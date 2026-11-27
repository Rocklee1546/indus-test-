import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, UserCheck, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ConvertLeadModal() {
  const { leadToConvert, setLeadToConvert, convertLeadToPatient, patients } = useApp();

  const [salutation, setSalutation] = useState('Mr.');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [allergies, setAllergies] = useState('No known drug allergies');
  const [address, setAddress] = useState('Coimbatore, Tamil Nadu');

  if (!leadToConvert) return null;

  if (leadToConvert.status === 'Converted to Patient') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <UserCheck size={24} />
          </div>
          <h3 className="text-base font-extrabold text-[#102A50]">Already Converted</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            This lead has already been converted to patient <b className="text-emerald-700">{leadToConvert.convertedPatientId || 'Profile'}</b>.
          </p>
          <button
            onClick={() => setLeadToConvert(null)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Check duplicate phone in patient database
  const cleanPhone = (leadToConvert.phone || '').replace(/\D/g, '');
  const existingPatient = patients.find(p => (p.phone || '').replace(/\D/g, '') === cleanPhone);

  const handleConvert = (e) => {
    e.preventDefault();
    convertLeadToPatient(leadToConvert.id, {
      salutation,
      age: Number(age) || 28,
      gender,
      bloodGroup,
      allergies,
      address
    });
    setLeadToConvert(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#092C60] to-[#1769D2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <UserCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Convert Lead to Patient</h2>
              <p className="text-xs text-blue-100">Step 4 in Centralized Patient Journey</p>
            </div>
          </div>
          <button
            onClick={() => setLeadToConvert(null)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleConvert} className="p-6 space-y-3.5">
          <div className="p-3 bg-[#EEF5FF] border border-blue-200/60 rounded-2xl">
            <div className="text-xs font-bold text-[#102A50]">{leadToConvert.name}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Phone: {leadToConvert.phone} • Interested in: <span className="font-semibold text-[#1769D2]">{leadToConvert.treatment}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Lead Source: {leadToConvert.source} (will be retained in medical records)
            </div>
          </div>

          {/* Duplicate Detection Warning Banner */}
          {existingPatient && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold">Existing Patient Record Found!</span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Patient <b className="text-amber-950">{existingPatient.name}</b> (UHID: <b>{existingPatient.id}</b>) has the same mobile number. Converting will link this enquiry to their existing medical profile without duplicating files.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Salutation</label>
              <select
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
              >
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
              >
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="AB+">AB+</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Allergies & Medical Alerts</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin allergy, diabetes"
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address in Coimbatore"
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setLeadToConvert(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#16A779] hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{existingPatient ? `Link to ${existingPatient.id}` : 'Generate Patient ID & Register'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
