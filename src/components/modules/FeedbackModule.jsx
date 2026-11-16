import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Plus,
  MessageSquare,
  CheckCircle2,
  ThumbsUp,
  User,
  Building2
} from 'lucide-react';

export default function FeedbackModule() {
  const { feedbackList, setFeedbackList, showToast } = useApp();

  const [filterRating, setFilterRating] = useState('ALL');

  const filtered = feedbackList.filter(f => filterRating === 'ALL' || f.rating === Number(filterRating));

  const averageRating = (
    feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length
  ).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Patient Feedback & Net Promoter Score (NPS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              <span>{averageRating} / 5.0 Star Average</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Post-consultation ratings, clinical satisfaction reviews, and complaint redressal
          </p>
        </div>

        <button
          onClick={() => showToast('Automated WhatsApp feedback survey dispatched to today\'s completed appointments')}
          className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <MessageSquare size={14} />
          <span>Send WhatsApp Feedback Requests</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map(fb => (
          <div key={fb.id} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400">{fb.date}</span>
              </div>

              <p className="text-xs text-slate-700 italic mt-3 leading-relaxed">
                "{fb.comment}"
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="font-extrabold text-[#102A50]">{fb.patientName}</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {fb.branchName} • Attending: <b className="text-slate-700">{fb.doctorName}</b>
                </div>
              </div>
            </div>

            {fb.response && (
              <div className="p-3 bg-[#EEF5FF] rounded-2xl border border-blue-100 text-[11px] text-slate-700">
                <span className="font-bold text-[#1769D2] block mb-0.5">Clinic Response:</span>
                {fb.response}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
