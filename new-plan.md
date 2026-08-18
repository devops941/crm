# Interactive Course Counselling App — Revised Implementation Plan v2.0

**Stack:** Next.js (Frontend Web + Future Mobile) + Python FastAPI (Backend) + MongoDB (Database)
**Version:** v2.0 — Based on actual business requirements
**Date:** August 2024

---

## 1. Business Flow (How the System Actually Works)

```
ADMIN uploads Courses (with syllabus, daily topics, duration)
        ↓
ADMIN creates Staff/Employees (counsellors, teachers, admins)
        ↓
STUDENT is registered (profile, education, interests, goals)
        ↓
System generates CELESTIAL MAP for that student (course recommendations)
        ↓
Student SELECTS a course → Admin sets START DATE + DURATION
        ↓
From Day 1: Student arrives at LOCATION → GEO CHECK-IN (only if within range)
        ↓
Daily SYLLABUS shown (today's topics based on day number)
        ↓
At end of day: Student does CHECK-OUT → writes DAILY NOTES/REVIEW
        ↓
Progress tracked: attendance, topics covered, reviews collected
        ↓
Course completed → Certificate generated
```

---

## 2. Core Modules

### Module 1: Course Management (Admin)
Admin uploads and manages all courses.

**What admin sets up per course:**
- Course name, category, description, prerequisites
- Course levels: Beginner / Learner / Expert
- Duration (in days/weeks/months) — e.g., "6 months = 180 days"
- Fee, mode (Classroom/Online/Hybrid), batch size
- **Daily Syllabus Plan** — Day 1 topics, Day 2 topics, ... Day N topics
  - Each day has: Topic name, subtopics, learning objectives, resources, assignment
- Certifications earned on completion
- Career paths linked to this course

**Key concept: Day-wise syllabus**
```
Course: Full Stack Developer (180 days)
├── Day 1: Introduction to Programming
│   ├── What is programming?
│   ├── Setting up environment
│   └── Assignment: Install & run "Hello World"
├── Day 2: Variables & Data Types
│   ├── Numbers, Strings, Booleans
│   ├── Type conversion
│   └── Assignment: Calculator exercise
├── Day 3: Control Flow
│   └── ...
...
├── Day 180: Final Project Submission
```

### Module 2: Employee / Staff Management (Admin)
Admin creates and manages all staff members.

**Staff roles:**
- Super Admin — full system access
- Admin — course CMS, staff management, reports
- Branch Admin — branch-level operations
- Counsellor — student counselling, lead management
- Teacher/Instructor — assigned to courses, tracks daily progress
- View Only — read-only access

**Staff record:**
- Name, email, phone, photo
- Role (from above)
- Branch assignment
- Assigned courses (for teachers)
- Active/inactive status

### Module 3: Student Registration & Course Discovery
Student is registered by admin/counsellor or self-registration.

**Student profile captured:**
1. Personal Info — name, DOB, mobile, email, location, selfie (camera capture)
2. Education — highest qualification (tap-select)
3. Interests — multi-select from domains (Coding, AI, Business, Design, etc.)
4. Goals — career intention, learning hours/week, preferred duration

**After registration:**
- System generates **Celestial Course Map** (recommendation engine runs)
- Student sees recommended courses with fit scores
- Student/Counsellor selects a course

### Module 4: Course Enrollment & Scheduling
When student selects a course:

- Admin/Counsellor confirms enrollment
- **Start date** is set for that student
- Duration auto-calculated from course settings
- End date = Start date + course duration
- Student's daily syllabus timeline is created (Day 1 = Start date, Day 2 = Start date + 1, etc.)
- Batch assignment (Morning/Evening/Weekend)
- Fee status tracked

**Enrollment record:**
```
{
  student_id, course_id, level_id,
  start_date: "2024-09-01",
  end_date: "2025-02-28",        // auto-calculated
  current_day: 45,                // auto-calculated from today - start_date
  total_days: 180,
  batch: "Morning",
  fee_paid: false,
  status: "Active"                // Active / Paused / Completed / Dropped
}
```

### Module 5: Location-Based Check-In / Check-Out (Attendance)
**How it works:**

1. Admin sets **branch/center GPS coordinates** + **allowed radius** (e.g., 100 meters)
2. Student opens the app at the location
3. App gets student's **current GPS coordinates** (Browser Geolocation API)
4. System calculates **distance** between student's location and center's coordinates
5. If distance ≤ allowed radius → **CHECK-IN allowed** ✓
6. If distance > allowed radius → **CHECK-IN blocked** ✗ (shows "You are not at the center")

