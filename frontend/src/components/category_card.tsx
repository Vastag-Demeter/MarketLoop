"use client";
import Link from "next/link";
import { ICategory } from "@/src/interfaces/category";

export default function CategoryCard({ category }: { category: ICategory }) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <div className="group relative bg-slate-900/40 border border-slate-800 p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] h-full flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 right-0 p-4 opacity-5 font-mono text-4xl font-black italic">
          {category.name.substring(0, 2)}
        </div>

        <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/30 group-hover:bg-cyan-500/5 transition-all duration-500">
          <span className="text-2xl group-hover:scale-110 transition-transform">
            📦
          </span>
        </div>

        <h3 className="text-white font-black uppercase tracking-tighter text-xl group-hover:text-cyan-400 transition-colors">
          {category.name}
        </h3>

        <p className="text-[9px] font-mono text-slate-600 mt-2 uppercase tracking-[0.3em]">
          Access_Hardware_Line
        </p>

        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-500 group-hover:w-full transition-all duration-700" />
      </div>
    </Link>
  );
}
