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
  ArrowRight,
  Check,
  Settings,
  Stethoscope
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
    doctors,
    selectDoctorProfile,
    setSettingsTab,
    globalSearchQuery,
    setGlobalSearchQuery,
    searchResults,
    setIsAddPatientOpen,
    setIsBookCheckInOpen,
    setCheckInPatientModalData,
    setIsBookApptSlotOpen,
    setApptToBookPatient,
    setLeadToBookAppt,
    setIsAddLeadOpen,
    setIsNewInvoiceOpen,
    setPatient360Data,
    setActivePatientId,
    setActiveModule
  } = useApp();

  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);
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
  const quickMenuRef = useRef(null);
  const doctorMenuRef = useRef(null);

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
    function handleQuickMenuOutside(event) {
      if (quickMenuRef.current && !quickMenuRef.current.contains(event.target)) {
        setShowQuickMenu(false);
      }
    }
    if (showQuickMenu) {
      document.addEventListener('mousedown', handleQuickMenuOutside);
    }
    return () => document.removeEventListener('mousedown', handleQuickMenuOutside);
  }, [showQuickMenu]);

  // Close doctor menu on click outside
  useEffect(() => {
    function handleDoctorMenuOutside(event) {
      if (doctorMenuRef.current && !doctorMenuRef.current.contains(event.target)) {
        setShowDoctorMenu(false);
      }
    }
    if (showDoctorMenu) {
      document.addEventListener('mousedown', handleDoctorMenuOutside);
    }
    return () => document.removeEventListener('mousedown', handleDoctorMenuOutside);
  }, [showDoctorMenu]);

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
        <div className="relative" ref={quickMenuRef}>
          <button
            onClick={() => setShowQuickMenu(v => !v)}
            className="flex items-center gap-2 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Quick Action</span>
            <ChevronDown size={14} />
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                Fast Clinical Actions
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddPatientOpen(true);
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <UserPlus size={16} className="text-[#1769D2]" />
                <span>Add New Patient (IND-ID)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCheckInPatientModalData(null);
                  setIsBookCheckInOpen(true);
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <UserCheck size={16} className="text-[#12B89A]" />
                <span>Instant Check-In to Queue</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setApptToBookPatient(null);
                  setLeadToBookAppt(null);
                  setIsBookApptSlotOpen(true);
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <CalendarPlus size={16} className="text-[#7955D9]" />
                <span>Book Appointment Slot</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={() => {
                  setIsAddLeadOpen(true);
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <Plus size={16} className="text-amber-500" />
                <span>Register New Lead / Enquiry</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNewInvoiceOpen(true);
                  setShowQuickMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#102A50] hover:bg-[#EEF5FF] hover:text-[#1769D2] rounded-xl transition-colors cursor-pointer text-left"
              >
                <Receipt size={16} className="text-emerald-600" />
                <span>Create Tax Invoice</span>
              </button>
            </div>
          )}
        </div>

        {/* Doctor Profile Switcher (Synchronized with Doctor Management) */}
        <div className="relative" ref={doctorMenuRef}>
          <button
            type="button"
            onClick={() => setShowDoctorMenu(prev => !prev)}
            className={`flex items-center gap-2.5 pl-3 pr-2 py-1.5 border-l border-slate-200 rounded-2xl transition-all cursor-pointer group text-left ${
              showDoctorMenu ? 'bg-blue-50/80 ring-2 ring-blue-100' : 'hover:bg-slate-50'
            }`}
            title="Click to Switch Doctor Profile"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/25 group-hover:ring-blue-500 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div className="hidden lg:flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#102A50] leading-tight group-hover:text-[#1769D2] transition-colors truncate max-w-[140px]">
                  {currentUser.name}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-slate-400 group-hover:text-[#1769D2] transition-transform duration-200 shrink-0 ${
                    showDoctorMenu ? 'rotate-180 text-[#1769D2]' : ''
                  }`}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-medium leading-tight truncate max-w-[150px]">
                {currentUser.title || currentUser.role || 'Chief Dental Surgeon'}
              </span>
            </div>
          </button>

          {/* Doctor Switcher Dropdown Modal */}
          {showDoctorMenu && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Stethoscope size={16} className="text-[#1769D2]" />
                  <div>
                    <h3 className="text-xs font-extrabold text-[#102A50] leading-tight">Switch Doctor Profile</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Select practicing clinician for this session</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  {doctors.filter(d => (d.status || 'Active') === 'Active').length} Active
                </span>
              </div>

              {/* Doctors List */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {doctors.map((doc) => {
                  const isCurrent = doc.id === currentUser.id;
                  const isInactive = doc.status === 'Inactive';

                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        if (isInactive) return;
                        selectDoctorProfile(doc.id);
                        setShowDoctorMenu(false);
                      }}
                      className={`p-2 rounded-xl flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-blue-50/90 border border-blue-200/80 shadow-xs'
                          : isInactive
                          ? 'opacity-50 cursor-not-allowed bg-slate-50/60 border border-dashed border-slate-200'
                          : 'hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ${
                            isCurrent
                              ? 'bg-[#1769D2] text-white ring-2 ring-blue-400'
                              : isInactive
                              ? 'bg-slate-200 text-slate-500'
                              : 'bg-blue-100 text-[#1769D2]'
                          }`}
                        >
                          {doc.avatar ? (
                            <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold truncate ${isCurrent ? 'text-[#1769D2]' : 'text-[#102A50]'}`}>
                              {doc.name}
                            </span>
                            {isInactive ? (
                              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 rounded">Inactive</span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active Doctor" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                            {doc.role || doc.specialty || 'Dental Surgeon'}
                          </p>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#1769D2] bg-white px-2 py-0.5 rounded-lg border border-blue-200 shrink-0">
                          <Check size={12} />
                          <span>Active</span>
                        </span>
                      ) : !isInactive ? (
                        <span className="text-[10px] font-bold text-slate-400 hover:text-[#1769D2] transition-colors shrink-0">
                          Select
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Settings Link */}
              <button
                type="button"
                onClick={() => {
                  setShowDoctorMenu(false);
                  setActiveModule('settings');
                  if (setSettingsTab) setSettingsTab('doctors');
                }}
                className="w-full mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-[#1769D2] hover:bg-blue-50/80 rounded-xl transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Settings size={14} className="text-[#1769D2]" />
                  <span>Manage Doctors in Settings</span>
                </span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
