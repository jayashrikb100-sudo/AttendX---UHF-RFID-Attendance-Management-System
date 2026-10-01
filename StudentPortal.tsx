import React, { useState } from 'react';
import { 
  StudentProfile, 
  AttendanceRecord, 
  CorrectionRequest, 
  DayAttendanceCalendar,
  AttendanceStatus,
  CorrectionIssueType 
} from '../../types';
import { Logo } from '../common/Logo';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Filter, 
  Download, 
  PlusCircle, 
  Radio, 
  LogOut, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles, 
  Search,
  ExternalLink,
  Printer,
  X
} from 'lucide-react';

interface StudentPortalProps {
  student: StudentProfile;
  attendanceHistory: AttendanceRecord[];
  calendarDays: DayAttendanceCalendar[];
  correctionRequests: CorrectionRequest[];
  onSubmitCorrection: (newRequest: Omit<CorrectionRequest, 'id' | 'status' | 'submittedAt'>) => void;
  onLogout: () => void;
  onOpenSimulator: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  attendanceHistory,
  calendarDays,
  correctionRequests,
  onSubmitCorrection,
  onLogout,
  onOpenSimulator,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'requests' | 'card'>('dashboard');

  // Filter states for history tab
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>('');

  // Correction Request Modal state
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [corrDate, setCorrDate] = useState('2026-10-01');
  const [corrSubject, setCorrSubject] = useState('Computer Networks');
  const [corrIssueType, setCorrIssueType] = useState<CorrectionIssueType>('RFID not detected');
  const [corrDescription, setCorrDescription] = useState('');
  const [corrSuccessToast, setCorrSuccessToast] = useState(false);

  // Export report modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Available subjects for filters and dropdowns
  const subjectList = Array.from(new Set(attendanceHistory.map(a => a.subject)));

