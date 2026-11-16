import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Phone,
  Calendar,
  PenTool,
  ArrowRight,
  ShieldAlert,
  Building2,
  FileText,
  Receipt,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  CalendarRange,
  X,
  FileSpreadsheet
} from 'lucide-react';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import {
  QUICK_DATE_OPTIONS,
  parsePatientDateToYMD,
  computeQuickDateRange,
  isDateWithinRange
} from '../../utils/dateFilterUtils';

export default function PatientsModule() {
  const {
    patients,
    filteredPatients,
    selectedBranch,
    branches,
    setIsAddPatientOpen,
    setPatient360Data,
    setActivePatientId,
    setActiveModule,
    checkInPatient,
    deletePatient,
    openBookAppointment,
    getActiveVisitForPatient,
    isPatientCheckedIn,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [patientViewFilter, setPatientViewFilter] = useState('ACTIVE'); // 'ACTIVE' (Default), 'CHECKED_IN', 'ALL'

  // Date Filter State
  const [quickDate, setQuickDate] = useState('ALL');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [appliedDateRange, setAppliedDateRange] = useState({ from: '', to: '' });

  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Delete Modal State
  const [patientToDelete, setPatientToDelete] = useState(null);

  const isSearching = searchQuery.trim().length > 0;

  // Active / Checked-in counts (based on filteredPatients, which already excludes soft-deleted records)
  const activeCount = filteredPatients.filter(p => !isPatientCheckedIn(p.id, p.name)).length;
  const checkedInCount = filteredPatients.filter(p => isPatientCheckedIn(p.id, p.name)).length;
  const totalCount = filteredPatients.length;

  const filtered = filteredPatients.filter(patient => {
    const isCheckedIn = isPatientCheckedIn(patient.id, patient.name);

    // Apply view filter ONLY when NOT searching
    if (!isSearching) {
      if (patientViewFilter === 'ACTIVE' && isCheckedIn) return false;
      if (patientViewFilter === 'CHECKED_IN' && !isCheckedIn) return false;
    }

    const matchesSearch = !isSearching || (
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
    );

    const matchesBlood = bloodGroupFilter === 'ALL' || patient.bloodGroup === bloodGroupFilter;

    // Registration Date Filter
    const patientYMD = parsePatientDateToYMD(patient);
    const matchesDate = isDateWithinRange(patientYMD, appliedDateRange.from, appliedDateRange.to);

    return matchesSearch && matchesBlood && matchesDate;
  });

  const handlePatientCheckInClick = (patient) => {
    checkInPatient(patient);
  };

  // Quick Date Handler
  const handleQuickDateChange = (val) => {
    setQuickDate(val);
    if (val === 'CUSTOM') {
      // keep current values
    } else if (val === 'ALL') {
      setCustomFromDate('');
      setCustomToDate('');
      setAppliedDateRange({ from: '', to: '' });
    } else {
      const range = computeQuickDateRange(val);
      setCustomFromDate(range.from);
      setCustomToDate(range.to);
      setAppliedDateRange(range);
    }
  };

  const handleApplyCustomDate = () => {
    setAppliedDateRange({ from: customFromDate, to: customToDate });
  };

  const handleClearDateFilter = () => {
    setQuickDate('ALL');
    setCustomFromDate('');
    setCustomToDate('');
    setAppliedDateRange({ from: '', to: '' });
  };

  // Export Data Handler
  const handleExport = (format) => {
    setIsExportMenuOpen(false);

    const headers = [
      { key: 'id', label: 'Patient ID / UHID' },
      { key: 'name', label: 'Full Name' },
      { key: 'age', label: 'Age' },
      { key: 'gender', label: 'Gender' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'email', label: 'Email Address' },
      { key: 'bloodGroup', label: 'Blood Group' },
      { key: 'referredBy', label: 'Referred By' },
      { key: 'registeredDate', label: 'Registration Date' },
      { key: 'medicalAlerts', label: 'Medical Alerts' },
      { key: 'financialStatus', label: 'Financial Status' }
    ];

    const rows = filtered.map(p => ({
      id: p.id,
      name: p.name,
      age: `${p.age || '—'} yrs`,
      gender: p.gender || '—',
      phone: p.phone,
      email: p.email || '—',
      bloodGroup: p.bloodGroup || '—',
      referredBy: p.referredBy || 'Direct Walk-in',
      registeredDate: parsePatientDateToYMD(p),
      medicalAlerts: p.medicalAlerts || (p.allergies ? p.allergies.join(', ') : 'None'),
      financialStatus: p.outstandingBalance > 0 ? `Due: ₹${p.outstandingBalance}` : 'Settled'
    }));

    const dateStamp = new Date().toISOString().split('T')[0];
    if (format === 'excel') {
      exportToExcel(headers, rows, `INDUS_Dental_Patients_${dateStamp}.xlsx`);
    } else {
      exportToCSV(headers, rows, `INDUS_Dental_Patients_${dateStamp}.csv`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">Centralised Patient Database</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              {totalCount} Registered
            </span>
            {checkedInCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{checkedInCount} In Clinic</span>
              </span>
            )}
            {appliedDateRange.from && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Registered: {appliedDateRange.from} to {appliedDateRange.to || 'Present'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single unique UHID across all clinical records, visit history, and prescriptions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export filtered patients"
            >
              <Download size={14} className="text-slate-500" />
              <span>Export</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-20 animate-in fade-in">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  <span>Export to Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#1769D2] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText size={15} className="text-[#1769D2]" />
                  <span>Export to CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>

          {/* Simplified Add Patient Button - No (IND-ID) in label */}
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Segmented View Filters with Date Filtering */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Top Filter Controls: Search & Blood Group */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient UHID (e.g. IND-0292), Full Name, Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* Date Filter Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
              <CalendarRange size={12} className="text-[#1769D2]" />
              <span>Registration Date:</span>
            </span>

            {QUICK_DATE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleQuickDateChange(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quickDate === opt.id
                    ? 'bg-[#1769D2] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          {(quickDate === 'CUSTOM' || appliedDateRange.from) && (
            <div className="flex items-center gap-2 bg-blue-50/60 p-1.5 rounded-xl border border-blue-100">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500">From:</span>
                <input
                  type="date"
                  value={customFromDate}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500">To:</span>
                <input
                  type="date"
                  value={customToDate}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleApplyCustomDate}
                className="px-2.5 py-1 bg-[#1769D2] hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                Apply
              </button>

              <button
                type="button"
                onClick={handleClearDateFilter}
                className="p-1 hover:bg-slate-200 rounded-md text-slate-500 transition-colors cursor-pointer"
                title="Clear date filter"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        {/* View Filter Segmented Pills (Active / Checked In / All) */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setPatientViewFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                patientViewFilter === 'ACTIVE' && !isSearching
                  ? 'bg-white text-[#102A50] shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Patients ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setPatientViewFilter('CHECKED_IN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                patientViewFilter === 'CHECKED_IN' && !isSearching
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {checkedInCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              )}
              <span>Checked In / In Clinic ({checkedInCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setPatientViewFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                patientViewFilter === 'ALL' && !isSearching
                  ? 'bg-white text-[#102A50] shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Patients ({totalCount})
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {isSearching ? (
              <span className="text-[#1769D2] font-bold">
                Search active across patient records ({filtered.length} found)
              </span>
            ) : patientViewFilter === 'ACTIVE' ? (
              <span>Showing active patients ready for appointment or walk-in check-in</span>
            ) : patientViewFilter === 'CHECKED_IN' ? (
              <span className="text-emerald-700 font-bold">
                Patients arrived at clinic today
              </span>
            ) : (
              <span>Showing all registered patient records</span>
            )}
          </div>
        </div>
      </div>

      {/* Patient Database Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">UHID & Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Registration & Referral</th>
                <th className="py-3 px-4">Medical Alerts</th>
                <th className="py-3 px-4">Financial Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 mx-auto flex items-center justify-center mb-2">
                      <UserCheck size={24} />
                    </div>
                    <div className="font-bold text-sm text-slate-600">No patients found matching filters</div>
                    {patientViewFilter === 'CHECKED_IN' && !isSearching && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Use "Check-In" on any active patient to mark them as arrived at the clinic.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(patient => {
                  const regDate = parsePatientDateToYMD(patient);

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      <td
                        className="py-3.5 px-4"
                        onClick={() => setPatient360Data(patient)}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isPatientCheckedIn(patient.id, patient.name)
                              ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300'
                              : 'bg-blue-100 text-[#1769D2]'
                          }`}>
                            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#102A50] group-hover:text-[#1769D2] flex items-center gap-1.5">
                              <span>{patient.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold">{patient.id}</div>

                            {/* Active Check-In Badge */}
                            {isPatientCheckedIn(patient.id, patient.name) && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>In Clinic (Checked In)</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4" onClick={() => setPatient360Data(patient)}>
                        <div className="font-semibold text-slate-800">{patient.gender}, {patient.age} yrs</div>
                        <div className="text-[10px] text-slate-400">Blood: <b className="text-slate-600">{patient.bloodGroup}</b></div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <div>{patient.phone}</div>
                        {patient.email && <div className="text-[10px] text-slate-400">{patient.email}</div>}
                      </td>

                      <td className="py-3.5 px-4" onClick={() => setPatient360Data(patient)}>
                        <div className="font-bold text-[#102A50]">{regDate}</div>
                        <div className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                          Ref: {patient.referredBy || 'Direct'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {patient.allergies?.some(a => a !== 'No known allergies' && a !== 'None') ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ShieldAlert size={11} />
                            {patient.allergies[0]}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            No Allergies
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4" onClick={() => setPatient360Data(patient)}>
                        <div className="font-bold text-slate-900">₹{patient.totalBilled?.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold ${patient.outstandingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {patient.outstandingBalance > 0 ? `Due: ₹${patient.outstandingBalance}` : 'Settled'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPatientCheckedIn(patient.id, patient.name) ? (
                            <span
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-[11px] inline-flex items-center gap-1 border border-emerald-200"
                              title="Patient is checked in at the clinic today"
                            >
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              <span>Checked In</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePatientCheckInClick(patient)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer border border-blue-200/60"
                              title="Check-In patient for today's visit"
                            >
                              Check-In
                            </button>
                          )}

                          <button
                            onClick={() => openBookAppointment(patient)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer border border-indigo-200/60"
                            title="Book Appointment for this patient"
                          >
                            <Calendar size={12} />
                            <span>Book Appt</span>
                          </button>

                          <button
                            onClick={() => setPatient360Data(patient)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="Open Patient History & Records"
                          >
                            <Clock size={12} />
                            <span>History</span>
                          </button>

                          {/* Safe Delete / Archive Button */}
                          <button
                            onClick={() => setPatientToDelete(patient)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors cursor-pointer"
                            title="Delete / Archive Patient"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete / Archive Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={() => {
          if (patientToDelete) {
            deletePatient(patientToDelete.id);
            setPatientToDelete(null);
          }
        }}
        title="Delete Patient Record"
        message="Are you sure you want to delete this patient?"
        itemName={patientToDelete ? `${patientToDelete.name} (${patientToDelete.id})` : ''}
        detailMessage="This patient record will be safely archived from the active patient list. All linked appointments, clinical records, prescriptions, and billing history will remain completely preserved."
        confirmButtonText="Delete Patient"
      />
    </div>
  );
}
