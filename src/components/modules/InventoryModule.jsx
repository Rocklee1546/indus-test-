import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageCheck,
  Plus,
  ArrowRightLeft,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';

export default function InventoryModule() {
  const {
    inventory,
    filteredInventory,
    selectedBranch,
    branches,
    setIsStockTransferOpen,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = [
    'Dental Materials',
    'Dental Instruments',
    'Medicines',
    'Consumables',
    'Protective Equipment'
  ];

  const filtered = filteredInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Dental Inventory & Stock Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              {filtered.length} SKUs Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized consumables, rotary files, implant fixtures, and inter-branch transfers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsStockTransferOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#102A50] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRightLeft size={14} className="text-[#1769D2]" />
            <span>Transfer Between Branches</span>
          </button>
          <button
            onClick={() => showToast('Stock receiving interface opened')}
            className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name, supplier, batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item Name & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Branch Location</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Batch & Expiry</th>
                <th className="py-3 px-4">Status Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-xs text-[#102A50]">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.id} • {item.supplier}</div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {item.category}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#1769D2]">
                    {item.branchId}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-black text-sm text-slate-900">{item.currentStock}</span>
                    <span className="text-[11px] text-slate-500 ml-1">({item.unit})</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    ₹{item.price.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{item.expiryDate}</div>
                    <div className="text-[10px] text-slate-400">Batch: {item.batchNo}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
