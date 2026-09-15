import { ICreditCard } from "../interfaces/card";

interface CreditCardProps {
  card: ICreditCard;
  onDelete: (id: string) => void;
}

export default function CreditCard({ card, onDelete }: CreditCardProps) {
  const isVisa = card.card_type?.toLowerCase() === "visa";
  const glowColor = isVisa
    ? "group-hover:shadow-blue-500/20"
    : "group-hover:shadow-cyan-500/20";
  const textColor = isVisa
    ? "group-hover:text-blue-400"
    : "group-hover:text-cyan-400";

  return (
    <div
      className={`relative group p-6 bg-gradient-to-br w-full from-slate-900 to-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-500 overflow-hidden shadow-2xl ${glowColor}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(String(card.id));
        }}
        className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/50 backdrop-blur-md rounded-full text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white"
      >
        <span className="text-xs">×</span> De-Link_Asset
      </button>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div
        className={`absolute top-4 right-6 text-[10px] font-mono font-black italic transition-colors uppercase tracking-[0.2em] ${textColor}`}
      >
        {card.card_type || "Standard_Asset"}
      </div>

      <div className="relative z-10 space-y-8 group-hover:opacity-40 transition-opacity duration-300">
        <div className="flex justify-between items-center">
          <div className="w-10 h-8 bg-gradient-to-br from-amber-400/40 to-amber-600/20 border border-amber-500/30 rounded-md relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 gap-px opacity-20">
              <div className="border-b border-r border-amber-900"></div>
              <div className="border-b border-amber-900"></div>
            </div>
          </div>
          <div className="flex gap-1 opacity-30">
            <div className="w-[2px] h-4 bg-slate-500 rounded-full"></div>
            <div className="w-[2px] h-4 bg-slate-500 rounded-full scale-y-75"></div>
            <div className="w-[2px] h-4 bg-slate-500 rounded-full scale-y-50"></div>
          </div>
        </div>

        <div className="font-mono text-xl tracking-[0.25em] text-white drop-shadow-md">
          <span className="text-slate-600 italic">****</span>
          <span className="text-slate-600 mx-1 italic">****</span>
          <span className="text-slate-600 mx-1 italic">****</span>
          <span className="ml-1 text-cyan-500/80">{card.last_four}</span>
        </div>

        <div className="flex justify-between items-end font-mono">
          <div className="space-y-1">
            <div className="text-[7px] text-slate-500 uppercase tracking-[0.3em]">
              Authorized_Holder
            </div>
            <div className="text-[10px] text-slate-300 uppercase tracking-tighter">
              User_Identity_Confirmed
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-[7px] text-slate-500 uppercase tracking-[0.3em]">
              Expiry_Date
            </div>
            <div className="text-[10px] text-slate-200 tracking-tighter">
              {card.expiration_date}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-red-500 to-transparent group-hover:w-full transition-all duration-700 opacity-50`}
      ></div>
    </div>
  );
}
