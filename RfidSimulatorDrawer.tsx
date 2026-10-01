import React, { useState } from 'react';
import { Radio, CheckCircle2, ArrowRight, Zap, X, Shield, Bell } from 'lucide-react';
import { ENROLLED_STUDENTS_LIST, ALL_CLASSROOMS } from '../../data/mockData';

interface RfidSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateEvent: (studentId: string, room: string, actionType: 'entry' | 'exit') => void;
}

export const RfidSimulatorDrawer: React.FC<RfidSimulatorDrawerProps> = ({
  isOpen,
  onClose,
  onSimulateEvent,
}) => {
  if (!isOpen) return null;

  const [selectedStudentId, setSelectedStudentId] = useState('SEC24CSE1023');
  const [selectedRoom, setSelectedRoom] = useState('Room 204');
  const [direction, setDirection] = useState<'entry' | 'exit'>('entry');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    tagId: string;
    rssi: string;
    latency: string;
    timestamp: string;
    action: string;
  } | null>(null);

  const currentStudent = ENROLLED_STUDENTS_LIST.find(s => s.id === selectedStudentId) || ENROLLED_STUDENTS_LIST[0];

  const handleTriggerWalkthrough = () => {
    setIsSimulating(true);
    setSimResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSimResult({
        tagId: currentStudent.tagId,
        rssi: '-52 dBm (Optimal)',
        latency: '14 ms',
        timestamp: timeStr,
        action: direction === 'entry' ? 'ENTRY RECORDED' : 'EXIT RECORDED'
      });
      onSimulateEvent(currentStudent.id, selectedRoom, direction);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#06243D]/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#06243D]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF4E3] border border-[#F5A044]/50 flex items-center justify-center">
              <Radio className="w-4 h-4 text-[#F5A044] animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#06243D]">
                UHF RFID Gate Simulator
              </h3>
              <p className="text-[11px] text-[#17202A]/60">
                Experience automatic contactless detection without roll call or tapping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Classroom Portal Graphic */}
        <div className="relative p-5 bg-[#06243D] text-white rounded-xl border border-[#06243D] overflow-hidden flex flex-col items-center justify-center text-center">
          
          {/* Animated portal antenna wave arcs */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isSimulating ? 'opacity-100' : 'opacity-20'} transition-opacity`}>
            <div className={`w-32 h-32 rounded-full border border-[#F5A044] ${isSimulating ? 'animate-ping' : ''}`} />
            <div className={`absolute w-48 h-48 rounded-full border border-[#F5A044]/60 ${isSimulating ? 'animate-pulse' : ''}`} />
          </div>

          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5A044]">
              PORTAL: {selectedRoom} · FIXED READER 01
            </div>
            <div className="text-sm font-bold text-white">
              {direction === 'entry' ? 'Doorway Entry Detection Vector' : 'Doorway Exit Detection Vector'}
            </div>
            <p className="text-[11px] text-[#FFF4E3]/70 max-w-xs">
              Antenna continuously scans 865.7 MHz RF field. Any passive tag passing through is harvested and read in &lt;20ms.
            </p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-[#06243D] mb-1">
              Select Passing Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
            >
              {ENROLLED_STUDENTS_LIST.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} — {std.id} ({std.dept})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#06243D] mb-1">
                Classroom Portal
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#17202A] focus:outline-none focus:ring-1 focus:ring-[#F5A044]"
              >
                {ALL_CLASSROOMS.map((cr) => (
                  <option key={cr.id} value={cr.room}>{cr.room}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#06243D] mb-1">
                Walk Direction
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDirection('entry')}
                  className={`py-1 rounded text-center font-medium transition-colors cursor-pointer ${
                    direction === 'entry' ? 'bg-[#06243D] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Walking In
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('exit')}
                  className={`py-1 rounded text-center font-medium transition-colors cursor-pointer ${
                    direction === 'exit' ? 'bg-[#06243D] text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Walking Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <div>
          <button
            type="button"
            onClick={handleTriggerWalkthrough}
            disabled={isSimulating}
            className="w-full py-3 px-4 bg-[#06243D] hover:bg-[#06243D]/90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Zap className="w-4 h-4 text-[#F5A044] animate-spin" />
                <span>Interrogating Tag via RF Beam...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 text-[#F5A044]" />
                <span>Simulate Student Passing Through Portal</span>
              </>
            )}
          </button>
        </div>

        {/* Detection Feedback result */}
        {simResult && (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between font-bold text-emerald-800">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tag Detected Successfully!</span>
              </span>
              <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {simResult.action}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-emerald-900/80 font-mono">
              <div>Student: {currentStudent.name}</div>
              <div>Timestamp: {simResult.timestamp}</div>
              <div>EPC: {simResult.tagId}</div>
              <div>Capture Latency: {simResult.latency}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
