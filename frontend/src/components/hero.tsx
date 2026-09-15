"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
          EVERYTHING YOU NEED. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            IN ONE PERFECT LOOP.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
          From gaming setups to fashion trends – we’ve parsed the best deals so
          you don’t have to. Select, order, and enjoy the cycle.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/20 uppercase tracking-tighter"
          >
            Start Shopping
          </Link>

          <Link
            href="/about"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all uppercase tracking-tighter"
          >
            How it works
          </Link>
        </div>

        <div className="mt-16 opacity-20 hidden md:block">
          <code className="text-sm font-mono text-slate-500">
            {`// initializing market_loop... [OK]`} <br />
            {`// loading_categories: ["gaming", "fashion", "tech", "home"]`}
          </code>
        </div>
      </div>
    </section>
  );
}
