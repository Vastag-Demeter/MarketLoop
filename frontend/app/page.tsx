"use client";
import { useState, useEffect } from "react";
import api from "@/src/axios";
import Hero from "@/src/components/hero";
import CategoryGrid from "@/src/components/category_grid";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/getActiveCategories");
        // Ha a backend pl. response.data.data-ban küldi:
        setCategories(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to sync categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main
      className="min-h-screen bg-slate-950 overflow-hidden"
      suppressHydrationWarning
    >
      <Hero />
      <CategoryGrid categories={categories} />
    </main>
  );
}
