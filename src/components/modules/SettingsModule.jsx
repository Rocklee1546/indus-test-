import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getDoctorInitials } from '../../utils/doctorUtils';
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
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Activity,
  Layers,
  Camera,
  ExternalLink,
  Eye,
  ArrowRight,
  Users
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

const PRESET_TREATMENT_CATEGORIES = [
  'Surgical & Implants',
  'Orthodontics',
  'Endodontics',
  'Cosmetic Dentistry',
  'Prosthodontics',
  'Pedodontics',
  'Oral Surgery',
  'Full Arch Restoration',
  'General Dentistry',
  'Periodontics'
];

export default function SettingsModule() {
  const {
    adminProfile,
    updateAdminProfile,
    getAdminInitials,
    doctors,
    addDoctor,
    updateDoctor,
    toggleDoctorStatus,
    deleteDoctor,
    appointments,
    leads,
    patients,
    treatments,
    enabledTreatments,
    addTreatment,
    updateTreatment,
    toggleTreatmentStatus,
    deleteTreatment,
    moveTreatment,
    showToast,
    settingsTab,
    setSettingsTab,
    setSelectedLeadId,
    setIsLeadDetailsOpen,
    setActivePatientId,
    setPatient360Data
  } = useApp();

  const [activeTab, setActiveTab] = useState(settingsTab || 'general');

  // Enquiries modal state for Treatment Management
  const [viewingTreatmentEnquiries, setViewingTreatmentEnquiries] = useState(null);

  // Helper to compute genuine unique active enquiries for a treatment
  const getTreatmentEnquiries = (treatment) => {
    if (!treatment) return [];
    const tNameLower = (treatment.name || '').toLowerCase();

    const matchesTreatment = (str) => {
      if (!str) return false;
      const sLower = str.toLowerCase();
      return sLower === tNameLower || sLower.includes(tNameLower) || tNameLower.includes(sLower);
    };

    const results = [];
    const seenPersons = new Set();

    // 1. Genuine Active Prospective Leads (exclude deleted and Lost Lead)
    (leads || []).forEach(l => {
      if (l.isDeleted || l.status === 'Lost Lead') return;
      if (!matchesTreatment(l.treatment)) return;

      const personKey = (l.phone || '').replace(/\D/g, '') || l.id;
      if (seenPersons.has(personKey)) return;
      seenPersons.add(personKey);

      results.push({
        id: l.id,
        key: `lead_${l.id}`,
        type: 'Lead Enquiry',
        isLead: true,
        leadId: l.id,
        patientId: l.convertedPatientId || null,
        name: l.name,
        phone: l.phone || 'Not provided',
        treatment: l.treatment || treatment.name,
        status: l.status,
        date: l.date || (l.createdAt ? l.createdAt.split('T')[0] : 'Recent'),
        record: l
      });
    });

    // 2. Active Patient Bookings (exclude cancelled appointments)
    (appointments || []).forEach(a => {
      if (a.status === 'Cancelled') return;
      if (!matchesTreatment(a.treatmentType)) return;

      const personKey = (a.phone || '').replace(/\D/g, '') || a.patientId || a.id;
      if (seenPersons.has(personKey)) return; // Avoid double counting if already captured via lead
      seenPersons.add(personKey);

      results.push({
        id: a.patientId || a.id,
        key: `appt_${a.id}`,
        type: 'Patient Booking',
        isLead: false,
        leadId: a.leadId || null,
        patientId: a.patientId,
        name: a.patientName,
        phone: a.phone || 'Not provided',
        treatment: a.treatmentType || treatment.name,
        status: `Booked (${a.status})`,
        date: a.date,
        record: a
      });
    });

    return results;
  };

  // Admin Profile local form state
  const [adminName, setAdminName] = useState(adminProfile?.name || 'Dr. Priya Sharma');
  const [adminRole, setAdminRole] = useState(adminProfile?.designation || 'Chief Dental Surgeon & Implantologist');
  const [adminPhoto, setAdminPhoto] = useState(adminProfile?.photo || '');

  // Keep synced if adminProfile changes externally
  useEffect(() => {
    if (adminProfile) {
      setAdminName(adminProfile.name || 'Dr. Priya Sharma');
      setAdminRole(adminProfile.designation || 'Chief Dental Surgeon & Implantologist');
      setAdminPhoto(adminProfile.photo || '');
    }
  }, [adminProfile]);

  const computedInitials = getAdminInitials ? getAdminInitials(adminName) : 'PS';

  const handleSaveAdminProfile = (e) => {
    if (e) e.preventDefault();
    if (!adminName.trim()) {
      showToast('Admin / Doctor Name cannot be empty.', 'error');
      return;
    }
    updateAdminProfile({
      name: adminName.trim(),
      designation: adminRole.trim() || 'Chief Dental Surgeon & Implantologist',
      photo: adminPhoto || null
    });
    showToast('Admin Profile saved successfully! Header identity updated.', 'success');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file too large. Please select an image under 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdminPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Treatment Modal State
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null); // null = Add, obj = Edit
  const [treatmentForm, setTreatmentForm] = useState({
    name: '',
    category: 'Surgical & Implants',
    enabled: true
  });
  const [deleteConfirmTreatment, setDeleteConfirmTreatment] = useState(null);

  const handleOpenAddTreatment = () => {
    setEditingTreatment(null);
    setTreatmentForm({
      name: '',
      category: 'General Dentistry',
      enabled: true
    });
    setIsTreatmentModalOpen(true);
  };

  const handleOpenEditTreatment = (trt) => {
    setEditingTreatment(trt);
    setTreatmentForm({
      name: trt.name,
      category: trt.category || 'General Dentistry',
      enabled: trt.enabled !== false
    });
    setIsTreatmentModalOpen(true);
  };

  const handleSaveTreatment = (e) => {
    e.preventDefault();
    if (!treatmentForm.name.trim()) {
      showToast('Treatment name is required.', 'error');
      return;
    }
    if (editingTreatment) {
      updateTreatment(editingTreatment.id, {
        name: treatmentForm.name.trim(),
        category: treatmentForm.category.trim(),
        enabled: treatmentForm.enabled
      });
    } else {
      addTreatment({
        name: treatmentForm.name.trim(),
        category: treatmentForm.category.trim(),
        enabled: treatmentForm.enabled
      });
    }
    setIsTreatmentModalOpen(false);
  };

  const handleConfirmDeleteTreatment = () => {
    if (!deleteConfirmTreatment) return;
    deleteTreatment(deleteConfirmTreatment.id);
    setDeleteConfirmTreatment(null);
  };

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
            Configure hospital branding, clinic operations, and WhatsApp credentials
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold flex-wrap">
          {[
            { id: 'general', label: 'Clinic Profile' },
            { id: 'doctors', label: 'Doctor Management' },
            { id: 'treatments', label: 'Treatment Management' }
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

          {/* ── ADMIN PROFILE SECTION ── */}
          <div className="pt-6 mt-2 border-t border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={16} className="text-[#1769D2]" />
                <span>Admin Profile</span>
              </h2>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                Top-Right Header Identity
              </span>
            </div>
            <p className="text-xs text-slate-500 -mt-2">
              Configure administrator name, clinical designation, and photo displayed in the top-right header across all pages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin / Doctor Name *
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none focus:border-[#1769D2] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role *
                </label>
                <input
                  type="text"
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value)}
                  placeholder="e.g. Chief Dental Surgeon & Implantologist"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none focus:border-[#1769D2] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Profile Initials (auto-generated from name) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profile Initials (Auto-Generated)
                </label>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-500/30 text-[#1769D2] font-black text-sm flex items-center justify-center tracking-wider shrink-0 shadow-xs">
                    {computedInitials}
                  </div>
                  <input
                    type="text"
                    value={computedInitials}
                    readOnly
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold tracking-widest cursor-not-allowed select-none outline-none"
                    title="Automatically generated from Admin / Doctor Name"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Generated automatically from the entered name</p>
              </div>

              {/* Optional Profile Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Profile Photo
                </label>
                <div className="flex items-center gap-2.5">
                  {adminPhoto ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shrink-0 shadow-xs">
                      <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <Camera size={16} />
                    </div>
                  )}

                  <div className="flex-1 flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <span className="w-full block text-center px-3 py-2 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-bold transition-colors">
                        {adminPhoto ? 'Change Photo' : 'Upload Photo'}
                      </span>
                    </label>

                    {adminPhoto && (
                      <button
                        type="button"
                        onClick={() => setAdminPhoto('')}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                        title="Remove photo (fallback to initials)"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG under 2MB. If omitted, initials will be shown.</p>
              </div>
            </div>

            {/* Save Admin Profile Button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAdminProfile}
                className="px-5 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save size={14} />
                <span>Save Admin Profile</span>
              </button>
            </div>
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
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1769D2] flex items-center justify-center font-bold text-xs shrink-0 tracking-wider">
                              {getDoctorInitials(doc.name)}
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

      {/* ── TAB: TREATMENT MANAGEMENT ── */}
      {activeTab === 'treatments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[#102A50] flex items-center gap-2">
                <Sparkles size={18} className="text-[#1769D2]" />
                <span>Treatment Management & Clinical Service Catalog</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure clinic procedures, catalog order, and activation status. Changes synchronize live with Dashboard and Lead capture.
              </p>
            </div>
            <button
              onClick={handleOpenAddTreatment}
              className="px-4 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus size={15} />
              <span>+ Add Treatment</span>
            </button>
          </div>

          {/* Treatment Order Notice Banner */}
          <div className="p-3.5 px-4 bg-gradient-to-r from-blue-50/80 to-teal-50/60 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-slate-700 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#1769D2] flex items-center justify-center font-bold text-xs shrink-0">
                ↕
              </span>
              <span>
                <b>Treatment Display Order:</b> Treatments appear in this order across Dashboard performance charts, Lead capture forms, and Appointment scheduling. Use <b>↑</b> and <b>↓</b> to reorder.
              </span>
            </div>
            <span className="text-[11px] font-extrabold text-[#1769D2] bg-white px-2.5 py-1 rounded-xl border border-blue-200/80 shrink-0">
              {enabledTreatments.length} Active / {treatments.length} Total
            </span>
          </div>

          {/* Treatments Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-24">Order</th>
                    <th className="py-3 px-4">Treatment Name</th>
                    <th className="py-3 px-4">Clinical Category</th>
                    <th className="py-3 px-4 text-center">Active Enquiries</th>
                    <th className="py-3 px-4 text-center">Appointments</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {treatments.map((trt, idx) => {
                    const isEnabled = trt.enabled !== false;
                    const enquiryList = getTreatmentEnquiries(trt);
                    const enquiryCount = enquiryList.length;
                    const apptCount = appointments.filter(a => a.status !== 'Cancelled' && a.treatmentType && (a.treatmentType.toLowerCase() === trt.name.toLowerCase() || a.treatmentType.toLowerCase().includes(trt.name.toLowerCase()) || trt.name.toLowerCase().includes(a.treatmentType.toLowerCase()))).length;

                    return (
                      <tr key={trt.id} className="hover:bg-blue-50/40 transition-colors">
                        {/* Order & Reorder Arrows */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveTreatment(idx, -1)}
                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                  idx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 cursor-pointer'
                                }`}
                                title="Move treatment up"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === treatments.length - 1}
                                onClick={() => moveTreatment(idx, 1)}
                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                                  idx === treatments.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 cursor-pointer'
                                }`}
                                title="Move treatment down"
                              >
                                <ArrowDown size={12} />
                              </button>
                            </div>
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-xs">
                              {idx + 1}
                            </span>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4 font-bold text-[#102A50]">
                          <span>{trt.name}</span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-[#F1F5F9] text-slate-700">
                            {trt.category || 'General Dentistry'}
                          </span>
                        </td>

                        {/* Enquiries - Clickable */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setViewingTreatmentEnquiries({ treatment: trt, records: enquiryList })}
                            className="font-extrabold text-[#1769D2] bg-blue-50 hover:bg-blue-100 hover:ring-2 hover:ring-blue-300 px-3 py-1 rounded-xl text-xs transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                            title={`Click to view ${enquiryCount} genuine active enquiries for ${trt.name}`}
                          >
                            <span>{enquiryCount}</span>
                            <ExternalLink size={11} className="opacity-70" />
                          </button>
                        </td>

                        {/* Appointments */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-extrabold text-[#12B89A] bg-teal-50 px-2 py-0.5 rounded-lg text-xs">
                            {apptCount}
                          </span>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => toggleTreatmentStatus(trt.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                              isEnabled
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title="Click to toggle treatment enabled/disabled"
                          >
                            {isEnabled ? '● Enabled' : '○ Disabled'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditTreatment(trt)}
                              className="p-1.5 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Edit Treatment Name & Category"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmTreatment(trt)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Delete Treatment"
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

      {/* ── MODAL: Add / Edit Treatment ── */}
      {isTreatmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1769D2] flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#102A50]">
                    {editingTreatment ? 'Edit Treatment Procedure' : 'Add New Treatment'}
                  </h3>
                  <p className="text-[11px] text-slate-500">INDUS Dental Clinical Service Catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsTreatmentModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Treatment Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dental Implants, Clear Aligners"
                  value={treatmentForm.name}
                  onChange={e => setTreatmentForm({ ...treatmentForm, name: e.target.value })}
                  className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Category / Specialty</label>
                <select
                  value={treatmentForm.category}
                  onChange={e => setTreatmentForm({ ...treatmentForm, category: e.target.value })}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
                >
                  {PRESET_TREATMENT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="treatmentStatus"
                      checked={treatmentForm.enabled === true}
                      onChange={() => setTreatmentForm({ ...treatmentForm, enabled: true })}
                      className="text-[#1769D2]"
                    />
                    <span className="text-emerald-700">Enabled (Available in Forms & Insights)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="treatmentStatus"
                      checked={treatmentForm.enabled === false}
                      onChange={() => setTreatmentForm({ ...treatmentForm, enabled: false })}
                      className="text-[#1769D2]"
                    />
                    <span className="text-slate-500">Disabled (Hidden)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTreatmentModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {editingTreatment ? 'Save Changes' : 'Add Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Treatment Confirmation ── */}
      {deleteConfirmTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#102A50]">Delete Treatment?</h3>
                <p className="text-[11px] text-slate-500">Remove from active clinical catalog.</p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-3 text-xs text-slate-700 mb-5 leading-relaxed">
              <div className="font-bold text-[#102A50]">{deleteConfirmTreatment.name}</div>
              <div className="text-slate-500">{deleteConfirmTreatment.category}</div>
              <div className="text-[11px] text-slate-500 mt-2">
                {leads.filter(l => !l.isDeleted && l.treatment && l.treatment.toLowerCase().includes(deleteConfirmTreatment.name.toLowerCase())).length > 0 ? (
                  <span className="text-amber-700 font-semibold">
                    ℹ️ Linked to {leads.filter(l => !l.isDeleted && l.treatment && l.treatment.toLowerCase().includes(deleteConfirmTreatment.name.toLowerCase())).length} lead(s). Historical lead records will preserve their treatment text.
                  </span>
                ) : (
                  <span>No active leads currently linked. Safe to delete.</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmTreatment(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTreatment}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Delete Treatment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Treatment Active Enquiries Detail ── */}
      {viewingTreatmentEnquiries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#1769D2] flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#102A50] flex items-center gap-2">
                    <span>{viewingTreatmentEnquiries.treatment.name}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                      {viewingTreatmentEnquiries.records.length} Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Genuine active enquiries and patient bookings for this procedure
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingTreatmentEnquiries(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {viewingTreatmentEnquiries.records.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">No Active Enquiries Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    There are currently no active prospective leads or pending bookings for {viewingTreatmentEnquiries.treatment.name}.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-3.5">Name & Contact</th>
                        <th className="py-3 px-3.5">Lead / UHID</th>
                        <th className="py-3 px-3.5">Type & Status</th>
                        <th className="py-3 px-3.5">Date</th>
                        <th className="py-3 px-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewingTreatmentEnquiries.records.map((rec) => {
                        const isLead = rec.isLead;
                        const displayId = isLead
                          ? (rec.leadId || `LD-${rec.id}`)
                          : (rec.patientId || 'IND-PAT');

                        return (
                          <tr key={rec.key} className="hover:bg-blue-50/40 transition-colors">
                            {/* Name & Contact */}
                            <td className="py-3 px-3.5">
                              <div className="font-bold text-[#102A50]">{rec.name || 'Unnamed'}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone size={10} className="text-slate-400" />
                                <span>{rec.phone || 'No phone'}</span>
                              </div>
                            </td>

                            {/* Lead ID / UHID */}
                            <td className="py-3 px-3.5">
                              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                {displayId}
                              </span>
                            </td>

                            {/* Type & Status */}
                            <td className="py-3 px-3.5">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                  isLead ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-teal-50 text-teal-700 border border-teal-200/60'
                                }`}>
                                  {rec.type}
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {rec.status || 'Active'}
                                </span>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="py-3 px-3.5 text-slate-600 text-[11px] font-medium whitespace-nowrap">
                              {rec.date || 'Recent'}
                            </td>

                            {/* Action */}
                            <td className="py-3 px-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setViewingTreatmentEnquiries(null);
                                  if (isLead) {
                                    if (setSelectedLeadId) setSelectedLeadId(rec.leadId || rec.id);
                                    if (setIsLeadDetailsOpen) setIsLeadDetailsOpen(true);
                                  } else {
                                    const p = (patients || []).find(pt => pt.id === rec.patientId || pt.uhid === rec.patientId || pt.phone === rec.phone);
                                    if (p && setPatient360Data) {
                                      setPatient360Data(p);
                                      if (setActivePatientId) setActivePatientId(p.id);
                                    } else {
                                      const mockPt = {
                                        id: rec.patientId || rec.id,
                                        uhid: rec.patientId || 'IND-PAT',
                                        name: rec.name,
                                        phone: rec.phone,
                                        treatment: rec.treatment
                                      };
                                      if (setPatient360Data) setPatient360Data(mockPt);
                                      if (setActivePatientId) setActivePatientId(mockPt.id);
                                    }
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1769D2] font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Open full profile details"
                              >
                                <Eye size={12} />
                                <span>View Profile</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total Unique Active Enquiries: <b>{viewingTreatmentEnquiries.records.length}</b>
              </span>
              <button
                type="button"
                onClick={() => setViewingTreatmentEnquiries(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
