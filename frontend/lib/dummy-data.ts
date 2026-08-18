// ═══════════════════════════════════════════
// SHARED DUMMY DATA — 15+ records per entity
// ═══════════════════════════════════════════

export const categories = [
  { id: "cat1", icon: "💻", name: "Coding & Development", description: "Programming, web development, software engineering", courseCount: 5, order: 1, active: true },
  { id: "cat2", icon: "🤖", name: "AI & Data Science", description: "Machine learning, data analytics, deep learning", courseCount: 4, order: 2, active: true },
  { id: "cat3", icon: "📊", name: "Business & Management", description: "Marketing, finance, entrepreneurship", courseCount: 3, order: 3, active: true },
  { id: "cat4", icon: "🎨", name: "Design & Creative", description: "UI/UX, graphic design, motion graphics", courseCount: 3, order: 4, active: true },
  { id: "cat5", icon: "☁️", name: "Cloud & DevOps", description: "AWS, Azure, Docker, Kubernetes, CI/CD", courseCount: 2, order: 5, active: true },
  { id: "cat6", icon: "🔒", name: "Cybersecurity", description: "Ethical hacking, network security, SOC", courseCount: 2, order: 6, active: false },
];

export const courses = [
  { id: "c1", name: "Full Stack Python Developer", category: "Coding & Development", levels: ["Beginner", "Learner", "Expert"], duration: "6 months", fee: "₹35,000", status: "Published" },
  { id: "c2", name: "Frontend React Developer", category: "Coding & Development", levels: ["Beginner", "Learner"], duration: "4 months", fee: "₹22,000", status: "Published" },
  { id: "c3", name: "Backend Node.js Developer", category: "Coding & Development", levels: ["Learner", "Expert"], duration: "5 months", fee: "₹28,000", status: "Published" },
  { id: "c4", name: "Java Full Stack", category: "Coding & Development", levels: ["Beginner", "Learner", "Expert"], duration: "8 months", fee: "₹45,000", status: "Draft" },
  { id: "c5", name: "MERN Stack Developer", category: "Coding & Development", levels: ["Learner"], duration: "6 months", fee: "₹32,000", status: "Published" },
  { id: "c6", name: "Data Science & Analytics", category: "AI & Data Science", levels: ["Learner", "Expert"], duration: "6 months", fee: "₹40,000", status: "Published" },
  { id: "c7", name: "Machine Learning Engineer", category: "AI & Data Science", levels: ["Expert"], duration: "8 months", fee: "₹50,000", status: "Published" },
  { id: "c8", name: "Python for Data Analysis", category: "AI & Data Science", levels: ["Beginner", "Learner"], duration: "3 months", fee: "₹18,000", status: "Published" },
  { id: "c9", name: "Deep Learning & NLP", category: "AI & Data Science", levels: ["Expert"], duration: "6 months", fee: "₹48,000", status: "Draft" },
  { id: "c10", name: "Digital Marketing", category: "Business & Management", levels: ["Beginner", "Learner"], duration: "3 months", fee: "₹15,000", status: "Published" },
  { id: "c11", name: "Business Analytics", category: "Business & Management", levels: ["Learner"], duration: "4 months", fee: "₹25,000", status: "Published" },
  { id: "c12", name: "Financial Modelling", category: "Business & Management", levels: ["Expert"], duration: "3 months", fee: "₹20,000", status: "Draft" },
  { id: "c13", name: "UI/UX Design", category: "Design & Creative", levels: ["Beginner", "Learner"], duration: "4 months", fee: "₹25,000", status: "Published" },
  { id: "c14", name: "Graphic Design Pro", category: "Design & Creative", levels: ["Beginner"], duration: "3 months", fee: "₹18,000", status: "Published" },
  { id: "c15", name: "Motion Graphics", category: "Design & Creative", levels: ["Learner", "Expert"], duration: "5 months", fee: "₹30,000", status: "Draft" },
  { id: "c16", name: "Cloud & DevOps Engineer", category: "Cloud & DevOps", levels: ["Learner", "Expert"], duration: "6 months", fee: "₹38,000", status: "Published" },
  { id: "c17", name: "AWS Solutions Architect", category: "Cloud & DevOps", levels: ["Expert"], duration: "4 months", fee: "₹35,000", status: "Published" },
];

