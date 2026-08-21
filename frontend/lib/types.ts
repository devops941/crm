// ═══════════════════════════════════════════════════════════════
// KAIZEN CRM — PHASE 1 TYPESCRIPT TYPES
// Matches Engineering Handoff §3 Data Model + §4 Database Schema
// ═══════════════════════════════════════════════════════════════

// ── Base fields (every entity carries these) ──
export interface BaseEntity {
  _id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at?: string | null;
}

// ── RBAC ──
export type RoleName =
  | "founder"
  | "admin"
  | "sales"
  | "telecaller"
  | "education_counsellor"
  | "trainer"
  | "project_manager"
  | "workforce_placement"
  | "finance"
  | "marketing";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "assign" | "export" | "financial";
export type PermissionResource =
  | "people"
  | "organizations"
  | "institutions"
  | "mous"
  | "leads"
  | "opportunities"
  | "education"
  | "projects"
  | "payments"
  | "reports"
  | "documents"
  | "users";

export interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
}

export interface Role extends BaseEntity {
  name: RoleName;
  label: string;
  permissions: Permission[];
}

// ── Users (login identity for Kaizen employees) ──
export interface User extends BaseEntity {
  email: string;
  name: string;
  role_id: string;
  role: Role;
  person_id?: string | null;
  status: "active" | "inactive";
  last_login_at?: string | null;
  avatar_url?: string | null;
  branch_id?: string | null;
}

// ── Person (canonical human record — one per real human) ──
export interface Person extends BaseEntity {
  full_name: string;
  primary_phone?: string | null;
  primary_email?: string | null;
  additional_phones: string[];
  additional_emails: string[];
  current_location?: {
    city?: string;
    district?: string;
    state?: string;
  } | null;
  social_identifiers?: {
    linkedin?: string;
    whatsapp?: string;
  } | null;
  external_ids: { system: string; id: string }[];
  dedupe_status: "active" | "merged" | "flagged_duplicate";
  merged_into?: string | null;
  owner_id: string;
  tags: string[];
  // Computed / joined at query time
  roles?: string[];           // From relationships
  organizations?: string[];   // From relationships
}

// ── Organization (company, institution, vendor, partner) ──
export type OrgCategory = "company" | "institution" | "government" | "vendor" | "partner" | "other";
export type InstitutionType = "school" | "college" | "university" | "training_institution" | "other";
export type ManagementType = "government" | "private" | "aided" | "autonomous" | "other";

export interface InstitutionDetails {
  institution_type: InstitutionType;
  management_type: ManagementType;
  location: { lat: number; lng: number };
  address?: string;
  district: string;
  taluk?: string;
  external_identifier?: string; // AISHE/UDISE code
  student_count?: number;
  department_count?: number;
  established_year?: number;
}

export interface Organization extends BaseEntity {
  name: string;
  category: OrgCategory;
  industry?: string | null;
  parent_org_id?: string | null;
  contacts: { person_id: string; role_label: string }[];
  institution_details?: InstitutionDetails | null;
  owner_id: string;
  // Computed
  relationship_status?: RelationshipStatusComputed;
  mou_status?: MoUStatusComputed;
  last_activity_at?: string | null;
  strategic_priority?: "high" | "medium" | "low";
}

export type RelationshipStatusComputed =
  | "no_relationship"
  | "prospect"
  | "contacted"
  | "active_opportunity"
  | "active_relationship"
  | "mou"
  | "inactive";

export type MoUStatusComputed = "none" | "proposed" | "negotiating" | "active" | "expiring" | "expired";

// ── Relationship (polymorphic edge between entities) ──
export type RelationshipEntityType = "person" | "organization" | "institution";
export type RelationshipType =
  | "studied_at"
  | "employed_by"
  | "decision_maker_for"
  | "partner_of"
  | "referred"
  | "alumnus_of"
  | "trainer_at"
  | "vendor_of"
  | "other";
export type RelationshipStrength = "weak" | "moderate" | "strong";

export interface Relationship extends BaseEntity {
  from_type: RelationshipEntityType;
  from_id: string;
  to_type: RelationshipEntityType;
  to_id: string;
  relationship_type: RelationshipType;
  role?: string | null;
  status: "active" | "inactive" | "ended";
  strength?: RelationshipStrength;
  owner_id: string;
  start_date: string;
  end_date?: string | null;
  // Joined data
  from_name?: string;
  to_name?: string;
}

// ── Lead ──
export type LeadSource = "website_form" | "referral" | "campaign" | "walk_in" | "event" | "cold_outreach" | "other";
export type LeadStage = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Lead extends BaseEntity {
  person_id: string;
  organization_id?: string | null;
  institution_id?: string | null;
  source: LeadSource;
  vertical: string;
  product: string;
  owner_id: string;
  stage: LeadStage;
  status: "open" | "converted" | "lost";
  score: number; // 0–100
  last_activity_at?: string | null;
  next_action?: string | null;
  converted_to_opportunity_id?: string | null;
  // Joined data
  person_name?: string;
  person_email?: string;
  person_phone?: string;
  organization_name?: string;
  owner_name?: string;
}

