import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, User, Phone, Mail, Calendar, Heart, Shield, Check } from 'lucide-react';

export default function AddPatientModal() {
  const { isAddPatientOpen, setIsAddPatientOpen, addPatient, selectedBranch, branches } = useApp();

  const [uhid, setUhid] = useState('IND-0' + Math.floor(280 + Math.random() * 700));
  const [salutation, setSalutation] = useState('Mr');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [ageYrs, setAgeYrs] = useState(23);
  const [ageMths, setAgeMths] = useState('');
  const [ageDays, setAgeDays] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [referredBy, setReferredBy] = useState('Website');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationToFamily, setRelationToFamily] = useState('Self');
  const [preferredBranch, setPreferredBranch] = useState(selectedBranch === 'ALL' ? 'RS_PURAM' : selectedBranch);

  if (!isAddPatientOpen) return null;

  const handleGenerateUhid = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setUhid(`IND-0${randomNum}`);
  };

  const handleDobChange = (e) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const now = new Date();
      let diff = now.getFullYear() - birth.getFullYear();
      if (diff > 0) setAgeYrs(diff);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert('Please provide patient name and phone number');
      return;
    }

    addPatient({
      id: uhid,
      name: `${salutation ? salutation + ' ' : ''}${fullName.trim()}`,
      salutation,
      dob: dob || '2003-04-18',
      age: Number(ageYrs) || 25,
      ageDetails: { yrs: Number(ageYrs) || 25, mths: Number(ageMths) || 0, days: Number(ageDays) || 0 },
      gender,
      bloodGroup,
      referredBy,
      phone,
      email,
      familyRelation: relationToFamily,
      preferredBranch,
      address: 'Coimbatore, Tamil Nadu',
      allergies: ['No known allergies'],
      medicalAlerts: 'None'
    });

    setIsAddPatientOpen(false);
    // Reset fields
    setFullName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden my-8">
        {/* Header - Matching Image 2 */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF5FF] text-[#1769D2] flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#102A50]">Add New Patient</h2>
              <p className="text-xs text-slate-500">Create a new registered patient profile</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddPatientOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: UHID, Salutation, Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">UHID / Patient ID *</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={uhid}
                  onChange={(e) => setUhid(e.target.value)}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateUhid}
                  className="px-2.5 py-2 bg-[#EEF5FF] hover:bg-blue-100 text-[#1769D2] text-[11px] font-bold rounded-xl flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Salutation</label>
              <select
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                <option value="None">None</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Master">Master</option>
              </select>
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Gokul Chandran"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>
          </div>

          {/* Row 2: Date of Birth and Age Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={handleDobChange}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              />
            </div>

            <div className="md:col-span-7">
              <label className="block text-xs font-bold text-slate-700 mb-1">Age *</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="23"
                    value={ageYrs}
                    onChange={(e) => setAgeYrs(e.target.value)}
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 pr-8 focus:ring-2 focus:ring-blue-100 outline-none"
                    required
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">yrs</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="6"
                    value={ageMths}
                    onChange={(e) => setAgeMths(e.target.value)}
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 pr-9 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">mths</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="18"
                    value={ageDays}
                    onChange={(e) => setAgeDays(e.target.value)}
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 pr-8 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Gender Selector (Matching Image 2 segmented toggle) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender *</label>
            <div className="grid grid-cols-3 gap-2">
              {['Female', 'Male', 'Other'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    gender === g
                      ? 'border-[#1769D2] bg-[#EEF5FF] text-[#1769D2] ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{g === 'Female' ? '♀ Female' : g === 'Male' ? '♂ Male' : '⚧ Other'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Blood Group & Referred By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                <option value="Select blood group">Select blood group</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Referred By</label>
              <select
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                <option value="Google Ads">Google Ads</option>
                <option value="Meta Ads">Meta / Instagram Ads</option>
                <option value="Website">INDUS Dental Website</option>
                <option value="WhatsApp Campaign">WhatsApp Campaign</option>
                <option value="Doctor Referral">Doctor Referral</option>
                <option value="Family & Friends">Family & Friends</option>
                <option value="Walk-in">Direct Walk-in</option>
              </select>
            </div>
          </div>

          {/* Contact Information Section Header */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                <div className="relative">
                  <Phone size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="8072103756"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs font-bold bg-[#F8FAFC] border border-blue-200 rounded-xl pl-8 pr-3 py-2 text-[#102A50] focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Relation to Family */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Relation to family (optional)</label>
            <select
              value={relationToFamily}
              onChange={(e) => setRelationToFamily(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
            >
              <option value="Self">Self</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Actions - Matching Image 2 Cancel / Add Patient */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddPatientOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <User size={15} />
              <span>Add Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