export const students = [
  { id: "s1", name: "Priya Sharma", email: "priya@email.com", mobile: "+91 98765 43210", qualification: "B.Tech CS", branch: "Chennai Main", enrollment: "Full Stack Python", status: "Active", lastActive: "Today" },
  { id: "s2", name: "Rahul Kumar", email: "rahul@email.com", mobile: "+91 98765 43211", qualification: "B.Sc IT", branch: "Chennai Main", enrollment: "Data Science", status: "Active", lastActive: "Today" },
  { id: "s3", name: "Ananya Reddy", email: "ananya@email.com", mobile: "+91 98765 43212", qualification: "BCA", branch: "Bangalore", enrollment: "UI/UX Design", status: "Active", lastActive: "Yesterday" },
  { id: "s4", name: "Vikram Patel", email: "vikram@email.com", mobile: "+91 98765 43213", qualification: "B.Tech ECE", branch: "Chennai Main", enrollment: "MERN Stack", status: "Active", lastActive: "Today" },
  { id: "s5", name: "Deepa Menon", email: "deepa@email.com", mobile: "+91 98765 43214", qualification: "M.Sc Maths", branch: "Bangalore", enrollment: "Machine Learning", status: "Active", lastActive: "2 days ago" },
  { id: "s6", name: "Arjun Singh", email: "arjun@email.com", mobile: "+91 98765 43215", qualification: "B.Com", branch: "Mumbai", enrollment: "Digital Marketing", status: "Active", lastActive: "Today" },
  { id: "s7", name: "Kavitha R", email: "kavitha@email.com", mobile: "+91 98765 43216", qualification: "MBA", branch: "Chennai Main", enrollment: "Business Analytics", status: "Completed", lastActive: "1 week ago" },
  { id: "s8", name: "Suresh M", email: "suresh@email.com", mobile: "+91 98765 43217", qualification: "Diploma", branch: "Mumbai", enrollment: "Frontend React", status: "Active", lastActive: "Today" },
  { id: "s9", name: "Lakshmi N", email: "lakshmi@email.com", mobile: "+91 98765 43218", qualification: "B.Tech IT", branch: "Bangalore", enrollment: "Cloud & DevOps", status: "Active", lastActive: "Yesterday" },
  { id: "s10", name: "Mohammed Faisal", email: "faisal@email.com", mobile: "+91 98765 43219", qualification: "MCA", branch: "Chennai Main", enrollment: "Backend Node.js", status: "Dropped", lastActive: "2 weeks ago" },
  { id: "s11", name: "Sneha Gupta", email: "sneha@email.com", mobile: "+91 98765 43220", qualification: "B.Tech CS", branch: "Mumbai", enrollment: "Full Stack Python", status: "Active", lastActive: "Today" },
  { id: "s12", name: "Karthik V", email: "karthik@email.com", mobile: "+91 98765 43221", qualification: "12th Pass", branch: "Chennai Main", enrollment: "Graphic Design", status: "Active", lastActive: "Today" },
  { id: "s13", name: "Divya S", email: "divya@email.com", mobile: "+91 98765 43222", qualification: "B.Sc CS", branch: "Bangalore", enrollment: "Python for Data", status: "Active", lastActive: "Yesterday" },
  { id: "s14", name: "Rajesh K", email: "rajesh@email.com", mobile: "+91 98765 43223", qualification: "B.Tech Mech", branch: "Mumbai", enrollment: "—", status: "Not Enrolled", lastActive: "3 days ago" },
  { id: "s15", name: "Meena T", email: "meena@email.com", mobile: "+91 98765 43224", qualification: "BCA", branch: "Chennai Main", enrollment: "—", status: "Not Enrolled", lastActive: "1 week ago" },
  { id: "s16", name: "Arun P", email: "arun@email.com", mobile: "+91 98765 43225", qualification: "M.Tech", branch: "Bangalore", enrollment: "AWS Solutions", status: "Active", lastActive: "Today" },
];

