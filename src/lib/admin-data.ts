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
  { id: "842943", name: "ANIRBAN", roll: 842943 },
  { id: "842944", name: "KHALID HOSSAIN", roll: 842944 },
  { id: "842945", name: "MD.TUSARUJJAMAN", roll: 842945 },
  { id: "842946", name: "GOLAM RABBANI ASIF", roll: 842946 },
  { id: "842949", name: "MORTOZA RAHMAN", roll: 842949 },
  { id: "842950", name: "SADIA TAHSIN AURIN", roll: 842950 },
  { id: "842951", name: "SUJOY KUMAR PAUL", roll: 842951 },
  { id: "842954", name: "MD. SAZIB HOSSAIN", roll: 842954 },
  { id: "842955", name: "MD. SAGOR ALI", roll: 842955 },
  { id: "842956", name: "MD. SAKIL SHEIKH", roll: 842956 },
  { id: "842957", name: "TANZIL HASAN OVI", roll: 842957 },
  { id: "842959", name: "NAZMUL HAQUE JAYAN", roll: 842959 },
  { id: "842961", name: "PRATIK BISWAS", roll: 842961 },
  { id: "842962", name: "RIPON SAHA", roll: 842962 },
  { id: "842963", name: "ERINA TONNI", roll: 842963 },
  { id: "842964", name: "MD. TORIKUL ISLAM", roll: 842964 },
  { id: "842965", name: "RATUL HOSSEN", roll: 842965 },
  { id: "842967", name: "MD. ASIF MOSADDEK", roll: 842967 },
  { id: "842969", name: "NIRAB KUMAR ADHIKARI", roll: 842969 },
  { id: "842971", name: "MD KHALID HASAN ABIR", roll: 842971 },
  { id: "842974", name: "SHEIKH ABDULLAH", roll: 842974 },
  { id: "842977", name: "MD. MUSA BEPARI", roll: 842977 },
  { id: "842978", name: "SHUVO SARKAR", roll: 842978 },
  { id: "842980", name: "SWOPNIL KUMAR KUNDU", roll: 842980 },
  { id: "842981", name: "MD.SHAHRIAR SIFAT", roll: 842981 },
  { id: "842984", name: "MD ASRAFUJJAMAN", roll: 842984 },
  { id: "842985", name: "PROTIK SAHA", roll: 842985 },
  { id: "842986", name: "MD. ASHADUL ISLAM", roll: 842986 },
  { id: "842987", name: "JUNAYED AL HABIB", roll: 842987 },
  { id: "842988", name: "LAMIM ISLAM", roll: 842988 },
  { id: "842991", name: "SHORIFUL ISLAM", roll: 842991 },
  { id: "842992", name: "SABBIR SHEIKH", roll: 842992 },
  { id: "842996", name: "MOBARAK TALUKDER", roll: 842996 },
  { id: "842999", name: "MD. AL AMIN HOSSAIN", roll: 842999 },
  { id: "843001", name: "JUBIAR RAHAMAN JONY", roll: 843001 },
  { id: "843003", name: "RAFI BEEN SAWKOT", roll: 843003 },
  { id: "843008", name: "TAMIM MIA", roll: 843008 },
  { id: "843010", name: "MD. SABBIR BISWAS", roll: 843010 },
  { id: "843011", name: "MOHAMMAD ABDULLAH MRIDHA", roll: 843011 },
  { id: "843012", name: "MD. SHEEMUL HOSSAIN", roll: 843012 },
  { id: "843014", name: "DIPTO SAHA", roll: 843014 },
  { id: "843015", name: "MD.RAYAJUL ISLAM", roll: 843015 },
  { id: "843016", name: "MD SHOHIDUL HASAN", roll: 843016 },
  { id: "843017", name: "AMIR HAMZA", roll: 843017 },
  { id: "843018", name: "SAKIBUL HASAN SOIKOT", roll: 843018 },
  { id: "843019", name: "SUMAIYA AKTER", roll: 843019 },
  { id: "843021", name: "MD.ASHADUL ISLAM", roll: 843021 },
  { id: "843022", name: "AYUB HOSSEN", roll: 843022 },
  { id: "843024", name: "MD. JUBRAJ AHAMED", roll: 843024 },
  { id: "843025", name: "MD. APU SHEIKH", roll: 843025 },
  { id: "843026", name: "MD. SANVIR ISLAM SHANTO", roll: 843026 },
  { id: "843027", name: "FATEMA MAHJABEN SNEHA", roll: 843027 },
  { id: "843029", name: "MD. JUBAYEAR SHAKE", roll: 843029 },
  { id: "843030", name: "MD. RAKIB HOSEN", roll: 843030 },
  { id: "843031", name: "SIMMY AKTER", roll: 843031 },
  { id: "843032", name: "BIDHAN BASAK", roll: 843032 },
  { id: "843036", name: "MD. MAHFUZAR RAHMAN TUSAR", roll: 843036 },
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
    studentId: "842943",
    studentName: "ANIRBAN",
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
    studentId: "842944",
    studentName: "KHALID HOSSAIN",
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
    studentId: "842950",
    studentName: "SADIA TAHSIN AURIN",
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
    studentId: "842946",
    studentName: "GOLAM RABBANI ASIF",
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
    studentId: "842949",
    studentName: "MORTOZA RAHMAN",
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
