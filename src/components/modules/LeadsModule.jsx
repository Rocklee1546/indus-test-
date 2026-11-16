import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  UserCheck,
  CalendarPlus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Download,
  CalendarRange,
  X,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
import {
  QUICK_DATE_OPTIONS,
  parseLeadDateToYMD,
  computeQuickDateRange,
  isDateWithinRange
} from '../../utils/dateFilterUtils';

export default function LeadsModule() {
  const {
    leads,
    filteredLeads,
    patients,
    setIsAddLeadOpen,
    setLeadToConvert,
    updateLeadStatus,
    deleteLead,
    setSelectedLeadId,
    setIsLeadDetailsOpen,
    setWhatsAppData,
    setIsWhatsAppModalOpen,
    setLostLeadData,
    setIsLostLeadModalOpen,
    setLeadToBookAppt,
    setIsBookApptSlotOpen,
    setPatient360Data,
    setActivePatientId,
    leadStatuses
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'pipeline'

  // Date Filter State
  const [quickDate, setQuickDate] = useState('ALL');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [appliedDateRange, setAppliedDateRange] = useState({ from: '', to: '' });

  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Delete Modal State
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Filter leads based on search, status, priority, source, and date range
  const filtered = filteredLeads.filter(lead => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.id.toLowerCase().includes(q) ||
      lead.treatment.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || lead.priority === priorityFilter;
    const matchesSource = sourceFilter === 'ALL' || lead.source === sourceFilter;

    const leadYMD = parseLeadDateToYMD(lead);
    const matchesDate = isDateWithinRange(leadYMD, appliedDateRange.from, appliedDateRange.to);

    return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesDate;
  });

  const handleOpenLead = (leadId) => {
    setSelectedLeadId(leadId);
    setIsLeadDetailsOpen(true);
  };

  const handleStatusChange = (lead, newStatus) => {
    if (newStatus === 'Lost Lead') {
      setLostLeadData({ leadId: lead.id, leadName: lead.name });
      setIsLostLeadModalOpen(true);
      return;
    }
    updateLeadStatus(lead.id, newStatus);
  };

  const handleOpenWhatsApp = (lead) => {
    setWhatsAppData({
      recipientName: lead.name,
      phone: lead.phone,
      treatment: lead.treatment,
      leadId: lead.id,
      patientId: null,
      defaultTemplateId: lead.status === 'New' ? 'TMP-01' : 'TMP-04'
    });
    setIsWhatsAppModalOpen(true);
  };

  const handleViewPatientProfile = (patientId) => {
    const p = patients.find(pat => pat.id === patientId);
    if (p) {
      setPatient360Data(p);
    } else {
      setActivePatientId(patientId);
    }
  };

  // Quick Date Handler
  const handleQuickDateChange = (val) => {
    setQuickDate(val);
    if (val === 'CUSTOM') {
      // keep custom input values
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
      { key: 'id', label: 'Lead ID' },
      { key: 'name', label: 'Lead Name' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'email', label: 'Email Address' },
      { key: 'treatment', label: 'Interested Treatment' },
      { key: 'source', label: 'Lead Source' },
      { key: 'priority', label: 'Priority' },
      { key: 'status', label: 'Pipeline Status' },
      { key: 'enquiryDate', label: 'Enquiry Created Date' },
      { key: 'nextFollowup', label: 'Next Follow-up Date' },
      { key: 'remarks', label: 'Enquiry Remarks & Notes' }
    ];

    const rows = filtered.map(l => ({
      ...l,
      enquiryDate: parseLeadDateToYMD(l),
      nextFollowup: l.nextFollowup || '—',
      remarks: l.remarks || l.nextAction || ''
    }));

    const dateStamp = new Date().toISOString().split('T')[0];
    if (format === 'excel') {
      exportToExcel(headers, rows, `INDUS_Dental_Leads_${dateStamp}.xlsx`);
    } else {
      exportToCSV(headers, rows, `INDUS_Dental_Leads_${dateStamp}.csv`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">Leads Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              {filtered.length} Leads
            </span>
            {appliedDateRange.from && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Filtered: {appliedDateRange.from} to {appliedDateRange.to || 'Present'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, nurture, and convert leads into confirmed appointments
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#102A50] shadow-xs' : 'text-slate-500'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'pipeline' ? 'bg-white text-[#102A50] shadow-xs' : 'text-slate-500'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Export filtered leads"
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

          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar with Date Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Top Filter Controls: Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, phone, treatment, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({leads.filter(l => !l.isDeleted).length})</option>
            {leadStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Hot">🔥 Hot</option>
            <option value="Warm">⚡ Warm</option>
            <option value="Cold">❄️ Cold</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Sources</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Meta Ads">Meta / Insta Ads</option>
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Phone Calls">Phone Calls</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Referrals">Referrals</option>
          </select>
        </div>

        {/* Date Filter Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
              <CalendarRange size={12} className="text-[#1769D2]" />
              <span>Enquiry Date:</span>
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

          {/* Custom Date Inputs (when Custom Range selected or applied) */}
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
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lead ID & Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Interested Treatment</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 cursor-pointer" onClick={() => handleOpenLead(lead.id)}>
                      <div className="font-extrabold text-xs text-[#102A50] hover:text-[#1769D2] flex items-center gap-1">
                        <span>{lead.name}</span>
                        <ChevronRight size={12} className="text-slate-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        {lead.id} • {lead.date}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <div>{lead.phone}</div>
                      {lead.email && <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{lead.email}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1769D2] bg-[#EEF5FF] px-2.5 py-1 rounded-lg">
                        {lead.treatment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{lead.source}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{lead.assignedTo || 'Front Desk'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lead.priority === 'Hot' ? 'bg-rose-100 text-rose-700' :
                        lead.priority === 'Warm' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {lead.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border-none outline-none cursor-pointer ${
                          lead.status === 'Converted to Patient'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'Lost Lead'
                            ? 'bg-rose-100 text-rose-800'
                            : lead.status === 'Appointment Booked'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenLead(lead.id)}
                          className="p-1.5 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                          title="Call / View Details"
                        >
                          <Phone size={13} />
                        </button>

                        <button
                          onClick={() => handleOpenWhatsApp(lead)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                          title="WhatsApp Lead"
                        >
                          <MessageSquare size={13} />
                        </button>

                        {/* If ALREADY converted: DO NOT SHOW Convert button! Show Patient Profile */}
                        {lead.status === 'Converted to Patient' ? (
                          <button
                            onClick={() => handleViewPatientProfile(lead.convertedPatientId || 'IND-0294')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-extrabold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            title="View Converted Patient Profile"
                          >
                            <UserCheck size={12} className="text-emerald-600" />
                            <span>{lead.convertedPatientId || 'IND-0294'} Profile</span>
                          </button>
                        ) : lead.status === 'Lost Lead' ? (
                          <span className="text-[10px] font-bold text-rose-600 px-2 py-1 bg-rose-50 rounded-lg">
                            Lost
                          </span>
                        ) : (
                          /* Eligible stage: show Convert button */
                          <button
                            onClick={() => setLeadToConvert(lead)}
                            className="px-2.5 py-1 rounded-lg bg-[#16A779] hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title="Convert to Registered Patient"
                          >
                            <UserCheck size={12} />
                            <span>Convert</span>
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => setLeadToDelete(lead)}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 mx-auto flex items-center justify-center mb-2">
                        <Users2 size={24} />
                      </div>
                      <div className="font-bold text-sm text-slate-600">No leads found matching current filters</div>
                      <div className="text-xs text-slate-400 mt-1">Try clearing date or status filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Kanban Pipeline Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {leadStatuses.map(status => {
            const columnLeads = filtered.filter(l => l.status === status);
            return (
              <div
                key={status}
                className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[210px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="font-bold text-xs text-[#102A50] truncate">{status}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white border border-slate-200 text-slate-600 shadow-xs">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 flex-1">
                  {columnLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div
                            onClick={() => handleOpenLead(lead.id)}
                            className="font-extrabold text-xs text-[#102A50] hover:text-[#1769D2] cursor-pointer"
                          >
                            {lead.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">{lead.id}</div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          lead.priority === 'Hot' ? 'bg-rose-50 text-rose-600' :
                          lead.priority === 'Warm' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {lead.priority}
                        </span>
                      </div>

                      <div className="text-[11px] font-bold text-[#1769D2] bg-blue-50/60 px-2 py-0.5 rounded-md truncate">
                        {lead.treatment}
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium">
                        📞 {lead.phone}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenLead(lead.id)}
                            className="text-slate-400 hover:text-blue-600"
                            title="Call Lead"
                          >
                            <Phone size={12} />
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            onClick={() => handleOpenWhatsApp(lead)}
                            className="text-slate-400 hover:text-emerald-600"
                            title="WhatsApp"
                          >
                            <MessageSquare size={12} />
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            onClick={() => setLeadToDelete(lead)}
                            className="text-slate-400 hover:text-rose-600"
                            title="Delete Lead"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Column-specific smart action */}
                        {lead.status === 'Converted to Patient' ? (
                          <button
                            onClick={() => handleViewPatientProfile(lead.convertedPatientId || 'IND-0294')}
                            className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Profile</span>
                            <ExternalLink size={10} />
                          </button>
                        ) : lead.status === 'Lost Lead' ? (
                          <span className="text-[9px] font-bold text-rose-600 truncate max-w-[80px]">
                            Lost
                          </span>
                        ) : (
                          <button
                            onClick={() => setLeadToConvert(lead)}
                            className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                          >
                            Convert →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="h-28 flex items-center justify-center text-[11px] text-slate-400 italic">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={() => {
          if (leadToDelete) {
            deleteLead(leadToDelete.id);
            setLeadToDelete(null);
          }
        }}
        title="Delete Lead"
        message="Are you sure you want to delete this lead?"
        itemName={leadToDelete ? `${leadToDelete.name} (${leadToDelete.id}) • ${leadToDelete.treatment}` : ''}
        detailMessage="This lead will be removed from the active Leads list and pipeline. If this lead has already been converted to a patient, the patient's profile and appointments will remain completely safe."
        confirmButtonText="Delete Lead"
      />
    </div>
  );
}
