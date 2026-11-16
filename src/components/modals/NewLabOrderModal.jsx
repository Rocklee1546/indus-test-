import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FlaskConical, Send } from 'lucide-react';

export default function NewLabOrderModal() {
  const {
    isNewLabOrderOpen,
    setIsNewLabOrderOpen,
    patients,
    activePatient,
    doctors,
    branches,
    selectedBranch,
    addLabOrder
  } = useApp();

  const [patientId, setPatientId] = useState(activePatient?.id || patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [branchId, setBranchId] = useState(selectedBranch === 'ALL' ? 'RS_PURAM' : selectedBranch);
  const [labName, setLabName] = useState('Coimbatore Dental Ceramics');
  const [workType, setWorkType] = useState('Multi-layer Zirconia Crown');
  const [toothNumber, setToothNumber] = useState('Tooth 46');
  const [shade, setShade] = useState('A2 Vita Classical');
  const [material, setMaterial] = useState('Pre-sintered High Translucent Zirconia');
  const [expectedDate, setExpectedDate] = useState('2026-11-12');
  const [instructions, setInstructions] = useState('Subgingival margin, anatomical occlusal table.');
  const [charges, setCharges] = useState(2500);

  if (!isNewLabOrderOpen) return null;

  const currentPatient = patients.find(p => p.id === patientId) || activePatient;
  const currentDoctor = doctors.find(d => d.id === doctorId) || doctors[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    addLabOrder({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      branchId,
      doctorName: currentDoctor.name,
      labName,
      workType,
      toothNumber,
      shade,
      material,
      expectedDate,
      instructions,
      charges: Number(charges) || 2000,
      paidStatus: 'Pending'
    });

    setIsNewLabOrderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FlaskConical size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A50]">Create Dental Lab Order</h2>
              <p className="text-xs text-slate-500">Dispatch prosthetics order with shade & tooth specs</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewLabOrderOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient *</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor *</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Dental Lab</label>
              <select
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                <option value="Coimbatore Dental Ceramics">Coimbatore Dental Ceramics</option>
                <option value="Apex Precision Dental Lab">Apex Precision Dental Lab</option>
                <option value="ClearSmile Aligners Lab Pvt Ltd">ClearSmile Aligners Lab Pvt Ltd</option>
                <option value="Kovai CAD-CAM Milling Centre">Kovai CAD-CAM Milling Centre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Type</label>
              <input
                type="text"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tooth #</label>
              <input
                type="text"
                value={toothNumber}
                onChange={(e) => setToothNumber(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shade Guide</label>
              <input
                type="text"
                value={shade}
                onChange={(e) => setShade(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery</label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                value={charges}
                onChange={(e) => setCharges(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Instructions to Technician</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewLabOrderOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#7955D9] hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>Dispatch Lab Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
