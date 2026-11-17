import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Shield,
  MessageSquare,
  Key,
  CheckCircle2,
  Clock,
  Save,
  Lock,
  UserCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  Stethoscope,
  AlertCircle
} from 'lucide-react';

const PRESET_ROLES = [
  'Chief Dental Surgeon',
  'Senior Dentist',
  'Dental Surgeon',
  'Orthodontist',
  'Endodontist',
  'Periodontist',
  'Oral Surgeon',
  'Associate Dentist',
  'Other (Custom Role)'
];

export default function SettingsModule() {
  const {
    doctors,
    addDoctor,
    updateDoctor,
    toggleDoctorStatus,
    deleteDoctor,
    appointments,
    showToast,
    settingsTab,
    setSettingsTab
  } = useApp();

  const [activeTab, setActiveTab] = useState(settingsTab || 'general');

  useEffect(() => {
    if (settingsTab) {
      setActiveTab(settingsTab);
    }
  }, [settingsTab]);

  // Doctor Modal State
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null); // null = Add, obj = Edit
  const [docForm, setDocForm] = useState({
    name: '',
    rolePreset: 'Dental Surgeon',
    customRole: '',
    phone: '',
    email: '',
    status: 'Active'
  });

  // Doctor Delete Confirm Modal State
  const [deleteConfirmDoctor, setDeleteConfirmDoctor] = useState(null);

  const auditLogs = [
    { time: '10:50 AM', user: 'Sneha R (Reception)', action: 'Registered Patient IND-0292 (Mr Gokul)', module: 'Patient Registration' },
    { time: '11:05 AM', user: 'Dr. Priya Sharma', action: 'Created Root Canal Treatment Plan for Tooth 46', module: 'Consultation' },
    { time: '11:15 AM', user: 'Dr. Priya Sharma', action: 'Signed & Finalized Treatment Note TX-9041', module: 'Draw & Explain' },
    { time: '11:20 AM', user: 'Praveen M (Billing)', action: 'Issued Tax Invoice IND-INV-082 (₹6,500)', module: 'Billing' },
    { time: '09:30 AM', user: 'Deepak Raj (Reception)', action: 'Scheduled Follow-up Reminders for Today', module: 'Follow-ups' },
    { time: '09:00 AM', user: 'Karthik S (Manager)', action: 'Stock update: 10 packs ProTaper Gold Rotary Files', module: 'Inventory' }
  ];

  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocForm({
      name: '',
      rolePreset: 'Dental Surgeon',
      customRole: '',
      phone: '',
      email: '',
      status: 'Active'
    });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc) => {
    setEditingDoctor(doc);
    const isPreset = PRESET_ROLES.includes(doc.role);
    setDocForm({
      name: doc.name || '',
      rolePreset: isPreset ? doc.role : 'Other (Custom Role)',
      customRole: isPreset ? '' : (doc.role || ''),
      phone: doc.phone || '',
      email: doc.email || '',
      status: doc.status || 'Active'
    });
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!docForm.name.trim()) {
      showToast('Doctor Name is required', 'error');
      return;
    }

    const finalRole = docForm.rolePreset === 'Other (Custom Role)'
      ? (docForm.customRole.trim() || 'Dental Surgeon')
      : docForm.rolePreset;

    const payload = {
      name: docForm.name.trim().startsWith('Dr.') ? docForm.name.trim() : `Dr. ${docForm.name.trim()}`,
      role: finalRole,
      specialty: finalRole,
      phone: docForm.phone.trim(),
      email: docForm.email.trim(),
      status: docForm.status
    };

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, payload);
    } else {
      addDoctor(payload);
    }
    setIsDoctorModalOpen(false);
  };

  const handleDeleteDoctorClick = (doc) => {
    setDeleteConfirmDoctor(doc);
  };

  const handleConfirmDeleteDoctor = () => {
    if (!deleteConfirmDoctor) return;
    deleteDoctor(deleteConfirmDoctor.id);
    setDeleteConfirmDoctor(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              System Settings & Clinic Configurations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              Super Admin Config
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure hospital branding, clinic operations, WhatsApp credentials, and security audit logs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
          {[
            { id: 'general', label: 'Clinic Profile' },
            { id: 'doctors', label: 'Doctor Management' },
            { id: 'audit_logs', label: 'HIPAA / DPDP Audit Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (setSettingsTab) setSettingsTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-white text-[#102A50] shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB 1: CLINIC PROFILE ── */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-sm font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-[#1769D2]" />
            <span>INDUS Dental Clinic Profile</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Name</label>
              <input
                type="text"
                defaultValue="INDUS Dental"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN / Registration #</label>
              <input
                type="text"
                defaultValue="33AAACI9912K1Z9 / TN-DENT-MED-4402"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Address</label>
            <input
              type="text"
              defaultValue="142, D.B. Road, R.S. Puram, Coimbatore, Tamil Nadu - 641002"
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Clinic Phone</label>
              <input
                type="text"
                defaultValue="+91 422 254 8890"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Email</label>
              <input
                type="email"
                defaultValue="contact@indusdental.in"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => showToast('Clinic configuration settings updated successfully!')}
              className="px-5 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>Save Configurations</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: DOCTOR MANAGEMENT ── */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#102A50] flex items-center gap-2">
                <Stethoscope size={18} className="text-[#1769D2]" />
                <span>Doctor Directory & Clinical Designations</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage doctor profiles, designations, and availability for appointments across all clinics
              </p>
            </div>
            <button
              onClick={handleOpenAddDoctor}
              className="px-4 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>+ Add Doctor</span>
            </button>
          </div>

          {/* Doctor Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Doctor Name</th>
                    <th className="py-3 px-4">Role / Designation</th>
                    <th className="py-3 px-4">Contact Number</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map(doc => {
                    const isActive = (doc.status || 'Active') === 'Active';
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1769D2] flex items-center justify-center font-bold text-xs shrink-0">
                              {doc.name.replace(/^Dr\.\s*/i, '').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-extrabold text-xs text-[#102A50]">{doc.name}</div>
                              <div className="text-[10px] text-slate-400">{doc.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-xs text-slate-800">
                            {doc.role || doc.specialty || 'Dental Surgeon'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-600">
                          {doc.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-slate-400" />
                              <span>{doc.phone}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {doc.email ? (
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-slate-400" />
                              <span>{doc.email}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => toggleDoctorStatus(doc.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {isActive ? '● Active' : '○ Inactive'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditDoctor(doc)}
                              className="p-1.5 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Edit Doctor"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctorClick(doc)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete Doctor"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: AUDIT LOGS ── */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
              <Lock size={15} className="text-[#1769D2]" />
              <span>Healthcare Activity & Security Audit Logs (DPDP Act Compliant)</span>
            </div>
            <span className="text-[10px] text-slate-400">Timestamped to Indian Standard Time (IST)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 w-16">{log.time}</span>
                  <div>
                    <span className="font-bold text-[#102A50]">{log.user}: </span>
                    <span className="text-slate-700">{log.action}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {log.module}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: Add / Edit Doctor ── */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1769D2] flex items-center justify-center">
                  <Stethoscope size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#102A50]">
                    {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
                  </h3>
                  <p className="text-[11px] text-slate-500">INDUS Dental Clinical Practitioner</p>
                </div>
              </div>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Priya Sharma"
                  value={docForm.name}
                  onChange={e => setDocForm({ ...docForm, name: e.target.value })}
                  className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation *</label>
                <select
                  value={docForm.rolePreset}
                  onChange={e => setDocForm({ ...docForm, rolePreset: e.target.value })}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
                >
                  {PRESET_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {docForm.rolePreset === 'Other (Custom Role)' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter Custom Role *</label>
                  <input
                    type="text"
                    placeholder="e.g. Implantologist & Maxillofacial Surgeon"
                    value={docForm.customRole}
                    onChange={e => setDocForm({ ...docForm, customRole: e.target.value })}
                    className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="+91 98422 10101"
                    value={docForm.phone}
                    onChange={e => setDocForm({ ...docForm, phone: e.target.value })}
                    className="w-full text-xs bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="doctor@indusdental.in"
                    value={docForm.email}
                    onChange={e => setDocForm({ ...docForm, email: e.target.value })}
                    className="w-full text-xs bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={docForm.status === 'Active'}
                      onChange={() => setDocForm({ ...docForm, status: 'Active' })}
                      className="text-[#1769D2]"
                    />
                    <span className="text-emerald-700">Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={docForm.status === 'Inactive'}
                      onChange={() => setDocForm({ ...docForm, status: 'Inactive' })}
                      className="text-[#1769D2]"
                    />
                    <span className="text-slate-500">Inactive</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {editingDoctor ? 'Save Changes' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Doctor Confirmation ── */}
      {deleteConfirmDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#102A50]">Delete Doctor Profile?</h3>
                <p className="text-[11px] text-slate-500">This action checks for linked appointments.</p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-3 text-xs text-slate-700 mb-5 leading-relaxed">
              <div className="font-bold text-[#102A50]">{deleteConfirmDoctor.name}</div>
              <div className="text-slate-500">{deleteConfirmDoctor.role || deleteConfirmDoctor.specialty}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {appointments.filter(a => a.doctorId === deleteConfirmDoctor.id || a.doctorName === deleteConfirmDoctor.name).length > 0 ? (
                  <span className="text-rose-700 font-semibold">
                    ⚠️ Linked to {appointments.filter(a => a.doctorId === deleteConfirmDoctor.id || a.doctorName === deleteConfirmDoctor.name).length} existing appointment(s). Deletion will be rejected and deactivation recommended.
                  </span>
                ) : (
                  <span>No active appointments linked. Safe to delete.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmDoctor(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDoctor}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Delete Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
