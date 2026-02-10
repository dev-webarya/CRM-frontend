export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  status: "Active" | "Paused" | "Inactive";
  joinDate: string;
  monthlyHours: number;
  rate: number;
}

export interface Student {
  id: string;
  regNumber: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  status: "Active" | "Paused" | "Completed";
  joinDate: string;
  assignedTeacher: string;
  course: string;
}

export interface Course {
  id: string;
  name: string;
  subject: string;
  studentId: string;
  teacherId: string;
  cycleType: "Monthly" | "Quarterly" | "Yearly";
  totalHours: number;
  completedHours: number;
  billingRate: number;
  status: "Active" | "Paused" | "Completed";
}

export interface ClassSession {
  id: string;
  date: string;
  time: string;
  duration: number;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  subject: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  object: string;
  user: string;
  role: "Admin" | "Teacher" | "Student";
  details: string;
}

export const teachers: Teacher[] = [
  { id: "t1", name: "Dr. Ananya Sharma", email: "ananya@institute.com", phone: "+91 98765 43210", subjects: ["Mathematics", "Physics"], status: "Active", joinDate: "2024-01-15", monthlyHours: 48, rate: 800 },
  { id: "t2", name: "Rajesh Kumar", email: "rajesh@institute.com", phone: "+91 98765 43211", subjects: ["Chemistry"], status: "Active", joinDate: "2024-03-01", monthlyHours: 36, rate: 700 },
  { id: "t3", name: "Priya Patel", email: "priya@institute.com", phone: "+91 98765 43212", subjects: ["English", "Literature"], status: "Paused", joinDate: "2023-09-10", monthlyHours: 0, rate: 650 },
  { id: "t4", name: "Vikram Singh", email: "vikram@institute.com", phone: "+91 98765 43213", subjects: ["Biology", "Chemistry"], status: "Active", joinDate: "2024-06-01", monthlyHours: 42, rate: 750 },
  { id: "t5", name: "Meera Nair", email: "meera@institute.com", phone: "+91 98765 43214", subjects: ["Computer Science"], status: "Active", joinDate: "2024-02-20", monthlyHours: 30, rate: 900 },
];