// ── Opportunity (qualified deal) ──
export type OpportunityMacroStage =
  | "discovered"
  | "engaged"
  | "qualified"
  | "proposed"
  | "negotiating"
  | "won"
  | "lost"
  | "delivering"
  | "outcome"
  | "renew_expand";

export interface Opportunity extends BaseEntity {
  account_type: "organization" | "institution";
  account_id: string;
  contact_id: string;
  vertical: string;
  product: string;
  owner_id: string;
  stage: OpportunityMacroStage;
  vertical_stage?: string | null;
  probability: number;
  value: number;
  currency: string;
  expected_close_date?: string | null;
  source?: string | null;
  proposal_doc_id?: string | null;
  contract_doc_id?: string | null;
  outcome?: "won_delivered" | "won_cancelled" | "lost_price" | "lost_timing" | "lost_competitor" | "lost_no_decision" | null;
  // Joined data
  account_name?: string;
  contact_name?: string;
  owner_name?: string;
}

// ── Activity (universal interaction record) ──
export type ActivityType =
  | "call"
  | "whatsapp"
  | "email"
  | "meeting"
  | "visit"
  | "workshop"
  | "training"
  | "event"
  | "follow_up"
  | "proposal"
  | "payment"
  | "mou_activity"
  | "research"
  | "survey"
  | "other";

export interface Activity extends BaseEntity {
  type: ActivityType;
  actor_id: string;
  participants: { person_id: string; name?: string }[];
  related_person_id?: string | null;
  related_organization_id?: string | null;
  related_institution_id?: string | null;
  related_lead_id?: string | null;
  related_opportunity_id?: string | null;
  related_project_id?: string | null;
  timestamp: string;
  duration?: number | null; // minutes
  outcome?: string | null;
  notes?: string | null;
  attachments: string[]; // document IDs
  next_action?: string | null;
  owner_id: string;
  // Joined data
  actor_name?: string;
}

// ── Task ──
export type TaskStatus = "open" | "complete" | "overdue";
export type TaskPriority = "low" | "normal" | "high";

export interface Task extends BaseEntity {
  related_activity_id?: string | null;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
  assignee_id: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  title: string;
  description?: string | null;
  // Joined data
  assignee_name?: string;
  related_entity_name?: string;
}

// ── MoU ──
export type MoUStatus =
  | "proposed"
  | "negotiating"
  | "approved"
  | "signed"
  | "active"
  | "expiring"
  | "expired"
  | "renewed";

export interface MoU extends BaseEntity {
  organization_id?: string | null;
  institution_id?: string | null;
  scope: string;
  vertical: string;
  owner_id: string;
  document_id?: string | null;
  start_date: string;
  end_date: string;
  status: MoUStatus;
  renewed_from_id?: string | null;
  commercial_value?: number;
  strategic_value?: "high" | "medium" | "low";
  // Joined data
  organization_name?: string;
  institution_name?: string;
  owner_name?: string;
  activities_covered?: string[];
}

// ── Document ──
export interface Document extends BaseEntity {
  filename: string;
  storage_key: string;
  mime_type: string;
  size: number;
  attached_to_type: string;
  attached_to_id: string;
  version: number;
  document_group_id: string;
  uploaded_by: string;
}

// ── Note ──
export interface Note extends BaseEntity {
  body: string;
  attached_to_type: string;
  attached_to_id: string;
  author_id: string;
  author_name?: string;
}

// ── Communication ──
export interface Communication extends BaseEntity {
  activity_id: string;
  person_id: string;
  channel: "email" | "whatsapp";
  body: string;
  direction: "inbound" | "outbound";
  sent_at: string;
}

// ── Education Entities ──

export interface Course extends BaseEntity {
  name: string;
  category_id: string;
  category_name?: string;
  description?: string;
  prerequisites?: string;
  levels: CourseLevel[];
  daily_syllabus: DaySyllabus[];
  certifications: { name: string; provider: string }[];
  career_path_ids: string[];
  status: "published" | "draft";
}

export interface CourseLevel {
  level_name: string;
  duration_days: number;
  fee: number;
  batch_size_max: number;
  mode: string;
  batch_type: string;
}

export interface DaySyllabus {
  day: number;
  title: string;
  topics: { name: string; objectives?: string; resources?: string }[];
  assignment?: string;
}

export interface CareerPath extends BaseEntity {
  name: string;
  description?: string;
  course_ids: string[];
  roles: {
    title: string;
    salary_min: number;
    salary_max: number;
    demand: "Very High" | "High" | "Medium" | "Low";
  }[];
}