export const staff = [
  { id: "st1", name: "Rajesh Kumar", email: "rajesh.k@company.com", branch: "Chennai Main", role: "Teacher", courses: "Full Stack Python, MERN Stack", sessions: "12", active: true },
  { id: "st2", name: "Priya Nair", email: "priya.n@company.com", branch: "Bangalore", role: "Teacher", courses: "Data Science, ML", sessions: "8", active: true },
  { id: "st3", name: "Amit Shah", email: "amit.s@company.com", branch: "Mumbai", role: "Branch Admin", courses: "—", sessions: "—", active: true },
  { id: "st4", name: "Anita Sharma", email: "anita@company.com", branch: "Chennai Main", role: "Counsellor", courses: "—", sessions: "15", active: true },
  { id: "st5", name: "Vikram Reddy", email: "vikram.r@company.com", branch: "Bangalore", role: "Counsellor", courses: "—", sessions: "10", active: true },
  { id: "st6", name: "Deepa M", email: "deepa.m@company.com", branch: "Chennai Main", role: "Teacher", courses: "UI/UX, Graphic Design", sessions: "6", active: true },
  { id: "st7", name: "Suresh R", email: "suresh.r@company.com", branch: "Mumbai", role: "Teacher", courses: "Digital Marketing", sessions: "9", active: true },
  { id: "st8", name: "Kavitha P", email: "kavitha.p@company.com", branch: "Chennai Main", role: "Teacher", courses: "Frontend React, Backend Node", sessions: "11", active: true },
  { id: "st9", name: "Ravi K", email: "ravi.k@company.com", branch: "Bangalore", role: "Teacher", courses: "Cloud & DevOps, AWS", sessions: "7", active: true },
  { id: "st10", name: "Meena S", email: "meena.s@company.com", branch: "Mumbai", role: "Counsellor", courses: "—", sessions: "13", active: true },
  { id: "st11", name: "Ganesh T", email: "ganesh@company.com", branch: "Chennai Main", role: "Teacher", courses: "Java Full Stack", sessions: "5", active: false },
  { id: "st12", name: "Lakshmi R", email: "lakshmi.r@company.com", branch: "Bangalore", role: "Teacher", courses: "Python for Data", sessions: "4", active: true },
  { id: "st13", name: "Arun M", email: "arun.m@company.com", branch: "Mumbai", role: "Counsellor", courses: "—", sessions: "8", active: false },
  { id: "st14", name: "Divya K", email: "divya.k@company.com", branch: "Chennai Main", role: "Teacher", courses: "Business Analytics", sessions: "6", active: true },
  { id: "st15", name: "Karthik S", email: "karthik.s@company.com", branch: "Bangalore", role: "Branch Admin", courses: "—", sessions: "—", active: true },
];

export const branches = [
  { id: "b1", name: "Chennai Main", location: "T. Nagar, Chennai", admin: "Rajesh Kumar", staff: "8", students: "45", lat: "13.0418", lng: "80.2341", radius: "100m", active: true },
  { id: "b2", name: "Bangalore Central", location: "Koramangala, Bangalore", admin: "Karthik S", staff: "5", students: "32", lat: "12.9352", lng: "77.6245", radius: "100m", active: true },
  { id: "b3", name: "Mumbai West", location: "Andheri, Mumbai", admin: "Amit Shah", staff: "4", students: "28", lat: "19.1136", lng: "72.8697", radius: "150m", active: true },
  { id: "b4", name: "Hyderabad Tech", location: "Madhapur, Hyderabad", admin: "—", staff: "0", students: "0", lat: "17.4484", lng: "78.3908", radius: "100m", active: false },
];