export const students: Student[] = [
  { id: "s1", regNumber: "STU-2024-001", name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 87654 32100", grade: "12th", status: "Active", joinDate: "2024-04-01", assignedTeacher: "t1", course: "JEE Advanced" },
  { id: "s2", regNumber: "STU-2024-002", name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 87654 32101", grade: "11th", status: "Active", joinDate: "2024-05-15", assignedTeacher: "t2", course: "NEET Prep" },
  { id: "s3", regNumber: "STU-2024-003", name: "Karan Gupta", email: "karan@email.com", phone: "+91 87654 32102", grade: "10th", status: "Paused", joinDate: "2024-01-10", assignedTeacher: "t3", course: "Board Prep" },
  { id: "s4", regNumber: "STU-2024-004", name: "Divya Joshi", email: "divya@email.com", phone: "+91 87654 32103", grade: "12th", status: "Active", joinDate: "2024-06-01", assignedTeacher: "t4", course: "NEET Prep" },
  { id: "s5", regNumber: "STU-2024-005", name: "Rohan Das", email: "rohan@email.com", phone: "+91 87654 32104", grade: "11th", status: "Completed", joinDate: "2023-08-01", assignedTeacher: "t5", course: "CS Foundation" },
  { id: "s6", regNumber: "STU-2024-006", name: "Anita Sharma", email: "anita@email.com", phone: "+91 87654 32105", grade: "12th", status: "Active", joinDate: "2024-07-01", assignedTeacher: "t1", course: "JEE Advanced" },
];

export const courses: Course[] = [
  { id: "c1", name: "JEE Advanced - Arjun", subject: "Mathematics + Physics", studentId: "s1", teacherId: "t1", cycleType: "Quarterly", totalHours: 120, completedHours: 78, billingRate: 800, status: "Active" },
  { id: "c2", name: "NEET Prep - Sneha", subject: "Chemistry", studentId: "s2", teacherId: "t2", cycleType: "Monthly", totalHours: 40, completedHours: 24, billingRate: 700, status: "Active" },
  { id: "c3", name: "Board Prep - Karan", subject: "English", studentId: "s3", teacherId: "t3", cycleType: "Monthly", totalHours: 30, completedHours: 30, billingRate: 650, status: "Paused" },
  { id: "c4", name: "NEET Prep - Divya", subject: "Biology + Chemistry", studentId: "s4", teacherId: "t4", cycleType: "Quarterly", totalHours: 100, completedHours: 45, billingRate: 750, status: "Active" },
  { id: "c5", name: "CS Foundation - Rohan", subject: "Computer Science", studentId: "s5", teacherId: "t5", cycleType: "Yearly", totalHours: 200, completedHours: 200, billingRate: 900, status: "Completed" },
];

export const classSessions: ClassSession[] = [
  { id: "cl1", date: "2026-02-10", time: "09:00", duration: 1.5, teacherId: "t1", teacherName: "Dr. Ananya Sharma", studentId: "s1", studentName: "Arjun Mehta", subject: "Mathematics", status: "Scheduled" },
  { id: "cl2", date: "2026-02-10", time: "11:00", duration: 1, teacherId: "t2", teacherName: "Rajesh Kumar", studentId: "s2", studentName: "Sneha Reddy", subject: "Chemistry", status: "Scheduled" },
  { id: "cl3", date: "2026-02-10", time: "14:00", duration: 1.5, teacherId: "t4", teacherName: "Vikram Singh", studentId: "s4", studentName: "Divya Joshi", subject: "Biology", status: "Scheduled" },
  { id: "cl4", date: "2026-02-10", time: "16:00", duration: 1, teacherId: "t5", teacherName: "Meera Nair", studentId: "s5", studentName: "Rohan Das", subject: "Computer Science", status: "Completed" },
  { id: "cl5", date: "2026-02-09", time: "10:00", duration: 1.5, teacherId: "t1", teacherName: "Dr. Ananya Sharma", studentId: "s6", studentName: "Anita Sharma", subject: "Physics", status: "Completed" },
  { id: "cl6", date: "2026-02-09", time: "13:00", duration: 1, teacherId: "t2", teacherName: "Rajesh Kumar", studentId: "s2", studentName: "Sneha Reddy", subject: "Chemistry", status: "Completed" },
  { id: "cl7", date: "2026-02-08", time: "09:00", duration: 2, teacherId: "t1", teacherName: "Dr. Ananya Sharma", studentId: "s1", studentName: "Arjun Mehta", subject: "Mathematics", status: "Completed" },
  { id: "cl8", date: "2026-02-08", time: "15:00", duration: 1, teacherId: "t4", teacherName: "Vikram Singh", studentId: "s4", studentName: "Divya Joshi", subject: "Chemistry", status: "Cancelled" },
];

export const logs: LogEntry[] = [
  { id: "l1", timestamp: "2026-02-10 09:15:00", action: "CREATE", object: "Class", user: "Dr. Ananya Sharma", role: "Teacher", details: "Created class for Arjun Mehta - Mathematics" },
  { id: "l2", timestamp: "2026-02-10 08:30:00", action: "UPDATE", object: "Student", user: "Admin", role: "Admin", details: "Updated student Sneha Reddy's course details" },
  { id: "l3", timestamp: "2026-02-09 17:00:00", action: "CREATE", object: "Course", user: "Admin", role: "Admin", details: "Created new course: NEET Prep - Divya" },
  { id: "l4", timestamp: "2026-02-09 14:20:00", action: "DELETE", object: "Class", user: "Admin", role: "Admin", details: "Cancelled class cl8 - Vikram Singh" },
  { id: "l5", timestamp: "2026-02-08 10:00:00", action: "UPDATE", object: "Teacher", user: "Admin", role: "Admin", details: "Updated Priya Patel status to Paused" },
  { id: "l6", timestamp: "2026-02-08 09:00:00", action: "CREATE", object: "Student", user: "Admin", role: "Admin", details: "Added new student Anita Sharma" },
];
