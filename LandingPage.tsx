import React, { useState } from 'react';
import { 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2, 
  Cpu, 
  FileText, 
  AlertTriangle, 
  History, 
  BarChart3, 
  Wifi, 
  Database, 
  Server, 
  Layers, 
  UserCheck, 
  EyeOff, 
  Check, 
  ChevronRight,
  ExternalLink,
  School,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface LandingPageProps {
  onNavigateToLogin: (role: 'student' | 'admin') => void;
  onOpenSimulator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onOpenSimulator,
}) => {
  // Interactive Walkthrough Demo State in the Hero
  const [heroStep, setHeroStep] = useState<number>(1);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);

  // Demo request modal state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [institutionName, setInstitutionName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const playInteractiveDemo = () => {
    if (isDemoPlaying) return;
    setIsDemoPlaying(true);
    setHeroStep(1);

    const stepInterval = setInterval(() => {
      setHeroStep((prev) => {
        if (prev >= 6) {
          clearInterval(stepInterval);
          setIsDemoPlaying(false);
          return 6;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName || !contactEmail) return;
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoModalOpen(false);
      setInstitutionName('');
      setContactEmail('');
    }, 3000);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">

      {/* ================================================== */}
      {/* 1. HERO SECTION (Asymmetric Bento Hero)            */}
      {/* ================================================== */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4E3] border border-[#F5A044]/40 text-[#06243D] text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-[#F5A044] animate-pulse" />
              <span>Contactless UHF RFID Technology (865–868 MHz)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#06243D] leading-[1.08] text-balance">
              Attendance, Without the Roll Call.
            </h1>

            <p className="text-base sm:text-lg text-[#17202A]/80 leading-relaxed max-w-2xl">
              AttendX automatically records student entry, exit and attendance using contactless UHF RFID technology.
              Students walk freely through classroom portals without tapping badges, scanning QR codes, or camera surveillance.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigateToLogin('student')}
                className="px-6 py-3 bg-[#06243D] text-white hover:bg-[#06243D]/90 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Explore AttendX</span>
                <ArrowRight className="w-4 h-4 text-[#F5A044]" />
              </button>

              <button
                onClick={() => onNavigateToLogin('admin')}
                className="px-6 py-3 bg-white text-[#06243D] hover:bg-[#FFF4E3]/60 border border-[#06243D]/20 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>View Dashboard</span>
              </button>

              <button
                onClick={onOpenSimulator}
                className="px-4 py-3 bg-[#FFF4E3] text-[#06243D] hover:bg-[#F5A044]/20 border border-[#F5A044]/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Radio className="w-4 h-4 text-[#F5A044]" />
                <span>Test RFID Gate Simulator</span>
              </button>
            </div>

            {/* Quick Proof metrics */}
            <div className="pt-6 border-t border-[#06243D]/10 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-xl font-bold text-[#06243D] block tabular-nums">&lt;20ms</span>
                <span className="text-[#17202A]/60">Detection Speed</span>
              </div>
              <div>
                <span className="text-xl font-bold text-[#06243D] block tabular-nums">0 Taps</span>
                <span className="text-[#17202A]/60">Passive UHF Wave</span>
              </div>
              <div>
                <span className="text-xl font-bold text-[#06243D] block tabular-nums">100%</span>
                <span className="text-[#17202A]/60">Audited Changes</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column (5 cols): Interactive Classroom Entry Point Flow */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#06243D]/12 p-6 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#06243D]/8">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#06243D] uppercase tracking-wider">
                    Classroom Entry Portal Flow
                  </span>
                </div>
                <button
                  type="button"
                  onClick={playInteractiveDemo}
                  disabled={isDemoPlaying}
                  className="text-xs font-semibold text-[#06243D] hover:text-[#F5A044] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDemoPlaying ? 'Simulating...' : '▶ Replay Flow'}
                </button>
              </div>

              {/* Central Visual Workflow as strictly requested:
                  Student with RFID ID card
                  ↓
                  RFID Reader
                  ↓
                  Entry Recorded
                  ↓
                  Classroom Session
                  ↓
                  Exit Recorded
                  ↓
                  Attendance Updated
              */}
              <div className="space-y-2 text-xs">
                
                {/* Step 1 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  heroStep === 1 
                    ? 'border-[#F5A044] bg-[#FFF4E3]/60 ring-1 ring-[#F5A044]' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#06243D]">1. Student with RFID ID Card</span>
                    <span className="text-[10px] font-mono text-slate-500">Passive Tag</span>
                  </div>
                  <p className="text-[11px] text-[#17202A]/70 mt-0.5">
                    Student approaches Room 204 door carrying standard lanyard ID badge.
                  </p>
                </div>

                <div className="flex justify-center text-slate-300">↓</div>

                {/* Step 2 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  heroStep === 2 
                    ? 'border-[#F5A044] bg-[#FFF4E3]/60 ring-1 ring-[#F5A044]' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#06243D]">2. UHF RFID Reader Detects Card</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1 rounded font-semibold">14ms Scan</span>
                  </div>
                  <p className="text-[11px] text-[#17202A]/70 mt-0.5">
                    Doorway antenna identifies EPC <span className="font-mono font-medium">E280-1160-4492</span> without stopping student.
                  </p>
                </div>

                <div className="flex justify-center text-slate-300">↓</div>

                {/* Step 3 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  heroStep === 3 
                    ? 'border-[#F5A044] bg-[#FFF4E3]/60 ring-1 ring-[#F5A044]' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#06243D]">3. Entry Recorded</span>
                    <span className="text-[10px] font-mono font-bold text-[#06243D]">09:04 AM</span>
                  </div>
                  <p className="text-[11px] text-[#17202A]/70 mt-0.5">
                    Timestamp verified against lecture start (09:00 AM) · Flagged On-Time.
                  </p>
                </div>

                <div className="flex justify-center text-slate-300">↓</div>

                {/* Step 4 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  heroStep === 4 
                    ? 'border-[#F5A044] bg-[#FFF4E3]/60 ring-1 ring-[#F5A044]' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#06243D]">4. Classroom Session</span>
                    <span className="text-[10px] font-mono text-emerald-700">Active (Room 204)</span>
                  </div>
                  <p className="text-[11px] text-[#17202A]/70 mt-0.5">
                    Continuous presence tracking in Computer Networks lecture.
                  </p>
                </div>

                <div className="flex justify-center text-slate-300">↓</div>

                {/* Step 5 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  heroStep === 5 
                    ? 'border-[#F5A044] bg-[#FFF4E3]/60 ring-1 ring-[#F5A044]' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#06243D]">5. Exit Recorded</span>
                    <span className="text-[10px] font-mono font-bold text-[#06243D]">10:52 AM</span>
                  </div>
                  <p className="text-[11px] text-[#17202A]/70 mt-0.5">
                    Opposing doorway antenna senses exit vector as class concludes.
                  </p>
                </div>

                <div className="flex justify-center text-slate-300">↓</div>

                {/* Step 6 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  heroStep === 6 
                    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">6. Attendance Updated</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800">1h 48m · PRESENT</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5">
                    Session credited instantly to Arun&apos;s student dashboard (91.6% monthly).
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 2. BENTO FEATURE CARDS (12 Required Features)       */}
      {/* ================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A044] block">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06243D] mt-1">
            Engineered for Autonomous Campus Operations
          </h2>
          <p className="text-sm text-[#17202A]/70 mt-1 max-w-2xl">
            AttendX handles high-throughput attendance across all academic facilities with robust administrative exception tooling.
          </p>
        </div>

        {/* Asymmetric Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Contactless Attendance (col-span-2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FFF4E3] border border-[#F5A044]/40 flex items-center justify-center text-[#06243D] mb-3">
                <Radio className="w-5 h-5 text-[#F5A044]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">1. Contactless Attendance</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Zero tapping, zero swiping, and zero turnstiles. Long-range UHF passive RFID antennas capture credentials as groups of 40+ students pass naturally through classroom doors.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-mono text-[#06243D]/70">
              <span>865–868 MHz ISO 18000-6C</span>
              <span>·</span>
              <span>Up to 6m Portal Range</span>
            </div>
          </div>

          {/* Card 2: Entry & Exit Tracking */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <Clock className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">2. Entry & Exit Tracking</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Dual directional antenna arrays record exact arrival and departure times, computing session duration to ensure minimum course lecture presence.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded self-start">
              Precision: ±1 second
            </span>
          </div>

          {/* Card 3: Real-Time Monitoring */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <Users className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">3. Real-Time Monitoring</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Know immediately how many students are inside any lecture hall, laboratory, or auditorium with live arrival feeds streaming directly to faculty and admin consoles.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#06243D]/60 self-start">
              Live Occupancy Counts
            </span>
          </div>

          {/* Card 4: Attendance Analytics */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <BarChart3 className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">4. Attendance Analytics</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Campus-wide trends, late arrival distributions, subject absenteeism correlations, and facility capacity utilization charts.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Department & Semester Views
            </span>
          </div>

          {/* Card 5: Multiple Classrooms (col-span-2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FFF4E3] border border-[#F5A044]/40 flex items-center justify-center text-[#06243D] mb-3">
                <Building2 className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">5. Multiple Classrooms & Venues</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Scale seamlessly across 200+ classrooms, libraries, workshops, and sports pavilions. ESP32 gateway controllers bridge local reader data over Wi-Fi directly to the cloud.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-600 pt-2 border-t border-slate-100">
              <span>Rooms 101–405</span>
              <span>·</span>
              <span>Central Library</span>
              <span>·</span>
              <span>Auditorium Gates</span>
            </div>
          </div>

          {/* Card 6: Student Dashboard */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <UserCheck className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">6. Student Dashboard</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Dedicated personal portal showing cumulative monthly percentage, daily entry/exit timestamps, and full Mon-Fri status calendar.
              </p>
            </div>
            <button
              onClick={() => onNavigateToLogin('student')}
              className="text-xs font-semibold text-[#06243D] hover:text-[#F5A044] text-left cursor-pointer"
            >
              Open Student View →
            </button>
          </div>

          {/* Card 7: Admin Controls */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <ShieldCheck className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">7. Admin Controls</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Centralized registrar console with role-based access, student directories, live hardware feeds, and policy enforcement tools.
              </p>
            </div>
            <button
              onClick={() => onNavigateToLogin('admin')}
              className="text-xs font-semibold text-[#06243D] hover:text-[#F5A044] text-left cursor-pointer"
            >
              Open Admin View →
            </button>
          </div>

          {/* Card 8: RFID Device Monitoring */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <Cpu className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">8. RFID Device Monitoring</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Live health indicators for every physical reader (Online, Offline, Warning), last heartbeat sync timestamps, and signal noise measurements.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded self-start">
              Auto Heartbeat Ping: 30s
            </span>
          </div>

          {/* Card 9: Manual Attendance (EXCEPTIONAL) */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-300 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-amber-950">9. Manual Attendance (Exception)</h3>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                Admins can modify records only when hardware glitches or damaged cards occur. A written reason is strictly mandatory.
              </p>
            </div>
            <span className="text-[11px] font-mono text-amber-800 font-semibold">
              Mandatory Explanation Required
            </span>
          </div>

          {/* Card 10: Correction Requests */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <FileText className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">10. Correction Requests</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Students report undetected RFID events or timing disputes. Discrepancies are queued for faculty review with system scan traces.
              </p>
            </div>
            <span className="text-[11px] text-[#06243D]/70 font-mono">
              Students Cannot Directly Alter Data
            </span>
          </div>

          {/* Card 11: Audit Logs (col-span-2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#06243D] text-[#FFF4E3] flex items-center justify-center mb-3">
                <History className="w-5 h-5 text-[#F5A044]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">11. Immutable Audit Logs</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Every manual intervention records admin ID, student register number, original status, altered status, mandatory reason, and exact timestamp in an auditable ledger.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-500">
              Complete Institutional Traceability & Academic Compliance
            </div>
          </div>

          {/* Card 12: Attendance Reports */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <FileText className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">12. Attendance Reports</h3>
              <p className="text-xs text-[#17202A]/75 mt-1 leading-relaxed">
                Generate official printable PDF transcripts and raw CSV datasets for regulatory accreditation, semester examination eligibility, and parent portals.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              PDF & CSV Instant Export
            </span>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 3. AUTOMATIC VS MANUAL ATTENDANCE (Comparison)     */}
      {/* ================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#06243D]/12 p-6 sm:p-10 shadow-xs space-y-8">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A044] block">
              Core Architectural Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06243D] mt-1">
              Automatic as Normal. Manual as the Exception.
            </h2>
            <p className="text-xs sm:text-sm text-[#17202A]/70 mt-2 leading-relaxed">
              In AttendX, attendance is 99.8% hands-free and system-recorded. Manual overrides exist only as a safeguarded administrative fallback for physical edge cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Automatic Card */}
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <span className="font-bold text-emerald-950 text-sm tracking-wide">
                  AUTOMATIC ATTENDANCE
                </span>
                <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  STANDARD OPERATING MODE
                </span>
              </div>

              <div className="space-y-3 text-xs text-emerald-950">
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="font-semibold text-emerald-800">Source:</span>
                  <span className="font-mono">UHF RFID Doorway Sensors</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="font-semibold text-emerald-800">Triggered:</span>
                  <span>Student entry / exit through portal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="font-semibold text-emerald-800">Reason:</span>
                  <span>Automatic system detection (&lt;20ms)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-emerald-800">Modification:</span>
                  <span>System generated without human intervention</span>
                </div>
              </div>
            </div>

            {/* Manual Card */}
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <span className="font-bold text-amber-950 text-sm tracking-wide">
                  MANUAL ATTENDANCE
                </span>
                <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
                  EXCEPTION ONLY
                </span>
              </div>

              <div className="space-y-3 text-xs text-amber-950">
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="font-semibold text-amber-800">Source:</span>
                  <span className="font-mono">Authorized Admin Only</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="font-semibold text-amber-800">Triggered:</span>
                  <span>Exceptional situation (Damaged card, outage)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-100">
                  <span className="font-semibold text-amber-800">Reason:</span>
                  <span className="font-bold text-amber-900">Mandatory verifiable explanation</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-amber-800">Modification:</span>
                  <span>Permanently recorded in audit log</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 4. HOW IT WORKS (Steps 01 - 05)                     */}
      {/* ================================================== */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A044] block">
            End-to-End Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06243D] mt-1">
            How AttendX Works
          </h2>
          <p className="text-sm text-[#17202A]/70 mt-1 max-w-xl">
            From physical radio frequency detection to academic credit calculation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Step 01 */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#F5A044]">Step 01</span>
              <h3 className="text-sm font-bold text-[#06243D] mt-1">ID CARD</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                Student receives an RFID-enabled ID card embedded with a passive UHF microchip and antenna.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Zero Battery</span>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#F5A044]">Step 02</span>
              <h3 className="text-sm font-bold text-[#06243D] mt-1">DETECTION</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                UHF RFID reader detects the card automatically within a 6-meter portal doorway boundary.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">865.7 MHz</span>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#F5A044]">Step 03</span>
              <h3 className="text-sm font-bold text-[#06243D] mt-1">ENTRY / EXIT</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                System records entry and exit timestamps using directional phased-array antenna vectors.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">±1 Sec Vector</span>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#F5A044]">Step 04</span>
              <h3 className="text-sm font-bold text-[#06243D] mt-1">ATTENDANCE</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                System calculates duration and updates the student dashboard and registrar records instantly.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">On-Time / Late / Absent</span>
          </div>

          {/* Step 05 */}
          <div className="bg-[#FFF4E3]/60 rounded-2xl border border-[#F5A044]/50 p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#06243D]">Step 05</span>
              <h3 className="text-sm font-bold text-[#06243D] mt-1">ADMIN OVERRIDE</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                If automatic detection fails, an authorized admin can manually correct attendance by providing a mandatory reason.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-800 font-bold">Audit Logged</span>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 5. SECURITY & CONTROL & PRIVACY                    */}
      {/* ================================================== */}
      <section id="security" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Security & Control Block (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#06243D]/10 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A044] block">
                Security & Governance
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[#06243D] mt-1">
                Attendance You Can Trust
              </h2>
              <p className="text-xs sm:text-sm text-[#17202A]/70 mt-1">
                &quot;Every manual attendance change is recorded and traceable.&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#17202A]/85">
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Role-based login (Student & Admin)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Student self-service access</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authorized Admin access</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mandatory reason for manual changes</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Attendance correction requests</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immutable audit logs</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>RFID device heartbeat monitoring</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Timestamped portal records</span>
              </div>
            </div>

            <div className="p-3 bg-[#06243D] text-[#FFF4E3] rounded-xl text-xs flex items-center justify-between">
              <span>Auditable academic record assurance</span>
              <span className="font-mono text-[#F5A044]">ISO 18000-6C Compliant</span>
            </div>
          </div>

          {/* Privacy Card (5 cols as requested in prompt) */}
          <div className="lg:col-span-5 bg-[#06243D] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                <EyeOff className="w-6 h-6 text-[#F5A044]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                No Facial Recognition Required
              </h3>
              <p className="text-xs sm:text-sm text-[#FFF4E3]/80 mt-2 leading-relaxed">
                AttendX identifies users through RFID ID cards rather than facial or biometric recognition.
              </p>
            </div>

            <div className="space-y-3 text-xs text-[#FFF4E3]/70 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A044] shrink-0" />
                <span>Zero facial biometric data stored or processed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A044] shrink-0" />
                <span>No invasive camera surveillance in classrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A044] shrink-0" />
                <span>Encrypted EPC tokens unlinked from personal biometrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A044] shrink-0" />
                <span>Ethical campus governance & GDPR/FERPA aligned</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 6. MULTI-PLATFORM USE CASES (4 Bento Cards)         */}
      {/* ================================================== */}
      <section id="use-cases" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A044] block">
            Institutional Deployments
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06243D] mt-1">
            Built for High-Footfall Environments
          </h2>
          <p className="text-sm text-[#17202A]/70 mt-1 max-w-xl">
            Reliable automatic throughput from university campuses to corporate facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bento 1: Colleges */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <Building2 className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">COLLEGES</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                Automatic classroom attendance. Lecture credit calculation, department compliance, and faculty time savings.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#06243D]/70 bg-slate-50 px-2 py-1 rounded">
              Lecture Hall Portals
            </span>
          </div>

          {/* Bento 2: Schools */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <School className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">SCHOOLS</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                Student entry and attendance monitoring. Automated campus gate checks and instant arrival notification to parents.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#06243D]/70 bg-slate-50 px-2 py-1 rounded">
              Campus Gates & Buses
            </span>
          </div>

          {/* Bento 3: Corporate Offices */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <Briefcase className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">CORPORATE OFFICES</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                Employee entry and room presence tracking. Meeting room occupancy, shift logging, and facility security zones.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#06243D]/70 bg-slate-50 px-2 py-1 rounded">
              Turnstile-Free Entry
            </span>
          </div>

          {/* Bento 4: Coaching & Event Centers */}
          <div className="bg-white rounded-2xl border border-[#06243D]/10 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#06243D] mb-3">
                <BookOpen className="w-5 h-5 text-[#06243D]" />
              </div>
              <h3 className="text-base font-bold text-[#06243D]">COACHING & EVENTS</h3>
              <p className="text-xs text-[#17202A]/70 mt-1 leading-relaxed">
                High-footfall attendance and occupancy monitoring. Rapid batch entry without queues during peak class turnarounds.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#06243D]/70 bg-slate-50 px-2 py-1 rounded">
              High-Velocity Transit
            </span>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 7. HARDWARE ARCHITECTURE DIAGRAM                    */}
      {/* ================================================== */}
      <section id="hardware" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-[#06243D]/10 p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F5A044] block">
              System Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06243D] mt-1">
              Hardware Architecture & Data Flow
            </h2>
            <p className="text-xs sm:text-sm text-[#17202A]/70 mt-1 max-w-2xl">
              Clean physical-to-cloud architecture connecting edge UHF RFID portals with AttendX dashboards.
            </p>
          </div>

          {/* Architecture Signal Pipeline Flow */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
            <div className="min-w-[760px] flex items-center justify-between text-center text-xs font-mono">
              
              {/* Node 1 */}
              <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">RFID ID CARD</div>
                <div className="text-[10px] text-slate-500 mt-1">Passive UHF Tag</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 2 */}
              <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">RFID ANTENNA</div>
                <div className="text-[10px] text-slate-500 mt-1">Circular Array</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 3 */}
              <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">UHF RFID READER</div>
                <div className="text-[10px] text-slate-500 mt-1">Fixed Portal</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 4 */}
              <div className="flex-1 p-3 bg-[#FFF4E3] rounded-xl border border-[#F5A044]/40 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">ESP32 CONTROLLER</div>
                <div className="text-[10px] text-slate-600 mt-1">Microcontroller</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 5 */}
              <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">Wi-Fi</div>
                <div className="text-[10px] text-slate-500 mt-1">Campus WLAN</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 6 */}
              <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">BACKEND</div>
                <div className="text-[10px] text-slate-500 mt-1">Python Service</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 7 */}
              <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-[#06243D] text-[11px]">DATABASE</div>
                <div className="text-[10px] text-slate-500 mt-1">Firebase Cloud</div>
              </div>

              <div className="px-2 text-slate-400 font-bold">→</div>

              {/* Node 8 */}
              <div className="flex-1 p-3 bg-[#06243D] text-white rounded-xl shadow-2xs">
                <div className="font-bold text-[#FFF4E3] text-[11px]">ATTENDX DASHBOARD</div>
                <div className="text-[10px] text-[#FFF4E3]/70 mt-1">Web Interface</div>
              </div>

            </div>
          </div>

          {/* Technical Specifications Split as requested */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            
            {/* Hardware Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#06243D]/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#06243D] uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-[#F5A044]" />
                <span>Hardware Components</span>
              </div>
              <ul className="space-y-2 text-[#17202A]/80 font-mono text-[11px]">
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">UHF RFID Reader:</span>
                  <span>4-Port Fixed Reader (30 dBm adjustable)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">RFID Antenna:</span>
                  <span>Circular polarized phased array (9 dBi gain)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">Passive RFID Tag:</span>
                  <span>EPC Gen2 / ISO 18000-6C (Inlay in PVC ID)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">Edge Node:</span>
                  <span>ESP32 Dual-Core 240MHz with Hardware UART</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="font-semibold text-[#06243D]">Networking:</span>
                  <span>802.11 b/g/n WPA2-Enterprise Wi-Fi</span>
                </li>
              </ul>
            </div>

            {/* Software Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#06243D]/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#06243D] uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#06243D]" />
                <span>Software Stack</span>
              </div>
              <ul className="space-y-2 text-[#17202A]/80 font-mono text-[11px]">
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">Frontend:</span>
                  <span>React / TypeScript / Tailwind CSS</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">Backend Services:</span>
                  <span>Python (FastAPI / Asynchronous Pipeline)</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">Database:</span>
                  <span>Firebase Cloud Firestore & Authentication</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-[#06243D]">Audit Trail:</span>
                  <span>Append-only SHA-256 integrity logs</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="font-semibold text-[#06243D]">Telemetry:</span>
                  <span>Reader heartbeat & RF noise telemetry</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 8. FINAL CTA                                       */}
      {/* ================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#06243D] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          
          {/* Subtle geometric background arch */}
          <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full border-2 border-white" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Make Attendance Automatic.
            </h2>
            <p className="text-base sm:text-lg text-[#FFF4E3]/80 leading-relaxed">
              Let RFID handle attendance. Let administrators handle the exceptions.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => onNavigateToLogin('student')}
              className="px-6 py-3 bg-[#F5A044] hover:bg-[#F5A044]/90 text-[#06243D] rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              Get Started
            </button>

            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Request Demo
            </button>
          </div>

          <p className="text-xs text-[#FFF4E3]/60 relative z-10 pt-4">
            SRM Institute of Science and Technology · Campus License 2026
          </p>
        </div>
      </section>

      {/* ================================================== */}
      {/* FOOTER                                             */}
      {/* ================================================== */}
      <footer className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 border-t border-[#06243D]/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#17202A]/60">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>Automated UHF RFID Attendance Management Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigateToLogin('student')} className="hover:text-[#06243D] cursor-pointer">
              Student Portal
            </button>
            <span>·</span>
            <button onClick={() => onNavigateToLogin('admin')} className="hover:text-[#06243D] cursor-pointer">
              Admin Console
            </button>
            <span>·</span>
            <button onClick={onOpenSimulator} className="hover:text-[#06243D] cursor-pointer">
              Gate Simulator
            </button>
          </div>
        </div>

        <div className="mt-6 text-center sm:text-left text-[11px] text-[#17202A]/40 font-mono">
          © 2026 AttendX Systems. Compliant with EPCglobal Gen2 & ISO/IEC 18000-6C.
        </div>
      </footer>

      {/* ================================================== */}
      {/* REQUEST DEMO MODAL                                 */}
      {/* ================================================== */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#06243D]/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#F5A044]" />
                <h3 className="text-base font-bold text-[#06243D]">
                  Request Campus Evaluation Kit
                </h3>
              </div>
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {demoSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Our technical field engineer will contact your institution within 24 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Receive a turnkey UHF portal reader demo kit, 50 pre-encoded EPC student test cards, and trial dashboard credentials.
                </p>

                <div>
                  <label className="block font-semibold text-[#06243D] mb-1">
                    Institution / Organization Name
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. SRM Institute of Science and Technology"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#06243D] mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="registrar@institution.edu"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#06243D] text-white rounded-lg text-xs font-semibold hover:bg-[#06243D]/90 transition-colors cursor-pointer"
                  >
                    Request Evaluation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
