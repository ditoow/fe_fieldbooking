"use client";

import React, { useEffect, useState } from 'react';
import { getFieldStats } from '@/lib/api/field/getAll';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stats() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getFieldStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Booking Berhasil", value: statsData ? `${statsData.total_bookings}+` : "0+" },
    { label: "Pilihan Lapangan", value: statsData ? `${statsData.total_fields}` : "0" },
    { label: "Pengguna Aktif", value: statsData ? `${statsData.active_users}` : "0" },
    { label: "Tingkat Kepuasan", value: statsData ? `${statsData.satisfaction_rate}%` : "0%" },
  ];

  return (
    <div className="bg-[#1B3627] relative z-10 border-t border-white/20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-8 h-8 text-[#EAD0B3] animate-spin" />
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                }}
              >
                <h4 className="text-3xl font-bold text-[#EAD0B3]">{stat.value}</h4>
                <p className="text-xs text-gray-300 mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}