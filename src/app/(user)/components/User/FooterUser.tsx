import React from "react";
import Link from "next/link";

export default function FooterUser() {
    return (
        <footer className="bg-[#1B3627] text-white font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-6">

                {/* Main Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-14">

                    {/* Kolom 1: Brand */}
                    <div className="space-y-4">
                        <span className="font-bold text-xl tracking-wide">MyUGO</span>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Platform manajemen pemesanan fasilitas olahraga modern yang dirancang untuk kemudahan dan efisiensi komunitas kampus.
                        </p>
                        <div className="flex gap-3 pt-1">
                        </div>
                    </div>

                    {/* Kolom 2: Tautan Cepat */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-sm text-white">Tautan Cepat</h4>
                        <ul className="space-y-4">
                            {[
                                { label: "Beranda", href: "/dashboard" },
                                { label: "Fasilitas", href: "/dashboard" },
                                { label: "Pesan Lapangan", href: "/dashboard" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Hubungi Kami */}
                    <div className="space-y-5">
                        <h4 className="font-semibold text-sm text-white">Hubungi Kami</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="mailto:admin@udinus.ac.id" className="text-sm text-gray-400 hover:text-white transition">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-6" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
                    <p>© 2026 MyUGO. Seluruh hak cipta dilindungi.</p>
                    <div className="flex gap-6">
                        <span>V 2.1.0</span>
                        <span>System Status: <span className="text-green-400">Online</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
