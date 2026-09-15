export default function DataInput({
  label,
  value,
  onChange,
  placeholder,
  type,
  id,
}: any) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[9px] text-slate-500 font-black uppercase ml-1 tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        id={id || null}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-900/40 border border-slate-800 text-white p-4 rounded-2xl focus:border-cyan-500 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
      />
    </div>
  );
}
