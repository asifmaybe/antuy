export type UserRole = "student" | "teacher" | "cr";

export interface DemoUser {
  id: string;
  password: string;
  name: string;
  role: UserRole;
  subject?: string; // for teachers
}

export const demoUsers: DemoUser[] = [
  {
    id: "STU001",
    password: "student123",
    name: "Ananya Das",
    role: "student",
  },
  {
    id: "TCH001",
    password: "teacher123",
    name: "Dr. Rajesh Sharma",
    role: "teacher",
    subject: "Physics",
  },
  {
    id: "CR001",
    password: "cr123",
    name: "Rina Mondal",
    role: "cr",
  },
];

export function authenticateUser(id: string, password: string): DemoUser | null {
  return demoUsers.find((u) => u.id === id && u.password === password) ?? null;
}
