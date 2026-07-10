"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { getAllFields } from "@/lib/api/field";
import { motion } from "framer-motion";

const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600";

interface Court {
  id: number;
  name: string;
  image_url: string;
  category: string;
  status: string;
  description: string;
}

export default function Exploration() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fields = await getAllFields();
        setCourts(
          fields.map((f: any) => ({
            id: f.id,
            name: f.name,
            image_url: f.image_url || fallbackImage,
            category: f.category,
            status: f.status,
            description: f.surface_type ? `${f.surface_type} • ${f.status === "available" ? "Tersedia" : "Maintenance"}` : "",
          }))
        );
      } catch {
        setCourts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  return (
    <section id="fasilitas" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-end mb-10"
      >
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Fasilitas Udinus</p>
          <h2 className="text-3xl font-bold text-[#1B3627]">EKSPLORASI LAPANGAN</h2>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-[#1B3627] flex items-center hover:underline">
          LIHAT SEMUA LAPANGAN <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#1B3627] animate-spin" />
          </div>
        ) : courts.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400 font-semibold">
            Belum ada lapangan tersedia
          </div>
        ) : (
          courts.slice(0, 3).map((court) => (
            <motion.div 
              key={court.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
              }}
            >
              <Link href={`/lapangan/${court.id}`} className="relative group overflow-hidden rounded bg-[#1B3627] text-white aspect-[4/5] shadow-lg block">
              <img
                src={court.image_url}
                alt={court.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B3627] via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded uppercase mb-3 inline-block ${
                    court.status === "available"
                      ? "bg-[#EAD0B3] text-[#1B3627]"
                      : "border border-[#EAD0B3] text-[#EAD0B3]"
                  }`}
                >
                  {court.status === "available" ? "Tersedia" : "Maintenance"}
                </span>
                <h3 className="text-xl font-bold mb-1">{court.name}</h3>
                <p className="text-xs text-gray-300 mb-4">{court.description}</p>
                <span className="text-sm font-semibold flex items-center hover:text-[#EAD0B3] transition">
                  LIHAT JADWAL <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
              </Link>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}
