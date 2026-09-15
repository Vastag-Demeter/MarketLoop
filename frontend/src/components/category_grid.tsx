"use client";
import { useRef, useEffect } from "react";
import CategoryCard from "@/src/components/category_card";
import { ICategory } from "../interfaces/category";
export default function CategoryGrid({
  categories,
}: {
  categories: ICategory[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      el.scrollLeft += e.deltaY * 1.2;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [categories]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.4em] italic">
          Browse_<span className="text-cyan-500">Departments</span>
        </h2>
        <div className="h-[2px] w-24 bg-cyan-500 mx-auto mt-4 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 pb-10 custom-scrollbar select-none cursor-grab active:cursor-grabbing overscroll-contain"
      >
        {categories.map((cat: ICategory) => (
          <div key={cat.id} className="min-w-[300px] md:min-w-[350px] shrink-0">
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </section>
  );
}
