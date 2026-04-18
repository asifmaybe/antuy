export interface AdminAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  status: "active" | "completed" | "overdue";
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminExam {
  id: string;
  subject: string;
  type: "Class Test" | "Quiz" | "Mid-Term" | "Final";
  date: string;
  marks: number;
  instructions: string;
  upcoming: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  roll: number;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "late";
  remarks: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  time: string;
  subject: string;
  isOnlineMarkingActive: boolean;
  markedBy: string;
  records: AttendanceRecord[];
  createdAt: string;
}

export interface AdminResult {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  examType: "Class Test" | "Quiz" | "Mid-Term" | "Final";
  marks: number;
  totalMarks: number;
  date: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AdminNotice {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  author: string;
  important: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  subject?: string;
  timestamp: string;
  details: string;
}

export const mockStudentsList: StudentRecord[] = [
  { id: "STU001", name: "Asif Ahmed", roll: 1 },
  { id: "STU002", name: "Rahim Ahmed", roll: 2 },
  { id: "STU003", name: "Fatema Khatun", roll: 3 },
  { id: "STU004", name: "Sumon Mia", roll: 4 },
  { id: "STU005", name: "Priya Sharma", roll: 5 },
  { id: "STU006", name: "Kamal Hossain", roll: 6 },
  { id: "STU007", name: "Nusrat Jahan", roll: 7 },
  { id: "STU008", name: "Arif Islam", roll: 8 },
  { id: "STU009", name: "Mithila Roy", roll: 9 },
  { id: "STU010", name: "Tanvir Hasan", roll: 10 },
];

export const mockAdminAssignments: AdminAssignment[] = [
  {
    id: "1",
    title: "English Essay — Modern Poetry",
    subject: "English",
    description: "Write a 500-word essay on modern poetry trends",
    assignedDate: "Apr 10, 2026",
    dueDate: "Apr 18, 2026",
    status: "active",
    createdBy: "Emdadul Hoque",
    updatedBy: "Emdadul Hoque",
    createdAt: "Apr 10, 2026 9:00 AM",
    updatedAt: "Apr 10, 2026 9:00 AM",
  },
  {
    id: "2",
    title: "Bengali Grammar Exercise",
    subject: "Bengali",
    description: "Complete exercises from chapter 5-6",
    assignedDate: "Apr 12, 2026",
    dueDate: "Apr 20, 2026",
    status: "active",
    createdBy: "Emdadul Hoque",
    updatedBy: "Emdadul Hoque",
    createdAt: "Apr 12, 2026 10:30 AM",
    updatedAt: "Apr 12, 2026 10:30 AM",
  },
  {
    id: "3",
    title: "Physics Numerical Problems",
    subject: "Physics",
    description: "Solve problems 1-15 from chapter 8",
    assignedDate: "Apr 13, 2026",
    dueDate: "Apr 22, 2026",
    status: "active",
    createdBy: "Md. Mosharrof Hosen",
    updatedBy: "Md. Mosharrof Hosen",
    createdAt: "Apr 13, 2026 8:00 AM",
    updatedAt: "Apr 13, 2026 8:00 AM",
  },
  {
    id: "4",
    title: "Math Problem Set 3",
    subject: "Mathematics",
    description: "Complete all problems from set 3",
    assignedDate: "Apr 1, 2026",
    dueDate: "Apr 8, 2026",
    status: "overdue",
    createdBy: "Razaul Karim",
    updatedBy: "Razaul Karim",
    createdAt: "Apr 1, 2026 9:00 AM",
    updatedAt: "Apr 1, 2026 9:00 AM",
  },
];

export const mockAdminExams: AdminExam[] = [
  {
    id: "1",
    subject: "English",
    type: "Class Test",
    date: "Apr 25, 2026",
    marks: 50,
    instructions: "Bring your own answer sheets",
    upcoming: true,
    createdBy: "Emdadul Hoque",
    updatedBy: "Emdadul Hoque",
    createdAt: "Apr 12, 2026 10:00 AM",
    updatedAt: "Apr 12, 2026 10:00 AM",
  },
  {
    id: "2",
    subject: "Physics",
    type: "Quiz",
    date: "Apr 28, 2026",
    marks: 20,
    instructions: "MCQ format, no negative marking",
    upcoming: true,
    createdBy: "Md. Mosharrof Hosen",
    updatedBy: "Md. Mosharrof Hosen",
    createdAt: "Apr 14, 2026 11:00 AM",
    updatedAt: "Apr 14, 2026 11:00 AM",
  },
  {
    id: "3",
    subject: "Bengali",
    type: "Class Test",
    date: "Apr 2, 2026",
    marks: 30,
    instructions: "Written test, answer any 5 questions",
    upcoming: false,
    createdBy: "Emdadul Hoque",
    updatedBy: "Emdadul Hoque",
    createdAt: "Mar 28, 2026 9:00 AM",
    updatedAt: "Mar 28, 2026 9:00 AM",
  },
];

export const mockAdminResults: AdminResult[] = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "Asif Ahmed",
    subject: "English",
    examType: "Quiz",
    marks: 18,
    totalMarks: 20,
    date: "Apr 2, 2026",
    uploadedBy: "Emdadul Hoque",
    uploadedAt: "Apr 3, 2026 10:00 AM",
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "Rahim Ahmed",
    subject: "English",
    examType: "Quiz",
    marks: 15,
    totalMarks: 20,
    date: "Apr 2, 2026",
    uploadedBy: "Emdadul Hoque",
    uploadedAt: "Apr 3, 2026 10:00 AM",
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Fatema Khatun",
    subject: "Bengali",
    examType: "Class Test",
    marks: 24,
    totalMarks: 30,
    date: "Mar 28, 2026",
    uploadedBy: "Emdadul Hoque",
    uploadedAt: "Mar 29, 2026 9:00 AM",
  },
  {
    id: "4",
    studentId: "STU001",
    studentName: "Asif Ahmed",
    subject: "Physics",
    examType: "Quiz",
    marks: 15,
    totalMarks: 20,
    date: "Mar 25, 2026",
    uploadedBy: "Md. Mosharrof Hosen",
    uploadedAt: "Mar 26, 2026 11:00 AM",
  },
  {
    id: "5",
    studentId: "STU004",
    studentName: "Sumon Mia",
    subject: "Mathematics",
    examType: "Class Test",
    marks: 38,
    totalMarks: 50,
    date: "Mar 20, 2026",
    uploadedBy: "Razaul Karim",
    uploadedAt: "Mar 21, 2026 10:00 AM",
  },
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "Created Assignment",
    performedBy: "Emdadul Hoque",
    subject: "English",
    timestamp: "Apr 10, 2026 9:00 AM",
    details: "English Essay — Modern Poetry",
  },
  {
    id: "2",
    action: "Created Exam",
    performedBy: "Md. Mosharrof Hosen",
    subject: "Physics",
    timestamp: "Apr 14, 2026 11:00 AM",
    details: "Physics Quiz on Apr 28",
  },
  {
    id: "3",
    action: "Posted Notice",
    performedBy: "Md. Mosharrof Hosen",
    timestamp: "Apr 12, 2026 10:30 AM",
    details: "Mid-term Exams announcement",
  },
  {
    id: "4",
    action: "Uploaded Results",
    performedBy: "Emdadul Hoque",
    subject: "English",
    timestamp: "Apr 3, 2026 10:00 AM",
    details: "English Quiz results for 10 students",
  },
  {
    id: "5",
    action: "Marked Attendance",
    performedBy: "Rina Mondal",
    subject: "Physics",
    timestamp: "Apr 15, 2026 8:30 AM",
    details: "Online attendance for Physics class",
  },
];