**Check-in record:**
```
{
  student_id, enrollment_id,
  date: "2024-10-15",
  check_in_time: "09:15:00",
  check_in_lat: 13.0827,
  check_in_lng: 80.2707,
  check_in_distance: 45,         // meters from center
  check_out_time: "17:30:00",    // filled on checkout
  status: "Present",              // Present / Absent / Late / Half-day
  day_number: 45                  // which day in the course
}
```

**Technical implementation:**
```javascript
// Browser Geolocation API
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // Send to backend → calculate distance using Haversine formula
  // If distance <= branch.allowed_radius → allow check-in
});
```

**Haversine formula** (backend — Python):
```python
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth radius in meters
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)
    a = math.sin(Δφ/2)**2 + math.cos(φ1) * math.cos(φ2) * math.sin(Δλ/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
```

### Module 6: Daily Syllabus & Topic Tracking
After check-in, student sees **today's topics**.

**How it works:**
1. System calculates: `day_number = (today - enrollment.start_date).days + 1`
2. Fetches the syllabus for that day from the course's daily plan
3. Shows today's topics, learning objectives, resources, assignments
4. Student marks topics as "completed" during the day
5. Progress tracked: topics completed vs total topics for that day

**Student's daily view:**
```
┌─────────────────────────────────────────┐
│ Day 45 of 180 — October 15, 2024       │
│ Course: Full Stack Developer            │
├─────────────────────────────────────────┤
│ Today's Topics:                         │
│ ☑ React Components & Props              │
│ ☑ State Management with useState        │
│ ☐ Event Handling in React               │
│ ☐ Assignment: Build a Todo App          │
├─────────────────────────────────────────┤
│ Progress: 2/4 topics completed (50%)    │
│ Overall: Day 45/180 (25% course done)   │
└─────────────────────────────────────────┘
```

### Module 7: Daily Checkout & Notes/Review
When student checks out at end of day:

**Checkout flow:**
1. Student taps "Check Out"
2. System shows today's topics summary
3. Student writes **daily notes/review**:
   - What did you learn today?
   - Any doubts or difficulties?
   - Rate today's session (1-5 stars)
   - Optional: feedback on teacher/content
4. Check-out time recorded
5. Attendance marked as "Complete" for the day

**Daily review record:**
```
{
  student_id, enrollment_id,
  date: "2024-10-15",
  day_number: 45,
  topics_completed: ["React Components", "State Management"],
  topics_pending: ["Event Handling", "Todo Assignment"],
  notes: "Learned about useState, need more practice with props...",
  rating: 4,
  difficulties: "Props drilling concept was confusing",
  checkout_time: "17:30:00"
}
```

### Module 8: Recommendation Engine
Same 6-factor weighted scoring from original plan:

| Factor | Weight |
|---|---|
| Interest Match | 30% |
| Qualification | 20% |
| Career Goal | 20% |
| Duration | 15% |
| Difficulty | 10% |
| Industry | 5% |

- Computed per student-course pair after student registration
- Stored in `recommendations` collection
- ≥ 85% = "Recommended" (gold star on Celestial Map)

### Module 9: Analytics & Reports (Phase 2)
- Student attendance report (daily/weekly/monthly)
- Topic completion rate per student
- Course progress dashboard
- Branch-wise enrollment stats
- Daily review sentiment analysis
- Teacher performance (from student ratings)
- Revenue tracking (fee paid vs pending)

---

## 3. MongoDB Data Model (Revised)

### 3.1 `users`
All system users — admin, staff, counsellors, teachers.
```
{
  _id, email, name, phone, photo_url,
  role: "super_admin" | "admin" | "branch_admin" | "counsellor" | "teacher" | "view_only",
  branch_id, assigned_course_ids: [],
  hashed_password, is_active, created_at
}
```

### 3.2 `branches`
Physical centers/locations where students attend.
```
{
  _id, name, address, city, state,
  latitude: 13.0827,              // GPS coordinates
  longitude: 80.2707,
  allowed_radius: 100,            // meters — geofence radius
  branch_admin_id, is_active, created_at
}
```

### 3.3 `course_categories`
Top-level course domains.
```
{
  _id, name, icon, description, display_order, is_active
}
```

### 3.4 `courses`
Course master with daily syllabus plan.
```
{
  _id, category_id, name, description, prerequisites,
  levels: [
    {
      level_name: "Learner",
      duration_days: 180,
      fee: 35000,
      batch_size_max: 20,
      mode: "Classroom + Online",
      batch_type: "Rolling"
    }
  ],
  daily_syllabus: [
    {
      day: 1,
      title: "Introduction to Programming",
      topics: [
        { name: "What is programming?", objectives: "...", resources: "..." },
        { name: "Setting up environment", objectives: "...", resources: "..." }
      ],
      assignment: "Install & run Hello World"
    },
    {
      day: 2,
      title: "Variables & Data Types",
      topics: [...],
      assignment: "Calculator exercise"
    },
    // ... up to day N
  ],
  certifications: [{ name, provider }],
  career_path_ids: [],
  status: "published" | "draft",
  created_at, updated_at
}
```

