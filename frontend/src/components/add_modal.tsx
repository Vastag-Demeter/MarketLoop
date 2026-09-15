"use client";
import React from "react";
import { X, Save } from "lucide-react";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
}

export default function TerminalModal({
  isOpen,
  onClose,
  onSave,
  title,
  label,
  placeholder = "INPUT_VALUE...",
}: TerminalModalProps) {
  const [inputValue, setInputValue] = React.useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!inputValue.trim()) return;
    onSave(inputValue);
    setInputValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-950 px-8 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[8px] font-black text-cyan-600 uppercase tracking-[0.4em] mb-1">
              System_Command
            </div>
            <h2 className="text-xl font-black italic uppercase text-white tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              {label}
            </label>
            <input
              id="addPage.value"
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-slate-950 border border-slate-800 py-4 px-6 rounded-2xl text-sm font-mono text-white placeholder:text-slate-800 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <button
            id="addPage.submitBtn"
            onClick={handleSave}
            disabled={!inputValue.trim()}
            className="w-full group flex items-center justify-center gap-3 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98]"
          >
            <Save size={16} /> Execute_Create_Sequence
          </button>
        </div>
      </div>
    </div>
  );
}
