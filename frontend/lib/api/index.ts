// ═══════════════════════════════════════════════════════════════
// KAIZEN CRM — API SERVICE LAYER
// Structured for real API — currently returns mock data
// Replace mock imports with fetch() calls when backend is ready
// ═══════════════════════════════════════════════════════════════

import type {
  Person, Organization, Relationship, Lead, Opportunity, Activity, Task,
  MoU, Course, CareerPath, StudentProfile, Enrollment, Branch,
  Notification, CourseCategory, InstitutionMapMarker, DashboardKPIs,
  PaginatedResponse, Attendance, DailyProgress,
} from "../types";
import * as mock from "./mock-data";

// ── Helpers ──
function paginate<T>(items: T[], page = 1, limit = 20): PaginatedResponse<T> {
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total, total_pages: Math.ceil(total / limit) },
  };
}

function delay(ms = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── People ──
export async function getPeople(params?: { q?: string; page?: number }): Promise<PaginatedResponse<Person>> {
  await delay();
  let items = [...mock.persons];
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter((p) => p.full_name.toLowerCase().includes(q) || p.primary_email?.toLowerCase().includes(q) || p.primary_phone?.includes(q));
  }
  return paginate(items, params?.page);
}

export async function getPerson(id: string): Promise<Person | null> {
  await delay();
  return mock.persons.find((p) => p._id === id) || null;
}

export async function getPersonRelationships(personId: string): Promise<Relationship[]> {
  await delay();
  return mock.relationships.filter((r) => r.from_id === personId || r.to_id === personId);
}

export async function getPersonTimeline(personId: string): Promise<Activity[]> {
  await delay();
  return mock.activities.filter((a) => a.related_person_id === personId || a.actor_id === personId);
}

// ── Organizations ──
export async function getOrganizations(params?: { q?: string; category?: string; page?: number }): Promise<PaginatedResponse<Organization>> {
  await delay();
  let items = [...mock.organizations];
  if (params?.category) items = items.filter((o) => o.category === params.category);
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter((o) => o.name.toLowerCase().includes(q));
  }
  return paginate(items, params?.page);
}

export async function getOrganization(id: string): Promise<Organization | null> {
  await delay();
  return mock.organizations.find((o) => o._id === id) || null;
}

// ── Institutions ──
export async function getInstitutions(params?: { district?: string; institution_type?: string; relationship_status?: string; page?: number }): Promise<PaginatedResponse<Organization>> {
  await delay();
  let items = mock.organizations.filter((o) => o.category === "institution");
  if (params?.district) items = items.filter((o) => o.institution_details?.district === params.district);
  if (params?.institution_type) items = items.filter((o) => o.institution_details?.institution_type === params.institution_type);
  if (params?.relationship_status) items = items.filter((o) => o.relationship_status === params.relationship_status);
  return paginate(items, params?.page);
}

export async function getInstitutionMapMarkers(params?: { district?: string }): Promise<InstitutionMapMarker[]> {
  await delay();
  let items = [...mock.institutionMapMarkers];
  if (params?.district) items = items.filter((m) => m.district === params.district);
  return items;
}

export async function getInstitution360(id: string) {
  await delay();
  const org = mock.organizations.find((o) => o._id === id);
  if (!org) return null;
  const rels = mock.relationships.filter((r) => r.to_id === id || r.from_id === id);
  const acts = mock.activities.filter((a) => a.related_institution_id === id);
  const mouList = mock.mous.filter((m) => m.institution_id === id);
  const opps = mock.opportunities.filter((o) => o.account_id === id);
  return { organization: org, relationships: rels, activities: acts, mous: mouList, opportunities: opps };
}

// ── Leads ──
export async function getLeads(params?: { stage?: string; owner_id?: string; source?: string; q?: string; page?: number }): Promise<PaginatedResponse<Lead>> {
  await delay();
  let items = [...mock.leads];
  if (params?.stage) items = items.filter((l) => l.stage === params.stage);
  if (params?.owner_id) items = items.filter((l) => l.owner_id === params.owner_id);
  if (params?.source) items = items.filter((l) => l.source === params.source);
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter((l) => l.person_name?.toLowerCase().includes(q));
  }
  return paginate(items, params?.page);
}

export async function getLead(id: string): Promise<Lead | null> {
  await delay();
  return mock.leads.find((l) => l._id === id) || null;
}

