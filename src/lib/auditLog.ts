import { LogEntry, LoggableObject } from "@/types/types";
import { generateLogId } from "./crmUtils";

interface LogDetails {
  before?: Partial<LoggableObject>;
  after?: Partial<LoggableObject>;
  remarks?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Mock storage for logs (in real app, this would be backend API)
let logStorage: LogEntry[] = [];

export function addLog(
  actionType: LogEntry["actionType"],
  objectType: LogEntry["objectType"],
  objectId: string,
  actorUserId: string,
  actorRole: "Admin" | "Teacher" | "Student",
  details?: LogDetails
): LogEntry {
  const logEntry: LogEntry = {
    logId: generateLogId(),
    timestamp: new Date().toISOString(),
    actorUserId,
    actorRole,
    actionType,
    objectType,
    objectId,
    before: details?.before,
    after: details?.after,
    ipAddress: details?.ipAddress,
    userAgent: details?.userAgent,
    remarks: details?.remarks,
  };

  logStorage.push(logEntry);
  console.log("[AUDIT LOG]", logEntry); // For debugging

  return logEntry;
}

export function getLogs(filters?: {
  date?: string; // YYYY-MM-DD format
  actorRole?: "Admin" | "Teacher" | "Student";
  actionType?: string;
  objectType?: string;
  actorUserId?: string;
}): LogEntry[] {
  let filtered = [...logStorage];

  if (filters?.date) {
    const filterDate = new Date(filters.date);
    const filterDateStr = filterDate.toISOString().split("T")[0];
    filtered = filtered.filter((log) => log.timestamp.split("T")[0] === filterDateStr);
  }

  if (filters?.actorRole) {
    filtered = filtered.filter((log) => log.actorRole === filters.actorRole);
  }

  if (filters?.actionType) {
    filtered = filtered.filter((log) => log.actionType === filters.actionType);
  }

  if (filters?.objectType) {
    filtered = filtered.filter((log) => log.objectType === filters.objectType);
  }

  if (filters?.actorUserId) {
    filtered = filtered.filter((log) => log.actorUserId === filters.actorUserId);
  }

  // Return newest first
  return filtered.reverse();
}

export function getLogsByDate(date: string): LogEntry[] {
  return getLogs({ date });
}

export function getLogsByUser(userId: string): LogEntry[] {
  return getLogs({ actorUserId: userId });
}

export function exportLogsToCSV(logs: LogEntry[]): string {
  const headers = [
    "Log ID",
    "Timestamp",
    "Actor User ID",
    "Actor Role",
    "Action Type",
    "Object Type",
    "Object ID",
    "Remarks",
  ];

  const rows = logs.map((log) => [
    log.logId,
    log.timestamp,
    log.actorUserId,
    log.actorRole,
    log.actionType,
    log.objectType,
    log.objectId,
    log.remarks || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

// Initialize with sample logs from mock data
export function initializeLogs(initialLogs: LogEntry[]) {
  logStorage = [...initialLogs];
}

export function clearLogs() {
  logStorage = [];
}

export function getLogCount(): number {
  return logStorage.length;
}

// Log templates for common actions
export function logTeacherAdded(
  teacherId: string,
  teacherName: string,
  adminId: string
) {
  return addLog("CREATE", "Teacher", teacherId, adminId, "Admin", {
    remarks: `Added new teacher: ${teacherName}`,
  });
}

export function logTeacherUpdated(
  teacherId: string,
  teacherName: string,
  adminId: string,
  changes: Record<string, any>
) {
  return addLog("UPDATE", "Teacher", teacherId, adminId, "Admin", {
    before: { teacherId, name: teacherName },
    after: changes,
    remarks: `Updated teacher: ${teacherName}`,
  });
}

export function logTeacherDeleted(
  teacherId: string,
  teacherName: string,
  adminId: string
) {
  return addLog("DELETE", "Teacher", teacherId, adminId, "Admin", {
    remarks: `Deleted teacher: ${teacherName}`,
  });
}

export function logStudentAdded(
  studentId: string,
  studentName: string,
  adminId: string
) {
  return addLog("CREATE", "Student", studentId, adminId, "Admin", {
    remarks: `Added new student: ${studentName}`,
  });
}

export function logStudentUpdated(
  studentId: string,
  studentName: string,
  adminId: string,
  changes: Record<string, any>
) {
  return addLog("UPDATE", "Student", studentId, adminId, "Admin", {
    before: { studentId, name: studentName },
    after: changes,
    remarks: `Updated student: ${studentName}`,
  });
}

export function logStudentDeleted(
  studentId: string,
  studentName: string,
  adminId: string
) {
  return addLog("DELETE", "Student", studentId, adminId, "Admin", {
    remarks: `Deleted student: ${studentName}`,
  });
}

export function logCourseAdded(
  courseId: string,
  subject: string,
  adminId: string
) {
  return addLog("CREATE", "Course", courseId, adminId, "Admin", {
    remarks: `Added new course: ${subject}`,
  });
}

export function logCourseUpdated(
  courseId: string,
  subject: string,
  adminId: string,
  changes: Record<string, any>
) {
  return addLog("UPDATE", "Course", courseId, adminId, "Admin", {
    before: { courseId, subject },
    after: changes,
    remarks: `Updated course: ${subject}`,
  });
}

export function logCourseDeleted(
  courseId: string,
  subject: string,
  adminId: string
) {
  return addLog("DELETE", "Course", courseId, adminId, "Admin", {
    remarks: `Deleted course: ${subject}`,
  });
}

export function logClassAdded(
  classId: string,
  studentName: string,
  subject: string,
  createdByRole: "Admin" | "Teacher",
  userId: string
) {
  return addLog("CREATE", "Class", classId, userId, createdByRole, {
    remarks: `Added class for ${studentName} - ${subject}`,
  });
}

export function logClassUpdated(
  classId: string,
  studentName: string,
  adminId: string,
  changes: Record<string, any>
) {
  return addLog("UPDATE", "Class", classId, adminId, "Admin", {
    before: { classId },
    after: changes,
    remarks: `Updated class for ${studentName}`,
  });
}

export function logClassDeleted(
  classId: string,
  studentName: string,
  adminId: string
) {
  return addLog("DELETE", "Class", classId, adminId, "Admin", {
    remarks: `Deleted class for ${studentName}`,
  });
}

export function logDuplicateClassAttempt(
  conflictingClassId: string,
  studentName: string,
  adminId: string
) {
  return addLog("CREATE", "Class", conflictingClassId, adminId, "Admin", {
    remarks: `Duplicate class attempt blocked for ${studentName}`,
  });
}

export function logUserLogin(userId: string, role: "Admin" | "Teacher" | "Student", success: boolean) {
  return addLog("LOGIN", "Settings", userId, userId, role, {
    remarks: `${role} login ${success ? "successful" : "failed"}`,
  });
}

export function logNotificationSent(
  notificationType: "FEE_DUE" | "PAYOUT_SUMMARY",
  recipientEmail: string,
  adminId: string
) {
  return addLog("NOTIFICATION", "Course", adminId, adminId, "Admin", {
    remarks: `${notificationType} notification sent to ${recipientEmail}`,
  });
}
