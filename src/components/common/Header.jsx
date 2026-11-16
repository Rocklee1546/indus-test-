import React, { useState, useRef, useEffect } from 'react';
import { useApp, USERS } from '../../context/AppContext';
import {
  Search,
  Building2,
  Calendar,
  Plus,
  UserPlus,
  CalendarPlus,
  UserCheck,
  Receipt,
  CheckCircle2,
  ChevronDown,
  X,
  ArrowRight
} from 'lucide-react';

// ── Live date helper (uses local calendar date, no UTC offset issues) ─────────
function getLocalDateString() {
  const now = new Date();
  const day = now.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `Today, ${String(day).padStart(2, '0')} ${month} ${year}`;
}

export default function Header() {
  const {
    currentUser,
    globalSearchQuery,
    setGlobalSearchQuery,
    searchResults,
    setIsAddPatientOpen,
    setIsBookCheckInOpen,
    setIsBookApptSlotOpen,
    setIsAddLeadOpen,
    setIsNewInvoiceOpen,
    setPatient360Data,
    setActivePatientId,
    setActiveModule
  } = useApp();

  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen]   = useState(false);

  // ── Live date state: recalculates every minute and also at midnight ────────
  const [dateLabel, setDateLabel] = useState(getLocalDateString());

  useEffect(() => {
    // Update immediately in case component mounted after a date change
    setDateLabel(getLocalDateString());

    // Recalculate every 60 seconds so the date stays accurate
    const interval = setInterval(() => {
      setDateLabel(getLocalDateString());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close quick menu on click outside
  useEffect(() => {
    function handleClickOutside() {
      setShowQuickMenu(false);
    }
    if (showQuickMenu) {
      document.addEventListener('click', handleClickOutside, true);
    }
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [showQuickMenu]);

  const totalResults =
    searchResults.patients.length +
    searchResults.leads.length +
    searchResults.appointments.length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">

      {/* ── Left: Global Search Bar ── */}
      <div className="flex items-center gap-4 flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => {
              setGlobalSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search leads, patients, UHID (e.g. IND-0292), phone..."
            className="w-full bg-[#F4F7FC] hover:bg-[#EEF5FF] focus:bg-white text-xs font-medium text-slate-800 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-transparent focus:border-[#1769D2] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          {globalSearchQuery && (
            <button
              onClick={() => {
                setGlobalSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Global Search Dropdown Results */}
        {isSearchOpen && globalSearchQuery.trim() && (
          <div className="absolute top-12 left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 max-h-96 overflow-y-auto z-50">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Search Results ({totalResults})</span>
              <span className="text-[10px] text-blue-600 font-semibold">Press Esc to close</span>
            </div>

            {totalResults === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching leads or patients found for "{globalSearchQuery}"
              </div>
            ) : (
              <div className="space-y-3 mt-1">
                {/* Patients Results */}
                {searchResults.patients.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-[#1769D2] uppercase tracking-wider px-2">
                      Patients ({searchResults.patients.length})
                    </span>
                    <div className="mt-1 space-y-1">
                      {searchResults.patients.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setPatient360Data(p);
                            setActivePatientId(p.id);
                            setIsSearchOpen(false);
                            setGlobalSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#EEF5FF] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1769D2] flex items-center justify-center font-bold text-xs">
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-[#102A50]">{p.name}</div>
                              <div className="text-[11px] text-slate-500">{p.id} • {p.phone} • {p.gender}, {p.age}y</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-[#1769D2] flex items-center gap-1">
                            View 360° <ArrowRight size={12} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leads Results */}
                {searchResults.leads.length > 0 && (
                  <div className="border-t border-slate-100 pt-2">
                    <span className="text-[10px] font-bold text-[#12B89A] uppercase tracking-wider px-2">
                      Leads ({searchResults.leads.length})
                    </span>
                    <div className="mt-1 space-y-1">
                      {searchResults.leads.map(l => (
                        <div
                          key={l.id}
                          onClick={() => {
                            setActiveModule('leads');
                            setIsSearchOpen(false);
                            setGlobalSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#12B89A] flex items-center justify-center font-bold text-xs">
                              {l.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-[#102A50]">{l.name}</div>
                              <div className="text-[11px] text-slate-500">{l.id} • {l.treatment} • {l.phone}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {l.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right Controls: Branch, Date, Quick Action, Profile ── */}
      <div className="flex items-center gap-3">

        {/* Clinic Indicator */}
        <div className="flex items-center gap-1.5 bg-[#EEF5FF] border border-blue-200/60 rounded-xl px-3 py-1.5">
          <Building2 className="w-4 h-4 text-[#1769D2]" />
          <span className="text-xs font-bold text-[#102A50]">INDUS Dental – Coimbatore</span>
        </div>

        {/* Live Date Badge (uses local system date, updates every minute) */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{dateLabel}</span>
        </div>

        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowQuickMenu(v => !v); }}
            className="flex items-center gap-2 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Quick Action</span>
            <ChevronDown size={14} />
          </button>

          {showQuickMenu && (
            <div
              onClick={e => e.stopPropagation()}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Fast Clinical Actions
              </div>
              <button
                onClick={() => { setIsAddPatientOpen(true); setShowQuickMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <UserPlus size={16} className="text-[#1769D2]" />
                <span>Add New Patient (IND-ID)</span>
              </button>
              <button
                onClick={() => { setIsBookCheckInOpen(true); setShowQuickMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <UserCheck size={16} className="text-[#12B89A]" />
                <span>Instant Check-In to Queue</span>
              </button>
              <button
                onClick={() => { setIsBookApptSlotOpen(true); setShowQuickMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <CalendarPlus size={16} className="text-[#7955D9]" />
                <span>Book Appointment Slot</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => { setIsAddLeadOpen(true); setShowQuickMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <Plus size={16} className="text-amber-500" />
                <span>Register New Lead / Enquiry</span>
              </button>
              <button
                onClick={() => { setIsNewInvoiceOpen(true); setShowQuickMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <Receipt size={16} className="text-emerald-600" />
                <span>Create Tax Invoice</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-bold text-[#102A50] leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {currentUser.title || 'INDUS Dental'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
