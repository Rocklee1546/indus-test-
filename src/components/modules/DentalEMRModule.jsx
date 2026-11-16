import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DentalEMRModule() {
  const { activePatient, showToast, setActiveModule } = useApp();

  const [dentitionType, setDentitionType] = useState('adult'); // 'adult' or 'pediatric'
  const [selectedTooth, setSelectedTooth] = useState('46');

  // Tooth conditions dictionary
  const [teethStatus, setTeethStatus] = useState({
    '46': { status: 'Caries / Pulpitis', planned: 'RCT + Ceramic Crown', cost: 6500, color: 'bg-rose-500' },
    '36': { status: 'Implant Crown', planned: 'Completed', cost: 28500, color: 'bg-emerald-500' },
    '18': { status: 'Missing / Extracted', planned: 'None', cost: 0, color: 'bg-slate-400' },
    '28': { status: 'Impacted', planned: 'Surgical Extraction', cost: 3500, color: 'bg-amber-500' }
  });

  const [treatmentPlans, setTreatmentPlans] = useState([
    {
      id: 'TP-101',
      tooth: 'Tooth 46 (Lower Right 1st Molar)',
      procedure: 'Rotary Root Canal Treatment + Core Build-up',
      cost: 6500,
      priority: 'High',
      status: 'In Progress',
      doctor: 'Dr. Priya Sharma'
    },
    {
      id: 'TP-102',
      tooth: 'Tooth 46 (Lower Right 1st Molar)',
      procedure: 'Multi-layer Zirconia Crown (CAD-CAM)',
      cost: 8500,
      priority: 'Normal',
      status: 'Recommended',
      doctor: 'Dr. Priya Sharma'
    },
    {
      id: 'TP-103',
      tooth: 'Tooth 28 (Upper Left 3rd Molar)',
      procedure: 'Surgical Wisdom Tooth Disimpaction',
      cost: 3500,
      priority: 'Low',
      status: 'Recommended',
      doctor: 'Dr. Rajesh Sundaram'
    }
  ]);

  const [newProcedure, setNewProcedure] = useState('Tooth Whitening / Polish');
  const [newCost, setNewCost] = useState(2500);

  // Adult teeth arrays (FDI notation)
  const upperRightAdult = ['18', '17', '16', '15', '14', '13', '12', '11'];
  const upperLeftAdult = ['21', '22', '23', '24', '25', '26', '27', '28'];
  const lowerRightAdult = ['48', '47', '46', '45', '44', '43', '42', '41'];
  const lowerLeftAdult = ['31', '32', '33', '34', '35', '36', '37', '38'];

  const conditionOptions = [
    { label: 'Healthy / Sound', color: 'bg-emerald-500' },
    { label: 'Cavity / Caries', color: 'bg-rose-500' },
    { label: 'Root Canal Treatment (RCT)', color: 'bg-purple-600' },
    { label: 'Crown / Bridge', color: 'bg-blue-600' },
    { label: 'Implant', color: 'bg-teal-600' },
    { label: 'Missing / Extracted', color: 'bg-slate-400' },
    { label: 'Impacted', color: 'bg-amber-500' }
  ];

  const handleUpdateToothStatus = (condition, color) => {
    setTeethStatus(prev => ({
      ...prev,
      [selectedTooth]: {
        ...prev[selectedTooth],
        status: condition,
        color
      }
    }));
    showToast(`Tooth ${selectedTooth} marked as ${condition}`);
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    const newPlan = {
      id: `TP-${Math.floor(100 + Math.random() * 900)}`,
      tooth: `Tooth ${selectedTooth}`,
      procedure: newProcedure,
      cost: Number(newCost) || 2000,
      priority: 'Normal',
      status: 'Recommended',
      doctor: 'Dr. Priya Sharma'
    };
    setTreatmentPlans(prev => [...prev, newPlan]);
    showToast(`Treatment plan added for Tooth ${selectedTooth}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Clinical Records & Interactive Dental Odontogram
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              EMR System
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Patient: <b className="text-slate-800">{activePatient?.name}</b> ({activePatient?.id}) • FDI World Dental Federation 2-digit notation
          </p>
        </div>

        {/* Dentition Selector */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setDentitionType('adult')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              dentitionType === 'adult' ? 'bg-[#1769D2] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Adult Dentition (32 Teeth)
          </button>
          <button
            onClick={() => setDentitionType('pediatric')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              dentitionType === 'pediatric' ? 'bg-[#1769D2] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Pediatric Dentition (20 Teeth)
          </button>
        </div>
      </div>

      {/* Interactive Odontogram Tooth Chart Canvas */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Visual Dental Odontogram
            </span>
            <span className="text-xs font-bold text-[#1769D2] bg-blue-50 px-2 py-0.5 rounded-md">
              Selected Tooth: #{selectedTooth}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Cavity</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> RCT</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Crown</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy</span>
          </div>
        </div>

        {/* Teeth Arch Layout */}
        <div className="space-y-6 py-4 bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200/60 text-center">
          {/* Upper Jaw (Maxilla) */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Maxillary Arch (Upper Jaw)
            </div>
            <div className="flex justify-center items-center gap-1 sm:gap-2 overflow-x-auto py-2">
              {/* Upper Right (Quadrant 1) */}
              <div className="flex gap-1">
                {upperRightAdult.map(num => {
                  const data = teethStatus[num];
                  const isSelected = selectedTooth === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedTooth(num)}
                      className={`w-10 h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1769D2] ring-3 ring-blue-200 scale-105 shadow-md bg-white'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400">{num}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold ${
                        data?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        🦷
                      </div>
                      <span className="w-2 h-1 rounded-full bg-slate-200"></span>
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-12 bg-slate-300 mx-2"></div>

              {/* Upper Left (Quadrant 2) */}
              <div className="flex gap-1">
                {upperLeftAdult.map(num => {
                  const data = teethStatus[num];
                  const isSelected = selectedTooth === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedTooth(num)}
                      className={`w-10 h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1769D2] ring-3 ring-blue-200 scale-105 shadow-md bg-white'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400">{num}</span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold ${
                        data?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        🦷
                      </div>
                      <span className="w-2 h-1 rounded-full bg-slate-200"></span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lower Jaw (Mandible) */}
          <div className="pt-2">
            <div className="flex justify-center items-center gap-1 sm:gap-2 overflow-x-auto py-2">
              {/* Lower Right (Quadrant 4) */}
              <div className="flex gap-1">
                {lowerRightAdult.map(num => {
                  const data = teethStatus[num];
                  const isSelected = selectedTooth === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedTooth(num)}
                      className={`w-10 h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1769D2] ring-3 ring-blue-200 scale-105 shadow-md bg-white'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <span className="w-2 h-1 rounded-full bg-slate-200"></span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold ${
                        data?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        🦷
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{num}</span>
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-12 bg-slate-300 mx-2"></div>

              {/* Lower Left (Quadrant 3) */}
              <div className="flex gap-1">
                {lowerLeftAdult.map(num => {
                  const data = teethStatus[num];
                  const isSelected = selectedTooth === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedTooth(num)}
                      className={`w-10 h-14 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1769D2] ring-3 ring-blue-200 scale-105 shadow-md bg-white'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <span className="w-2 h-1 rounded-full bg-slate-200"></span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold ${
                        data?.color || 'bg-slate-100 text-slate-600'
                      }`}>
                        🦷
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{num}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">
              Mandibular Arch (Lower Jaw)
            </div>
          </div>
        </div>

        {/* Selected Tooth Action Controls */}
        <div className="p-4 bg-[#EEF5FF] rounded-2xl border border-blue-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-sm text-[#102A50]">
              Tooth #{selectedTooth}: {teethStatus[selectedTooth]?.status || 'Sound / Healthy'}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Click any quick status below to record condition into patient's EMR
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {conditionOptions.map(opt => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleUpdateToothStatus(opt.label, opt.color)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-slate-700 hover:text-[#1769D2] text-[11px] font-bold border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Treatment Planner Table & Addition */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
              <ClipboardList size={16} className="text-[#1769D2]" />
              <span>Multi-Stage Dental Treatment Planner</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phase-wise procedures, costs and approval tracking
            </p>
          </div>

          <button
            onClick={() => setActiveModule('opd')}
            className="text-xs font-bold text-[#1769D2] hover:underline cursor-pointer"
          >
            Attach to Active Prescription →
          </button>
        </div>

        {/* Treatment Plan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Plan ID</th>
                <th className="py-3 px-4">Tooth Number</th>
                <th className="py-3 px-4">Planned Procedure</th>
                <th className="py-3 px-4">Estimated Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Doctor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {treatmentPlans.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-400">{plan.id}</td>
                  <td className="py-3 px-4 font-bold text-[#102A50]">{plan.tooth}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{plan.procedure}</td>
                  <td className="py-3 px-4 font-black text-slate-900">₹{plan.cost.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      plan.status === 'In Progress' ? 'bg-blue-100 text-[#1769D2]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{plan.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Procedure to Plan Form */}
        <form onSubmit={handleAddPlan} className="pt-3 border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            placeholder="Procedure Name (e.g. Composite Restoration)"
            value={newProcedure}
            onChange={(e) => setNewProcedure(e.target.value)}
            className="flex-1 text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            required
          />
          <input
            type="number"
            placeholder="Cost (₹)"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            className="w-28 text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add to Plan</span>
          </button>
        </form>
      </div>
    </div>
  );
}
