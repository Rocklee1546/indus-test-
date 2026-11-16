import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRightLeft, PackageCheck } from 'lucide-react';

export default function StockTransferModal() {
  const {
    isStockTransferOpen,
    setIsStockTransferOpen,
    inventory,
    branches,
    transferStock
  } = useApp();

  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [fromBranch, setFromBranch] = useState('RS_PURAM');
  const [toBranch, setToBranch] = useState('PEELAMEDU');
  const [quantity, setQuantity] = useState(2);

  if (!isStockTransferOpen) return null;

  const currentItem = inventory.find(i => i.id === selectedItemId) || inventory[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromBranch === toBranch) {
      alert('Source branch and destination branch cannot be the same.');
      return;
    }

    transferStock({
      itemId: currentItem.id,
      fromBranch,
      toBranch,
      quantity: Number(quantity) || 1
    });

    setIsStockTransferOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1769D2] flex items-center justify-center">
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A50]">Inter-Branch Stock Transfer</h2>
              <p className="text-xs text-slate-500">Transfer supplies across Coimbatore branches</p>
            </div>
          </div>
          <button
            onClick={() => setIsStockTransferOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Item *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Avail: {item.currentStock} {item.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From Branch</label>
              <select
                value={fromBranch}
                onChange={(e) => setFromBranch(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.shortName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">To Branch</label>
              <select
                value={toBranch}
                onChange={(e) => setToBranch(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.shortName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quantity to Transfer</label>
            <input
              type="number"
              min="1"
              max={currentItem.currentStock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-xs font-bold bg-[#F8FAFC] border border-blue-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
              required
            />
            <div className="text-[10px] text-slate-400 mt-1">
              Current available in source: {currentItem.currentStock} {currentItem.unit}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsStockTransferOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PackageCheck size={14} />
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
