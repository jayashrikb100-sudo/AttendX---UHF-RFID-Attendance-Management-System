import React, { useState } from 'react';
import { 
  StudentProfile, 
  AttendanceRecord, 
  CorrectionRequest, 
  AuditLogRecord, 
  RFIDDevice, 
  ClassroomSession,
  AttendanceStatus 
} from '../../types';
import { Logo } from '../common/Logo';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Building2, 
  Radio, 
  FileEdit, 
  CheckSquare, 
  BarChart3, 
  History, 
  Settings as SettingsIcon, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Download, 
  ShieldCheck, 
  ArrowUpRight, 
  ChevronRight, 
  Info, 
  Filter,
  RefreshCw,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ENROLLED_STUDENTS_LIST, ALL_CLASSROOMS } from '../../data/mockData';

interface AdminPortalProps {
  auditLogs: AuditLogRecord[];
  correctionRequests: CorrectionRequest[];
  rfidDevices: RFIDDevice[];
  activeSession: ClassroomSession;
  onAddAuditLog: (log: Omit<AuditLogRecord, 'id' | 'timestamp'>) => void;
  onUpdateCorrectionRequest: (requestId: string, status: 'Resolved' | 'Rejected', adminReason: string) => void;
  onLogout: () => void;
  onOpenSimulator: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  auditLogs,
  correctionRequests,
  rfidDevices,
  activeSession,
  onAddAuditLog,
  onUpdateCorrectionRequest,
  onLogout,
  onOpenSimulator,
}) => {
  type AdminTab = 
    | 'dashboard' 
    | 'students' 
    | 'attendance' 
    | 'classrooms' 
    | 'devices' 
    | 'manual' 
    | 'corrections' 
    | 'reports' 
    | 'audit' 
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // MANUAL ATTENDANCE FORM STATE (EXCEPTIONAL)
  // ==========================================
  const [manualStudentId, setManualStudentId] = useState('SEC24CSE1023');
  const [manualStudentName, setManualStudentName] = useState('Arun Kumar');
  const [manualDate, setManualDate] = useState('2026-10-01');
  const [manualSubject, setManualSubject] = useState('Computer Networks');
  const [manualClassroom, setManualClassroom] = useState('Room 204');
  const [manualOriginalStatus, setManualOriginalStatus] = useState<AttendanceStatus>('Absent');
  const [manualNewStatus, setManualNewStatus] = useState<AttendanceStatus>('Present');
  const [manualReason, setManualReason] = useState('');
  const [manualFormError, setManualFormError] = useState<string | null>(null);
  const [showManualWarningModal, setShowManualWarningModal] = useState(false);
  const [manualSuccessBanner, setManualSuccessBanner] = useState<string | null>(null);

  // ==========================================
  // CORRECTION RESOLUTION MODAL STATE
  // ==========================================
  const [selectedCorrection, setSelectedCorrection] = useState<CorrectionRequest | null>(null);
  const [resolutionAction, setResolutionAction] = useState<'Resolved' | 'Rejected'>('Resolved');
  const [adminResolutionNote, setAdminResolutionNote] = useState('');
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  // Search & Filters for Audit Logs & Attendance
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');

  // Handle student select in manual attendance
  const handleStudentSelect = (id: string) => {
    setManualStudentId(id);
    const found = ENROLLED_STUDENTS_LIST.find(s => s.id === id);
    if (found) {
      setManualStudentName(found.name);
    }
  };

  // Pre-fill reason helpers as specified in prompt
  const prefillReasons = [
    'RFID reader was offline during the first 20 minutes of the class.',
    'RFID card damaged.',
    'Reader malfunction.',
    'Student was present but card was not detected.',
    'New student ID card was not registered.',
    'System synchronization failure.'
  ];

  // Initiate manual submission (checks mandatory reason and opens warning)
  const handleInitiateManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualFormError(null);
    if (!manualReason.trim()) {
      setManualFormError('Reason for manual attendance is mandatory. You cannot submit an unverified attendance change.');
      return;
    }
    setShowManualWarningModal(true);
  };

  // Confirm manual submission
  const handleConfirmManualAttendance = () => {
    onAddAuditLog({
      adminId: 'admin_204',
      adminName: 'Prof. K. Venkatesh',
      studentId: manualStudentId,
      studentName: manualStudentName,
      date: manualDate,
      subject: manualSubject,
      classroom: manualClassroom,
      originalStatus: manualOriginalStatus,
      newStatus: manualNewStatus,
      reason: manualReason,
      action: 'Manual Override'
    });

    setShowManualWarningModal(false);
    setManualSuccessBanner(`Manual attendance recorded and permanently logged in audit register for ${manualStudentName} (${manualStudentId}).`);
    setManualReason('');
    setTimeout(() => setManualSuccessBanner(null), 6000);
  };

  // Handle Correction Approval / Rejection
  const handleConfirmCorrectionResolution = () => {
    if (!selectedCorrection) return;
    if (!adminResolutionNote.trim()) {
      setResolutionError('Admin Reason / Resolution Note is mandatory to close this request.');
      return;
    }

    onUpdateCorrectionRequest(selectedCorrection.id, resolutionAction, adminResolutionNote);

    // Also auto-log to audit log if approved!
    if (resolutionAction === 'Resolved') {
      onAddAuditLog({
        adminId: 'admin_204',
        adminName: 'Prof. K. Venkatesh',
        studentId: selectedCorrection.studentId,
        studentName: selectedCorrection.studentName,
        date: selectedCorrection.date,
        subject: selectedCorrection.subject,
        classroom: 'Room 204',
        originalStatus: selectedCorrection.currentAttendance,
        newStatus: 'Present',
        reason: `Correction #${selectedCorrection.id} Approved: ${adminResolutionNote}`,
        action: 'Correction Approval'
      });
    }

    setSelectedCorrection(null);
    setAdminResolutionNote('');
    setResolutionError(null);
  };

  // Counts for correction requests
  const pendingRequestsCount = 12; // Base institutional metric
  const underReviewCount = 4;
  const resolvedCount = 26;
  const rejectedCount = 3;

  return (
    <div className="min-h-screen bg-[#FFF4E3]/20 flex">
      {/* ================================================== */}
      {/* SIDEBAR NAVIGATION AS REQUIRED BY PROMPT           */}
      {/* ================================================== */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#06243D] text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 flex flex-col h-full">
          {/* Logo brand */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Logo variant="light" size="md" />
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Admin badge */}
          <div className="my-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5A044] text-[#06243D] font-bold flex items-center justify-center text-xs">
              KV
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Prof. K. Venkatesh</div>
              <div className="text-[10px] text-[#FFF4E3]/70 font-mono">admin_204 · Registrar</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 text-xs">
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('students'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'students' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Students</span>
            </button>

            <button
              onClick={() => { setActiveTab('attendance'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'attendance' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => { setActiveTab('classrooms'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'classrooms' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>Classrooms</span>
                <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded">24</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('devices'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'devices' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>RFID Devices</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">22/24</span>
              </div>
            </button>

            {/* Manual Attendance highlighted as exceptional */}
            <button
              onClick={() => { setActiveTab('manual'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'manual' 
                  ? 'bg-[#F5A044] text-[#06243D] font-bold border-[#F5A044]' 
                  : 'text-amber-300/90 hover:bg-amber-400/10 border-amber-400/20'
              }`}
            >
              <FileEdit className="w-4 h-4 shrink-0 text-amber-300" />
              <div className="flex-1 flex items-center justify-between">
                <span>Manual Attendance</span>
                <span className="text-[9px] uppercase tracking-wider bg-amber-500/30 text-amber-200 px-1 rounded">
                  Exception
                </span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('corrections'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'corrections' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>Correction Requests</span>
                <span className="text-[10px] font-bold bg-[#F5A044] text-[#06243D] px-1.5 py-0.5 rounded-full">
                  12
                </span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'reports' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => { setActiveTab('audit'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'audit' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>Audit Logs</span>
                <span className="text-[10px] font-mono text-white/50">{auditLogs.length}</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#F5A044] text-[#06243D] font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Bottom hardware telemetry and sign out */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={onOpenSimulator}
              className="w-full py-2 px-3 bg-[#F5A044]/15 border border-[#F5A044]/40 hover:bg-[#F5A044]/25 text-[#FFF4E3] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-[#F5A044] animate-pulse" />
              <span>Simulate RFID Tag Walk</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full py-2 px-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Console</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#06243D]/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#06243D] hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              ☰
            </button>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-bold text-[#06243D] capitalize">
                {activeTab === 'manual' ? 'Manual Attendance' : activeTab === 'corrections' ? 'Correction Requests' : activeTab}
              </h1>
              <span className="hidden sm:inline text-xs text-slate-400">/</span>
              <span className="hidden sm:inline text-xs text-[#17202A]/60 font-mono">
                SRM Institute · Central Campus
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Campus Telemetry Badges */}
            <div className="hidden md:flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>RFID Readers: 22 / 24 Online</span>
              </div>
              <div className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Active Classes: 24
              </div>
            </div>

            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#06243D] bg-[#FFF4E3] border border-[#F5A044]/50 rounded-lg hover:bg-[#F5A044]/20 transition-colors cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-[#F5A044]" />
              <span className="hidden sm:inline">Simulate Portal</span>
            </button>
          </div>
        </header>

        {/* Success Banner */}
        {manualSuccessBanner && (
          <div className="bg-emerald-600 text-white text-xs py-2.5 px-6 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{manualSuccessBanner}</span>
            </div>
            <button onClick={() => setManualSuccessBanner(null)} className="hover:opacity-75">✕</button>
          </div>
        )}

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* ================================================== */}
          {/* VIEW: ADMIN BENTO DASHBOARD                        */}
          {/* ================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Header Overview Banner as specified in prompt */}
              <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#06243D]/8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#06243D]">
                      Admin Dashboard
                    </h2>
                    <p className="text-xs text-[#17202A]/70 mt-1">
                      Real-time campus-wide UHF RFID automated attendance telemetry
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#06243D]/70 bg-[#FFF4E3]/50 px-3 py-1.5 rounded-lg border border-[#06243D]/10">
                    <Clock className="w-3.5 h-3.5 text-[#F5A044]" />
                    <span>01 Oct 2026 · 09:42:18 AM</span>
                  </div>
                </div>

                {/* Today's Overview requested in prompt */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-semibold uppercase text-slate-500 block">Total Students</span>
                    <span className="text-2xl font-bold font-mono text-[#06243D] mt-1 block tabular-nums">1,240</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Campus enrollment</span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[11px] font-semibold uppercase text-emerald-800 block">Present</span>
                    <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">1,087</span>
                    <span className="text-[10px] text-emerald-800/70 mt-1 block">RFID detected entry</span>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <span className="text-[11px] font-semibold uppercase text-rose-800 block">Absent</span>
                    <span className="text-2xl font-bold font-mono text-rose-700 mt-1 block tabular-nums">103</span>
                    <span className="text-[10px] text-rose-800/70 mt-1 block">No tag capture</span>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-[11px] font-semibold uppercase text-amber-800 block">Late</span>
                    <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block tabular-nums">50</span>
                    <span className="text-[10px] text-amber-800/70 mt-1 block">&gt;10 min grace period</span>
                  </div>

                  <div className="p-4 bg-[#06243D] text-white rounded-xl col-span-2 flex items-center justify-between px-5">
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-[#FFF4E3]/80 block">Attendance Rate</span>
                      <span className="text-3xl font-bold font-mono text-[#FFF4E3] mt-0.5 block tabular-nums">87.7%</span>
                    </div>
                    <div className="text-right text-xs font-mono text-[#FFF4E3]/80">
                      <div>Active Classrooms: 24</div>
                      <div className="text-[#F5A044] mt-1 font-semibold">RFID Online: 22 / 24</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid: Automatic vs Manual Comparison & Real-Time Classroom Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AUTOMATIC VS MANUAL ATTENDANCE COMPARISON CARD (Prompt requirement) */}
                <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#06243D]/8">
                      <ShieldCheck className="w-5 h-5 text-[#F5A044]" />
                      <h3 className="text-sm font-bold text-[#06243D]">
                        Automatic vs. Manual Attendance
                      </h3>
                    </div>

                    <div className="space-y-4 mt-4 text-xs">
                      {/* Automatic RFID Attendance Block */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">
                            AUTOMATIC ATTENDANCE
                          </span>
                          <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                            Primary Flow
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-emerald-900/90 pt-1">
                          <div><span className="text-emerald-700/80">Source:</span> UHF RFID</div>
                          <div><span className="text-emerald-700/80">Trigger:</span> Walk-in/out</div>
                          <div><span className="text-emerald-700/80">Reason:</span> Automatic</div>
                          <div><span className="text-emerald-700/80">Mod:</span> System Log</div>
                        </div>
                      </div>

                      {/* Manual Attendance Block (Exception) */}
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                            MANUAL ATTENDANCE
                          </span>
                          <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-semibold">
                            Exception Only
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-amber-900/90 pt-1">
                          <div><span className="text-amber-700/80">Source:</span> Admin</div>
                          <div><span className="text-amber-700/80">Trigger:</span> Outage/Issue</div>
                          <div><span className="text-amber-700/80">Reason:</span> Mandatory</div>
                          <div><span className="text-amber-700/80">Mod:</span> Audit Trail</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Traceable governance</span>
                    <button
                      onClick={() => setActiveTab('manual')}
                      className="text-xs font-semibold text-[#06243D] hover:text-[#F5A044] transition-colors cursor-pointer"
                    >
                      Open Manual Tool →
                    </button>
                  </div>
                </div>

                {/* REAL-TIME CLASSROOM MONITORING (Room 204 prompt requirement) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#06243D]/8">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h3 className="text-base font-bold text-[#06243D]">
                          ROOM 204 — Computer Networks
                        </h3>
                      </div>
                      <p className="text-xs text-[#17202A]/70 mt-0.5">
                        Instructor: Prof. K. Venkatesh · Session Active
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        RFID Reader: ONLINE
                      </span>
                      <span className="text-slate-500">
                        09:00 AM - 10:45 AM
                      </span>
                    </div>
                  </div>

                  {/* Room status stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Students Inside</span>
                      <span className="text-xl font-bold font-mono text-[#06243D] tabular-nums mt-0.5 block">
                        42
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Expected Enrolled</span>
                      <span className="text-xl font-bold font-mono text-[#06243D] tabular-nums mt-0.5 block">
                        47
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Class Entry Window</span>
                      <span className="text-sm font-bold font-mono text-[#06243D] mt-1 block">
                        09:00 AM
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Current Time</span>
                      <span className="text-sm font-bold font-mono text-[#06243D] mt-1 block">
                        09:42 AM
                      </span>
                    </div>
                  </div>

                  {/* Live Activity Timeline as requested in prompt */}
                  <div>
                    <span className="text-xs font-semibold text-[#06243D] block mb-2">
                      Live Gateway Event Timeline:
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {activeSession.liveActivity.map((act) => (
                        <div key={act.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-500 text-[11px]">{act.timestamp}</span>
                            <span className="text-slate-300">·</span>
                            <span className={`font-semibold ${act.event === 'Student entered' ? 'text-emerald-700' : 'text-slate-700'}`}>
                              {act.studentName} ({act.studentId})
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-slate-600">{act.event}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                            {act.rfidSignal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Access Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab('corrections')}
                  className="bg-white p-5 rounded-2xl border border-[#06243D]/10 hover:border-[#F5A044] transition-colors cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#06243D]">Pending Correction Requests</span>
                    <span className="text-xs font-mono font-bold bg-[#F5A044] text-[#06243D] px-2 py-0.5 rounded-full">
                      12
                    </span>
                  </div>
                  <p className="text-xs text-[#17202A]/70 mt-2">
                    12 students reported RFID antenna detection or schedule discrepancies.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-[#06243D] flex items-center gap-1">
                    <span>Review Queue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('devices')}
                  className="bg-white p-5 rounded-2xl border border-[#06243D]/10 hover:border-[#F5A044] transition-colors cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#06243D]">RFID Device Health</span>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      91.7%
                    </span>
                  </div>
                  <p className="text-xs text-[#17202A]/70 mt-2">
                    Reader 03 (Room 301) offline since 08:17 AM. Reader 06 requires antenna power calibration.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-[#06243D] flex items-center gap-1">
                    <span>Hardware Status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('audit')}
                  className="bg-white p-5 rounded-2xl border border-[#06243D]/10 hover:border-[#F5A044] transition-colors cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#06243D]">Audit Trail Compliance</span>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#17202A]/70 mt-2">
                    Every administrative modification is signed with timestamp and mandatory reason.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-[#06243D] flex items-center gap-1">
                    <span>Inspect Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: MANUAL ATTENDANCE (CRITICAL PROMPT FEATURE)   */}
          {/* ================================================== */}
          {activeTab === 'manual' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Mandatory Policy Warning Header */}
              <div className="bg-amber-50 rounded-2xl border border-amber-300/80 p-5 text-xs text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-amber-950">
                      Exceptional Administrative Function
                    </h3>
                    <p className="text-amber-900/90 leading-relaxed">
                      AttendX is an automatic RFID system. Manual attendance overrides must strictly be used for hardware outages, damaged credentials, or formal academic appeals. 
                      <strong> A verifiable written reason is legally mandatory</strong> and will be committed to the tamper-evident audit ledger.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-[#06243D]">
                    Manual Attendance Override
                  </h2>
                  <p className="text-xs text-[#17202A]/70 mt-0.5">
                    Authorized Administrator: <span className="font-mono font-semibold text-[#06243D]">Prof. K. Venkatesh (admin_204)</span>
                  </p>
                </div>

                {manualFormError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{manualFormError}</span>
                  </div>
                )}

                <form onSubmit={handleInitiateManualSubmit} className="space-y-4 text-xs">
                  
                  {/* Student selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#06243D] mb-1">
                        Select Student
                      </label>
                      <select
                        value={manualStudentId}
                        onChange={(e) => handleStudentSelect(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                      >
                        {ENROLLED_STUDENTS_LIST.map((std) => (
                          <option key={std.id} value={std.id}>
                            {std.name} — {std.id} ({std.dept})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#06243D] mb-1">
                        Student ID / Register Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={manualStudentId}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Date and Classroom */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-[#06243D] mb-1">
                        Date of Lecture
                      </label>
                      <input
                        type="date"
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#06243D] mb-1">
                        Subject
                      </label>
                      <select
                        value={manualSubject}
                        onChange={(e) => setManualSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                      >
                        <option value="Computer Networks">Computer Networks</option>
                        <option value="Operating Systems">Operating Systems</option>
                        <option value="Database Management Systems">Database Management Systems</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#06243D] mb-1">
                        Classroom
                      </label>
                      <select
                        value={manualClassroom}
                        onChange={(e) => setManualClassroom(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                      >
                        <option value="Room 204">Room 204</option>
                        <option value="Room 205">Room 205</option>
                        <option value="Room 301">Room 301</option>
                        <option value="Room 305">Room 305</option>
                        <option value="Lab 2">Lab 2 (Systems)</option>
                        <option value="Lab 3">Lab 3 (Databases)</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Change Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-500 mb-1">
                        Original Recorded Status
                      </label>
                      <select
                        value={manualOriginalStatus}
                        onChange={(e) => setManualOriginalStatus(e.target.value as AttendanceStatus)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Present">Present</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#06243D] mb-1">
                        New Verified Status
                      </label>
                      <select
                        value={manualNewStatus}
                        onChange={(e) => setManualNewStatus(e.target.value as AttendanceStatus)}
                        className="w-full px-3 py-2 bg-white border border-[#06243D]/30 rounded-lg text-xs font-bold text-[#06243D]"
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                  </div>

                  {/* MANDATORY REASON FIELD AS SPECIFIED IN PROMPT */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-[#06243D]">
                        Reason for Manual Attendance <span className="text-rose-600 font-bold">* MANDATORY</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Recorded in audit log</span>
                    </div>
                    <textarea
                      rows={3}
                      value={manualReason}
                      onChange={(e) => {
                        setManualReason(e.target.value);
                        setManualFormError(null);
                      }}
                      placeholder="e.g. RFID reader was offline during the first 20 minutes of the class."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-2 focus:ring-[#F5A044]"
                      required
                    />

                    {/* Pre-fill helper chips */}
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-500 font-medium block mb-1">
                        Common Verifiable Reasons (Click to insert):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prefillReasons.map((reason, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setManualReason(reason)}
                            className="px-2 py-1 bg-slate-100 hover:bg-[#FFF4E3] border border-slate-200 hover:border-[#F5A044]/50 rounded text-[10px] text-slate-700 cursor-pointer transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submission Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#06243D] text-white hover:bg-[#06243D]/90 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <FileEdit className="w-4 h-4 text-[#F5A044]" />
                      <span>Submit Manual Attendance</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* WARNING CONFIRMATION MODAL (Prompt requirement) */}
              {showManualWarningModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#06243D]/10 shadow-xl space-y-4">
                    <div className="flex items-center gap-3 text-amber-600">
                      <AlertTriangle className="w-6 h-6 shrink-0" />
                      <h3 className="text-base font-bold text-[#06243D]">
                        Confirm Manual Attendance Change
                      </h3>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-semibold">Notice of Administrative Logging:</div>
                      <p className="text-[11px] leading-relaxed">
                        &quot;Manual attendance changes are recorded in the audit log.&quot;
                      </p>
                    </div>

                    <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div><span className="text-slate-500">Student:</span> <span className="font-semibold">{manualStudentName} ({manualStudentId})</span></div>
                      <div><span className="text-slate-500">Date & Subject:</span> <span>{manualDate} · {manualSubject}</span></div>
                      <div><span className="text-slate-500">Status Change:</span> <span className="text-rose-700">{manualOriginalStatus}</span> → <span className="font-bold text-emerald-700">{manualNewStatus}</span></div>
                      <div><span className="text-slate-500">Reason:</span> &quot;{manualReason}&quot;</div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowManualWarningModal(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmManualAttendance}
                        className="px-4 py-2 bg-[#06243D] text-white rounded-lg text-xs font-semibold hover:bg-[#06243D]/90 transition-colors cursor-pointer"
                      >
                        Confirm Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: CORRECTION REQUEST MANAGEMENT                */}
          {/* ================================================== */}
          {activeTab === 'corrections' && (
            <div className="space-y-6">
              
              {/* Header Status Cards requested in prompt */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-amber-800">PENDING REQUESTS</span>
                  <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
                    {pendingRequestsCount}
                  </div>
                  <span className="text-[10px] text-amber-800/70 mt-1 block">Awaiting faculty review</span>
                </div>

                <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-blue-800">UNDER REVIEW</span>
                  <div className="text-2xl font-bold font-mono text-blue-700 mt-1 tabular-nums">
                    {underReviewCount}
                  </div>
                  <span className="text-[10px] text-blue-800/70 mt-1 block">CCTV & reader cross-check</span>
                </div>

                <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-emerald-800">RESOLVED</span>
                  <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                    {resolvedCount}
                  </div>
                  <span className="text-[10px] text-emerald-800/70 mt-1 block">Attendance updated</span>
                </div>

                <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs">
                  <span className="text-[11px] font-semibold uppercase text-rose-800">REJECTED</span>
                  <div className="text-2xl font-bold font-mono text-rose-700 mt-1 tabular-nums">
                    {rejectedCount}
                  </div>
                  <span className="text-[10px] text-rose-800/70 mt-1 block">Unsubstantiated claims</span>
                </div>
              </div>

              {/* Correction Requests List */}
              <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-[#06243D]">
                    Active Attendance Correction Inquiries
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Showing latest academic batch requests
                  </span>
                </div>

                <div className="space-y-4">
                  {correctionRequests.map((req) => (
                    <div 
                      key={req.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-[#06243D]/30 transition-all bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#06243D]">{req.id}</span>
                          <span className="text-slate-300">·</span>
                          <span className="font-bold text-[#17202A]">{req.studentName}</span>
                          <span className="font-mono text-slate-500">({req.studentId})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">{req.date} · {req.subject}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                            req.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Display items as specified in prompt:
                          Student Name, Student ID, Date, Subject, Issue, Student Description, RFID Log, Current Attendance */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                        <div>
                          <div className="text-[11px] text-slate-400 font-semibold">Reported Issue</div>
                          <div className="font-semibold text-rose-700 mt-0.5">{req.issueType}</div>

                          <div className="text-[11px] text-slate-400 font-semibold mt-2">Student Description</div>
                          <p className="text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            &quot;{req.description}&quot;
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <div className="text-[11px] text-slate-500 font-semibold">Gateway RFID Log Trace</div>
                            <div className="font-mono text-[11px] text-slate-600 mt-0.5 break-all">
                              {req.rfidLog}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <div>
                              <span className="text-slate-500">Current Attendance: </span>
                              <span className="font-semibold text-rose-700">{req.currentAttendance}</span>
                            </div>

                            {/* Admin actions: [ Approve ] [ Reject ] */}
                            {req.status === 'Pending' || req.status === 'Under Review' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedCorrection(req);
                                    setResolutionAction('Resolved');
                                    setAdminResolutionNote(`Verified classroom attendance via faculty roll roster. Updated status to Present.`);
                                  }}
                                  className="px-3 py-1 bg-emerald-700 text-white rounded hover:bg-emerald-800 font-semibold text-xs cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCorrection(req);
                                    setResolutionAction('Rejected');
                                    setAdminResolutionNote(`Unable to substantiate student presence. Tag signal completely absent during scan window.`);
                                  }}
                                  className="px-3 py-1 bg-rose-700 text-white rounded hover:bg-rose-800 font-semibold text-xs cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Processed ({req.resolvedBy || 'Administrator'})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* RESOLUTION MODAL (Requires Admin Reason / Resolution Note as specified) */}
              {selectedCorrection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#06243D]/10 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-[#F5A044]" />
                        <h3 className="text-base font-bold text-[#06243D]">
                          {resolutionAction === 'Resolved' ? 'Approve Correction Request' : 'Reject Correction Request'}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setSelectedCorrection(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div><span className="text-slate-500">Student:</span> <span className="font-semibold">{selectedCorrection.studentName} ({selectedCorrection.studentId})</span></div>
                      <div><span className="text-slate-500">Subject:</span> {selectedCorrection.subject} · {selectedCorrection.date}</div>
                      <div><span className="text-slate-500">Issue:</span> {selectedCorrection.issueType}</div>
                    </div>

                    {resolutionError && (
                      <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
                        {resolutionError}
                      </div>
                    )}

                    <div className="text-xs">
                      <label className="block font-bold text-[#06243D] mb-1">
                        Admin Reason / Resolution Note <span className="text-rose-600">* Mandatory</span>
                      </label>
                      <textarea
                        rows={3}
                        value={adminResolutionNote}
                        onChange={(e) => setAdminResolutionNote(e.target.value)}
                        placeholder="Provide formal audit reasoning for approving or rejecting this correction..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        This note will be recorded in the student record and committed to the Audit Log.
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedCorrection(null)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmCorrectionResolution}
                        className={`px-4 py-2 text-white rounded-lg text-xs font-semibold transition-colors ${
                          resolutionAction === 'Resolved' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-rose-700 hover:bg-rose-800'
                        }`}
                      >
                        Confirm {resolutionAction === 'Resolved' ? 'Approval' : 'Rejection'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: AUDIT LOGS (TRANSPARENT & TRACEABLE)         */}
          {/* ================================================== */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#06243D]">
                    Manual Attendance Audit Logs
                  </h2>
                  <p className="text-xs text-[#17202A]/70 mt-0.5">
                    Permanent, tamper-evident log of all manual overrides and correction resolutions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={auditSearchTerm}
                      onChange={(e) => setAuditSearchTerm(e.target.value)}
                      placeholder="Search student, admin ID, reason..."
                      className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const csvHeader = "Admin,Student,Date,Original,Changed To,Reason,Timestamp,Action\n";
                      const csvContent = auditLogs.map(l => 
                        `"${l.adminId}","${l.studentId}","${l.date}","${l.originalStatus}","${l.newStatus}","${l.reason}","${l.timestamp}","${l.action}"`
                      ).join("\n");
                      const blob = new Blob([csvHeader + csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `attendx_audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1 font-medium"
                    title="Export Audit Log CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* Table displaying: Admin, Student, Date, Original Status, New Status, Reason, Timestamp, Action */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#06243D]/5 text-[#06243D] border-b border-slate-200 font-semibold">
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4 font-mono">Date</th>
                      <th className="py-3 px-4">Original</th>
                      <th className="py-3 px-4">Changed To</th>
                      <th className="py-3 px-4 min-w-[220px]">Reason</th>
                      <th className="py-3 px-4 font-mono">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs
                      .filter(l => 
                        l.studentName.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                        l.studentId.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                        l.adminId.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                        l.reason.toLowerCase().includes(auditSearchTerm.toLowerCase())
                      )
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono text-[#06243D] font-medium">
                            <div>{log.adminId}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{log.adminName}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#17202A]">{log.studentName}</div>
                            <div className="text-[10px] font-mono text-slate-500">{log.studentId}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {log.date}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              {log.originalStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {log.newStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 leading-normal">
                            &quot;{log.reason}&quot;
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500 tabular-nums">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {log.action}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Total records in immutable compliance trail: {auditLogs.length}</span>
                <span className="font-mono text-[11px]">SHA-256 Block Signature Verified</span>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: RFID DEVICE MONITORING                       */}
          {/* ================================================== */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#06243D]/10 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-[#06243D]">
                    RFID Device Monitoring
                  </h2>
                  <p className="text-xs text-[#17202A]/70 mt-0.5">
                    Real-time status of UHF fixed portal readers, phased array antennas, and ESP32 controllers
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={deviceFilter}
                    onChange={(e) => setDeviceFilter(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="all">All Readers (8)</option>
                    <option value="ONLINE">Online Only</option>
                    <option value="OFFLINE">Offline Only</option>
                    <option value="WARNING">Warning Only</option>
                  </select>

                  <button
                    onClick={onOpenSimulator}
                    className="px-3 py-1.5 bg-[#FFF4E3] border border-[#F5A044]/50 rounded-lg text-xs font-semibold text-[#06243D] hover:bg-[#F5A044]/20 transition-colors flex items-center gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5 text-[#F5A044]" />
                    <span>Test Reader Beam</span>
                  </button>
                </div>
              </div>

              {/* Grid of Readers as specifically requested in prompt:
                  Reader 01 Room 204 ONLINE Last Sync 09:42 AM
                  Reader 02 Room 205 ONLINE Last Sync 09:41 AM
                  Reader 03 Room 301 OFFLINE Last Sync 08:17 AM
                  Reader 04 Library ONLINE Last Sync 09:42 AM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {rfidDevices
                  .filter(d => deviceFilter === 'all' || d.status === deviceFilter)
                  .map((device) => (
                    <div 
                      key={device.id} 
                      className={`p-4 rounded-xl border bg-white shadow-xs space-y-3 transition-all ${
                        device.status === 'OFFLINE' ? 'border-rose-300 ring-1 ring-rose-200' : 
                        device.status === 'WARNING' ? 'border-amber-300 ring-1 ring-amber-200' : 
                        'border-slate-200 hover:border-[#06243D]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#06243D]">{device.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          device.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' :
                          device.status === 'OFFLINE' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {device.status}
                        </span>
                      </div>

                      <div className="text-xs">
                        <div className="text-slate-500 font-medium">Classroom / Location:</div>
                        <div className="font-semibold text-[#17202A] text-sm mt-0.5">{device.classroom}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Sync:</span>
                          <span className="font-mono text-slate-700">{device.lastSync}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tags Today:</span>
                          <span className="font-mono text-slate-700 tabular-nums">{device.tagsDetectedToday} tags</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">IP Address:</span>
                          <span className="font-mono text-slate-500 text-[11px]">{device.ipAddress}</span>
                        </div>
                      </div>

                      {device.status === 'OFFLINE' && (
                        <div className="p-2 bg-rose-50 text-rose-800 text-[11px] rounded flex items-center justify-between">
                          <span>Connection timed out</span>
                          <button 
                            onClick={() => alert(`Diagnostics ping sent to ${device.ipAddress}`)}
                            className="font-bold hover:underline"
                          >
                            Ping
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: CLASSROOMS MONITORING                        */}
          {/* ================================================== */}
          {activeTab === 'classrooms' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#06243D]/10 shadow-xs">
                <h2 className="text-lg font-bold text-[#06243D]">
                  Campus Classrooms & Real-Time Presence
                </h2>
                <p className="text-xs text-[#17202A]/70 mt-0.5">
                  Occupancy tracking calculated from doorway entry and exit RFID radio beams
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ALL_CLASSROOMS.map((cr) => (
                  <div key={cr.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-[#06243D]">{cr.room}</div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cr.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {cr.reader} · {cr.status}
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-400">Current Subject:</span>
                      <p className="font-semibold text-[#17202A] mt-0.5">{cr.currentSubject}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Live Presence</span>
                        <span className="font-mono font-bold text-[#06243D]">
                          {cr.inside} / {cr.expected} ({Math.round((cr.inside / cr.expected) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#06243D] rounded-full" 
                          style={{ width: `${Math.min(100, (cr.inside / cr.expected) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: ENROLLED STUDENTS DIRECTORY                  */}
          {/* ================================================== */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#06243D]">
                    Student Roster & RFID Tag Directory
                  </h2>
                  <p className="text-xs text-[#17202A]/70 mt-0.5">
                    1,240 Enrolled students with linked passive UHF EPC credentials
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Total Active Cards: 1,238 / 1,240
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#06243D]/5 text-[#06243D] border-b border-slate-200 font-semibold">
                      <th className="py-3 px-4">Register No.</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 font-mono">Assigned UHF EPC Tag</th>
                      <th className="py-3 px-4 font-mono">Cumulative Attendance</th>
                      <th className="py-3 px-4">Today&apos;s Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ENROLLED_STUDENTS_LIST.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-[#06243D]">{std.id}</td>
                        <td className="py-3 px-4 font-medium text-[#17202A]">{std.name}</td>
                        <td className="py-3 px-4 text-slate-600">{std.dept}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{std.tagId}</td>
                        <td className="py-3 px-4 font-mono font-bold tabular-nums text-slate-800">
                          {std.attendanceRate}%
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            std.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            std.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {std.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              handleStudentSelect(std.id);
                              setActiveTab('manual');
                            }}
                            className="text-[#06243D] hover:text-[#F5A044] font-semibold text-xs"
                          >
                            Override
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: ATTENDANCE MASTER STREAM                     */}
          {/* ================================================== */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#06243D]">
                    Campus Attendance Log Stream
                  </h2>
                  <p className="text-xs text-[#17202A]/70 mt-0.5">
                    Real-time timestamped portal records across all active lecture rooms
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Live Stream Active · Sync: 100ms
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#06243D]/5 text-[#06243D] border-b border-slate-200 font-semibold">
                      <th className="py-3 px-4 font-mono">Timestamp</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Classroom</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Signal Vector</th>
                      <th className="py-3 px-4">Recorded State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">09:35:12 AM</td>
                      <td className="py-3 px-4 font-semibold text-[#17202A]">Sanjay Dutt V. (SEC24CSE1078)</td>
                      <td className="py-3 px-4">Room 204</td>
                      <td className="py-3 px-4 text-slate-600">Computer Networks</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">Exit Vector (Antenna C) -53dBm</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Exited</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">09:12:04 AM</td>
                      <td className="py-3 px-4 font-semibold text-[#17202A]">Tanvi Joshi (SEC24CSE1062)</td>
                      <td className="py-3 px-4">Room 204</td>
                      <td className="py-3 px-4 text-slate-600">Computer Networks</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">Entry Vector (Antenna A) -61dBm</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Late (+12m)</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">09:05:40 AM</td>
                      <td className="py-3 px-4 font-semibold text-[#17202A]">Priya Sharma (SEC24CSE1045)</td>
                      <td className="py-3 px-4">Room 204</td>
                      <td className="py-3 px-4 text-slate-600">Computer Networks</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">Entry Vector (Antenna A) -56dBm</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Present</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">09:03:19 AM</td>
                      <td className="py-3 px-4 font-semibold text-[#17202A]">Arun Kumar (SEC24CSE1023)</td>
                      <td className="py-3 px-4">Room 204</td>
                      <td className="py-3 px-4 text-slate-600">Computer Networks</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">Entry Vector (Antenna B) -51dBm</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Present</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-500">09:01:05 AM</td>
                      <td className="py-3 px-4 font-semibold text-[#17202A]">Karthik Raja (SEC24CSE1004)</td>
                      <td className="py-3 px-4">Room 204</td>
                      <td className="py-3 px-4 text-slate-600">Computer Networks</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">Entry Vector (Antenna A) -54dBm</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Present</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: ATTENDANCE ANALYTICS & REPORTS               */}
          {/* ================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#06243D]/10 shadow-xs">
                <h2 className="text-lg font-bold text-[#06243D]">
                  Campus Attendance Analytics & Trends
                </h2>
                <p className="text-xs text-[#17202A]/70 mt-0.5">
                  Clean institutional analytics across departments, subjects, and classroom occupancy
                </p>
              </div>

              {/* Analytics Metric Cards requested in prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Overall Attendance */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">Overall Attendance</div>
                  <div className="text-3xl font-mono font-bold text-[#06243D] tabular-nums">87.7%</div>
                  <p className="text-xs text-slate-600">
                    +2.4% higher than previous semester before contactless UHF deployment.
                  </p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '87.7%' }} />
                  </div>
                </div>

                {/* Late Arrivals */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">Late Arrivals Trend</div>
                  <div className="text-3xl font-mono font-bold text-amber-700 tabular-nums">4.0%</div>
                  <p className="text-xs text-slate-600">
                    Average delay is 7.2 minutes. Peak late entries occur in Monday 09:00 AM slots.
                  </p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '4%' }} />
                  </div>
                </div>

                {/* Classroom Utilization */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">Classroom Utilization</div>
                  <div className="text-3xl font-mono font-bold text-[#06243D] tabular-nums">92.1%</div>
                  <p className="text-xs text-slate-600">
                    22 of 24 instructional lecture halls actively occupied during morning shift.
                  </p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#06243D] rounded-full" style={{ width: '92.1%' }} />
                  </div>
                </div>

              </div>

              {/* Subject-wise & Department Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#06243D]">
                    Subject-Wise Attendance Breakdown
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700">Computer Networks</span>
                        <span className="font-mono font-bold text-[#06243D]">89.4%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#06243D] rounded-full" style={{ width: '89.4%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700">Operating Systems</span>
                        <span className="font-mono font-bold text-[#06243D]">91.2%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#06243D] rounded-full" style={{ width: '91.2%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700">Database Management Systems</span>
                        <span className="font-mono font-bold text-[#06243D]">94.0%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#06243D] rounded-full" style={{ width: '94.0%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-700">Cyber Security</span>
                        <span className="font-mono font-bold text-[#06243D]">84.6%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#06243D] rounded-full" style={{ width: '84.6%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#06243D]">
                    Monthly Absence Trends
                  </h3>
                  <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-200">
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-500">11.2%</span>
                      <div className="w-full bg-slate-200 rounded-t h-28" />
                      <span className="text-[11px] font-semibold text-slate-600">Jul</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-500">9.8%</span>
                      <div className="w-full bg-slate-300 rounded-t h-24" />
                      <span className="text-[11px] font-semibold text-slate-600">Aug</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-500">8.4%</span>
                      <div className="w-full bg-slate-400 rounded-t h-20" />
                      <span className="text-[11px] font-semibold text-slate-600">Sep</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold text-[#06243D]">8.3%</span>
                      <div className="w-full bg-[#06243D] rounded-t h-19" />
                      <span className="text-[11px] font-bold text-[#06243D]">Oct</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Absences continue steady reduction following automatic portal deployment and instant student self-checking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* VIEW: SETTINGS                                     */}
          {/* ================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs max-w-3xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#06243D]">
                  AttendX System Configuration
                </h2>
                <p className="text-xs text-[#17202A]/70 mt-0.5">
                  Hardware thresholds, portal read debouncing, and attendance credit policies
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-[#06243D]">Doorway Entry Grace Period</h3>
                  <p className="text-slate-600 text-[11px]">
                    Time threshold past lecture scheduled start before a student is flagged as &apos;Late&apos;.
                  </p>
                  <select className="bg-white border border-slate-200 rounded px-3 py-1.5 font-mono">
                    <option value="10">10 Minutes (SRM Academic Standard)</option>
                    <option value="5">5 Minutes</option>
                    <option value="15">15 Minutes</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-[#06243D]">Minimum Lecture Duration Credit</h3>
                  <p className="text-slate-600 text-[11px]">
                    Minimum active presence duration calculated between Entry and Exit to earn full credit for a lecture.
                  </p>
                  <select className="bg-white border border-slate-200 rounded px-3 py-1.5 font-mono">
                    <option value="75">75% of Total Period Time</option>
                    <option value="60">60% of Total Period Time</option>
                    <option value="85">85% of Total Period Time</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="font-bold text-[#06243D]">Antenna RF Beam Debounce Delay</h3>
                  <p className="text-slate-600 text-[11px]">
                    Prevent duplicate exit triggers when students linger near doorway threshold.
                  </p>
                  <select className="bg-white border border-slate-200 rounded px-3 py-1.5 font-mono">
                    <option value="180">180 Seconds (3 Minutes)</option>
                    <option value="120">120 Seconds</option>
                    <option value="300">300 Seconds</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