export const enrollments = [
  { id: "e1", student: "Priya Sharma", course: "Full Stack Python", level: "Learner", start: "2024-09-01", end: "2025-02-28", day: "45/180", batch: "Morning", fee: "₹35,000", paid: true, status: "Active" },
  { id: "e2", student: "Rahul Kumar", course: "Data Science", level: "Learner", start: "2024-09-15", end: "2025-03-14", day: "31/180", batch: "Morning", fee: "₹40,000", paid: true, status: "Active" },
  { id: "e3", student: "Ananya Reddy", course: "UI/UX Design", level: "Beginner", start: "2024-10-01", end: "2025-01-28", day: "15/120", batch: "Evening", fee: "₹25,000", paid: false, status: "Active" },
  { id: "e4", student: "Vikram Patel", course: "MERN Stack", level: "Learner", start: "2024-08-01", end: "2025-01-28", day: "76/180", batch: "Morning", fee: "₹32,000", paid: true, status: "Active" },
  { id: "e5", student: "Deepa Menon", course: "Machine Learning", level: "Expert", start: "2024-07-01", end: "2025-02-25", day: "107/240", batch: "Weekend", fee: "₹50,000", paid: true, status: "Active" },
  { id: "e6", student: "Arjun Singh", course: "Digital Marketing", level: "Beginner", start: "2024-10-01", end: "2024-12-31", day: "15/90", batch: "Evening", fee: "₹15,000", paid: false, status: "Active" },
  { id: "e7", student: "Kavitha R", course: "Business Analytics", level: "Learner", start: "2024-04-01", end: "2024-07-30", day: "120/120", batch: "Morning", fee: "₹25,000", paid: true, status: "Completed" },
  { id: "e8", student: "Suresh M", course: "Frontend React", level: "Beginner", start: "2024-09-15", end: "2025-01-14", day: "31/120", batch: "Evening", fee: "₹22,000", paid: true, status: "Active" },
  { id: "e9", student: "Lakshmi N", course: "Cloud & DevOps", level: "Learner", start: "2024-08-15", end: "2025-02-11", day: "62/180", batch: "Morning", fee: "₹38,000", paid: true, status: "Active" },
  { id: "e10", student: "Mohammed Faisal", course: "Backend Node.js", level: "Learner", start: "2024-07-01", end: "2024-11-28", day: "45/150", batch: "Morning", fee: "₹28,000", paid: false, status: "Dropped" },
  { id: "e11", student: "Sneha Gupta", course: "Full Stack Python", level: "Learner", start: "2024-09-01", end: "2025-02-28", day: "45/180", batch: "Evening", fee: "₹35,000", paid: true, status: "Active" },
  { id: "e12", student: "Karthik V", course: "Graphic Design", level: "Beginner", start: "2024-10-01", end: "2024-12-31", day: "15/90", batch: "Morning", fee: "₹18,000", paid: true, status: "Active" },
  { id: "e13", student: "Divya S", course: "Python for Data", level: "Beginner", start: "2024-10-01", end: "2024-12-31", day: "15/90", batch: "Morning", fee: "₹18,000", paid: false, status: "Active" },
  { id: "e14", student: "Arun P", course: "AWS Solutions", level: "Expert", start: "2024-09-01", end: "2024-12-31", day: "45/120", batch: "Weekend", fee: "₹35,000", paid: true, status: "Active" },
  { id: "e15", student: "Sneha Gupta", course: "Data Science", level: "Learner", start: "2024-03-01", end: "2024-08-28", day: "180/180", batch: "Morning", fee: "₹40,000", paid: true, status: "Completed" },
];

