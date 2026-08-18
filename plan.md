# Interactive Course Counselling App — Implementation Plan

**Stack:** Next.js (Frontend) + Python FastAPI (Backend) + MongoDB (Database)
**Source:** Adapted from developer handoff wireframe (originally spec'd for Postgres)
**Version:** v1.0 Draft

---

## 1. Product Vision

Replace static brochures and manual course explanations with an interactive, touch-first digital counselling journey that answers two questions for every student:

1. *"Which course is suitable for me?"*
2. *"Where can this course take me?"*

**Primary users:** Counsellors, Students, Branch Teams
**Primary devices:** Touchscreen kiosks, Tablets, Laptop (counsellor-assisted use)
**Architecture:** Multi-branch, role-based, cloud-hosted

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | **Next.js (React)** | Touch-first UI, paginated card-based forms, SSR/CSR hybrid for fast kiosk boot |
| Backend | **Python + FastAPI** | REST API, async endpoints, Pydantic models for validation |
| Database | **MongoDB** | Document store — schema below replaces the original 29-table Postgres design with embedded/referenced collections |
| Auth | Clerk / JWT-based session auth | Role-based access (Super Admin → Admin → Branch Admin → Counsellor → View Only) |
| Recommendation Engine | Custom weighted scoring service (FastAPI microservice or module) | Interest Match 30%, Qualification 20%, Career Goal 20%, Duration 15%, Difficulty 10%, Industry 5% |
| Hosting | Cloud (AWS/GCP/Azure — TBD) | Multi-branch tenancy via `branch_id` scoping |
| File/Image storage | S3-compatible bucket | Student selfie/profile photo capture |

---

## 3. MongoDB Data Model

MongoDB replaces the relational 29-table Postgres schema with **6 core collections**, using embedding for tightly-coupled data and references for shared/lookup data. This reduces join complexity while keeping the same entity groups from the original design (Student, Course, Career, Recommendation, CRM).

### 3.1 `students`
Holds student profile, education background, interest selections, and career goals/preferences captured in Screen 1. Includes a `photo_url` for the selfie captured via device camera, and `branch_id` to scope the record to a branch.

### 3.2 `courses`
The core course master record. Embeds category, level, mode, duration, fee, and prerequisites, along with the full **module → topic → subtopic → project** hierarchy as nested arrays (instead of separate join tables). Also embeds certifications, career progression path, career roles with salary/demand, and placement stats — since this content is read far more often than written and is almost always queried course-scoped (Screens 2–4).

### 3.3 `recommendations`
Stores generated per-student course fit scores rather than recomputing live on every screen load. Each record holds the overall fit score plus the score breakdown across the six weighted factors, and a `recommended` flag for the gold-star UI treatment.

### 3.4 `counselling_sessions`
Tracks each counselling session: student, counsellor, branch, course/level/batch selected, session notes, pipeline status (New → Counselled → Course Selected → Follow-up → Registration → Enrolled), and follow-up scheduling details.

### 3.5 `leads` (CRM)
The CRM record tied to a student — tracks enquiry history, lead status, seat reservation (with expiry), and final enrolment details (enrolled flag, enrolment date, fee-paid status).

### 3.6 Supporting collections
- `counsellors` — name, branch, role, active status
- `branches` — name, location, branch admin
- `users` — auth + RBAC roles (Super Admin, Admin, Branch Admin, Counsellor, View Only)

---

## 4. Screen-by-Screen Build Plan

### Screen 1 — Student Discovery (`/discovery`)
Touch-first, 4-step paginated form (no long scroll forms):
1. Personal Info (name, DOB, mobile, email, location, selfie capture via device camera API)
2. Education (qualification tap-select)
3. Interests (multi-select tap cards)
4. Goals & Time (career intention, learning hours/week, preferred duration, optional free-text course search)

**Frontend:** Next.js form wizard component, progress stepper, `44–48px` min touch targets.
**Backend endpoints:**
- `POST /api/students` — create student record
- `PUT /api/students/{id}/profile` — update profile fields incrementally per step
- `POST /api/sessions` — create counselling session on final submit
- `POST /api/recommendations/generate` — trigger scoring engine

### Screen 2 — Celestial Course Map (`/map/{student_id}`)
Signature interactive visualization: student photo at center, domain "orbits" expand on tap, courses highlighted by fit score (gold star + blue border for recommended).

**Frontend:** Custom SVG/Canvas or D3-based radial map in Next.js (client component). Support pinch/zoom, pan/drag, long-press tooltip.
**Backend endpoints:**
- `GET /api/students/{id}/course-map` — returns domains → courses with fit scores for rendering

### Screen 3 — Course & Syllabus Explorer (`/courses/{course_id}`)
Module → Topic → Subtopic accordion with embedded projects, certifications, career progression path, and a course comparison table.

**Backend endpoints:**
- `GET /api/courses/{id}` — full course detail
- `GET /api/courses/compare?ids=...` — comparison table data

### Screen 4 — Course Intelligence Panel (`/courses/{course_id}/intelligence`)
Split-panel: left = course map/mini nav, right = tabbed detail (Overview, Syllabus, Objectives, Scope, Industry, Careers, Projects, Certification, Placement, Fees). Includes fit-score breakdown bar chart per student.

**Backend endpoints:**
- `GET /api/courses/{id}/intelligence?student_id=` — merges course detail + student's fit score breakdown

### Screen 5 — Enrolment / Conversion (`/enrol/{student_id}`)
Lead pipeline stepper: New → Counselled → Course Selected → Follow-up → Registration → Enrolled. Actions: Book Counselling, Reserve Seat (24hr hold), Enrol Now.

**Backend endpoints:**
- `POST /api/enquiries` — create/update lead record
- `PUT /api/enquiries/{id}/status` — update pipeline status
- `POST /api/followups` — schedule follow-up
- `POST /api/enrolments` — finalize enrolment (creates CRM record, updates lead status to `Enrolled`, triggers welcome notification)
- `POST /api/seat-reservations` — reserve seat with expiry

> **Dev note carried over from wireframe:** Payment integration is deferred to Phase 2 — enrolment record is created first, payment linked later.

---

## 5. Recommendation Engine — Scoring Logic

Weighted fit score computed per student-course pair, stored in `recommendations` collection:

| Factor | Weight |
|---|---|
| Interest Match | 30% |
| Qualification | 20% |
| Career Goal | 20% |
| Duration | 15% |
| Difficulty | 10% |
| Industry | 5% |

Implement as a standalone FastAPI service/module (`services/recommendation_engine.py`) that:
1. Pulls student profile (`interests`, `education`, `goals`) from `students`.
2. Pulls candidate courses from `courses`.
3. Computes weighted score per course.
4. Writes results to `recommendations` (upsert per student-course pair).
5. Flags `recommended: true` for scores above threshold (e.g. ≥ 85%) for gold-star UI treatment.

Recompute triggers: on profile step completion (real-time preview) and on final session submit (authoritative).

---

## 6. RBAC (Role-Based Access Control)

| Role | Permissions |
|---|---|
| **Super Admin** | All orgs & branches, course catalogue, all users, all reports |
| **Admin** | Course CMS, course data, counsellors, reports |
| **Branch Admin** | Branch counsellors, branch leads, batches, branch reports |
| **Counsellor** | Run counselling, create/update leads, recommendations, follow-ups |
| **View Only** | View course info, view approved reports |

Implement via JWT claims (`role`, `branch_id`) checked in FastAPI dependency (`Depends(require_role(...))`), scoping MongoDB queries by `branch_id` for non-Super Admin roles.

---

## 7. Suggested Development Roadmap (Phases)

| Phase | Deliverable |
|---|---|
| **Phase 1** | Course Knowledge Base — Course CMS, MongoDB schema, taxonomy setup |
| **Phase 2** | Counselling Questionnaire — Screen 1 (student profile, education, interest, goal capture) |
| **Phase 3** | Recommendation Engine — weighted scoring service, fit-score API |
| **Phase 4** | Celestial Course Map — interactive visual map (zoom/pan/expand) |
| **Phase 5** | Counselling CRM — leads, session history, course selection, enrolment |
| **Phase 6** | Analytics & Management — branch/counsellor/course demand dashboards |

---

## 8. Notes / Open Decisions

- **Auth provider:** Confirm Clerk vs. custom JWT — wireframe listed Clerk as a possibility.
- **Payment gateway:** Explicitly deferred to Phase 2 per original dev notes.
- **Celestial Map rendering approach:** D3.js vs. Canvas vs. custom SVG — needs a spike/prototype before Phase 4 due to touch/zoom/pan complexity.
- **MongoDB vs. original Postgres schema:** This plan embeds course hierarchy (modules/topics/projects) inside the `courses` document for read performance; if course content editing becomes heavy (frequent CMS updates to individual subtopics), consider splitting into a separate `course_content` collection referenced by `course_id`.