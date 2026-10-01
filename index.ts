export type UserRole = 'student' | 'admin' | null;

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Holiday';

export interface StudentProfile {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  semester: string;
  section: string;
  email: string;
  rfidTagId: string;
  monthlyAttendance: number;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  todayStatus: AttendanceStatus;
  todayEntry: string;
  todayExit: string;
  todayDuration: string;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  classroom: string;
  entryTime: string;
  exitTime: string;
  duration: string;
  status: AttendanceStatus;
  source: 'RFID Automatic' | 'Manual Override';
  notes?: string;
}

export type CorrectionIssueType = 
  | 'RFID not detected' 
  | 'Incorrect entry time' 
  | 'Incorrect exit time' 
  | 'Other';

export type CorrectionStatus = 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';

export interface CorrectionRequest {
  id: string;
  studentName: string;
  studentId: string;
  date: string;
  subject: string;
  issueType: CorrectionIssueType;
  description: string;
  rfidLog: string;
  currentAttendance: AttendanceStatus;
  status: CorrectionStatus;
  submittedAt: string;
  adminReason?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminName: string;
  studentId: string;
  studentName: string;
  date: string;
  subject: string;
  classroom: string;
  originalStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
  timestamp: string;
  action: 'Manual Override' | 'Correction Approval' | 'Status Revision';
}

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'WARNING';

export interface RFIDDevice {
  id: string;
  name: string;
  classroom: string;
  status: DeviceStatus;
  lastSync: string;
  antennaCount: number;
  frequencyBand: string;
  tagsDetectedToday: number;
  signalStrength: number;
  ipAddress: string;
}

export interface LiveActivityEvent {
  id: string;
  timestamp: string;
  studentName: string;
  studentId: string;
  event: 'Student entered' | 'Student exited';
  duration?: string;
  rfidSignal: string;
}

export interface ClassroomSession {
  id: string;
  roomNumber: string;
  subject: string;
  instructor: string;
  department: string;
  sessionActive: boolean;
  studentsInside: number;
  expected: number;
  entryWindow: string;
  currentTime: string;
  readerStatus: DeviceStatus;
  rfidReaderName: string;
  liveActivity: LiveActivityEvent[];
}

export interface DayAttendanceCalendar {
  date: string;
  dayName: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  dayNumber: number;
  status: AttendanceStatus;
  subjectSummary?: string;
}
