"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { submitRating } from "@/lib/api/rating";
import { HistoryItem } from "@/app/(user)/riwayat/page";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingItem: HistoryItem | null;
    onSuccess: () => void;
}

export default function RatingModal({
    isOpen,
    onClose,
    bookingItem,
    onSuccess,
}: RatingModalProps) {
    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setRating(5);
            setHoverRating(0);
            setReview("");
            setError("");
        }
    }, [isOpen]);

    if (!bookingItem) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            setError("Harap pilih rating antara 1 sampai 5.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await submitRating(Number(bookingItem.id), {
                rating,
                review: review.trim() || undefined
            });

            alert(res.message || "Terima kasih! Ulasan Anda berhasil dikirim.");
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Gagal mengirim ulasan:", err);
            setError(err.response?.data?.message || err.message || "Gagal mengirim rating. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#FDFBF5] border-gray-200 p-0 overflow-hidden sm:max-w-sm [&>button]:text-white [&>button]:top-5 [&>button]:right-5">
                <DialogHeader className="bg-[#1B3627] text-white p-6 text-center m-0">
                    <DialogTitle className="text-base font-bold tracking-wide text-center">
                        Beri Penilaian
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center space-y-1">
                            <h3 className="text-sm font-bold text-[#1B3627]">{bookingItem.title}</h3>
                            <p className="text-[11px] text-gray-500 font-medium">Bagikan pengalaman bermain Anda</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        {/* Star Rating Selector */}
                        <div className="flex justify-center items-center gap-2 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1.5 transition-transform hover:scale-110 active:scale-95 outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= (hoverRating || rating)
                                                ? "fill-[#E5C3A6] text-[#E5C3A6]"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Optional Review Textarea */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Tulis Ulasan (Opsional)
                            </label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Bagaimana kondisi lapangan, kebersihan, atau pelayanan?"
                                rows={3}
                                maxLength={1000}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] outline-none resize-none"
                            />
                        </div>

                        <div className="flex gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 border border-gray-200 text-xs font-bold rounded text-gray-500 hover:bg-gray-50 transition tracking-wide disabled:opacity-50"
                            >
                                BATAL
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 bg-[#8b5a2b] hover:bg-[#724a23] text-white text-xs font-bold rounded transition tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        MENGIRIM...
                                    </>
                                ) : (
                                    "KIRIM"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
