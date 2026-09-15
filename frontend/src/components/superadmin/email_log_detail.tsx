"use client";
import React from "react";
import { X, FileText, Clock, Mail, User, ShieldCheck } from "lucide-react";

interface EmailDetailsModalProps {
  log: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailDetailsModal({
  log,
  isOpen,
  onClose,
}: EmailDetailsModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="bg-slate-950 px-8 py-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[8px] font-black text-cyan-600 uppercase tracking-[0.4em] mb-1">
              Audit_Detailed_Inspection
            </div>
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">
              Log_Entry <span className="text-cyan-500">#{log.id}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                <Mail size={12} className="text-cyan-500" /> Recipient
              </div>
              <div className="text-sm text-white font-bold break-all">
                {log.recipient_email}
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-blue-500" />{" "}
                Protocol_Type
              </div>
              <div className="text-xs font-black text-blue-500 uppercase">
                {log.type?.name || "N/A"}
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                <User size={12} className="text-slate-500" /> User_Association
              </div>
              <div className="text-xs text-slate-400 font-bold">
                {log.user
                  ? `${log.user.first_name} ${log.user.last_name}`
                  : "GUEST_SYSTEM"}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div className="text-[8px] font-black text-cyan-600 uppercase tracking-[0.4em] mb-2">
              Subject_Line
            </div>
            <div className="text-lg text-white font-black italic">
              {log.subject}
            </div>
          </div>

          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center gap-2">
              <FileText size={14} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Raw_Payload_Content
              </span>

              <span className="ml-auto text-[8px] font-bold text-amber-500/50 uppercase tracking-tighter">
                Read_Only_Safe_Mode
              </span>
            </div>

            <div
              className="p-8 text-sm text-slate-400 font-sans leading-relaxed min-h-[200px] pointer-events-none select-text"
              dangerouslySetInnerHTML={{
                __html: log.body || "",
              }}
            />
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            <Clock size={12} /> Execution_Time:{" "}
            {new Date(log.sent_at).toLocaleString()}
          </div>
          <div className="text-[8px] font-black text-cyan-900 uppercase">
            Secure_Log_Viewer
          </div>
        </div>
      </div>
    </div>
  );
}
