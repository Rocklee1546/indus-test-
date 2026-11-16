import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Phone, Mail, Building2, Tag, Calendar, AlertCircle } from 'lucide-react';

export default function AddLeadModal() {
  const { isAddLeadOpen, setIsAddLeadOpen, addLead, branches, selectedBranch } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [treatment, setTreatment] = useState('Dental Implants');
  const [branchId, setBranchId] = useState(selectedBranch === 'ALL' ? 'RS_PURAM' : selectedBranch);
  const [source, setSource] = useState('Google Ads');
  const [priority, setPriority] = useState('Hot');
  const [nextFollowup, setNextFollowup] = useState('2026-11-07T10:00');
  const [remarks, setRemarks] = useState('');

  if (!isAddLeadOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide lead name and mobile number.');
      return;
    }

    addLead({
      name,
      phone,
      altPhone,
      email,
      treatment,
      branchId,
      source,
      priority,
      assignedTo: 'Sneha R (Front Desk)',
      nextFollowup,
      remarks: remarks || 'Lead captured via CRM form.'
    });

    setIsAddLeadOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setRemarks('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Patient / Lead Name *</label>
            <input
              type="text"
              placeholder="e.g. Arun Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone size={13} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="98430 12845"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={13} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="arun@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Interested Treatment</label>
            <select
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
            >
              <option value="Dental Implants">Dental Implants</option>
              <option value="Clear Aligners / Invisible Braces">Clear Aligners / Invisible Braces</option>
              <option value="Root Canal Treatment">Root Canal Treatment</option>
              <option value="Teeth Whitening">Teeth Whitening</option>
              <option value="Zirconia Crown / Bridge">Zirconia Crown / Bridge</option>
              <option value="Pediatric Dental Care">Pediatric Dental Care</option>
              <option value="Tooth Extraction">Tooth Extraction</option>
              <option value="Full Mouth Rehabilitation">Full Mouth Rehabilitation</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                <option value="Google Ads">Google Ads</option>
                <option value="Meta Ads">Meta / Insta Ads</option>
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone Calls">Phone Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Referrals">Referrals</option>
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
