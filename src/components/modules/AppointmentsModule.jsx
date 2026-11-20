import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Clock,
  UserCheck,
  CalendarPlus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  RefreshCw,
  Eye,
  Filter,
  Users,
  Stethoscope,
  Calendar,
  ChevronDown,
  Trash2,
  X
} from 'lucide-react';

const STATUS_FILTERS = [
  'ALL',
  'Booked',
  'Confirmed',
  'Checked In',
  'Completed',
  'Cancelled',
  'Rescheduled',
  'No Show'
];

function getStatusStyle(status) {
  switch (status) {
    case 'Checked In':      return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'Completed':       return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Booked':          return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Confirmed':       return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Rescheduled':     return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Cancelled':       return 'bg-red-100 text-red-700 border-red-200';
    case 'No Show':         return 'bg-slate-100 text-slate-500 border-slate-200';
    default:                return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export default function AppointmentsModule() {
  const {
    appointments,
    filteredAppointments,
    doctors,
    openBookAppointment,
    openRescheduleAppt,
    openCancelAppt,
    updateAppointmentStatus,
    checkInAppointment,
    setPatient360Data,
    setActivePatientId,
    setWhatsAppData,
    setIsWhatsAppModalOpen,
    patients,
    deleteAppointment,
    showToast
  } = useApp();

  const [dateFilter, setDateFilter] = useState('ALL');
  const [customDate, setCustomDate] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { appt }

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  // Filtered Appointments
  const filtered = useMemo(() => {
    return filteredAppointments.filter(appt => {
      // 1. Status Filter
      const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;

      // 2. Doctor Filter
      const matchesDoc = selectedDoctorFilter === 'ALL' || appt.doctorId === selectedDoctorFilter;

      // 3. Date Filter
      let matchesDate = true;
      if (customDate) {
        matchesDate = appt.date === customDate;
      } else if (dateFilter === 'TODAY') {
        matchesDate = appt.date === todayStr || appt.date === '2026-11-06';
      } else if (dateFilter === 'TOMORROW') {
        matchesDate = appt.date === tomorrowStr;
      }

      // 4. Search Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        appt.patientName?.toLowerCase().includes(q) ||
        appt.patientId?.toLowerCase().includes(q) ||
        appt.phone?.includes(q) ||
        appt.doctorName?.toLowerCase().includes(q) ||
        appt.treatmentType?.toLowerCase().includes(q) ||
        appt.id?.toLowerCase().includes(q);

      return matchesStatus && matchesDoc && matchesDate && matchesSearch;
    });
  }, [filteredAppointments, statusFilter, selectedDoctorFilter, dateFilter, customDate, searchQuery, todayStr, tomorrowStr]);

  // Summary Metrics
  const counts = useMemo(() => {
    const all = filteredAppointments;
    return {
      total: all.length,
      today: all.filter(a => a.date === todayStr || a.date === '2026-11-06').length,
      confirmed: all.filter(a => a.status === 'Confirmed' || a.status === 'Booked').length,
      checkedIn: all.filter(a => a.status === 'Checked In').length,
      completed: all.filter(a => a.status === 'Completed').length,
      cancelled: all.filter(a => a.status === 'Cancelled' || a.status === 'No Show').length,
    };
  }, [filteredAppointments, todayStr]);

  const handleViewPatientHistory = (appt) => {
    const patient = patients.find(p => p.id === appt.patientId);
    if (patient) {
      setPatient360Data(patient);
      setActivePatientId(appt.patientId);
    } else {
      showToast(`Viewing details for ${appt.patientName} (${appt.patientId || appt.id})`);
    }
  };

  const handleOpenWhatsApp = (appt) => {
    setWhatsAppData({
      recipientName: appt.patientName,
      phone: appt.phone,
      treatment: appt.treatmentType,
      leadId: null,
      patientId: appt.patientId,
      defaultTemplateId: 'TMP-05' // Appointment Confirmation
    });
    setIsWhatsAppModalOpen(true);
  };

  const handleDeleteAppt = (appt) => {
    setDeleteConfirm(appt);
  };

  const confirmDeleteAppt = () => {
    if (deleteConfirm) {
      deleteAppointment(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-10">
      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full mx-4 border border-rose-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#102A50] text-sm">Delete Appointment?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-rose-50 rounded-2xl p-3 mb-5 text-xs text-slate-700 leading-relaxed">
              <div className="font-bold text-[#102A50]">{deleteConfirm.patientName}</div>
              <div className="text-slate-500">{deleteConfirm.id} · {deleteConfirm.date} at {deleteConfirm.time}</div>
              <div className="text-slate-500">{deleteConfirm.treatmentType} · {deleteConfirm.doctorName}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAppt}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">Appointment Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              {counts.total} Appointments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule, track, and manage dental appointments for existing and new patients
          </p>
        </div>

        <button
          onClick={() => openBookAppointment(null)}
          className="px-4 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <CalendarPlus size={16} />
          <span>+ Book Appointment</span>
        </button>
      </div>

      {/* ── Summary Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Appointments', value: counts.total, color: 'text-slate-800', bg: 'bg-white', filter: 'ALL' },
          { label: "Today's Schedule", value: counts.today, color: 'text-[#1769D2]', bg: 'bg-white', isToday: true },
          { label: 'Confirmed / Booked', value: counts.confirmed, color: 'text-indigo-700', bg: 'bg-white', filter: 'Confirmed' },
          { label: 'Checked In', value: counts.checkedIn, color: 'text-teal-700', bg: 'bg-white', filter: 'Checked In' },
          { label: 'Completed', value: counts.completed, color: 'text-emerald-700', bg: 'bg-white', filter: 'Completed' },
          { label: 'Cancelled / No Show', value: counts.cancelled, color: 'text-red-700', bg: 'bg-white', filter: 'Cancelled' },
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => {
              if (card.isToday) {
                setDateFilter('TODAY');
                setStatusFilter('ALL');
                setCustomDate('');
              } else if (card.filter) {
                setStatusFilter(card.filter);
                setDateFilter('ALL');
                setCustomDate('');
              }
            }}
            className={`${card.bg} border border-slate-200/90 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer`}
          >
            <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 leading-tight">{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Row 1: Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient Name, UHID, Mobile, Doctor, Appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Doctor Filter */}
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Doctors ({doctors.length})</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Custom Date Input */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-1">
            <Calendar size={13} className="text-slate-400" />
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setDateFilter('CUSTOM');
              }}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            />
            {customDate && (
              <button
                type="button"
                onClick={() => { setCustomDate(''); setDateFilter('ALL'); }}
                className="text-slate-400 hover:text-slate-600 text-xs ml-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Date Pills & Status Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Date Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Date:</span>
            {[
              { id: 'ALL', label: 'All Dates' },
              { id: 'TODAY', label: 'Today' },
              { id: 'TOMORROW', label: 'Tomorrow' },
            ].map(df => (
              <button
                key={df.id}
                onClick={() => { setDateFilter(df.id); setCustomDate(''); }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  dateFilter === df.id && !customDate
                    ? 'bg-[#1769D2] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {df.label}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {STATUS_FILTERS.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#102A50] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Appointments Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Appt ID</th>
                <th className="py-3 px-4">Patient Name & UHID</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Treatment / Reason</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CalendarDays size={36} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-xs text-[#102A50]">No appointments found matching your filters.</p>
                    <button
                      onClick={() => { setStatusFilter('ALL'); setDateFilter('ALL'); setCustomDate(''); setSearchQuery(''); }}
                      className="mt-2 text-xs text-[#1769D2] font-bold hover:underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(appt => {
                  const isCheckedIn = appt.status === 'Checked In';
                  const isCompleted = appt.status === 'Completed';
                  const isCancelled = appt.status === 'Cancelled' || appt.status === 'No Show';

                  return (
                    <tr key={appt.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Appt ID */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <span>{appt.id}</span>
                        {appt.type && (
                          <div className="text-[10px] text-slate-400 font-normal">{appt.type}</div>
                        )}
                      </td>

                      {/* Patient Name & UHID */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleViewPatientHistory(appt)}
                          className="font-bold text-xs text-[#102A50] hover:text-[#1769D2] transition-colors cursor-pointer text-left block"
                        >
                          {appt.patientName}
                        </button>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {appt.patientId || 'New Patient'}
                        </div>
                      </td>

                      {/* Mobile Number */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {appt.phone}
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{appt.doctorName}</div>
                        <div className="text-[10px] text-slate-400">
                          {appt.branchId === 'RS_PURAM' ? 'R.S. Puram' : (appt.branchId || 'Coimbatore')}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1769D2]">{appt.time}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{appt.date}</div>
                        {appt.checkInTime && (
                          <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                            Checked in: {appt.checkInTime}
                          </div>
                        )}
                      </td>

                      {/* Treatment / Visit Reason */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-semibold text-slate-800 truncate">{appt.treatmentType}</div>
                        {appt.notes && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{appt.notes}</div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Check In Action */}
                          {!isCheckedIn && !isCompleted && !isCancelled && (
                            <button
                              onClick={() => checkInAppointment(appt.id)}
                              title="Check In Patient"
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                            >
                              Check In
                            </button>
                          )}

                          {/* Reschedule Action */}
                          {!isCompleted && !isCancelled && (
                            <button
                              onClick={() => openRescheduleAppt(appt)}
                              title="Reschedule Appointment"
                              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Reschedule
                            </button>
                          )}

                          {/* Cancel Action */}
                          {!isCompleted && !isCancelled && (
                            <button
                              onClick={() => openCancelAppt(appt)}
                              title="Cancel Appointment"
                              className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}

                          {/* Phone Call */}
                          <button
                            onClick={() => showToast(`Calling ${appt.patientName} (${appt.phone})...`)}
                            title="Call Patient"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1769D2] transition-colors cursor-pointer"
                          >
                            <Phone size={13} />
                          </button>

                          {/* WhatsApp */}
                          <button
                            onClick={() => handleOpenWhatsApp(appt)}
                            title="Send WhatsApp Message"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <MessageCircle size={13} />
                          </button>

                          {/* View History */}
                          <button
                            onClick={() => handleViewPatientHistory(appt)}
                            title="View Patient History"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#102A50] transition-colors cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteAppt(appt)}
                            title="Delete Appointment"
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
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
    </div>
  );
}
