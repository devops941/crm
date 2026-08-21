// ═══════════════════════════════════════════════════════════════
// KAIZEN CRM — REALISTIC MOCK DATA (Person-centric model)
// Matches Engineering Handoff §3/§4 entity model
// ═══════════════════════════════════════════════════════════════

import type {
  Person, Organization, Relationship, Lead, Opportunity, Activity, Task,
  MoU, Course, CareerPath, StudentProfile, Enrollment, Attendance,
  DailyProgress, Recommendation, Branch, Notification, CourseCategory,
  InstitutionMapMarker, DashboardKPIs,
} from "../types";

const now = new Date().toISOString();
const base = { created_at: now, created_by: "u2", updated_at: now, updated_by: "u2" };

// ── Branches ──
export const branches: Branch[] = [
  { _id: "br1", name: "Madurai HQ", address: "Melur Road, Madurai", city: "Madurai", state: "Tamil Nadu", latitude: 9.9252, longitude: 78.1198, allowed_radius: 100, branch_admin_id: "u2", is_active: true, ...base },
  { _id: "br2", name: "Chennai Branch", address: "T Nagar, Chennai", city: "Chennai", state: "Tamil Nadu", latitude: 13.0827, longitude: 80.2707, allowed_radius: 100, branch_admin_id: null, is_active: true, ...base },
  { _id: "br3", name: "Bangalore Branch", address: "Koramangala, Bangalore", city: "Bangalore", state: "Karnataka", latitude: 12.9352, longitude: 77.6245, allowed_radius: 150, branch_admin_id: null, is_active: true, ...base },
  { _id: "br4", name: "Coimbatore Branch", address: "RS Puram, Coimbatore", city: "Coimbatore", state: "Tamil Nadu", latitude: 11.0168, longitude: 76.9558, allowed_radius: 100, branch_admin_id: null, is_active: true, ...base },
];