// ── Opportunities ──
export async function getOpportunities(params?: { stage?: string; owner_id?: string; page?: number }): Promise<PaginatedResponse<Opportunity>> {
  await delay();
  let items = [...mock.opportunities];
  if (params?.stage) items = items.filter((o) => o.stage === params.stage);
  if (params?.owner_id) items = items.filter((o) => o.owner_id === params.owner_id);
  return paginate(items, params?.page);
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  await delay();
  return mock.opportunities.find((o) => o._id === id) || null;
}

// ── Activities ──
export async function getActivities(params?: { entity_type?: string; entity_id?: string; page?: number }): Promise<PaginatedResponse<Activity>> {
  await delay();
  let items = [...mock.activities];
  if (params?.entity_id) {
    items = items.filter((a) =>
      a.related_person_id === params.entity_id ||
      a.related_organization_id === params.entity_id ||
      a.related_institution_id === params.entity_id ||
      a.related_lead_id === params.entity_id ||
      a.related_opportunity_id === params.entity_id
    );
  }
  return paginate(items, params?.page);
}

// ── Tasks ──
export async function getTasks(params?: { assignee_id?: string; status?: string }): Promise<Task[]> {
  await delay();
  let items = [...mock.tasks];
  if (params?.assignee_id) items = items.filter((t) => t.assignee_id === params.assignee_id);
  if (params?.status) items = items.filter((t) => t.status === params.status);
  return items;
}

// ── MoUs ──
export async function getMoUs(params?: { status?: string; page?: number }): Promise<PaginatedResponse<MoU>> {
  await delay();
  let items = [...mock.mous];
  if (params?.status) items = items.filter((m) => m.status === params.status);
  return paginate(items, params?.page);
}

export async function getMoU(id: string): Promise<MoU | null> {
  await delay();
  return mock.mous.find((m) => m._id === id) || null;
}

// ── Courses ──
export async function getCourses(params?: { category_id?: string; status?: string; page?: number }): Promise<PaginatedResponse<Course>> {
  await delay();
  let items = [...mock.courses];
  if (params?.category_id) items = items.filter((c) => c.category_id === params.category_id);
  if (params?.status) items = items.filter((c) => c.status === params.status);
  return paginate(items, params?.page);
}

export async function getCourse(id: string): Promise<Course | null> {
  await delay();
  return mock.courses.find((c) => c._id === id) || null;
}

export async function getCourseCategories(): Promise<CourseCategory[]> {
  await delay();
  return [...mock.courseCategories];
}

// ── Career Paths ──
export async function getCareerPaths(): Promise<CareerPath[]> {
  await delay();
  return [...mock.careerPaths];
}

// ── Students ──
export async function getStudents(params?: { q?: string; page?: number }): Promise<PaginatedResponse<StudentProfile & { person?: Person }>> {
  await delay();
  let items = mock.studentProfiles.map((sp) => ({
    ...sp,
    person: mock.persons.find((p) => p._id === sp.person_id),
  }));
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter((s) => s.person?.full_name.toLowerCase().includes(q));
  }
  return paginate(items, params?.page);
}

export async function getStudent(id: string): Promise<(StudentProfile & { person?: Person }) | null> {
  await delay();
  const sp = mock.studentProfiles.find((s) => s._id === id || s.person_id === id);
  if (!sp) return null;
  return { ...sp, person: mock.persons.find((p) => p._id === sp.person_id) };
}

// ── Enrollments ──
export async function getEnrollments(params?: { student_id?: string; status?: string; page?: number }): Promise<PaginatedResponse<Enrollment>> {
  await delay();
  let items = [...mock.enrollments];
  if (params?.student_id) items = items.filter((e) => e.student_id === params.student_id);
  if (params?.status) items = items.filter((e) => e.status === params.status);
  return paginate(items, params?.page);
}

// ── Branches ──
export async function getBranches(): Promise<Branch[]> {
  await delay();
  return [...mock.branches];
}

// ── Notifications ──
export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay();
  return mock.notifications.filter((n) => n.recipient_id === userId);
}

// ── Dashboard ──
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  await delay();
  return { ...mock.dashboardKPIs };
}

// ═══════════════════════════════════════════════════════════════
// MUTATIONS — write operations (mock; replace with fetch() calls)
// Each logs the payload, waits 200ms, and returns a stub with _id
// ═══════════════════════════════════════════════════════════════

function mockId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function stubEntity(data: Record<string, unknown>) {
  const now = new Date().toISOString();
  return {
    _id: mockId(),
    created_at: now,
    created_by: "current_user",
    updated_at: now,
    updated_by: "current_user",
    ...data,
  };
}