export const leads = [
  { id: "L001", student: "Priya Sharma", course: "Full Stack Python", counsellor: "Anita Sharma", status: "Enrolled", source: "Website", followup: "—", branch: "Chennai Main", priority: "High", created: "2024-08-15" },
  { id: "L002", student: "Rahul Kumar", course: "Data Science", counsellor: "Anita Sharma", status: "Enrolled", source: "Referral", followup: "—", branch: "Chennai Main", priority: "High", created: "2024-08-20" },
  { id: "L003", student: "Ananya Reddy", course: "UI/UX Design", counsellor: "Vikram Reddy", status: "Course Selected", source: "Walk-in", followup: "2024-10-20", branch: "Bangalore", priority: "Medium", created: "2024-09-10" },
  { id: "L004", student: "New Student A", course: "MERN Stack", counsellor: "Anita Sharma", status: "New", source: "Website", followup: "—", branch: "Chennai Main", priority: "High", created: "2024-10-14" },
  { id: "L005", student: "New Student B", course: "Data Science", counsellor: "—", status: "New", source: "Social Media", followup: "—", branch: "Bangalore", priority: "Medium", created: "2024-10-14" },
  { id: "L006", student: "New Student C", course: "Digital Marketing", counsellor: "Meena S", status: "Counselled", source: "Ads", followup: "2024-10-18", branch: "Mumbai", priority: "Low", created: "2024-10-10" },
  { id: "L007", student: "New Student D", course: "Cloud & DevOps", counsellor: "Vikram Reddy", status: "Follow-up", source: "Website", followup: "2024-10-16", branch: "Bangalore", priority: "High", created: "2024-10-05" },
  { id: "L008", student: "New Student E", course: "Frontend React", counsellor: "Anita Sharma", status: "Seat Attended", source: "Referral", followup: "2024-10-17", branch: "Chennai Main", priority: "High", created: "2024-10-01" },
  { id: "L009", student: "New Student F", course: "Machine Learning", counsellor: "Vikram Reddy", status: "Registration", source: "Walk-in", followup: "—", branch: "Bangalore", priority: "Medium", created: "2024-09-25" },
  { id: "L010", student: "New Student G", course: "Business Analytics", counsellor: "Meena S", status: "New", source: "Website", followup: "—", branch: "Mumbai", priority: "Low", created: "2024-10-15" },
  { id: "L011", student: "New Student H", course: "Graphic Design", counsellor: "Anita Sharma", status: "Counselled", source: "Social Media", followup: "2024-10-19", branch: "Chennai Main", priority: "Medium", created: "2024-10-12" },
  { id: "L012", student: "New Student I", course: "Java Full Stack", counsellor: "—", status: "New", source: "Ads", followup: "—", branch: "Chennai Main", priority: "Low", created: "2024-10-15" },
  { id: "L013", student: "New Student J", course: "AWS Solutions", counsellor: "Vikram Reddy", status: "Follow-up", source: "Referral", followup: "2024-10-17", branch: "Bangalore", priority: "High", created: "2024-10-08" },
  { id: "L014", student: "New Student K", course: "Python for Data", counsellor: "Meena S", status: "Course Selected", source: "Website", followup: "2024-10-20", branch: "Mumbai", priority: "Medium", created: "2024-10-09" },
  { id: "L015", student: "New Student L", course: "Full Stack Python", counsellor: "Anita Sharma", status: "Counselled", source: "Walk-in", followup: "2024-10-18", branch: "Chennai Main", priority: "High", created: "2024-10-13" },
  { id: "L016", student: "Mohammed Faisal", course: "Backend Node.js", counsellor: "Anita Sharma", status: "Enrolled", source: "Website", followup: "—", branch: "Chennai Main", priority: "Medium", created: "2024-06-15" },
];

