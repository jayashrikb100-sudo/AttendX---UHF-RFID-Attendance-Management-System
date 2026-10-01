/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CURRENT_STUDENT, 
  INITIAL_STUDENT_ATTENDANCE, 
  INITIAL_CALENDAR_DAYS, 
  INITIAL_CORRECTION_REQUESTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_RFID_DEVICES, 
  INITIAL_ROOM_204_SESSION,
  ENROLLED_STUDENTS_LIST
} from './data/mockData';
import { 
  StudentProfile, 
  AttendanceRecord, 
  CorrectionRequest, 
  AuditLogRecord, 
  RFIDDevice, 
  ClassroomSession,
  DayAttendanceCalendar,
  UserRole
} from './types';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { RfidSimulatorDrawer } from './components/common/RfidSimulatorDrawer';
import { CheckCircle2, Radio, Bell } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'student' | 'admin'>('landing');
  const [loginTargetRole, setLoginTargetRole] = useState<'student' | 'admin'>('student');
  const [activeUserRole, setActiveUserRole] = useState<UserRole>(null);

  // App-wide reactive state
  const [student, setStudent] = useState<StudentProfile>(CURRENT_STUDENT);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(INITIAL_STUDENT_ATTENDANCE);
  const [calendarDays, setCalendarDays] = useState<DayAttendanceCalendar[]>(INITIAL_CALENDAR_DAYS);
  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>(INITIAL_CORRECTION_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [rfidDevices, setRfidDevices] = useState<RFIDDevice[]>(INITIAL_RFID_DEVICES);
  const [activeSession, setActiveSession] = useState<ClassroomSession>(INITIAL_ROOM_204_SESSION);

  // Simulator Drawer State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleNavigate = (view: 'landing' | 'login' | 'student' | 'admin', roleHint?: 'student' | 'admin') => {
    if (view === 'login') {
      setLoginTargetRole(roleHint || 'student');
      setCurrentView('login');
      return;
    }
    if (view === 'student') {
      setActiveUserRole('student');
      setCurrentView('student');
      return;
    }
    if (view === 'admin') {
      setActiveUserRole('admin');
      setCurrentView('admin');
      return;
    }
    setCurrentView('landing');
  };

  const handleLoginSuccess = (role: 'student' | 'admin') => {
    setActiveUserRole(role);
    if (role === 'student') {
      setCurrentView('student');
      showToast('Logged in as Arun Kumar (SEC24CSE1023). RFID credentials verified.');
    } else {
      setCurrentView('admin');
      showToast('Logged in as Prof. K. Venkatesh (admin_204). Full administrative privileges granted.');
    }
  };

  const handleLogout = () => {
    setActiveUserRole(null);
    setCurrentView('landing');
    showToast('Signed out successfully.');
  };

  // Student submits attendance correction request
  const handleSubmitCorrection = (newRequest: Omit<CorrectionRequest, 'id' | 'status' | 'submittedAt'>) => {
    const id = `CR-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const submittedAt = now.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    const created: CorrectionRequest = {
      ...newRequest,
      id,
      status: 'Pending',
      submittedAt
    };

    setCorrectionRequests([created, ...correctionRequests]);
    showToast(`Correction request ${id} submitted for faculty review.`);
  };

  // Admin commits manual attendance override to audit log
  const handleAddAuditLog = (newLog: Omit<AuditLogRecord, 'id' | 'timestamp'>) => {
    const id = `AUD-${Math.floor(8820 + Math.random() * 500)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timestamp = `${dateFormatted}, ${timeFormatted}`;

    const createdRecord: AuditLogRecord = {
      ...newLog,
      id,
      timestamp
    };

    setAuditLogs([createdRecord, ...auditLogs]);

    // If override is for Arun Kumar, update his history and today status if applicable
    if (newLog.studentId === student.id) {
      setAttendanceHistory(prev => {
        const existingIndex = prev.findIndex(r => r.date === newLog.date && r.subject === newLog.subject);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            status: newLog.newStatus,
            source: 'Manual Override',
            notes: `Manual adjustment by ${newLog.adminId}: "${newLog.reason}"`
          };
          return updated;
        } else {
          return [
            {
              id: `att-${Date.now()}`,
              date: newLog.date,
              subject: newLog.subject,
              classroom: newLog.classroom,
              entryTime: '09:00 AM',
              exitTime: '10:45 AM',
              duration: '1h 45m',
              status: newLog.newStatus,
              source: 'Manual Override',
              notes: `Manual entry by ${newLog.adminId}: "${newLog.reason}"`
            },
            ...prev
          ];
        }
      });

      if (newLog.date === '2026-10-01') {
        setStudent(prev => ({
          ...prev,
          todayStatus: newLog.newStatus
        }));
      }
    }
  };

  // Admin resolves or rejects a correction request
  const handleUpdateCorrectionRequest = (
    requestId: string, 
    status: 'Resolved' | 'Rejected', 
    adminReason: string
  ) => {
    const now = new Date();
    const resolvedAt = now.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    setCorrectionRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status,
          adminReason,
          resolvedAt,
          resolvedBy: 'admin_204 (Prof. K. Venkatesh)'
        };
      }
      return req;
    }));

    showToast(`Correction Request ${requestId} marked as ${status}.`);
  };

  // Real-time RFID Walkthrough Simulator Handler
  const handleSimulateRfidEvent = (studentId: string, room: string, actionType: 'entry' | 'exit') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetStudent = ENROLLED_STUDENTS_LIST.find(s => s.id === studentId) || ENROLLED_STUDENTS_LIST[0];

    // Add to active classroom session live timeline
    setActiveSession(prev => ({
      ...prev,
      studentsInside: actionType === 'entry' ? Math.min(prev.expected, prev.studentsInside + 1) : Math.max(0, prev.studentsInside - 1),
      liveActivity: [
        {
          id: `act-${Date.now()}`,
          timestamp: timeStr,
          studentName: targetStudent.name,
          studentId: targetStudent.id,
          event: actionType === 'entry' ? 'Student entered' : 'Student exited',
          rfidSignal: '-52 dBm (Portal Phased Array)'
        },
        ...prev.liveActivity.slice(0, 7)
      ]
    }));

    // Update reader detection counters
    setRfidDevices(prev => prev.map(d => {
      if (d.classroom.includes(room) || d.name === 'Reader 01') {
        return {
          ...d,
          tagsDetectedToday: d.tagsDetectedToday + 1,
          lastSync: timeStr
        };
      }
      return d;
    }));

    // If Arun Kumar, update today's card values
    if (studentId === student.id) {
      if (actionType === 'entry') {
        setStudent(prev => ({
          ...prev,
          todayStatus: 'Present',
          todayEntry: timeStr
        }));
      } else {
        setStudent(prev => ({
          ...prev,
          todayExit: timeStr,
          todayDuration: '1h 52m'
        }));
      }
    }

    showToast(`UHF RFID Portal detected ${targetStudent.name} (${targetStudent.id}) in ${room} · ${actionType.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF4E3]/20 text-[#17202A]">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md bg-[#06243D] text-white p-3.5 rounded-xl border border-[#F5A044]/50 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 text-xs">
            <Radio className="w-4 h-4 text-[#F5A044] shrink-0 animate-pulse" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Switching */}
      {currentView === 'landing' && (
        <>
          <Navbar 
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
          <main className="flex-1">
            <LandingPage 
              onNavigateToLogin={(role) => handleNavigate('login', role)}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />
          </main>
        </>
      )}

      {currentView === 'login' && (
        <LoginPage 
          initialRole={loginTargetRole}
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'student' && (
        <StudentPortal 
          student={student}
          attendanceHistory={attendanceHistory}
          calendarDays={calendarDays}
          correctionRequests={correctionRequests}
          onSubmitCorrection={handleSubmitCorrection}
          onLogout={handleLogout}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />
      )}

      {currentView === 'admin' && (
        <AdminPortal 
          auditLogs={auditLogs}
          correctionRequests={correctionRequests}
          rfidDevices={rfidDevices}
          activeSession={activeSession}
          onAddAuditLog={handleAddAuditLog}
          onUpdateCorrectionRequest={handleUpdateCorrectionRequest}
          onLogout={handleLogout}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />
      )}

      {/* Interactive RFID Gate Simulator Drawer/Modal */}
      <RfidSimulatorDrawer 
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSimulateEvent={handleSimulateRfidEvent}
      />

    </div>
  );
}
