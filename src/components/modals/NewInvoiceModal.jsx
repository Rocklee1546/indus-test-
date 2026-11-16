import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Receipt, Plus, Trash2, Printer, CheckCircle } from 'lucide-react';

export default function NewInvoiceModal() {
  const {
    isNewInvoiceOpen,
    setIsNewInvoiceOpen,
    patients,
    activePatient,
    doctors,
    branches,
    selectedBranch,
    addInvoice
  } = useApp();

  const [patientId, setPatientId] = useState(activePatient?.id || patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [branchId, setBranchId] = useState(selectedBranch === 'ALL' ? 'RS_PURAM' : selectedBranch);
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay)');
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState([
    { description: 'OPD Dental Consultation & Intraoral Exam', qty: 1, rate: 500, amount: 500 },
    { description: 'Digital RVG Intraoral X-Ray', qty: 1, rate: 300, amount: 300 }
  ]);

  const [amountPaid, setAmountPaid] = useState(800);

  if (!isNewInvoiceOpen) return null;

  const currentPatient = patients.find(p => p.id === patientId) || activePatient;
  const currentDoctor = doctors.find(d => d.id === doctorId) || doctors[0];

  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));
  const balance = Math.max(0, grandTotal - Number(amountPaid || 0));

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { description: 'Root Canal Treatment (Rotary)', qty: 1, rate: 4500, amount: 4500 }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      if (field === 'qty' || field === 'rate') {
        item.amount = (Number(item.qty) || 0) * (Number(item.rate) || 0);
      }
      next[index] = item;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addInvoice({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      branchId,
      doctorName: currentDoctor.name,
      items,
      subtotal,
      discount: Number(discount),
      tax: 0,
      grandTotal,
      paidAmount: Number(amountPaid),
      balance,
      paymentMethod,
      paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: balance === 0 ? 'Paid' : Number(amountPaid) > 0 ? 'Partial' : 'Pending'
    });

    setIsNewInvoiceOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A50]">Generate Tax Invoice</h2>
              <p className="text-xs text-slate-500">INDUS Dental Centralised Billing & Receipts</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewInvoiceOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient *</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Attending Doctor</label>
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Billing Branch</label>
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

          {/* Procedure Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dental Procedures & Services
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-[#1769D2] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Procedure name"
                    className="flex-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                    className="w-14 text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center text-slate-800 outline-none"
                    required
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                    className="w-24 text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-right text-slate-800 outline-none"
                    required
                  />
                  <span className="w-20 text-xs font-black text-slate-900 text-right pr-2">
                    ₹{item.amount}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calculations Summary */}
          <div className="bg-[#EEF5FF] p-4 rounded-2xl border border-blue-200/60 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Discount (₹)</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-right text-slate-800 outline-none"
              />
            </div>
            <div className="flex justify-between text-sm font-black text-[#102A50] pt-1 border-t border-blue-200/50">
              <span>Grand Total</span>
              <span className="text-[#1769D2]">₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full text-xs font-black bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-emerald-800 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[#102A50] outline-none cursor-pointer"
                >
                  <option value="UPI (GPay)">UPI (Google Pay / PhonePe)</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>
            </div>
            {balance > 0 && (
              <div className="text-[11px] font-bold text-rose-600 flex justify-between pt-1">
                <span>Remaining Balance Due:</span>
                <span>₹{balance.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewInvoiceOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle size={14} />
              <span>Generate & Issue Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
