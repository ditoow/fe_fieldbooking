import React from "react";

export default function BiodataForm({ formData, setFormData }: any) {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-6 bg-gray-300"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">Biodata Pemesan</h3>
            </div>
            <div className="bg-[#F5F2E9]/60 p-6 sm:p-8 rounded-2xl border border-[#E5C3A6]/20 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nama Lengkap</label>
                    <input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-[#EAE7DF] border-none rounded-lg px-4 py-3.5 text-sm font-bold text-[#1B3627] focus:ring-2 focus:ring-[#c29867] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nomor Handphone</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#EAE7DF] border-none rounded-lg px-4 py-3.5 text-sm font-bold text-[#1B3627] focus:ring-2 focus:ring-[#c29867] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address / NIM</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#EAE7DF] border-none rounded-lg px-4 py-3.5 text-sm font-bold text-[#1B3627] focus:ring-2 focus:ring-[#c29867] outline-none transition-all" />
                    <p className="text-[9px] text-gray-400 font-medium mt-1 italic">* We'll send your e-ticket here</p>
                </div>
            </div>
        </div>
    );
}