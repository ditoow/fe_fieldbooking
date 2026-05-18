import React from "react";
import { Building2, QrCode, UploadCloud, CheckCircle2 } from "lucide-react";

export default function PaymentMethod({ role, paymentMethod, setPaymentMethod, suratFile, handleFileChange }: any) {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-6 bg-gray-300"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">
                    {role === "mahasiswa" ? "Verifikasi Akademik" : "Metode Pembayaran"}
                </h3>
            </div>

            {role === "mahasiswa" ? (
                <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-[#8CB954] bg-[#8CB954]/5 text-center">
                    <p className="text-xs text-[#1B3627] font-medium mb-6 leading-relaxed">
                        Sebagai mahasiswa UDINUS, Anda berhak menggunakan fasilitas olahraga secara <strong className="font-black text-[#8CB954]">GRATIS</strong> untuk keperluan akademik atau UKM. Silakan unggah Surat Pengantar dari Tata Usaha (TU).
                    </p>

                    <input type="file" id="suratTU" accept=".pdf, .jpg, .png" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="suratTU" className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#8CB954]/40 bg-white rounded-xl hover:bg-[#8CB954]/10 transition-colors">
                        {suratFile ? (
                            <>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <span className="font-bold text-[#1B3627] text-sm">File Siap: {suratFile.name}</span>
                                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Klik untuk mengganti file</span>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-[#8CB954]/20 rounded-full flex items-center justify-center mb-3">
                                    <UploadCloud className="w-6 h-6 text-[#8CB954]" />
                                </div>
                                <span className="font-bold text-[#1B3627] text-sm mb-1">Unggah Surat TU</span>
                                <span className="text-xs text-gray-500">Mendukung format .PDF, .JPG, .PNG</span>
                            </>
                        )}
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div onClick={() => setPaymentMethod("bank")} className={`relative bg-white p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "bank" ? "border-[#8CB954] shadow-md" : "border-transparent hover:border-gray-200 shadow-sm"}`}>
                        <div className="absolute top-6 right-6">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "bank" ? "border-[#8CB954]" : "border-gray-300"}`}>
                                {paymentMethod === "bank" && <div className="w-2 h-2 rounded-full bg-[#8CB954]"></div>}
                            </div>
                        </div>
                        <Building2 className="w-6 h-6 text-[#1B3627] mb-4" />
                        <h4 className="font-black text-sm mb-2">Transfer Bank</h4>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-4">Verifikasi manual via Virtual Account.</p>
                        <div className="flex gap-2">
                            <span className="text-[8px] font-bold bg-gray-100 px-2 py-1 rounded">BCA</span>
                            <span className="text-[8px] font-bold bg-gray-100 px-2 py-1 rounded">MANDIRI</span>
                            <span className="text-[8px] font-bold bg-gray-100 px-2 py-1 rounded">BNI</span>
                        </div>
                    </div>

                    <div onClick={() => setPaymentMethod("qris")} className={`relative bg-white p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === "qris" ? "border-[#8CB954] shadow-md" : "border-transparent hover:border-gray-200 shadow-sm"}`}>
                        <div className="absolute top-6 right-6">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "qris" ? "border-[#8CB954]" : "border-gray-300"}`}>
                                {paymentMethod === "qris" && <div className="w-2 h-2 rounded-full bg-[#8CB954]"></div>}
                            </div>
                        </div>
                        <QrCode className="w-6 h-6 text-[#1B3627] mb-4" />
                        <h4 className="font-black text-sm mb-2">QRIS</h4>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-4">Scan with GoPay, OVO, or Mobile Banking.</p>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-4 object-contain opacity-80" />
                    </div>
                </div>
            )}
        </div>
    );
}