import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'dark', 
  size = 'md',
  showSubtitle = false 
}) => {
  const isLight = variant === 'light';
  
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }[size];

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* AttendX Logo Icon: Minimal ID Card + Directional RFID Portal Waves & Checkmark */}
      <div className={`relative ${iconSizeClasses} rounded-lg flex items-center justify-center font-bold overflow-hidden shadow-xs transition-transform duration-200 hover:scale-105 ${
        isLight ? 'bg-white text-[#06243D]' : 'bg-[#06243D] text-[#FFF4E3]'
      }`}>
        <svg 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full p-1.5"
        >
          {/* Card outline */}
          <rect 
            x="5" 
            y="6" 
            width="26" 
            height="24" 
            rx="3" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="none"
          />
          {/* RFID contact/antenna strip */}
          <line 
            x1="5" 
            y1="13" 
            x2="31" 
            y2="13" 
            stroke={isLight ? '#F5A044' : '#F5A044'} 
            strokeWidth="1.75" 
          />
          {/* Automatic RFID Entry Vector Arrow */}
          <path 
            d="M12 21L17 25L24 18" 
            stroke={isLight ? '#06243D' : '#FFF4E3'} 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* UHF Radio wave arch */}
          <path 
            d="M23 8.5C24.2 9.5 25 10.9 25 12.5" 
            stroke="#F5A044" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight ${textSizeClasses} ${isLight ? 'text-white' : 'text-[#06243D]'}`}>
          Attend<span className="text-[#F5A044]">X</span>
        </span>
        {showSubtitle && (
          <span className={`text-[10px] uppercase font-mono tracking-widest mt-1 ${isLight ? 'text-[#FFF4E3]/70' : 'text-[#06243D]/60'}`}>
            UHF RFID Attendance
          </span>
        )}
      </div>
    </div>
  );
};
