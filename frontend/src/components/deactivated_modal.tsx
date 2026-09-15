"use client";

interface DeactivatedModalProps {
  isOpen: boolean;
  onExit: () => void;
}

export default function DeactivatedModal({
  isOpen,
  onExit,
}: DeactivatedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 font-mono">
      <div className="bg-slate-950 border border-cyan-500/30 w-full max-w-sm p-8 rounded-[2rem] text-center shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)]">
        <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
          <span className="text-cyan-500 text-2xl">✓</span>
        </div>

        <h2 className="text-2xl font-black italic uppercase text-white mb-2">
          Account <span className="text-cyan-500">Deactivated</span>
        </h2>

        <p className="text-slate-400 text-[10px] mb-8 uppercase tracking-widest">
          Access terminated. Redirection pending.
        </p>

        <button
          onClick={onExit}
          className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all text-xs"
        >
          Acknowledge & Exit
        </button>
      </div>
    </div>
  );
}