export const careerPaths = [
  { id: "cp1", name: "Full Stack Development", description: "Web development career from junior to architect", courses: ["Full Stack Python", "MERN Stack", "Frontend React"], roles: [
    { title: "Junior Developer", salary: "₹3-5 LPA", demand: "High" },
    { title: "Full Stack Developer", salary: "₹5-10 LPA", demand: "Very High" },
    { title: "Senior Developer", salary: "₹10-18 LPA", demand: "High" },
    { title: "Tech Lead", salary: "₹15-25 LPA", demand: "Medium" },
  ]},
  { id: "cp2", name: "Data Science & AI", description: "Data-driven career path", courses: ["Data Science", "Machine Learning", "Python for Data"], roles: [
    { title: "Data Analyst", salary: "₹4-8 LPA", demand: "Very High" },
    { title: "Data Scientist", salary: "₹8-15 LPA", demand: "Very High" },
    { title: "ML Engineer", salary: "₹12-22 LPA", demand: "High" },
  ]},
  { id: "cp3", name: "Cloud & DevOps", description: "Infrastructure and deployment career", courses: ["Cloud & DevOps", "AWS Solutions"], roles: [
    { title: "DevOps Engineer", salary: "₹6-12 LPA", demand: "Very High" },
    { title: "Cloud Architect", salary: "₹15-30 LPA", demand: "High" },
  ]},
  { id: "cp4", name: "Design & UX", description: "Creative design career", courses: ["UI/UX Design", "Graphic Design", "Motion Graphics"], roles: [
    { title: "UI Designer", salary: "₹3-6 LPA", demand: "High" },
    { title: "UX Designer", salary: "₹6-12 LPA", demand: "Very High" },
    { title: "Design Lead", salary: "₹12-20 LPA", demand: "Medium" },
  ]},
  { id: "cp5", name: "Digital Marketing", description: "Marketing and growth career", courses: ["Digital Marketing", "Business Analytics"], roles: [
    { title: "Marketing Executive", salary: "₹3-5 LPA", demand: "High" },
    { title: "SEO Specialist", salary: "₹4-8 LPA", demand: "High" },
    { title: "Marketing Manager", salary: "₹8-15 LPA", demand: "Medium" },
  ]},
];

export const users = [
  { id: "u1", name: "Admin User", email: "admin@company.com", role: "Super Admin", branch: "All", active: true },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh.k@company.com", role: "Branch Admin", branch: "Chennai Main", active: true },
  { id: "u3", name: "Karthik S", email: "karthik.s@company.com", role: "Branch Admin", branch: "Bangalore", active: true },
  { id: "u4", name: "Amit Shah", email: "amit.s@company.com", role: "Branch Admin", branch: "Mumbai", active: true },
  { id: "u5", name: "Anita Sharma", email: "anita@company.com", role: "Counsellor", branch: "Chennai Main", active: true },
  { id: "u6", name: "Vikram Reddy", email: "vikram.r@company.com", role: "Counsellor", branch: "Bangalore", active: true },
  { id: "u7", name: "Meena S", email: "meena.s@company.com", role: "Counsellor", branch: "Mumbai", active: true },
  { id: "u8", name: "Priya Nair", email: "priya.n@company.com", role: "Admin", branch: "All", active: true },
  { id: "u9", name: "Deepa M", email: "deepa.m@company.com", role: "Counsellor", branch: "Chennai Main", active: true },
  { id: "u10", name: "Suresh R", email: "suresh.r@company.com", role: "View Only", branch: "Mumbai", active: true },
  { id: "u11", name: "Ganesh T", email: "ganesh@company.com", role: "Counsellor", branch: "Chennai Main", active: false },
  { id: "u12", name: "Lakshmi R", email: "lakshmi.r@company.com", role: "Counsellor", branch: "Bangalore", active: true },
  { id: "u13", name: "Arun M", email: "arun.m@company.com", role: "View Only", branch: "Mumbai", active: false },
  { id: "u14", name: "Divya K", email: "divya.k@company.com", role: "Counsellor", branch: "Chennai Main", active: true },
  { id: "u15", name: "Student User", email: "student@company.com", role: "View Only", branch: "Chennai Main", active: true },
];
