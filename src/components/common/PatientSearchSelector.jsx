import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, User, Phone, Check, X, UserPlus, AlertCircle } from 'lucide-react';

export default function PatientSearchSelector({
  selectedPatient,
  onSelectPatient,
  onClearPatient,
  label = "Select Patient *",
  required = true
}) {
  const { patients, setIsAddPatientOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter patients based on name, phone, or id (UHID)
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const cleanPhone = (patient.phone || '').replace(/\D/g, '');
    const cleanQ = q.replace(/\D/g, '');

    const nameMatch = patient.name.toLowerCase().includes(q);
    const idMatch = (patient.id || '').toLowerCase().includes(q);
    const phoneMatch = patient.phone.toLowerCase().includes(q) || (cleanQ.length > 2 && cleanPhone.includes(cleanQ));

    return nameMatch || idMatch || phoneMatch;
  });

  const getInitials = (name) => {
    if (!name) return 'PT';
    return name
      .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '')
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setIsAddPatientOpen(true);
          }}
          className="text-[11px] font-bold text-[#1769D2] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <UserPlus size={12} />
          <span>+ Register New Patient</span>
        </button>
      </div>

      {selectedPatient ? (
        /* Selected Patient Card */
        <div className="flex items-center justify-between p-3 rounded-2xl border border-blue-200 bg-blue-50/50 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#1769D2] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
              {getInitials(selectedPatient.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-[#102A50] truncate">
                  {selectedPatient.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                  {selectedPatient.id}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" />
                  {selectedPatient.phone}
                </span>
                {selectedPatient.age && (
                  <span>• {selectedPatient.gender}, {selectedPatient.age} yrs</span>
                )}
                {selectedPatient.bloodGroup && (
                  <span>• {selectedPatient.bloodGroup}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClearPatient();
              setSearchQuery('');
              setIsOpen(true);
            }}
            className="text-[11px] font-bold text-slate-500 hover:text-red-600 px-2.5 py-1 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer shrink-0 ml-2"
          >
            Change
          </button>
        </div>
      ) : (
        /* Search Input and Dropdown */
        <div className="relative">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search patient by Name, Mobile Number, or UHID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-[#102A50] placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#1769D2] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dropdown Results */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-60 overflow-y-auto z-50 p-1.5 space-y-1 divide-y divide-slate-50">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Patients ({filteredPatients.length})</span>
                <span className="text-[9px] text-slate-400 normal-case">Click to select</span>
              </div>

              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => {
                      onSelectPatient(patient);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1769D2] group-hover:bg-[#1769D2] group-hover:text-white transition-colors flex items-center justify-center font-extrabold text-[11px] shrink-0">
                        {getInitials(patient.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#102A50] group-hover:text-[#1769D2] transition-colors truncate">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="font-bold text-[#1769D2]">{patient.id}</span>
                          <span>•</span>
                          <span>{patient.phone}</span>
                          {patient.age && <span>• {patient.age}y</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#1769D2] px-2 py-1 rounded-md group-hover:bg-blue-100 transition-colors shrink-0">
                      Select →
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    No registered patient found matching "{searchQuery}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsAddPatientOpen(true);
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <UserPlus size={13} />
                    <span>Register "{searchQuery}" as New Patient</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {required && !selectedPatient && (
        <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
          <AlertCircle size={11} />
          <span>Please search and select a patient to proceed.</span>
        </p>
      )}
    </div>
  );
}
