import React from "react";
import { Input } from "@/components/ui/input";

// 1. SOLUSI ERROR ANY: Kita buatkan tipe data (Interface) yang jelas untuk props
interface FormDataTypes {
    nama: string;
    phone: string;
    email: string;
}

interface BiodataFormProps {
    formData: FormDataTypes;
    setFormData: React.Dispatch<React.SetStateAction<FormDataTypes>>;
}

export default function BiodataForm({ formData, setFormData }: BiodataFormProps) {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                {/* 3. SOLUSI TAILWIND: Mengubah h-[1px] menjadi h-px */}
                <div className="h-px w-6 bg-gray-300"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">Biodata Pemesan</h3>
            </div>
            
            <div className="bg-[#F5F2E9]/60 p-6 sm:p-8 rounded-2xl border border-[#E5C3A6]/20 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nama Lengkap</label>
                    <Input 
                        type="text" 
                        value={formData.nama} 
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })} 
                        className="w-full bg-[#EAE7DF] border-none rounded-lg px-4 py-3.5 text-sm font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] outline-none transition-all h-auto" 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nomor Handphone</label>
                    <Input 
                        type="text" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        className="w-full bg-[#EAE7DF] border-none rounded-lg px-4 py-3.5 text-sm font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] outline-none transition-all h-auto" 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address / NIM</label>
                    <Input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className="w-full bg-[#EAE7DF] border-none rounded-lg px-4 py-3.5 text-sm font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] outline-none transition-all h-auto" 
                    />
                    {/* 2. SOLUSI ENTITIES: Mengganti We'll menjadi We&apos;ll */}
                    <p className="text-[9px] text-gray-400 font-medium mt-1 italic">
                        * We&apos;ll send your e-ticket here
                    </p>
                </div>
            </div>
        </div>
    );
}