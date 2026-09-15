"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-2xl">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Market <span className="text-cyan-500">Loop</span>
          </h1>
          <div className="h-1 w-12 bg-cyan-500 mt-2 rounded-full mx-auto md:mx-0"></div>
        </div>

        <div className="space-y-6 text-lg leading-relaxed text-center md:text-left">
          <p>
            Your all-in-one destination for everything you need. From the latest
            fashion and gaming gear to home essentials and tech, we bring every
            category into one seamless experience.
          </p>

          <div className="py-6 px-8 bg-slate-900/50 border border-slate-700 rounded-2xl shadow-inner">
            <p className="font-mono text-sm md:text-base text-cyan-400 leading-7">
              <span className="text-purple-400">while</span> (
              <span className="text-cyan-500">true</span>) {"{"} <br />
              &nbsp;&nbsp;<span className="text-white">select</span>(); <br />
              &nbsp;&nbsp;<span className="text-white">order</span>(); <br />
              &nbsp;&nbsp;<span className="text-white">enjoy</span>(); <br />
              {"}"}
            </p>
          </div>

          <p className="text-slate-400">
            High quality, vast selection, and a never-ending commitment to our
            customers. Welcome to the perfect loop of shopping.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/products"
            className="block w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black rounded-xl transition-all uppercase tracking-[0.2em] text-center text-xs shadow-lg shadow-cyan-900/20"
          >
            Explore Market
          </Link>
        </div>
      </div>
    </div>
  );
}