export async function createPerson(data: Partial<Person>): Promise<Person> {
  await delay(200);
  console.log("API CALL: createPerson", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Person;
}

export async function createOrganization(data: Partial<Organization>): Promise<Organization> {
  await delay(200);
  console.log("API CALL: createOrganization", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Organization;
}

export async function createLead(data: Partial<Lead>): Promise<Lead> {
  await delay(200);
  console.log("API CALL: createLead", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Lead;
}

export async function createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
  await delay(200);
  console.log("API CALL: createOpportunity", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Opportunity;
}

export async function createMoU(data: Partial<MoU>): Promise<MoU> {
  await delay(200);
  console.log("API CALL: createMoU", data);
  return stubEntity(data as Record<string, unknown>) as unknown as MoU;
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  await delay(200);
  console.log("API CALL: createTask", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Task;
}

export async function createActivity(data: Partial<Activity>): Promise<Activity> {
  await delay(200);
  console.log("API CALL: createActivity", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Activity;
}

export async function createRelationship(data: Partial<Relationship>): Promise<Relationship> {
  await delay(200);
  console.log("API CALL: createRelationship", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Relationship;
}

export async function updateOpportunityStage(id: string, stage: string): Promise<Opportunity> {
  await delay(200);
  console.log("API CALL: updateOpportunityStage", { id, stage });
  const existing = mock.opportunities.find((o) => o._id === id);
  return stubEntity({
    ...(existing ?? {}),
    _id: id,
    stage,
    updated_at: new Date().toISOString(),
  }) as unknown as Opportunity;
}

export async function convertLeadToOpportunity(
  leadId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Promise<Opportunity> {
  await delay(200);
  console.log("API CALL: convertLeadToOpportunity", { leadId, data });
  return stubEntity({ ...data, lead_id: leadId }) as unknown as Opportunity;
}

export async function markTaskComplete(taskId: string): Promise<Task> {
  await delay(200);
  console.log("API CALL: markTaskComplete", { taskId });
  const existing = mock.tasks.find((t) => t._id === taskId);
  return stubEntity({
    ...(existing ?? {}),
    _id: taskId,
    status: "complete",
    updated_at: new Date().toISOString(),
  }) as unknown as Task;
}

// ── Attendance ──
export async function getAttendance(params?: { enrollment_id?: string; date_from?: string; date_to?: string }): Promise<Attendance[]> {
  await delay();
  // Mock: return empty array — real data will come from backend
  return [];
}

export async function logAttendance(data: Partial<Attendance>): Promise<Attendance> {
  await delay(200);
  console.log("API CALL: logAttendance", data);
  return stubEntity(data as Record<string, unknown>) as unknown as Attendance;
}

export async function getDailyProgress(params?: { enrollment_id?: string; date?: string }): Promise<DailyProgress[]> {
  await delay();
  return [];
}

export async function submitDailyProgress(data: Partial<DailyProgress>): Promise<DailyProgress> {
  await delay(200);
  console.log("API CALL: submitDailyProgress", data);
  return stubEntity(data as Record<string, unknown>) as unknown as DailyProgress;
}

// ── Search ──
export async function globalSearch(q: string) {
  await delay();
  const query = q.toLowerCase();
  const results: { entity_type: string; entity_id: string; title: string; subtitle?: string }[] = [];

  mock.persons.filter((p) => p.full_name.toLowerCase().includes(query)).forEach((p) =>
    results.push({ entity_type: "person", entity_id: p._id, title: p.full_name, subtitle: p.primary_email || undefined })
  );
  mock.organizations.filter((o) => o.name.toLowerCase().includes(query)).forEach((o) =>
    results.push({ entity_type: o.category === "institution" ? "institution" : "organization", entity_id: o._id, title: o.name, subtitle: o.industry || undefined })
  );
  mock.leads.filter((l) => l.person_name?.toLowerCase().includes(query)).forEach((l) =>
    results.push({ entity_type: "lead", entity_id: l._id, title: l.person_name || "", subtitle: l.product })
  );
  mock.opportunities.filter((o) => o.account_name?.toLowerCase().includes(query) || o.product.toLowerCase().includes(query)).forEach((o) =>
    results.push({ entity_type: "opportunity", entity_id: o._id, title: `${o.account_name} — ${o.product}`, subtitle: o.stage })
  );

  return results.slice(0, 10);
}
