"use client";

import { useState, useEffect } from 'react';
import { Plus, MoreVertical, PlusCircle, Edit2, Trash2, X, UploadCloud, Image as ImageIcon, Loader2, Eye } from 'lucide-react';
import { getAllFields, Field } from '@/lib/api/field/getAll';
import { createField, updateField, deleteField } from '@/lib/api/admin/field';
import axios from 'axios';
const parseDescription = (desc: string) => {
  if (!desc) return { long_description: '', jam_buka: '08:00 - 22:00', kapasitas: 'Tim Standar', spesifikasi: 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi' };
  
  if (desc.includes('|||')) {
    const parts = desc.split('|||');
    return {
      long_description: parts[0] || '',
      jam_buka: parts[1] || '08:00 - 22:00',
      kapasitas: parts[2] || 'Tim Standar',
      spesifikasi: parts[3] || 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi'
    };
  }

  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === 'object' && 'long_description' in parsed) {
      return parsed;
    }
  } catch(e) {}
  return {
    long_description: desc,
    jam_buka: '08:00 - 22:00',
    kapasitas: 'Tim Standar',
    spesifikasi: 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi'
  };
};

export default function KelolaLapanganPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingFacility, setEditingFacility] = useState<Field | null>(null);
  const [isAddingFacility, setIsAddingFacility] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    jam_buka: '08:00 - 22:00',
    kapasitas: 'Tim Standar',
    spesifikasi: 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi',
    category: '',
    surface_type: 'vinyl',
    status: 'available',
    image: '',
    imageFile: null as File | null,
  });

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const data = await getAllFields();
      setFields(data);
    } catch (error) {
      console.error("Failed to fetch fields", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleEditClick = (facility: Field) => {
    setEditingFacility(facility);
    setIsAddingFacility(false);
    const parsed = parseDescription(facility.description || '');
    setEditForm({
      name: facility.name || '',
      description: parsed.long_description || '',
      jam_buka: parsed.jam_buka || '08:00 - 22:00',
      kapasitas: parsed.kapasitas || 'Tim Standar',
      spesifikasi: parsed.spesifikasi || 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi',
      category: facility.category || '',
      surface_type: facility.surface_type || 'vinyl',
      status: facility.status || 'available',
      image: facility.image_url || '',
      imageFile: null,
    });
    setOpenDropdownId(null);
  };

  const handleAddClick = () => {
    setIsAddingFacility(true);
    setEditingFacility(null);
    setEditForm({
      name: '',
      description: '',
      jam_buka: '08:00 - 22:00',
      kapasitas: 'Tim Standar',
      spesifikasi: 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi',
      category: '',
      surface_type: 'vinyl',
      status: 'available',
      image: '',
      imageFile: null,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditForm({ ...editForm, image: url, imageFile: file });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus lapangan ini?")) return;
    
    try {
      setOpenDropdownId(null);
      await deleteField(id);
      await fetchFields();
      alert("Lapangan berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Gagal menghapus lapangan.");
    }
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.description || !editForm.category) {
      alert("Harap lengkapi semua field yang wajib.");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('name', editForm.name);
      
      const dataToSave = [
        editForm.description,
        editForm.jam_buka,
        editForm.kapasitas,
        editForm.spesifikasi
      ].join('|||');
      formData.append('description', dataToSave);
      
      formData.append('category', editForm.category);
      formData.append('surface_type', editForm.surface_type);
      formData.append('status', editForm.status);
      
      if (editForm.imageFile) {
        formData.append('image_file', editForm.imageFile);
      }

      if (isAddingFacility) {
        await createField(formData);
        alert("Lapangan berhasil ditambahkan!");
      } else if (editingFacility) {
        await updateField(editingFacility.id, formData);
        alert("Lapangan berhasil diupdate!");
      }

      setEditingFacility(null);
      setIsAddingFacility(false);
      await fetchFields();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menyimpan data.");
      } else {
        alert("Terjadi kesalahan.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Kelola Lapangan</h1>
          <p className="text-gray-500 text-sm">
            Manajemen unit fasilitas, deskripsi, dan status ketersediaan.
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-ugo-primary hover:bg-ugo-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Lapangan
        </button>
      </div>

      {/* Grid Layout */}
      {isLoading ? (
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-ugo-primary" />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((facility) => (
          <div key={facility.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            {/* Image Container */}
            <div className="h-[180px] w-full relative bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={facility.image_url || 'https://via.placeholder.com/600x400?text=No+Image'} 
                alt={facility.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {facility.status === 'available' ? (
                  <span className="bg-ugo-status-aktif-bg text-ugo-status-aktif-text px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    AKTIF
                  </span>
                ) : (
                  <span className="bg-ugo-status-maintenance-bg text-ugo-status-maintenance-text px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    PERBAIKAN
                  </span>
                )}
              </div>
              
              {/* Dropdown Menu Trigger */}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === facility.id ? null : facility.id)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white shadow-md transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openDropdownId === facility.id && (
                  <div className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                    <button 
                      onClick={() => handleEditClick(facility)}
                      className="w-full px-4 py-2.5 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-50"
                    >
                      <Edit2 className="w-4 h-4 text-ugo-primary" />
                      Edit Data
                    </button>
                    <button 
                      onClick={() => handleDelete(facility.id)}
                      className="w-full px-4 py-2.5 text-sm font-medium text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{facility.category}</p>
              <h3 className="font-bold text-lg text-ugo-sidebar mb-2">{facility.name}</h3>
              <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-2">
                {parseDescription(facility.description || '').long_description}
              </p>
              
              <div className="flex justify-between items-end">
                <p className="text-xs text-gray-500 font-medium">Permukaan</p>
                <p className="font-bold text-sm text-ugo-primary uppercase">{facility.surface_type}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <div 
          onClick={handleAddClick}
          className="rounded-2xl border-2 border-dashed border-ugo-primary/40 bg-ugo-primary/5 hover:bg-ugo-primary/10 hover:border-ugo-primary cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[300px] text-center p-6 group"
        >
          <div className="w-16 h-16 rounded-full bg-[#D4A574] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full border-[1.5px] border-white flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-ugo-sidebar mb-2">Tambah Unit Baru</h3>
          <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed">Klik untuk menambahkan fasilitas atau lapangan baru ke dalam sistem.</p>
        </div>
      </div>
      )}

      {/* ========================================== */}
      {/* ADD/EDIT MODAL DIALOG */}
      {/* ========================================== */}
      {(editingFacility || isAddingFacility) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ugo-sidebar/40 backdrop-blur-sm p-4 fade-in animate-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-ugo-sidebar">
                {isAddingFacility ? 'Tambah Lapangan Baru' : 'Edit Data Lapangan'}
              </h2>
              <button 
                onClick={() => {
                  setEditingFacility(null);
                  setIsAddingFacility(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              
              {/* Photo Edit Section */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">Foto Fasilitas</p>
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 group flex items-center justify-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="facility-image-upload" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                  {editForm.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={editForm.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                        }}
                      />
                      <label htmlFor="facility-image-upload" className="absolute inset-0 bg-ugo-sidebar/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <div className="bg-white text-ugo-sidebar px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-ugo-primary hover:text-white transition-colors">
                          <ImageIcon className="w-4 h-4" />
                          Ubah Foto
                        </div>
                      </label>
                    </>
                  ) : (
                    <label htmlFor="facility-image-upload" className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-ugo-primary transition-colors cursor-pointer w-full h-full justify-center">
                      <UploadCloud className="w-8 h-8" />
                      <span className="text-sm font-medium">Klik untuk upload foto</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">Nama Lapangan *</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Contoh: Lapangan Futsal A"
                    className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">Deskripsi Lapangan *</label>
                  <textarea 
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    placeholder="Deskripsi fasilitas lapangan..."
                    className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Jam Buka</label>
                    <input 
                      type="text" 
                      value={editForm.jam_buka}
                      onChange={(e) => setEditForm({...editForm, jam_buka: e.target.value})}
                      placeholder="Contoh: 08:00 - 22:00"
                      className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Kapasitas</label>
                    <input 
                      type="text" 
                      value={editForm.kapasitas}
                      onChange={(e) => setEditForm({...editForm, kapasitas: e.target.value})}
                      placeholder="Contoh: Tim Standar"
                      className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1.5">Spesifikasi Lapangan (Pisahkan dengan koma)</label>
                  <textarea 
                    value={editForm.spesifikasi}
                    onChange={(e) => setEditForm({...editForm, spesifikasi: e.target.value})}
                    rows={2}
                    placeholder="Contoh: Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED"
                    className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Kategori *</label>
                    <input 
                      type="text" 
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      placeholder="Contoh: Futsal"
                      className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Tipe Permukaan</label>
                    <select 
                      value={editForm.surface_type}
                      onChange={(e) => setEditForm({...editForm, surface_type: e.target.value})}
                      className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                    >
                      <option value="vinyl">Vinyl</option>
                      <option value="parket">Parket</option>
                      <option value="semen">Semen</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Status Operasional</label>
                  <div className="relative flex items-center p-1.5 bg-gray-100 rounded-xl w-full h-14 border border-gray-200">
                    {/* Sliding Background */}
                    <div 
                      className={`absolute top-1.5 bottom-1.5 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                        editForm.status === 'available' 
                          ? 'left-1.5 w-[calc(50%-6px)] bg-ugo-sidebar' 
                          : 'left-[50%] w-[calc(50%-6px)] bg-ugo-status-menunggu-text'
                      }`}
                    ></div>
                    
                    {/* Labels */}
                    <button
                      type="button"
                      onClick={() => setEditForm({...editForm, status: 'available'})}
                      className={`relative flex-1 text-center text-sm font-bold z-10 transition-colors duration-300 ${
                        editForm.status === 'available' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      AKTIF
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({...editForm, status: 'maintenance'})}
                      className={`relative flex-1 text-center text-sm font-bold z-10 transition-colors duration-300 ${
                        editForm.status === 'maintenance' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      PERBAIKAN
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => {
                  setEditingFacility(null);
                  setIsAddingFacility(false);
                }}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-bold text-white bg-ugo-primary hover:bg-ugo-primary/90 rounded-lg shadow-sm transition-colors flex items-center justify-center min-w-[120px]"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isAddingFacility ? 'Simpan Unit Baru' : 'Simpan Perubahan'
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