// ── Persons (canonical — one per real human) ──
export const persons: Person[] = [
  { _id: "p1", full_name: "Arun Selvam", primary_phone: "+91 98430 12345", primary_email: "arun.selvam@tvsmotor.com", additional_phones: [], additional_emails: [], current_location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu" }, social_identifiers: { linkedin: "arun-selvam" }, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u3", tags: ["alumni", "referral-source"], roles: ["Alumni", "Corporate Contact"], organizations: ["TVS Motor Co."], ...base },
  { _id: "p2", full_name: "Deepa Krishnan", primary_phone: "+91 98765 43210", primary_email: "deepa.k@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Madurai", district: "Madurai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["student"], roles: ["Student"], organizations: ["Kaizen Institute"], ...base },
  { _id: "p3", full_name: "Rish Kumar", primary_phone: "+91 99441 55667", primary_email: "rish.k@meenakshi.edu", additional_phones: [], additional_emails: [], current_location: { city: "Madurai", district: "Madurai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u2", tags: ["decision-influencer"], roles: ["Decision Influencer"], organizations: ["Sri Meenakshi College of Engg."], ...base },
  { _id: "p4", full_name: "Priya Sharma", primary_phone: "+91 98765 43211", primary_email: "priya.s@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Madurai", district: "Madurai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["student"], roles: ["Student"], organizations: ["Kaizen Institute"], ...base },
  { _id: "p5", full_name: "Vikram Patel", primary_phone: "+91 98765 43213", primary_email: "vikram.p@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["student"], roles: ["Student"], organizations: ["Kaizen Institute"], ...base },
  { _id: "p6", full_name: "Ananya Reddy", primary_phone: "+91 98765 43212", primary_email: "ananya.r@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["student"], roles: ["Student"], organizations: ["Kaizen Institute"], ...base },
  { _id: "p7", full_name: "Deputy GM, L&D — TVS", primary_phone: "+91 98430 99887", primary_email: "ld.gm@tvsmotor.com", additional_phones: [], additional_emails: [], current_location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u3", tags: ["economic-buyer"], roles: ["Economic Buyer"], organizations: ["TVS Motor Co."], ...base },
  { _id: "p8", full_name: "Dr. Kavitha Placement Officer", primary_phone: "+91 99441 22334", primary_email: "placement@meenakshi.edu", additional_phones: [], additional_emails: [], current_location: { city: "Madurai", district: "Madurai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u2", tags: ["placement-officer"], roles: ["Placement Officer"], organizations: ["Sri Meenakshi College of Engg."], ...base },
  { _id: "p9", full_name: "Rahul Kumar", primary_phone: "+91 98765 43220", primary_email: "rahul.k@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Madurai", district: "Madurai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["student"], roles: ["Student"], organizations: ["Kaizen Institute"], ...base },
  { _id: "p10", full_name: "Suresh Menon", primary_phone: "+91 98430 55443", primary_email: "suresh.m@infosys.com", additional_phones: [], additional_emails: [], current_location: { city: "Chennai", district: "Chennai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u3", tags: ["tech-contact"], roles: ["Technology Contact"], organizations: ["Infosys BPM Ltd."], ...base },
  { _id: "p11", full_name: "Lakshmi N", primary_phone: "+91 98765 43218", primary_email: "lakshmi.n@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Bangalore", district: "Bangalore Urban", state: "Karnataka" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["student"], roles: ["Student"], organizations: ["Kaizen Institute"], ...base },
  { _id: "p12", full_name: "Mohammed Faisal", primary_phone: "+91 98765 43219", primary_email: "faisal.m@gmail.com", additional_phones: [], additional_emails: [], current_location: { city: "Madurai", district: "Madurai", state: "Tamil Nadu" }, social_identifiers: null, external_ids: [], dedupe_status: "active", merged_into: null, owner_id: "u4", tags: ["dropped"], roles: ["Student (Dropped)"], organizations: ["Kaizen Institute"], ...base },
];

// ── Organizations (incl. institutions as subtype) ──
export const organizations: Organization[] = [
  { _id: "org1", name: "TVS Motor Company", category: "company", industry: "Automotive", parent_org_id: null, contacts: [{ person_id: "p1", role_label: "Champion" }, { person_id: "p7", role_label: "Economic Buyer" }], institution_details: null, owner_id: "u3", relationship_status: "active_relationship", last_activity_at: "2026-08-18T11:40:00Z", ...base },
  { _id: "org2", name: "Sri Meenakshi College of Engineering", category: "institution", industry: "Education", parent_org_id: null, contacts: [{ person_id: "p3", role_label: "Decision Influencer" }, { person_id: "p8", role_label: "Placement Officer" }], institution_details: { institution_type: "college", management_type: "private", location: { lat: 9.9600, lng: 78.1450 }, address: "Melur Road, Madurai — 625107", district: "Madurai", established_year: 1994, student_count: 4800, department_count: 9 }, owner_id: "u2", relationship_status: "prospect", mou_status: "none", last_activity_at: "2026-06-05T10:00:00Z", strategic_priority: "high", ...base },
  { _id: "org3", name: "Infosys BPM Ltd.", category: "company", industry: "Technology", parent_org_id: null, contacts: [{ person_id: "p10", role_label: "Technology Contact" }], institution_details: null, owner_id: "u3", relationship_status: "active_relationship", last_activity_at: "2026-08-15T09:00:00Z", ...base },
  { _id: "org4", name: "Fatima College", category: "institution", industry: "Education", parent_org_id: null, contacts: [], institution_details: { institution_type: "college", management_type: "aided", location: { lat: 9.9120, lng: 78.1280 }, address: "Mary Land, Madurai", district: "Madurai", established_year: 1953, student_count: 3200, department_count: 7 }, owner_id: "u2", relationship_status: "no_relationship", mou_status: "none", last_activity_at: null, strategic_priority: "medium", ...base },
  { _id: "org5", name: "Madurai Kamaraj University", category: "institution", industry: "Education", parent_org_id: null, contacts: [], institution_details: { institution_type: "university", management_type: "government", location: { lat: 9.9590, lng: 78.1440 }, address: "Palkalai Nagar, Madurai", district: "Madurai", established_year: 1966, student_count: 12000, department_count: 18 }, owner_id: "u2", relationship_status: "mou", mou_status: "active", last_activity_at: "2026-08-13T14:00:00Z", strategic_priority: "high", ...base },
  { _id: "org6", name: "Velammal Engineering College", category: "institution", industry: "Education", parent_org_id: null, contacts: [], institution_details: { institution_type: "college", management_type: "private", location: { lat: 9.9400, lng: 78.0900 }, address: "Ambathurai Road, Madurai", district: "Madurai", established_year: 2007, student_count: 3500, department_count: 8 }, owner_id: "u2", relationship_status: "active_relationship", mou_status: "expiring", last_activity_at: "2026-08-19T09:30:00Z", strategic_priority: "high", ...base },
  { _id: "org7", name: "Kaizen Institute", category: "company", industry: "Education & Training", parent_org_id: null, contacts: [], institution_details: null, owner_id: "u2", relationship_status: "active_relationship", last_activity_at: now, ...base },
  { _id: "org8", name: "Thiagarajar College of Engineering", category: "institution", industry: "Education", parent_org_id: null, contacts: [], institution_details: { institution_type: "college", management_type: "aided", location: { lat: 9.9450, lng: 78.1300 }, address: "Thiruparankundram, Madurai", district: "Madurai", established_year: 1957, student_count: 5200, department_count: 11 }, owner_id: "u2", relationship_status: "active_relationship", mou_status: "active", last_activity_at: "2026-08-10T11:00:00Z", strategic_priority: "high", ...base },
  { _id: "org9", name: "Lady Doak College", category: "institution", industry: "Education", parent_org_id: null, contacts: [], institution_details: { institution_type: "college", management_type: "aided", location: { lat: 9.9200, lng: 78.1350 }, address: "Tallakulam, Madurai", district: "Madurai", established_year: 1948, student_count: 2800, department_count: 6 }, owner_id: "u2", relationship_status: "contacted", mou_status: "none", last_activity_at: "2026-07-20T10:00:00Z", strategic_priority: "medium", ...base },
  { _id: "org10", name: "American College", category: "institution", industry: "Education", parent_org_id: null, contacts: [], institution_details: { institution_type: "college", management_type: "aided", location: { lat: 9.9180, lng: 78.1200 }, address: "Mattuthavani, Madurai", district: "Madurai", established_year: 1881, student_count: 4000, department_count: 12 }, owner_id: "u2", relationship_status: "no_relationship", mou_status: "none", last_activity_at: null, strategic_priority: "low", ...base },
];

// ── Relationships ──
export const relationships: Relationship[] = [
  { _id: "rel1", from_type: "person", from_id: "p1", to_type: "organization", to_id: "org1", relationship_type: "employed_by", role: "Employee, L&D", status: "active", strength: "strong", owner_id: "u3", start_date: "2020-01-01", from_name: "Arun Selvam", to_name: "TVS Motor Co.", ...base },
  { _id: "rel2", from_type: "person", from_id: "p1", to_type: "organization", to_id: "org7", relationship_type: "alumnus_of", role: "Alumni — Full-Stack Dev 2019", status: "active", strength: "moderate", owner_id: "u3", start_date: "2019-01-01", end_date: "2019-06-30", from_name: "Arun Selvam", to_name: "Kaizen Institute", ...base },
  { _id: "rel3", from_type: "person", from_id: "p2", to_type: "organization", to_id: "org7", relationship_type: "studied_at", role: "Student — Full-Stack Web Dev", status: "active", strength: "strong", owner_id: "u4", start_date: "2026-06-01", from_name: "Deepa Krishnan", to_name: "Kaizen Institute", ...base },
  { _id: "rel4", from_type: "person", from_id: "p3", to_type: "organization", to_id: "org2", relationship_type: "decision_maker_for", role: "Decision Influencer", status: "active", strength: "weak", owner_id: "u2", start_date: "2026-01-01", from_name: "Rish Kumar", to_name: "Sri Meenakshi College of Engg.", ...base },
  { _id: "rel5", from_type: "person", from_id: "p7", to_type: "organization", to_id: "org1", relationship_type: "decision_maker_for", role: "Economic Buyer", status: "active", strength: "moderate", owner_id: "u3", start_date: "2025-06-01", from_name: "Deputy GM, L&D", to_name: "TVS Motor Co.", ...base },
  { _id: "rel6", from_type: "person", from_id: "p1", to_type: "person", to_id: "p7", relationship_type: "referred", role: "Internal referral", status: "active", strength: "strong", owner_id: "u3", start_date: "2026-03-15", from_name: "Arun Selvam", to_name: "Deputy GM, L&D — TVS", ...base },
];

// ── Leads ──
export const leads: Lead[] = [
  { _id: "lead1", person_id: "p2", source: "website_form", vertical: "Education", product: "Full-Stack Web Development", owner_id: "u4", stage: "new", status: "open", score: 78, last_activity_at: now, next_action: "Call today", person_name: "Deepa Krishnan", person_email: "deepa.k@gmail.com", owner_name: "Kavya S.", ...base },
  { _id: "lead2", person_id: "p1", organization_id: "org1", source: "referral", vertical: "Cybersecurity", product: "Cybersecurity Audit", owner_id: "u3", stage: "qualified", status: "open", score: 91, last_activity_at: "2026-08-18T09:15:00Z", next_action: "Send proposal", person_name: "Arun Selvam (TVS)", person_email: "arun.selvam@tvsmotor.com", organization_name: "TVS Motor Co.", owner_name: "Arjun K.", ...base },
  { _id: "lead3", person_id: "p3", institution_id: "org4", source: "cold_outreach", vertical: "Education / Placement", product: "Campus Placement Drive", owner_id: "u2", stage: "contacted", status: "open", score: 52, last_activity_at: "2026-07-01T10:00:00Z", next_action: "Follow up", person_name: "Rish Kumar", organization_name: "Fatima College", owner_name: "Priya R.", ...base },
  { _id: "lead4", person_id: "p4", source: "walk_in", vertical: "Education", product: "MERN Stack Developer", owner_id: "u4", stage: "qualified", status: "open", score: 85, last_activity_at: "2026-08-17T14:00:00Z", next_action: "Course counselling", person_name: "Priya Sharma", owner_name: "Kavya S.", ...base },
  { _id: "lead5", person_id: "p9", source: "website_form", vertical: "Education", product: "Data Science & Analytics", owner_id: "u4", stage: "new", status: "open", score: 72, last_activity_at: "2026-08-19T08:00:00Z", next_action: "Initial call", person_name: "Rahul Kumar", owner_name: "Kavya S.", ...base },
  { _id: "lead6", person_id: "p10", organization_id: "org3", source: "referral", vertical: "SAP / Enterprise", product: "SAP Rollout", owner_id: "u3", stage: "qualified", status: "open", score: 88, last_activity_at: "2026-08-15T09:00:00Z", next_action: "Proposal prep", person_name: "Suresh Menon", organization_name: "Infosys BPM Ltd.", owner_name: "Arjun K.", ...base },
];

// ── Opportunities ──
export const opportunities: Opportunity[] = [
  { _id: "opp1", account_type: "organization", account_id: "org1", contact_id: "p1", vertical: "Corporate Training", product: "Corp. Training Batch 4", owner_id: "u3", stage: "negotiating", probability: 70, value: 2200000, currency: "INR", expected_close_date: "2026-09-02", source: "Referral — Arun Selvam", account_name: "TVS Motor Co.", contact_name: "Arun Selvam", owner_name: "Arjun K.", ...base },
  { _id: "opp2", account_type: "organization", account_id: "org1", contact_id: "p1", vertical: "Cybersecurity", product: "Cybersecurity Audit", owner_id: "u3", stage: "qualified", probability: 40, value: 1800000, currency: "INR", expected_close_date: "2026-10-15", source: "Referral — Arun Selvam", account_name: "TVS Motor Co.", contact_name: "Arun Selvam", owner_name: "Arjun K.", ...base },
  { _id: "opp3", account_type: "organization", account_id: "org3", contact_id: "p10", vertical: "SAP / Enterprise", product: "SAP S/4HANA Rollout", owner_id: "u3", stage: "proposed", probability: 55, value: 9500000, currency: "INR", expected_close_date: "2026-11-30", account_name: "Infosys BPM Ltd.", contact_name: "Suresh Menon", owner_name: "Arjun K.", ...base },
  { _id: "opp4", account_type: "institution", account_id: "org5", contact_id: "p3", vertical: "Education / Placement", product: "Faculty Development Program", owner_id: "u2", stage: "delivering", probability: 100, value: 350000, currency: "INR", outcome: "won_delivered", account_name: "Madurai Kamaraj University", contact_name: "Rish Kumar", owner_name: "Priya R.", ...base },
  { _id: "opp5", account_type: "organization", account_id: "org7", contact_id: "p2", vertical: "Education", product: "Full Stack Batch 12", owner_id: "u4", stage: "won", probability: 100, value: 640000, currency: "INR", outcome: "won_delivered", account_name: "Kaizen Institute B2C", contact_name: "Deepa Krishnan", owner_name: "Kavya S.", ...base },
  { _id: "opp6", account_type: "organization", account_id: "org3", contact_id: "p10", vertical: "Cybersecurity", product: "Cross-sell Cybersecurity", owner_id: "u3", stage: "discovered", probability: 20, value: 3000000, currency: "INR", account_name: "Infosys BPM Ltd.", contact_name: "Suresh Menon", owner_name: "Arjun K.", ...base },
];

// ── Activities ──
export const activities: Activity[] = [
  { _id: "act1", type: "meeting", actor_id: "u2", participants: [{ person_id: "p3", name: "Rish Kumar" }], related_institution_id: "org2", timestamp: "2026-08-20T11:40:00Z", outcome: "Discussed placement partnership", notes: "Met with placement officer. Interested in 3 drives next semester.", next_action: "Send placement proposal", owner_id: "u2", attachments: [], actor_name: "Priya R.", ...base },
  { _id: "act2", type: "proposal", actor_id: "u3", participants: [{ person_id: "p1", name: "Arun Selvam" }], related_organization_id: "org1", related_opportunity_id: "opp2", timestamp: "2026-08-20T09:15:00Z", outcome: "Proposal sent for cybersecurity audit", notes: "Sent detailed proposal with timeline and pricing.", owner_id: "u3", attachments: [], actor_name: "Arjun K.", ...base },
  { _id: "act3", type: "mou_activity", actor_id: "u2", participants: [], related_institution_id: "org6", timestamp: "2026-08-19T09:30:00Z", outcome: "MoU moved to Negotiating", notes: "Discussed renewal terms with admin office.", owner_id: "u2", attachments: [], actor_name: "Priya R.", ...base },
  { _id: "act4", type: "visit", actor_id: "u2", participants: [{ person_id: "p8" }], related_institution_id: "org2", timestamp: "2026-06-05T10:00:00Z", outcome: "Campus visit — met admin office, no decision maker present", notes: "General orientation. They showed interest but need follow-up with placement officer.", owner_id: "u2", attachments: [], actor_name: "Priya R.", ...base },
  { _id: "act5", type: "call", actor_id: "u2", participants: [], related_institution_id: "org2", timestamp: "2026-03-10T14:00:00Z", outcome: "Cold call — introduced Kaizen placement services", notes: "Asked to send brochure.", owner_id: "u2", attachments: [], actor_name: "Priya R.", ...base },
  { _id: "act6", type: "email", actor_id: "u4", participants: [{ person_id: "p2", name: "Deepa Krishnan" }], related_person_id: "p2", related_lead_id: "lead1", timestamp: "2026-08-20T08:30:00Z", outcome: "Welcome email sent", notes: "Sent course details and next steps.", owner_id: "u4", attachments: [], actor_name: "Kavya S.", ...base },
];

// ── Tasks ──
export const tasks: Task[] = [
  { _id: "task1", related_activity_id: "act1", related_entity_type: "institution", related_entity_id: "org2", assignee_id: "u2", due_date: "2026-08-21", status: "open", priority: "high", title: "Send placement proposal to Sri Meenakshi College", assignee_name: "Priya R.", related_entity_name: "Sri Meenakshi College of Engg.", ...base },
  { _id: "task2", related_entity_type: "mou", related_entity_id: "mou2", assignee_id: "u2", due_date: "2026-08-21", status: "open", priority: "high", title: "MoU renewal — Velammal Engineering College", description: "Draft renewal terms before expiry on Aug 23", assignee_name: "Priya R.", related_entity_name: "Velammal Engg. College", ...base },
  { _id: "task3", related_entity_type: "opportunity", related_entity_id: "opp2", assignee_id: "u3", due_date: "2026-08-22", status: "open", priority: "normal", title: "Follow up on cybersecurity proposal — TVS Motor Co.", assignee_name: "Arjun K.", related_entity_name: "TVS Motor Co.", ...base },
  { _id: "task4", related_entity_type: "institution", related_entity_id: "org5", assignee_id: "u2", due_date: "2026-08-23", status: "open", priority: "normal", title: "Confirm faculty dev workshop — Madurai Kamaraj Univ.", assignee_name: "Priya R.", related_entity_name: "Madurai Kamaraj University", ...base },
];

// ── MoUs ──
export const mous: MoU[] = [
  { _id: "mou1", institution_id: "org5", scope: "Campus placement drives, internships", vertical: "Education / Placement", owner_id: "u2", start_date: "2026-09-01", end_date: "2027-03-31", status: "active", owner_name: "Priya R.", institution_name: "Madurai Kamaraj University", activities_covered: ["3 placement drives (2024–25)", "1 faculty development workshop", "12 internship placements"], ...base },
  { _id: "mou2", institution_id: "org6", scope: "Campus placement drives, internships", vertical: "Placement", owner_id: "u2", start_date: "2024-08-23", end_date: "2026-08-23", status: "expiring", owner_name: "Priya R.", institution_name: "Velammal Engineering College", activities_covered: ["3 placement drives (2024–25)", "1 faculty development workshop", "12 internship placements"], ...base },
  { _id: "mou3", organization_id: "org3", scope: "Corporate Training — SAP & Cybersecurity", vertical: "Corp. Training", owner_id: "u3", start_date: "2025-01-01", end_date: "2027-12-31", status: "negotiating", owner_name: "Arjun K.", organization_name: "Infosys BPM Ltd.", ...base },
  { _id: "mou4", institution_id: "org8", scope: "Industry placement program", vertical: "Education / Placement", owner_id: "u2", start_date: "2025-06-01", end_date: "2027-05-31", status: "active", owner_name: "Priya R.", institution_name: "Thiagarajar College of Engineering", ...base },
];

// ── Course Categories ──
export const courseCategories: CourseCategory[] = [
  { _id: "cat1", name: "Coding & Development", icon: "Code", description: "Programming, web development, software engineering", display_order: 1, is_active: true, course_count: 5, ...base },
  { _id: "cat2", name: "AI & Data Science", icon: "Brain", description: "Machine learning, data analytics, deep learning", display_order: 2, is_active: true, course_count: 4, ...base },
  { _id: "cat3", name: "Business & Management", icon: "Briefcase", description: "Marketing, finance, entrepreneurship", display_order: 3, is_active: true, course_count: 3, ...base },
  { _id: "cat4", name: "Design & Creative", icon: "Palette", description: "UI/UX, graphic design, motion graphics", display_order: 4, is_active: true, course_count: 3, ...base },
  { _id: "cat5", name: "Cloud & DevOps", icon: "Cloud", description: "AWS, Azure, Docker, Kubernetes, CI/CD", display_order: 5, is_active: true, course_count: 2, ...base },
  { _id: "cat6", name: "Cybersecurity", icon: "Shield", description: "Ethical hacking, network security, SOC", display_order: 6, is_active: false, course_count: 2, ...base },
];

// ── Courses ──
export const courses: Course[] = [
  { _id: "c1", name: "Full Stack Web Development", category_id: "cat1", category_name: "Coding & Development", description: "Comprehensive full-stack development with Python, React, and databases", levels: [{ level_name: "Learner", duration_days: 180, fee: 35000, batch_size_max: 20, mode: "Classroom + Online", batch_type: "Rolling" }], daily_syllabus: [{ day: 1, title: "Introduction to Programming", topics: [{ name: "What is programming?" }, { name: "Setting up environment" }], assignment: "Install & run Hello World" }, { day: 2, title: "Variables & Data Types", topics: [{ name: "Numbers, Strings, Booleans" }, { name: "Type conversion" }], assignment: "Calculator exercise" }], certifications: [{ name: "Full Stack Developer Certificate", provider: "Kaizen" }], career_path_ids: ["cp1"], status: "published", ...base },
  { _id: "c2", name: "Data Science & Analytics", category_id: "cat2", category_name: "AI & Data Science", description: "Data analysis, visualization, and machine learning foundations", levels: [{ level_name: "Learner", duration_days: 180, fee: 40000, batch_size_max: 15, mode: "Classroom", batch_type: "Cohort" }], daily_syllabus: [], certifications: [{ name: "Data Science Certificate", provider: "Kaizen" }], career_path_ids: ["cp2"], status: "published", ...base },
  { _id: "c3", name: "UI/UX Design", category_id: "cat4", category_name: "Design & Creative", description: "User research, wireframing, prototyping, and design systems", levels: [{ level_name: "Beginner", duration_days: 120, fee: 25000, batch_size_max: 20, mode: "Classroom + Online", batch_type: "Rolling" }], daily_syllabus: [], certifications: [{ name: "UI/UX Design Certificate", provider: "Kaizen" }], career_path_ids: ["cp3"], status: "published", ...base },
];

// ── Career Paths ──
export const careerPaths: CareerPath[] = [
  { _id: "cp1", name: "Software Development", description: "From junior developer to tech lead", course_ids: ["c1"], roles: [{ title: "Junior Developer", salary_min: 300000, salary_max: 500000, demand: "Very High" }, { title: "Full Stack Developer", salary_min: 500000, salary_max: 1200000, demand: "Very High" }, { title: "Senior Developer", salary_min: 1200000, salary_max: 2500000, demand: "High" }], ...base },
  { _id: "cp2", name: "Data & Analytics", description: "From data analyst to data scientist", course_ids: ["c2"], roles: [{ title: "Data Analyst", salary_min: 400000, salary_max: 700000, demand: "High" }, { title: "Data Scientist", salary_min: 800000, salary_max: 2000000, demand: "Very High" }], ...base },
  { _id: "cp3", name: "Design", description: "From UI designer to design lead", course_ids: ["c3"], roles: [{ title: "UI Designer", salary_min: 300000, salary_max: 600000, demand: "High" }, { title: "UX Designer", salary_min: 600000, salary_max: 1500000, demand: "High" }], ...base },
];

// ── Student Profiles ──
export const studentProfiles: StudentProfile[] = [
  { _id: "sp1", person_id: "p2", academic_details: { qualification: "B.Sc CS", institution: "Fatima College", interests: ["Coding", "Web Development", "AI"], career_goal: "Get a Job", preferred_duration: "6 months", hours_per_week: 30 }, ...base },
  { _id: "sp2", person_id: "p4", academic_details: { qualification: "B.Tech CS", institution: "TCE", interests: ["Coding", "Backend", "Cloud"], career_goal: "Get a Job", preferred_duration: "6 months", hours_per_week: 25 }, ...base },
  { _id: "sp3", person_id: "p6", academic_details: { qualification: "BCA", institution: "Christ University", interests: ["Design", "UI/UX"], career_goal: "Freelance", preferred_duration: "4 months", hours_per_week: 20 }, ...base },
];

// ── Enrollments ──
export const enrollments: Enrollment[] = [
  { _id: "enr1", student_id: "sp1", course_id: "c1", level: "Learner", batch: "Morning", branch_id: "br1", start_date: "2026-06-01", end_date: "2026-11-28", total_days: 180, current_day: 81, fee: 35000, fee_paid: true, status: "active", enrolled_by: "u4", student_name: "Deepa Krishnan", course_name: "Full Stack Web Development", branch_name: "Madurai HQ", ...base },
  { _id: "enr2", student_id: "sp2", course_id: "c1", level: "Learner", batch: "Morning", branch_id: "br1", start_date: "2026-06-15", end_date: "2026-12-12", total_days: 180, current_day: 67, fee: 35000, fee_paid: false, status: "active", enrolled_by: "u4", student_name: "Priya Sharma", course_name: "Full Stack Web Development", branch_name: "Madurai HQ", ...base },
  { _id: "enr3", student_id: "sp3", course_id: "c3", level: "Beginner", batch: "Evening", branch_id: "br3", start_date: "2026-07-01", end_date: "2026-10-28", total_days: 120, current_day: 51, fee: 25000, fee_paid: true, status: "active", enrolled_by: "u4", student_name: "Ananya Reddy", course_name: "UI/UX Design", branch_name: "Bangalore Branch", ...base },
];

// ── Notifications ──
export const notifications: Notification[] = [
  { _id: "notif1", recipient_id: "u2", type: "mou_expiring", title: "MoU Expiring", message: "Velammal Engineering College MoU expires in 3 days", payload: { mou_id: "mou2" }, priority: "high", ...base },
  { _id: "notif2", recipient_id: "u3", type: "opportunity_stage_changed", title: "Opportunity Update", message: "TVS Motor Corp Training moved to Negotiating", payload: { opportunity_id: "opp1" }, priority: "normal", ...base },
  { _id: "notif3", recipient_id: "u4", type: "lead_assigned", title: "New Lead", message: "New website enquiry from Rahul Kumar", payload: { lead_id: "lead5" }, priority: "normal", ...base },
];

// ── Institution Map Markers ──
export const institutionMapMarkers: InstitutionMapMarker[] = organizations
  .filter((o) => o.category === "institution" && o.institution_details)
  .map((o) => ({
    institution_id: o._id,
    name: o.name,
    type: o.institution_details!.institution_type,
    lat: o.institution_details!.location.lat,
    lng: o.institution_details!.location.lng,
    district: o.institution_details!.district,
    relationship_status: o.relationship_status || "no_relationship",
    mou_status: o.mou_status || "none",
    last_activity_at: o.last_activity_at,
    priority: o.strategic_priority || "medium",
  }));

// ── Dashboard KPIs ──
export const dashboardKPIs: DashboardKPIs = {
  revenue_qtd: 48200000,
  revenue_delta_pct: 18,
  open_pipeline: 114000000,
  open_pipeline_count: 142,
  win_rate: 31,
  collections_due: 6800000,
  collections_overdue: 1400000,
  active_mous: 86,
  mous_expiring_30d: 7,
  revenue_by_vertical: [
    { vertical: "Education", amount: 19000000 },
    { vertical: "SAP / Enterprise", amount: 11000000 },
    { vertical: "Corp. Training", amount: 7800000 },
    { vertical: "Cybersecurity", amount: 5200000 },
    { vertical: "Software / AI", amount: 4100000 },
  ],
  critical_tasks: tasks.filter((t) => t.priority === "high"),
  recent_activity: activities.slice(0, 5),
};
