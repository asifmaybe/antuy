export const mockNotices = [
  {
    id: "1",
    title: "Mid-term Exams",
    description: "Mid-term exams start from April 25. Check the schedule.",
    date: "Apr 12, 2026",
    time: "10:30 AM",
    author: "Md. Mosharrof Hosen",
    important: true,
  },
  {
    id: "2",
    title: "Assignment Deadline",
    description: "Submit English assignment by April 18.",
    date: "Apr 9, 2026",
    time: "9:00 AM",
    author: "Emdadul Hoque",
    important: true,
  },
  {
    id: "3",
    title: "Holiday Notice",
    description: "College will remain closed on April 14 for Bengali New Year.",
    date: "Apr 8, 2026",
    time: "11:15 AM",
    author: "Principal Office",
    important: false,
  },
  {
    id: "4",
    title: "Lab Schedule Change",
    description: "Electrical Engineering Project-II lab shifted to Wednesday this week.",
    date: "Apr 6, 2026",
    time: "2:00 PM",
    author: "Rakibul Islam",
    important: false,
  },
  {
    id: "5",
    title: "Library Book Return",
    description: "All borrowed books must be returned by April 20.",
    date: "Apr 4, 2026",
    time: "8:45 AM",
    author: "Library Admin",
    important: false,
  },
];

export const mockAssignments = [
  {
    id: "1",
    title: "English Essay — Modern Poetry",
    subject: "English",
    assignedDate: "Apr 10",
    dueDate: "Apr 18",
    status: "pending" as const,
  },
  {
    id: "2",
    title: "Bengali Grammar Exercise",
    subject: "Bengali",
    assignedDate: "Apr 12",
    dueDate: "Apr 20",
    status: "pending" as const,
  },
  {
    id: "3",
    title: "Physics Numerical Problems",
    subject: "Physics",
    assignedDate: "Apr 13",
    dueDate: "Apr 22",
    status: "pending" as const,
  },
  {
    id: "4",
    title: "History Chapter Summary",
    subject: "History",
    assignedDate: "Apr 5",
    dueDate: "Apr 12",
    status: "submitted" as const,
  },
  {
    id: "5",
    title: "Math Problem Set 3",
    subject: "Mathematics",
    assignedDate: "Apr 1",
    dueDate: "Apr 8",
    status: "overdue" as const,
  },
];

export const mockExams = [
  {
    id: "1",
    subject: "English",
    type: "Class Test",
    date: "Apr 25",
    marks: 50,
    instructions: "Bring your own answer sheets",
    upcoming: true,
  },
  {
    id: "2",
    subject: "Physics",
    type: "Quiz",
    date: "Apr 28",
    marks: 20,
    instructions: "MCQ format, no negative marking",
    upcoming: true,
  },
  {
    id: "3",
    subject: "Bengali",
    type: "Class Test",
    date: "Apr 2",
    marks: 30,
    instructions: "",
    upcoming: false,
  },
];

export const mockAttendance = [
  { date: "Apr 15", status: "present" as const },
  { date: "Apr 14", status: "absent" as const },
  { date: "Apr 13", status: "present" as const },
  { date: "Apr 12", status: "present" as const },
  { date: "Apr 11", status: "late" as const },
  { date: "Apr 10", status: "present" as const },
  { date: "Apr 9", status: "present" as const },
  { date: "Apr 8", status: "present" as const },
];

export const mockResults = [
  { id: "1", subject: "English", type: "Quiz", marks: 18, total: 20, date: "Apr 2" },
  { id: "2", subject: "Bengali", type: "Class Test", marks: 24, total: 30, date: "Mar 28" },
  { id: "3", subject: "Physics", type: "Quiz", marks: 15, total: 20, date: "Mar 25" },
  { id: "4", subject: "Mathematics", type: "Class Test", marks: 38, total: 50, date: "Mar 20" },
];

export const mockStudent = {
  id: "STU001",
  name: "Ananya Das",
  attendancePercent: 89,
};

export const mockNextSession = {
  subject: "Generation of Electrical Power",
  session: "26751 — MH",
  time: "10:15 AM",
  hall: "EMS",
};

export const mockRoutine = [
  { day: "Sunday", periods: [
    { time: "8:00–8:45", subject: "Generation of Electrical Power (26751)", teacher: "Md. Mosharrof Hosen", hall: "COM 405" },
    { time: "8:45–9:30", subject: "Principle of Marketing (25851)", teacher: "Emdadul Hoque", hall: "COM 405" },
    { time: "9:30–10:15", subject: "Industrial Management (25852)", teacher: "Emdadul Hoque", hall: "COM 405" },
    { time: "11:00–11:45", subject: "Elec. & Electronic Measurement-I (26752)", teacher: "Md. EmaratHossain", hall: "EMS" },
    { time: "12:30–1:15", subject: "Testing & Maintenance of Elec. Equip. (26753)", teacher: "Razaul Karim", hall: "EMS" },
  ]},
  { day: "Monday", periods: [
    { time: "8:45–10:15", subject: "Electrical Engineering Project-II (26754)", teacher: "Rakibul Islam", hall: "EMS" },
    { time: "10:15–11:00", subject: "Generation of Electrical Power (26751)", teacher: "Md. Mosharrof Hosen", hall: "EMS" },
    { time: "11:45–12:30", subject: "Generation of Electrical Power (26751)", teacher: "Md. Mosharrof Hosen", hall: "EPS" },
  ]},
  { day: "Tuesday", periods: [
    { time: "8:00–8:45", subject: "Testing & Maintenance of Elec. Equip. (26753)", teacher: "Razaul Karim", hall: "EPS" },
    { time: "9:30–10:15", subject: "Microprocessor & Microcontroller (26853)", teacher: "Razaul Karim", hall: "EPS" },
    { time: "11:00–11:45", subject: "Principle of Marketing (25851)", teacher: "Emdadul Hoque", hall: "COM 405" },
    { time: "11:45–12:30", subject: "Microprocessor & Microcontroller (26853)", teacher: "Razaul Karim", hall: "COM 405" },
    { time: "12:30–1:15", subject: "Elec. & Electronic Measurement-I (26752)", teacher: "Md. EmaratHossain", hall: "COM 405" },
  ]},
  { day: "Wednesday", periods: [
    { time: "8:45–9:30", subject: "Industrial Management (25852)", teacher: "Emdadul Hoque", hall: "COM 401" },
    { time: "9:30–10:15", subject: "Generation of Electrical Power (26751)", teacher: "Md. Mosharrof Hosen", hall: "COM 401" },
    { time: "11:00–11:45", subject: "Electrical Engineering Project-II (26754)", teacher: "Rakibul Islam", hall: "EMS" },
    { time: "12:30–1:15", subject: "Microprocessor & Microcontroller (26853)", teacher: "Razaul Karim", hall: "EMS" },
  ]},
  { day: "Thursday", periods: [
    { time: "9:30–10:15", subject: "Elec. & Electronic Measurement-I (26752)", teacher: "Md. EmaratHossain", hall: "EPS" },
    { time: "11:00–11:45", subject: "Testing & Maintenance of Elec. Equip. (26753)", teacher: "Razaul Karim", hall: "EMS" },
    { time: "12:30–1:15", subject: "Microprocessor & Microcontroller (26853)", teacher: "Razaul Karim", hall: "EMS" },
  ]},
];
