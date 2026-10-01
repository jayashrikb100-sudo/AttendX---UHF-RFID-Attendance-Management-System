import React from 'react';
import { Logo } from './Logo';
import { Radio } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'student' | 'admin' | 'login';
  onNavigate: (view: 'landing' | 'student' | 'admin' | 'login', loginRole?: 'student' | 'admin') => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenSimulator 
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#06243D]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A044] rounded-md transition-opacity hover:opacity-90"
          aria-label="AttendX Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#17202A]/80">
          <button 
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-[#06243D] ${currentView === 'landing' ? 'text-[#06243D] font-semibold' : ''}`}
          >
            Overview
          </button>
          <a 
            href="#how-it-works"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#06243D]"
          >
            How It Works
          </a>
          <a 
            href="#hardware"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('hardware')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#06243D]"
          >
            RFID Architecture
          </a>
          <a 
            href="#security"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#06243D]"
          >
            Security & Audit
          </a>
          <a 
            href="#use-cases"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="transition-colors hover:text-[#06243D]"
          >
            Use Cases
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Interactive RFID Simulator Trigger */}
          <button
            onClick={onOpenSimulator}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#06243D] bg-[#FFF4E3] border border-[#F5A044]/40 rounded-lg hover:bg-[#F5A044]/20 transition-all cursor-pointer whitespace-nowrap"
            title="Simulate student walking past classroom UHF RFID portal"
          >
            <Radio className="w-3.5 h-3.5 text-[#F5A044] animate-pulse" />
            <span>Test RFID Gate</span>
          </button>

          {/* Student Login Button */}
          <button 
            onClick={() => onNavigate('login', 'student')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border whitespace-nowrap cursor-pointer ${
              currentView === 'student'
                ? 'bg-[#06243D] text-white border-[#06243D]'
                : 'text-[#06243D] bg-white border-[#06243D]/20 hover:bg-[#FFF4E3]/40'
            }`}
          >
            Student Login
          </button>

          {/* Admin Login Button */}
          <button 
            onClick={() => onNavigate('login', 'admin')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs ${
              currentView === 'admin'
                ? 'bg-[#F5A044] text-[#06243D] font-bold'
                : 'bg-[#06243D] text-white hover:bg-[#06243D]/90'
            }`}
          >
            Admin Login
          </button>
        </div>

      </div>
    </header>
  );
};
