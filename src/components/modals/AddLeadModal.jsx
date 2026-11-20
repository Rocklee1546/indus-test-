import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Phone, Mail, AlertCircle } from 'lucide-react';

export default function AddLeadModal() {
  const { isAddLeadOpen, setIsAddLeadOpen, addLead, selectedBranch, enabledTreatments } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [treatment, setTreatment] = useState(enabledTreatments?.[0]?.name || 'Dental Implants');
  const [branchId, setBranchId] = useState(selectedBranch === 'ALL' ? 'RS_PURAM' : selectedBranch);
  const [source, setSource] = useState('Meta Ads');
  const [priority, setPriority] = useState('Hot');
  const [nextFollowup, setNextFollowup] = useState('2026-11-07T10:00');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (enabledTreatments && enabledTreatments.length > 0) {
      if (!enabledTreatments.some(t => t.name === treatment)) {
        setTreatment(enabledTreatments[0].name);
      }
    }
  }, [enabledTreatments]);

  // Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  if (!isAddLeadOpen) return null;

  // Validation Logic
  const validateField = (field, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    if (field === 'name') {
      if (!trimmed) {
        error = 'Patient / Lead Name is required.';
      } else if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        error = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters long.';
      }
    }

    if (field === 'phone') {
      const digitsOnly = (value || '').replace(/\D/g, '');
      if (!digitsOnly) {
        error = 'Mobile number is required.';
      } else if (digitsOnly.length !== 10) {
        error = `Mobile number must be exactly 10 digits (${digitsOnly.length}/10 entered).`;
      }
    }

    if (field === 'email') {
      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    }

    return error;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (touched.name) {
      setErrors(prev => ({ ...prev, name: validateField('name', val) }));
    }
  };

  const handlePhoneChange = (e) => {
    // Only accept digits and limit to 10 characters
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (touched.phone) {
      setErrors(prev => ({ ...prev, phone: validateField('phone', digitsOnly) }));
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateField('email', val) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const val = field === 'name' ? name : field === 'phone' ? phone : email;
    setErrors(prev => ({ ...prev, [field]: validateField(field, val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameErr = validateField('name', name);
    const phoneErr = validateField('phone', phone);
    const emailErr = validateField('email', email);

    const newErrors = { name: nameErr, phone: phoneErr, email: emailErr };
    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true });

    if (nameErr || phoneErr || emailErr) {
      return;
    }

    addLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      treatment,
      branchId,
      source,
      priority,
      assignedTo: 'Sneha R (Front Desk)',
      nextFollowup,
      remarks: remarks.trim() || 'Lead captured via CRM form.'
    });

    setIsAddLeadOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setRemarks('');
    setErrors({});
    setTouched({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A50]">Register New Lead / Enquiry</h2>
              <p className="text-xs text-slate-500">Capture prospective dental patient enquiry into CRM pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddLeadOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5" noValidate>
          {/* Patient / Lead Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Patient / Lead Name *</label>
            <input
              type="text"
              placeholder="e.g. Arun Kumar"
              value={name}
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
              className={`w-full text-xs font-bold rounded-xl px-3 py-2 text-[#102A50] outline-none transition-all ${
                errors.name
                  ? 'bg-rose-50/30 border-2 border-rose-400 focus:ring-2 focus:ring-rose-100'
                  : 'bg-[#F8FAFC] border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:bg-white'
              }`}
              required
            />
            {errors.name && (
              <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-in fade-in">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Mobile & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone size={13} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="9843012845"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full text-xs font-bold rounded-xl pl-8 pr-3 py-2 text-[#102A50] outline-none transition-all ${
                    errors.phone
                      ? 'bg-rose-50/30 border-2 border-rose-400 focus:ring-2 focus:ring-rose-100'
                      : 'bg-[#F8FAFC] border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:bg-white'
                  }`}
                  required
                />
              </div>
              {errors.phone ? (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-in fade-in">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">10-digit mobile number</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={13} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="arun@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full text-xs font-medium rounded-xl pl-8 pr-3 py-2 text-slate-800 outline-none transition-all ${
                    errors.email
                      ? 'bg-rose-50/30 border-2 border-rose-400 focus:ring-2 focus:ring-rose-100'
                      : 'bg-[#F8FAFC] border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-in fade-in">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Interested Treatment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Interested Treatment</label>
            <select
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
            >
              {(enabledTreatments || []).map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Lead Source, Priority, Next Followup */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                <option value="Meta Ads">Meta Ads</option>
                <option value="Walk In">Walk In</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-rose-600 outline-none cursor-pointer"
              >
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">⚡ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Next Follow-up</label>
              <input
                type="datetime-local"
                value={nextFollowup}
                onChange={(e) => setNextFollowup(e.target.value)}
                className="w-full text-[11px] font-medium bg-white border border-slate-200 rounded-xl px-2 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Enquiry Remarks & Patient Needs</label>
            <textarea
              rows={2}
              placeholder="e.g. Patient inquired about full mouth implant warranty and EMI options..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Save Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
