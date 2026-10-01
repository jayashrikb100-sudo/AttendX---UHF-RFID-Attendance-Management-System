import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, UserCheck, ArrowRight, Lock, KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  initialRole?: 'student' | 'admin';
  onLoginSuccess: (role: 'student' | 'admin') => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'student',
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>(initialRole);
  
  // Student form state
  const [studentAuthMethod, setStudentAuthMethod] = useState<'register' | 'email'>('register');
  const [studentId, setStudentId] = useState('SEC24CSE1023');
  const [studentEmail, setStudentEmail] = useState('arun.cse24@srmuniv.ac.in');
  const [studentPassword, setStudentPassword] = useState('attendx•student•2026');

  // Admin form state
  const [adminId, setAdminId] = useState('admin_204');
  const [adminPassword, setAdminPassword] = useState('attendx•admin•secure');
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('849201');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (studentAuthMethod === 'register' && !studentId.trim()) {
      setErrorMsg('Please enter your Student ID / Register Number');
      return;
    }
    if (studentAuthMethod === 'email' && !studentEmail.trim()) {
      setErrorMsg('Please enter your registered college email');
      return;
    }
    if (!studentPassword.trim()) {
      setErrorMsg('Please enter your student portal password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('student');
    }, 400);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!adminId.trim()) {
      setErrorMsg('Please enter your Authorized Admin ID');
      return;
    }
    if (!adminPassword.trim()) {
      setErrorMsg('Please enter your admin credentials');
      return;
    }
    if (require2FA && twoFactorCode.length < 6) {
      setErrorMsg('Please enter the 6-digit hardware security token code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('admin');
    }, 400);
  };

  const handleQuickDemoFill = (role: 'student' | 'admin') => {
    setActiveRole(role);
    setErrorMsg(null);
    if (role === 'student') {
      setStudentAuthMethod('register');
      setStudentId('SEC24CSE1023');
      setStudentPassword('attendx•student•2026');
      setTimeout(() => onLoginSuccess('student'), 300);
    } else {
      setAdminId('admin_204');
      setAdminPassword('attendx•admin•secure');
      setRequire2FA(false);
      setTimeout(() => onLoginSuccess('admin'), 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E3]/35 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top back bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#06243D]/80 hover:text-[#06243D] transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-white/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </button>

        <span className="text-xs text-[#06243D]/60 font-mono">
          System Node: GATEWAY-SRM-04
        </span>
      </div>

      {/* Main card */}
      <div className="max-w-md w-full mx-auto my-auto pt-4 pb-8">
        <div className="bg-white rounded-2xl border border-[#06243D]/12 shadow-sm p-6 sm:p-8">
          {/* Logo and greeting */}
          <div className="text-center mb-6">
            <div className="inline-flex justify-center mb-3">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#06243D]">
              Welcome to AttendX
            </h1>
            <p className="text-xs text-[#17202A]/70 mt-1">
              Automated UHF RFID Attendance & Academic Governance
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FFF4E3]/60 rounded-xl border border-[#06243D]/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveRole('student');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-[#06243D] text-white shadow-xs'
                  : 'text-[#06243D]/80 hover:text-[#06243D] hover:bg-white/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#F5A044]" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-[#06243D] text-white shadow-xs'
                  : 'text-[#06243D]/80 hover:text-[#06243D] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#F5A044]" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Error banner */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
              <span className="font-semibold">Error:</span> {errorMsg}
            </div>
          )}

          {/* STUDENT LOGIN FORM */}
          {activeRole === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {/* Optional auth switch: Register Number vs College Email */}
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#06243D]/8">
                <span className="text-[#17202A]/70 font-medium">Log in via:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentAuthMethod('register')}
                    className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                      studentAuthMethod === 'register'
                        ? 'border-[#06243D] text-[#06243D]'
                        : 'border-transparent text-[#17202A]/50 hover:text-[#17202A]'
                    }`}
                  >
                    Student ID
                  </button>
                  <span className="text-[#06243D]/20">·</span>
                  <button
                    type="button"
                    onClick={() => setStudentAuthMethod('email')}
                    className={`font-semibold cursor-pointer pb-0.5 border-b-2 transition-colors ${
                      studentAuthMethod === 'email'
                        ? 'border-[#06243D] text-[#06243D]'
                        : 'border-transparent text-[#17202A]/50 hover:text-[#17202A]'
                    }`}
                  >
                    College Email
                  </button>
                </div>
              </div>

              {studentAuthMethod === 'register' ? (
                <div>
                  <label className="block text-xs font-semibold text-[#06243D] mb-1.5">
                    Student ID / Register Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. SEC24CSE1023"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#06243D]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A044] focus:border-transparent font-mono uppercase tracking-wider text-[#17202A]"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#17202A]/60 mt-1">
                    Printed on your university RFID smart card badge.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-[#06243D] mb-1.5">
                    College Institutional Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@srmuniv.ac.in"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#06243D]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A044] focus:border-transparent text-[#17202A]"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#17202A]/60 mt-1">
                    Official domain single sign-on credential.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#06243D]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact your College RFID Center (Admin Block Room 102) to reset credentials.')}
                    className="text-[11px] text-[#06243D]/70 hover:text-[#06243D] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#06243D]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A044] focus:border-transparent text-[#17202A]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#06243D] text-white hover:bg-[#06243D]/90 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating RFID Credentials...</span>
                ) : (
                  <>
                    <span>Enter Student Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#F5A044]" />
                  </>
                )}
              </button>

              {/* Quick pre-fill demo shortcut */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('student')}
                  className="w-full py-2 px-3 bg-[#FFF4E3] border border-[#F5A044]/30 hover:border-[#F5A044] text-[#06243D] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A044]" />
                  <span>One-Click Demo: Arun Kumar (SEC24CSE1023)</span>
                </button>
              </div>
            </form>
          )}

          {/* ADMIN LOGIN FORM */}
          {activeRole === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#06243D] mb-1.5">
                  Authorized Admin ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. admin_204"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#06243D]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A044] focus:border-transparent font-mono text-[#17202A]"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#17202A]/60 mt-1">
                  Department head, attendance officer, or system registrar.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#06243D] mb-1.5">
                  Administrative Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#06243D]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5A044] focus:border-transparent text-[#17202A]"
                    required
                  />
                </div>
              </div>

              {/* Optional 2FA verification toggle */}
              <div className="pt-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#17202A]/80 font-medium">
                    <input
                      type="checkbox"
                      checked={require2FA}
                      onChange={(e) => setRequire2FA(e.target.checked)}
                      className="rounded border-[#06243D]/30 text-[#06243D] focus:ring-[#F5A044]"
                    />
                    <span>Enable 2FA Hardware Token</span>
                  </label>
                  <span className="text-[10px] text-[#06243D]/50 uppercase font-mono">Optional</span>
                </div>

                {require2FA && (
                  <div className="mt-2.5 p-3 bg-[#FFF4E3]/50 rounded-lg border border-[#F5A044]/30">
                    <label className="block text-xs font-semibold text-[#06243D] mb-1">
                      Security Token Code (6 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="849201"
                      className="w-full px-3 py-1.5 text-sm bg-white border border-[#06243D]/20 rounded-md font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#F5A044]"
                    />
                    <p className="text-[10px] text-[#17202A]/60 mt-1">
                      Time-based hardware OTP from institutional keyfob.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#06243D] text-white hover:bg-[#06243D]/90 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying System Credentials...</span>
                ) : (
                  <>
                    <span>Enter Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#F5A044]" />
                  </>
                )}
              </button>

              {/* Quick pre-fill demo shortcut */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="w-full py-2 px-3 bg-[#FFF4E3] border border-[#F5A044]/30 hover:border-[#F5A044] text-[#06243D] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F5A044]" />
                  <span>One-Click Demo: Dr. R. Ramanathan (Chief Admin)</span>
                </button>
              </div>
            </form>
          )}

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-[#06243D]/10 text-center">
            <p className="text-[11px] text-[#17202A]/60">
              Institutional encrypted session · UHF EPC Gen2 Standard · Audit compliant
            </p>
          </div>
        </div>
      </div>

      {/* Institutional bottom disclaimer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-[#17202A]/50">
        AttendX Attendance Management System · Campus License
      </div>
    </div>
  );
};