### 3.5 `career_paths`
```
{
  _id, name, description, course_ids: [],
  roles: [
    { title: "Full Stack Developer", salary_min: 4, salary_max: 8, demand: "Very High" }
  ]
}
```

### 3.6 `students`
```
{
  _id, name, dob, mobile, email, location, photo_url,
  education: { qualification, institution },
  interests: ["Coding", "AI"],
  goals: { intention: "Get a Job", hours_per_week: 20, preferred_duration: "6 months" },
  branch_id, created_at
}
```

### 3.7 `recommendations`
Per-student course fit scores.
```
{
  _id, student_id, course_id,
  overall_score: 93,
  breakdown: {
    interest: 28, qualification: 18, career_goal: 20,
    duration: 15, difficulty: 7, industry: 5
  },
  recommended: true,
  created_at
}
```

### 3.8 `enrollments`
Student enrolled in a course with schedule.
```
{
  _id, student_id, course_id, level_id, branch_id,
  start_date: "2024-09-01",
  end_date: "2025-02-28",
  total_days: 180,
  batch: "Morning",
  fee: 35000, fee_paid: false,
  status: "Active" | "Paused" | "Completed" | "Dropped",
  enrolled_by: user_id,          // who enrolled the student
  created_at
}
```

### 3.9 `attendance`
Daily check-in/check-out with geo-location.
```
{
  _id, student_id, enrollment_id, branch_id,
  date: "2024-10-15",
  day_number: 45,
  check_in_time: "09:15:00",
  check_in_location: { lat: 13.0827, lng: 80.2707 },
  check_in_distance: 45,         // meters from center
  check_out_time: "17:30:00",
  check_out_location: { lat: 13.0827, lng: 80.2707 },
  status: "Present" | "Absent" | "Late" | "Half-day",
  created_at
}
```

### 3.10 `daily_progress`
Student's daily topic completion + notes/review.
```
{
  _id, student_id, enrollment_id,
  date: "2024-10-15",
  day_number: 45,
  topics_completed: ["React Components", "State Management"],
  topics_pending: ["Event Handling"],
  assignment_submitted: false,
  notes: "Learned about useState, need more practice...",
  difficulties: "Props drilling was confusing",
  rating: 4,                     // 1-5 stars
  created_at
}
```

### 3.11 `counselling_sessions`
```
{
  _id, student_id, counsellor_id, branch_id,
  course_selected_id, notes,
  status: "New" | "Counselled" | "Course Selected" | "Follow-up" | "Enrolled",
  followup_date, created_at
}
```

---

## 4. Screens — Revised

### Admin Screens (Dashboard — already built)
| Screen | Route | Status |
|---|---|---|
| Dashboard Overview | `/dashboard` | Built |
| Course Categories | `/dashboard/categories` | Built |
| Courses + Editor | `/dashboard/courses`, `/dashboard/courses/editor` | Built — **needs daily syllabus editor** |
| Career Paths | `/dashboard/careers` | Built |
| Branches | `/dashboard/branches` | Built — **needs GPS coordinates + radius fields** |
| Staff/Employees | `/dashboard/counsellors` → rename to `/dashboard/staff` | Built — **needs role expansion (Teacher)** |
| Students | `/dashboard/students` | Built |
| Leads & CRM | `/dashboard/leads` | Built |
| Sessions | `/dashboard/sessions` | Built |
| Users & RBAC | `/dashboard/users` | Built |
| Rec. Engine | `/dashboard/recommendation` | Built |
| Settings | `/dashboard/settings` | Built |
| **Enrollments** | `/dashboard/enrollments` | **NEW — needs building** |
| **Attendance Reports** | `/dashboard/attendance` | **NEW — needs building** |
| **Daily Progress Reports** | `/dashboard/progress` | **NEW — needs building** |

### Student Screens (Web — then Mobile)
| Screen | Route | Status |
|---|---|---|
| Student Discovery (4-step form) | `/discovery` | Built |
| Celestial Course Map | `/map/[studentId]` | Built |
| Course Explorer (Syllabus) | `/courses/[courseId]` | Built |
| Course Intelligence Panel | `/courses/[courseId]/intelligence` | Built |
| Enrolment/Conversion | `/enrol/[studentId]` | Built |
| **Daily Check-In** | `/student/checkin` | **NEW — needs building** |
| **Today's Syllabus** | `/student/today` | **NEW — needs building** |
| **Daily Check-Out + Notes** | `/student/checkout` | **NEW — needs building** |
| **My Progress** | `/student/progress` | **NEW — needs building** |
| **My Attendance** | `/student/attendance` | **NEW — needs building** |

