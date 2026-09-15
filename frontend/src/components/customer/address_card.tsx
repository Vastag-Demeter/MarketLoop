"use client";
import { MapPin, Pencil, Trash2 } from "lucide-react";

interface AddressCardProps {
  addr: any;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

export default function AddressCard({
  addr,
  onDelete,
  onEdit,
}: AddressCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-cyan-500/30 rounded-tl" />
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-sm relative overflow-hidden group-hover:border-cyan-500/30 transition-all duration-500">
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex flex-col">
            <span className="text-[9px] text-cyan-500 uppercase tracking-[0.3em] mb-1">
              Node_ID: 0{addr.id}
            </span>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
              Location_Point
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit()}
              className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(addr.id)}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6 relative z-10 text-slate-300 font-bold italic">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[8px] text-slate-600 uppercase tracking-widest block mb-1">
                Region_Country
              </label>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                {addr.country.name}
              </div>
            </div>
            <div>
              <label className="text-[8px] text-slate-600 uppercase tracking-widest block mb-1">
                Sector_City
              </label>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                {addr.city.postal_code} {addr.city.name}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[8px] text-slate-600 uppercase tracking-widest block mb-1">
              Primary_Vector_Address
            </label>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-slate-200">
              <span>
                {addr.street.name} {addr.house_number}.
              </span>
              <MapPin size={14} className="text-cyan-500/50" />
            </div>
          </div>

          {(addr.floor || addr.door) && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col border-l border-cyan-500/20 pl-3">
                <span className="text-[8px] text-slate-600 uppercase tracking-widest">
                  Level_Floor
                </span>
                <span className="text-xs font-mono text-cyan-500/70">
                  {addr.floor || "NULL"}
                </span>
              </div>
              <div className="flex flex-col border-l border-cyan-500/20 pl-3">
                <span className="text-[8px] text-slate-600 uppercase tracking-widest">
                  Access_Unit
                </span>
                <span className="text-xs font-mono text-cyan-500/70">
                  {addr.door || "NULL"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