export interface StudentProfile extends BaseEntity {
  person_id: string;
  academic_details: {
    qualification?: string;
    institution?: string;
    interests: string[];
    career_goal?: string;
    preferred_duration?: string;
    hours_per_week?: number;
  };
  // Joined
  person?: Person;
}

export interface Enrollment extends BaseEntity {
  student_id: string;
  course_id: string;
  level?: string;
  batch?: string;
  branch_id?: string;
  start_date: string;
  end_date: string;
  total_days: number;
  current_day?: number; // Computed: (today - start_date) + 1
  fee: number;
  fee_paid: boolean;
  status: "active" | "paused" | "completed" | "dropped";
  enrolled_by: string;
  // Joined
  student_name?: string;
  course_name?: string;
  branch_name?: string;
}

export interface Attendance extends BaseEntity {
  enrollment_id: string;
  student_id: string;
  branch_id: string;
  date: string;
  day_number: number;
  check_in_time?: string | null;
  check_in_location?: { lat: number; lng: number } | null;
  check_in_distance?: number | null; // meters
  check_out_time?: string | null;
  check_out_location?: { lat: number; lng: number } | null;
  status: "present" | "absent" | "late" | "half_day";
}

export interface DailyProgress extends BaseEntity {
  enrollment_id: string;
  student_id: string;
  date: string;
  day_number: number;
  topics_completed: string[];
  topics_pending: string[];
  assignment_submitted: boolean;
  notes?: string;
  difficulties?: string;
  rating: number; // 1–5
}

export interface Recommendation extends BaseEntity {
  student_id: string;
  course_id: string;
  overall_score: number;
  breakdown: {
    interest: number;
    qualification: number;
    career_goal: number;
    duration: number;
    difficulty: number;
    industry: number;
  };
  recommended: boolean; // ≥85%
  // Joined
  course_name?: string;
}

// ── Branch ──
export interface Branch extends BaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  allowed_radius: number; // meters
  branch_admin_id?: string | null;
  is_active: boolean;
}

// ── Notification ──
export type NotificationType =
  | "lead_assigned"
  | "lead_untouched"
  | "task_due"
  | "task_overdue"
  | "opportunity_stage_changed"
  | "mou_expiring"
  | "payment_pending"
  | "student_at_risk"
  | "institution_inactive"
  | "proposal_pending";

export interface Notification extends BaseEntity {
  recipient_id: string;
  type: NotificationType;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  read_at?: string | null;
  priority: "low" | "normal" | "high";
}

// ── Audit Log ──
export interface AuditLog extends BaseEntity {
  subject_type: string;
  subject_id: string;
  actor_id: string;
  action: "create" | "update" | "delete";
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  timestamp: string;
  ip?: string;
}

// ── Category (for courses) ──
export interface CourseCategory extends BaseEntity {
  name: string;
  icon: string;
  description: string;
  display_order: number;
  is_active: boolean;
  course_count?: number;
}

// ── Payment ──
export interface Payment extends BaseEntity {
  opportunity_id?: string | null;
  project_id?: string | null;
  enrollment_id?: string | null;
  amount: number;
  currency: string;
  status: "pending" | "received" | "reconciled" | "refunded";
  due_date?: string | null;
  paid_at?: string | null;
  method?: string;
}

// ── Project (reference target for won Opportunities) ──
export interface Project extends BaseEntity {
  opportunity_id: string;
  name: string;
  status: "not_started" | "in_progress" | "on_track" | "at_risk" | "completed" | "cancelled";
  milestones: { name: string; due_date: string; status: string }[];
  owner_id: string;
}

// ── Dashboard KPIs ──
export interface DashboardKPIs {
  revenue_qtd: number;
  revenue_delta_pct: number;
  open_pipeline: number;
  open_pipeline_count: number;
  win_rate: number;
  collections_due: number;
  collections_overdue: number;
  active_mous: number;
  mous_expiring_30d: number;
  revenue_by_vertical: { vertical: string; amount: number }[];
  critical_tasks: Task[];
  recent_activity: Activity[];
}

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// ── Map Marker (thin payload for institution map) ──
export interface InstitutionMapMarker {
  institution_id: string;
  name: string;
  type: InstitutionType;
  lat: number;
  lng: number;
  district: string;
  relationship_status: RelationshipStatusComputed;
  mou_status: MoUStatusComputed;
  last_activity_at?: string | null;
  priority: "high" | "medium" | "low";
}

// ── Search Result ──
export interface SearchResult {
  entity_type: "person" | "organization" | "institution" | "lead" | "opportunity" | "mou" | "course" | "student";
  entity_id: string;
  title: string;
  subtitle?: string;
  badge?: string;
}
