"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ScheduleCalendar from "@/app/(user)/components/User/ScheduleCalendar";
import { getFieldById } from "@/lib/api/field";
import { Field } from "@/lib/api/field";
import { useParams } from "next/navigation";
import axios from "axios";

export default function BookingDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string) || 1;

    const [field, setField] = useState<Field | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchField = async () => {
            try {
                const data = await getFieldById(id);
                setField(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || "Gagal memuat data lapangan.");
                } else {
                    setError("Terjadi kesalahan.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchField();
    }, [id]);

    return (
        <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#1B3627] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
                </Link>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#8CB954] animate-spin mb-4" />
                        <p className="text-[#1B3627] font-semibold text-sm">Memuat data lapangan...</p>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="text-center py-20">
                        <p className="text-lg font-bold text-red-500">{error}</p>
                        <Link href="/dashboard" className="text-sm text-[#1B3627] underline mt-4 inline-block">
                            Kembali ke Dashboard
                        </Link>
                    </div>
                )}

                {/* Content */}
                {!isLoading && !error && field && (
                    <ScheduleCalendar field={field} />
                )}
            </div>
        </div>
    );
}   