---

## 5. API Endpoints (Revised)

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register` (admin only)
- `GET /api/auth/me`

### Courses
- `GET/POST /api/courses`
- `GET/PUT/DELETE /api/courses/{id}`
- `POST /api/courses/{id}/daily-syllabus` — bulk upload daily syllabus
- `GET /api/courses/{id}/syllabus/day/{day_number}` — get specific day's topics

### Students
- `GET/POST /api/students`
- `GET/PUT /api/students/{id}`
- `GET /api/students/{id}/course-map` — celestial map data

### Enrollments
- `POST /api/enrollments` — enroll student in course (sets start_date)
- `GET /api/enrollments?student_id=&status=`
- `PUT /api/enrollments/{id}` — update status, pause, complete
- `GET /api/enrollments/{id}/today` — get today's day number + syllabus

### Attendance (Check-In / Check-Out)
- `POST /api/attendance/checkin` — body: { enrollment_id, lat, lng } → validates geo
- `POST /api/attendance/checkout` — body: { enrollment_id, lat, lng }
- `GET /api/attendance?student_id=&date_from=&date_to=`
- `GET /api/attendance/today?enrollment_id=` — check if already checked in today

### Daily Progress
- `POST /api/progress/daily` — submit daily notes + completed topics
- `GET /api/progress?enrollment_id=&date=`
- `GET /api/progress/summary?enrollment_id=` — overall progress stats

### Recommendations
- `POST /api/recommendations/generate`
- `GET /api/students/{id}/recommendations`

### Admin
- `GET/POST/PUT/DELETE /api/branches` — includes lat, lng, radius
- `GET/POST/PUT/DELETE /api/staff` (replaces counsellors)
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/reports/attendance?branch_id=&date=`
- `GET /api/admin/reports/progress?course_id=`

---

## 6. Development Phases (Revised)

| Phase | Deliverable | Priority |
|---|---|---|
| **Phase 1** | Course CMS + Daily Syllabus Editor | **NOW** |
| **Phase 2** | Staff/Employee Management | **NOW** |
| **Phase 3** | Student Registration + Celestial Map | **NOW** |
| **Phase 4** | Enrollment System (start date, duration, scheduling) | **NOW** |
| **Phase 5** | Geo Check-In / Check-Out (Browser Geolocation API) | **NEXT** |
| **Phase 6** | Daily Syllabus View + Topic Tracking | **NEXT** |
| **Phase 7** | Daily Checkout Notes / Review System | **NEXT** |
| **Phase 8** | Attendance & Progress Reports | **LATER** |
| **Phase 9** | Analytics Dashboard | **LATER** |
| **Phase 10** | Mobile App (React Native / PWA) | **FUTURE** |

---

## 7. What Needs to Change in Current Frontend

### Modify Existing Pages
1. **Course Editor** — add "Daily Syllabus" tab (Day 1, Day 2, ... Day N topic editor)
2. **Branches** — add GPS latitude, longitude, allowed_radius fields
3. **Staff page** — rename from "Counsellors", add Teacher role, add course assignment
4. **Enrollment** — new page for managing enrollments with start dates

### New Student Pages (Web — then Mobile)
5. **Check-In page** — shows location status, check-in button (disabled if not in range)
6. **Today's Syllabus** — shows day number, today's topics with checkboxes
7. **Check-Out page** — today's summary, notes textarea, star rating, submit
8. **My Progress** — overall course progress, topics completed chart
9. **My Attendance** — calendar view of attendance history

### New Admin Pages
10. **Enrollments** — manage all enrollments, set start dates
11. **Attendance Reports** — branch/student/date filtering
12. **Progress Reports** — student progress across courses

---

## 8. Mobile App Strategy

**Phase 1 (Now):** Build everything as a **responsive web app** (PWA-ready)
- Use Browser Geolocation API for check-in
- Responsive design for mobile browsers
- All student screens optimized for mobile viewport

**Phase 2 (Future):** Build a **native mobile app** (React Native)
- Push notifications for check-in reminders
- Background geolocation tracking
- Offline mode for notes
- Camera for selfie attendance verification
- Biometric authentication

---

## 9. Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Geolocation | Browser Geolocation API | Works on web + mobile browsers, no native app needed initially |
| Distance calculation | Haversine formula (server-side) | Accurate, prevents GPS spoofing by validating on server |
| Daily syllabus storage | Embedded in course document | Read-heavy, always queried by course_id + day_number |
| Attendance | Separate collection | Write-heavy, queried by date range, needs indexes |
| Auth | JWT (custom) | Simpler than Clerk, full control over roles |
| Mobile (later) | React Native or PWA | Share component logic with web |