  // Filtered attendance history
  const filteredHistory = attendanceHistory.filter(record => {
    if (filterSubject !== 'all' && record.subject !== filterSubject) return false;
    if (filterStatus !== 'all' && record.status !== filterStatus) return false;
    if (filterMonth !== 'all') {
      const recordMonth = record.date.substring(5, 7);
      if (recordMonth !== filterMonth) return false;
    }
    if (searchDate && !record.date.includes(searchDate)) return false;
    return true;
  });

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!corrDescription.trim()) return;

    // Find the record for this date & subject to capture rfid log context
    const matchingRecord = attendanceHistory.find(
      r => r.date === corrDate && r.subject === corrSubject
    );

    onSubmitCorrection({
      studentName: student.name,
      studentId: student.id,
      date: corrDate,
      subject: corrSubject,
      issueType: corrIssueType,
      description: corrDescription,
      rfidLog: matchingRecord 
        ? `Portal Scan log: ${matchingRecord.classroom} - Entry: ${matchingRecord.entryTime}, Exit: ${matchingRecord.exitTime}` 
        : 'Portal Scan log: No UHF beacon tag captured during scheduled lecture block',
      currentAttendance: matchingRecord ? matchingRecord.status : 'Absent'
    });

    setIsCorrectionModalOpen(false);
    setCorrDescription('');
    setCorrSuccessToast(true);
    setTimeout(() => setCorrSuccessToast(false), 5000);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Late':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Absent':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Holiday':
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getCalendarDotColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present': return 'bg-emerald-500';
      case 'Late': return 'bg-amber-500';
      case 'Absent': return 'bg-rose-500';
      case 'Holiday': return 'bg-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E3]/25 flex flex-col">
      {/* Student App Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#06243D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-1 border-l border-[#06243D]/10 pl-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#06243D] text-white'
                    : 'text-[#06243D]/70 hover:text-[#06243D] hover:bg-[#FFF4E3]/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#06243D] text-white'
                    : 'text-[#06243D]/70 hover:text-[#06243D] hover:bg-[#FFF4E3]/50'
                }`}
              >
                Attendance History
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'bg-[#06243D] text-white'
                    : 'text-[#06243D]/70 hover:text-[#06243D] hover:bg-[#FFF4E3]/50'
                }`}
              >
                <span>Correction Requests</span>
                {correctionRequests.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#F5A044] text-[#06243D] text-[10px] font-bold flex items-center justify-center">
                    {correctionRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-[#06243D] text-white'
                    : 'text-[#06243D]/70 hover:text-[#06243D] hover:bg-[#FFF4E3]/50'
                }`}
              >
                Digital RFID ID
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#06243D] bg-[#FFF4E3] border border-[#F5A044]/40 rounded-lg hover:bg-[#F5A044]/20 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-[#F5A044] animate-pulse" />
              <span className="hidden sm:inline">Simulate RFID Gate</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#17202A]/80 hover:text-[#06243D] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Sign out of student account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab row */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-50 border-t border-[#06243D]/5 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded whitespace-nowrap font-medium ${activeTab === 'dashboard' ? 'bg-[#06243D] text-white' : 'text-[#06243D]'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded whitespace-nowrap font-medium ${activeTab === 'history' ? 'bg-[#06243D] text-white' : 'text-[#06243D]'}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1 rounded whitespace-nowrap font-medium ${activeTab === 'requests' ? 'bg-[#06243D] text-white' : 'text-[#06243D]'}`}
          >
            Correction Requests ({correctionRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1 rounded whitespace-nowrap font-medium ${activeTab === 'card' ? 'bg-[#06243D] text-white' : 'text-[#06243D]'}`}
          >
            My RFID Card
          </button>
        </div>
      </header>

      {/* Success Notification Banner */}
      {corrSuccessToast && (
        <div className="bg-emerald-600 text-white text-xs py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-xs transition-all">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Attendance Issue reported successfully! Sent to academic administration for review.</span>
          <button onClick={() => setCorrSuccessToast(false)} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">

        {/* ================================================== */}
        {/* STUDENT DASHBOARD HEADER AS SPECIFIED              */}
        {/* ================================================== */}
        <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06243D]">
                  Good Morning, {student.name.split(' ')[0]}
                </h1>
                <span className="hidden sm:inline-block text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  RFID Tag Active
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[#17202A]/80 font-medium">
                <div>
                  <span className="text-[#17202A]/50">Student ID: </span>
                  <span className="font-mono font-semibold text-[#06243D]">{student.registerNumber}</span>
                </div>
                <span className="hidden sm:inline text-slate-300">·</span>
                <div>
                  <span className="text-[#17202A]/50">Department: </span>
                  <span className="font-semibold text-[#06243D]">{student.department}</span>
                </div>
                <span className="hidden sm:inline text-slate-300">·</span>
                <div>
                  <span className="text-[#17202A]/50">Semester: </span>
                  <span>{student.semester}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3 self-start lg:self-center">
              <button
                onClick={() => setIsCorrectionModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#06243D] bg-[#FFF4E3] border border-[#F5A044]/50 rounded-lg hover:bg-[#F5A044]/20 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#F5A044]" />
                <span>Report Attendance Issue</span>
              </button>
            </div>
          </div>

          {/* Today's Attendance Banner (Prompt specific values) */}
          <div className="mt-5 pt-5 border-t border-[#06243D]/8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-[#FFF4E3]/40 rounded-xl border border-[#06243D]/8">
              <span className="text-[11px] uppercase tracking-wider text-[#17202A]/60 font-semibold block">
                Today&apos;s Attendance
              </span>
              <span className="text-base font-bold text-emerald-700 mt-1 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {student.todayStatus.toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#06243D]/8">
              <span className="text-[11px] uppercase tracking-wider text-[#17202A]/60 font-semibold block">
                Entry Time
              </span>
              <span className="text-base font-mono font-bold text-[#06243D] mt-1 block">
                {student.todayEntry}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#06243D]/8">
              <span className="text-[11px] uppercase tracking-wider text-[#17202A]/60 font-semibold block">
                Exit Time
              </span>
              <span className="text-base font-mono font-bold text-[#06243D] mt-1 block">
                {student.todayExit}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#06243D]/8">
              <span className="text-[11px] uppercase tracking-wider text-[#17202A]/60 font-semibold block">
                Duration
              </span>
              <span className="text-base font-mono font-bold text-[#06243D] mt-1 block">
                {student.todayDuration}
              </span>
            </div>

            <div className="p-3 bg-[#06243D] text-white rounded-xl border border-[#06243D] col-span-2 sm:col-span-4 lg:col-span-2 flex items-center justify-between px-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#FFF4E3]/80 font-semibold block">
                  Monthly Attendance
                </span>
                <span className="text-2xl font-mono font-bold text-[#FFF4E3] tabular-nums">
                  {student.monthlyAttendance}%
                </span>
              </div>
              <div className="text-right text-[11px] text-[#FFF4E3]/70 font-mono">
                Above 75% Cutoff
                <div className="w-24 h-1.5 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-[#F5A044] rounded-full" 
                    style={{ width: `${student.monthlyAttendance}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* TAB 1: DASHBOARD VIEW                              */}
        {/* ================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards Grid: Total Classes, Present, Absent, Late */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-[#06243D]/10 p-4 shadow-xs">
                <span className="text-xs text-[#17202A]/60 font-medium">Total Classes</span>
                <div className="text-2xl font-bold font-mono text-[#06243D] mt-1 tabular-nums">
                  {student.totalClasses}
                </div>
                <span className="text-[11px] text-[#17202A]/50 mt-1 block">Term to date</span>
              </div>

              <div className="bg-white rounded-xl border border-emerald-200/80 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-800 font-medium">Present</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                  {student.presentCount}
                </div>
                <span className="text-[11px] text-emerald-800/60 mt-1 block">
                  {((student.presentCount / student.totalClasses) * 100).toFixed(1)}% of total
                </span>
              </div>

              <div className="bg-white rounded-xl border border-rose-200/80 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-rose-800 font-medium">Absent</span>
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-rose-700 mt-1 tabular-nums">
                  {student.absentCount}
                </div>
                <span className="text-[11px] text-rose-800/60 mt-1 block">
                  {((student.absentCount / student.totalClasses) * 100).toFixed(1)}% unexcused
                </span>
              </div>

              <div className="bg-white rounded-xl border border-amber-200/80 p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-800 font-medium">Late</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
                  {student.lateCount}
                </div>
                <span className="text-[11px] text-amber-800/60 mt-1 block">
                  Arrived past gate delay
                </span>
              </div>
            </div>

            {/* Attendance Calendar & Recent Activity Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ATTENDANCE CALENDAR AS SPECIFIED */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#06243D]/10 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#06243D]" />
                    <h2 className="text-base font-bold text-[#06243D]">
                      Attendance Calendar — September / October 2026
                    </h2>
                  </div>

                  {/* Indicator legend */}
                  <div className="hidden sm:flex items-center gap-3 text-xs text-[#17202A]/70">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Late</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                      <span>Holiday</span>
                    </div>
                  </div>
                </div>

                {/* Day of week headers */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold text-[#06243D]/70 py-2 border-b border-[#06243D]/8">
                  <span>MON</span>
                  <span>TUE</span>
                  <span>WED</span>
                  <span>THU</span>
                  <span>FRI</span>
                </div>

                {/* Calendar grid cells */}
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {calendarDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center transition-all hover:border-[#06243D]/30 ${
                        day.date === '2026-10-01' 
                          ? 'border-[#F5A044] bg-[#FFF4E3]/40 ring-1 ring-[#F5A044]' 
                          : 'border-[#06243D]/8 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#06243D] tabular-nums">
                          {day.dayNumber}
                        </span>
                        <span 
                          className={`w-2.5 h-2.5 rounded-full ${getCalendarDotColor(day.status)}`}
                          title={`${day.date}: ${day.status}`}
                        />
                      </div>
                      <div className="mt-2 text-[10px] font-medium text-[#17202A]/70 truncate">
                        {day.status}
                      </div>
                      <div className="text-[9px] text-[#17202A]/50 truncate mt-0.5">
                        {day.subjectSummary}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sm:hidden flex items-center justify-between text-[11px] text-[#17202A]/70 mt-4 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Late</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Absent</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Holiday</span>
                </div>
              </div>

              {/* Today's Next Session & Quick Correction Status */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#06243D]">
                      Next Automated Portal
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Reader Online
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#06243D]">
                    Cyber Security (CS304)
                  </h3>
                  <p className="text-xs text-[#17202A]/70 mt-0.5">
                    Room 305 · 11:15 AM - 01:00 PM
                  </p>
                  <div className="mt-3 p-3 bg-[#FFF4E3]/50 rounded-xl border border-[#06243D]/8 text-xs text-[#06243D]">
                    <div className="flex items-center gap-2 font-semibold">
                      <Radio className="w-3.5 h-3.5 text-[#F5A044]" />
                      <span>UHF Antenna Portal Active</span>
                    </div>
                    <p className="text-[11px] text-[#17202A]/70 mt-1">
                      Walk freely through the Room 305 entryway. Your RFID badge will be recorded automatically within 4 meters.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#06243D]">
                      My Correction Requests
                    </span>
                    <button 
                      onClick={() => setActiveTab('requests')}
                      className="text-xs text-[#F5A044] font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {correctionRequests.length === 0 ? (
                    <p className="text-xs text-[#17202A]/50 py-3">No pending issues reported.</p>
                  ) : (
                    <div className="space-y-2 mt-3">
                      {correctionRequests.slice(0, 2).map((req) => (
                        <div key={req.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#06243D]">{req.subject}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              req.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                              req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#17202A]/60 mt-1 truncate">
                            {req.issueType} · {req.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setIsCorrectionModalOpen(true)}
                    className="w-full mt-3 py-2 px-3 text-xs font-semibold text-[#06243D] bg-white border border-[#06243D]/20 hover:bg-[#FFF4E3]/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#F5A044]" />
                    <span>Report Attendance Issue</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 2: DETAILED ATTENDANCE HISTORY                 */}
        {/* ================================================== */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#06243D]">
                  Student Attendance History
                </h2>
                <p className="text-xs text-[#17202A]/70 mt-0.5">
                  Verified RFID entry/exit timestamps for academic credit
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#06243D] bg-white border border-[#06243D]/20 hover:bg-[#FFF4E3]/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>

                <button
                  onClick={() => setIsCorrectionModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#06243D] bg-[#FFF4E3] border border-[#F5A044]/40 hover:bg-[#F5A044]/20 rounded-lg transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F5A044]" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-[#06243D] mb-1">
                  Subject
                </label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                >
                  <option value="all">All Subjects</option>
                  {subjectList.map((sub, i) => (
                    <option key={i} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#06243D] mb-1">
                  Attendance Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#06243D] mb-1">
                  Month
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                >
                  <option value="all">All Months</option>
                  <option value="10">October 2026</option>
                  <option value="09">September 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#06243D] mb-1">
                  Search Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    placeholder="YYYY-MM-DD or DD"
                    className="w-full text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                  />
                  {searchDate && (
                    <button
                      onClick={() => setSearchDate('')}
                      className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table as strictly requested in prompt: Date | Subject | Classroom | Entry Time | Exit Time | Duration | Status */}
            <div className="overflow-x-auto rounded-xl border border-[#06243D]/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#06243D]/5 text-[#06243D] border-b border-[#06243D]/10 font-semibold">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Classroom</th>
                    <th className="py-3 px-4 font-mono">Entry Time</th>
                    <th className="py-3 px-4 font-mono">Exit Time</th>
                    <th className="py-3 px-4 font-mono">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No attendance records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-[#06243D]">
                          {rec.date}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#17202A]">
                          {rec.subject}
                          {rec.notes && (
                            <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                              {rec.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[#17202A]/80 font-medium">
                          {rec.classroom}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-[#17202A]">
                          {rec.entryTime}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-[#17202A]">
                          {rec.exitTime}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-[#17202A]">
                          {rec.duration}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusColor(rec.status)}`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-mono ${rec.source === 'Manual Override' ? 'text-amber-700 font-semibold' : 'text-slate-500'}`}>
                            {rec.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-[#17202A]/60 pt-2">
              <span>Showing {filteredHistory.length} of {attendanceHistory.length} recorded lecture sessions</span>
              <span className="font-mono">Automated UHF Portal Gen2</span>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 3: CORRECTION REQUESTS MANAGEMENT FOR STUDENT */}
        {/* ================================================== */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#06243D]">
                  Attendance Correction Requests
                </h2>
                <p className="text-xs text-[#17202A]/70 mt-0.5">
                  Students cannot directly edit attendance. Submit requests here for academic administration review.
                </p>
              </div>

              <button
                onClick={() => setIsCorrectionModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#06243D] bg-[#FFF4E3] border border-[#F5A044]/60 hover:bg-[#F5A044]/20 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#F5A044]" />
                <span>Report Attendance Issue</span>
              </button>
            </div>

            {/* Request list */}
            <div className="space-y-3">
              {correctionRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  You have not submitted any attendance correction requests.
                </div>
              ) : (
                correctionRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#06243D]/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#06243D]">{req.id}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-semibold text-xs text-[#17202A]">{req.subject}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 font-mono">{req.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Status:</span>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          req.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          req.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[11px]">Reported Issue Type</span>
                        <p className="font-semibold text-[#06243D] mt-0.5">{req.issueType}</p>
                        
                        <span className="text-slate-400 font-semibold block text-[11px] mt-2">Student Description</span>
                        <p className="text-slate-700 mt-0.5">{req.description}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                        <span className="text-slate-500 font-semibold block text-[11px]">System RFID Portal Log</span>
                        <p className="font-mono text-[11px] text-slate-600 mt-0.5 break-all">
                          {req.rfidLog}
                        </p>

                        {req.adminReason && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200">
                            <span className="text-emerald-800 font-semibold block text-[11px]">
                              Admin Resolution Note ({req.resolvedBy || 'Administrator'})
                            </span>
                            <p className="text-emerald-900 mt-0.5 text-xs font-medium">
                              {req.adminReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* TAB 4: DIGITAL RFID STUDENT BADGE VIEW             */}
        {/* ================================================== */}
        {activeTab === 'card' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {/* Student RFID Badge Simulation Card */}
              <div className="relative aspect-[1.586/1] w-full max-w-md mx-auto bg-gradient-to-br from-[#06243D] to-[#0a3558] text-white rounded-2xl p-5 shadow-lg border border-white/10 overflow-hidden flex flex-col justify-between">
                
                {/* Background passive RFID wireframe antenna loop illustration */}
                <svg className="absolute -right-10 -bottom-10 w-56 h-56 text-[#F5A044]/15 pointer-events-none" viewBox="0 0 100 100" fill="none">
                  <rect x="5" y="5" width="90" height="90" rx="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
                  <rect x="15" y="15" width="70" height="70" rx="8" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="25" y="25" width="50" height="50" rx="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M40 50h20M50 40v20" stroke="currentColor" strokeWidth="2"/>
                </svg>

                {/* Top card bar */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#F5A044] text-[#06243D] flex items-center justify-center font-bold text-xs">
                      X
                    </div>
                    <span className="font-bold text-xs tracking-tight">ATTENDX SMART ID</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#F5A044] border border-[#F5A044]/30 px-1.5 py-0.5 rounded">
                    PASSIVE UHF
                  </span>
                </div>

                {/* Middle chip representation */}
                <div className="z-10 my-2 flex items-center justify-between">
                  <div className="w-10 h-8 rounded bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-500/40 relative overflow-hidden flex items-center justify-center">
                    <div className="w-full h-[1px] bg-amber-700/30"></div>
                    <div className="absolute w-[1px] h-full bg-amber-700/30"></div>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">
                    ISO/IEC 18000-6C
                  </span>
                </div>

                {/* Bottom card credentials */}
                <div className="z-10">
                  <div className="text-sm font-bold tracking-wide text-[#FFF4E3]">
                    {student.name}
                  </div>
                  <div className="text-[11px] font-mono text-white/80">
                    {student.registerNumber}
                  </div>
                  <div className="text-[10px] text-white/60 truncate mt-0.5">
                    {student.department}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/50">
                    <span>{student.rfidTagId}</span>
                    <span>865-868 MHz</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#06243D]/10 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#06243D]">
                How Your Passive RFID Card Operates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#17202A]/80">
                <div className="p-3 bg-[#FFF4E3]/40 rounded-xl border border-[#06243D]/8">
                  <h3 className="font-bold text-[#06243D] mb-1">Zero Battery Required</h3>
                  <p>
                    Your card contains an embedded passive UHF dipole antenna. It harvests microwave RF energy directly from the classroom doorway readers as you walk through.
                  </p>
                </div>

                <div className="p-3 bg-[#FFF4E3]/40 rounded-xl border border-[#06243D]/8">
                  <h3 className="font-bold text-[#06243D] mb-1">Hands-Free Detection</h3>
                  <p>
                    No need to tap, wait in line, scan QR codes, or stand in front of facial cameras. Keep your badge on your lanyard or in your outer bag pocket.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-[#06243D] mb-1">Multi-Tag Collision Mitigation</h3>
                  <p>
                    Even if 30 students walk through the room door simultaneously, the EPC Gen2 Q-algorithm arbitrates tag responses in under 25 milliseconds.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-[#06243D] mb-1">Privacy Guarantee</h3>
                  <p>
                    The RFID chip only transmits an encrypted anonymous hex EPC code. No biometric or facial recognition templates are ever collected or stored.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenSimulator}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#06243D] text-white rounded-lg text-xs font-semibold hover:bg-[#06243D]/90 transition-colors cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-[#F5A044]" />
                  <span>Launch Live Portal Signal Simulator</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================================================== */}
      {/* STUDENT ATTENDANCE CORRECTION REQUEST MODAL        */}
      {/* ================================================== */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#06243D]/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#06243D]/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F5A044]" />
                <h3 className="text-base font-bold text-[#06243D]">
                  Attendance Issue
                </h3>
              </div>
              <button
                onClick={() => setIsCorrectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#17202A]/70">
              Submit an attendance issue for faculty and registrar verification. Note that students cannot modify attendance directly.
            </p>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#06243D] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={corrDate}
                  onChange={(e) => setCorrDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#06243D] mb-1">
                  Subject
                </label>
                <select
                  value={corrSubject}
                  onChange={(e) => setCorrSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                >
                  {subjectList.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#06243D] mb-1.5">
                  Issue Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['RFID not detected', 'Incorrect entry time', 'Incorrect exit time', 'Other'] as CorrectionIssueType[]).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setCorrIssueType(type)}
                      className={`p-2 rounded-lg text-left text-xs font-medium border transition-colors cursor-pointer ${
                        corrIssueType === type
                          ? 'border-[#06243D] bg-[#06243D] text-white shadow-xs'
                          : 'border-slate-200 text-[#17202A]/80 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#06243D] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={corrDescription}
                  onChange={(e) => setCorrDescription(e.target.value)}
                  placeholder="Explain the circumstances (e.g. Which door you walked through, row seated, TA contact)..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06243D] text-white rounded-lg text-xs font-semibold hover:bg-[#06243D]/90 transition-colors cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* EXPORT REPORT MODAL                                */}
      {/* ================================================== */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#06243D]/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#06243D]/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#06243D]" />
                <h3 className="text-base font-bold text-[#06243D]">
                  Student Attendance Report
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-[#06243D]">{student.name} ({student.registerNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span>{student.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cumulative Attendance:</span>
                <span className="font-mono font-bold text-emerald-700">{student.monthlyAttendance}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Lectures Tracked:</span>
                <span className="font-mono">{student.totalClasses}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setIsExportModalOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-[#06243D] text-white rounded-lg text-xs font-semibold hover:bg-[#06243D]/90 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#F5A044]" />
                <span>Print Official PDF Transcript</span>
              </button>

              <button
                onClick={() => {
                  // CSV download
                  const csvHeaders = "Date,Subject,Classroom,Entry Time,Exit Time,Duration,Status,Source\n";
                  const csvRows = attendanceHistory.map(r => 
                    `"${r.date}","${r.subject}","${r.classroom}","${r.entryTime}","${r.exitTime}","${r.duration}","${r.status}","${r.source}"`
                  ).join("\n");
                  const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `attendance_report_${student.registerNumber}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  setIsExportModalOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-white border border-[#06243D]/20 text-[#06243D] rounded-lg text-xs font-semibold hover:bg-[#FFF4E3]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#06243D]" />
                <span>Export CSV Dataset</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
