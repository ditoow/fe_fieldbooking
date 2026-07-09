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
  const [activeTab, setActiveTab] = useState<'umum' | 'spesifikasi' | 'media' | 'maintenance'>('umum');

  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    jam_buka: '08:00 - 22:00',
    kapasitas: 'Tim Standar',
    spesifikasi: ['Ukuran Standar Internasional', 'Material Lantai Premium', 'Pencahayaan LED Terang', 'Level Kompetisi'],
    category: '',
    surface_type: 'vinyl',
    status: 'available',
    image: '',
    imageFile: null as File | null,
    additionalImageFiles: [] as File[],
    additionalImageUrls: [] as string[],
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
    setActiveTab('umum');
    const parsed = parseDescription(facility.description || '');
    setEditForm({
      name: facility.name || '',
      description: parsed.long_description || '',
      jam_buka: parsed.jam_buka || '08:00 - 22:00',
      kapasitas: parsed.kapasitas || 'Tim Standar',
      spesifikasi: parsed.spesifikasi ? parsed.spesifikasi.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      category: facility.category || '',
      surface_type: facility.surface_type || 'vinyl',
      status: facility.status || 'available',
      image: facility.image_url || '',
      imageFile: null,
      additionalImageFiles: [],
      additionalImageUrls: facility.carousel_urls || [],
    });
    setOpenDropdownId(null);
  };

  const handleAddClick = () => {
    setIsAddingFacility(true);
    setEditingFacility(null);
    setActiveTab('umum');
    setEditForm({
      name: '',
      description: '',
      jam_buka: '08:00 - 22:00',
      kapasitas: 'Tim Standar',
      spesifikasi: [],
      category: '',
      surface_type: 'vinyl',
      status: 'available',
      image: '',
      imageFile: null,
      additionalImageFiles: [],
      additionalImageUrls: [],
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      const extraFiles = files.slice(1);
      const extraUrls = extraFiles.map(f => URL.createObjectURL(f));

      setEditForm(prev => ({ 
        ...prev, 
        image: url, 
        imageFile: file,
        additionalImageFiles: [...prev.additionalImageFiles, ...extraFiles],
        additionalImageUrls: [...prev.additionalImageUrls, ...extraUrls]
      }));
    }
  };

  const handleAddMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const urls = files.map(f => URL.createObjectURL(f));
      
      setEditForm(prev => ({
        ...prev,
        additionalImageFiles: [...prev.additionalImageFiles, ...files],
        additionalImageUrls: [...prev.additionalImageUrls, ...urls]
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setEditForm(prev => {
      const newFiles = [...prev.additionalImageFiles];
      const newUrls = [...prev.additionalImageUrls];
      newFiles.splice(index, 1);
      newUrls.splice(index, 1);
      return {
        ...prev,
        additionalImageFiles: newFiles,
        additionalImageUrls: newUrls
      };
    });
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
        editForm.spesifikasi.filter(s => s.trim() !== '').join(', ')
      ].join('|||');
      formData.append('description', dataToSave);
      
      formData.append('category', editForm.category);
      formData.append('surface_type', editForm.surface_type);
      formData.append('status', editForm.status);
      
      if (editForm.imageFile) {
        formData.append('image_file', editForm.imageFile);
      }
      
      // Append additional images for backend (if supported in the future)
      editForm.additionalImageFiles.forEach((file, idx) => {
        formData.append(`images[${idx}]`, file);
      });

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
            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              {/* Custom Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('umum')}
                  className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'umum' ? 'border-ugo-primary text-ugo-primary' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                >
                  Informasi Umum
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('spesifikasi')}
                  className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'spesifikasi' ? 'border-ugo-primary text-ugo-primary' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                >
                  Spesifikasi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'media' ? 'border-ugo-primary text-ugo-primary' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                >
                  Galeri Foto
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('maintenance')}
                  className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'maintenance' ? 'border-ugo-primary text-ugo-primary' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                >
                  Maintenance
                </button>
              </div>

              <div className="space-y-4">
                {/* TAB UMUM */}
                {activeTab === 'umum' && (
                  <div className="space-y-4 fade-in animate-in duration-300">
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
                        rows={4}
                        placeholder="Deskripsi fasilitas lapangan..."
                        className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium custom-scrollbar"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1.5">Jam Buka</label>
                        <input 
                          type="text" 
                          value={editForm.jam_buka}
                          onChange={(e) => setEditForm({...editForm, jam_buka: e.target.value})}
                          placeholder="08:00 - 22:00"
                          className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1.5">Kapasitas</label>
                        <input 
                          type="text" 
                          value={editForm.kapasitas}
                          onChange={(e) => setEditForm({...editForm, kapasitas: e.target.value})}
                          placeholder="Contoh: 10 Orang"
                          className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1.5">Kategori *</label>
                        <select 
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium appearance-none"
                        >
                          <option value="">Pilih Kategori...</option>
                          <option value="Futsal">Futsal</option>
                          <option value="Mini Soccer">Mini Soccer</option>
                          <option value="Badminton">Badminton</option>
                          <option value="Voli">Voli</option>
                          <option value="Tenis">Tenis</option>
                          <option value="Basket">Basket</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1.5">Tipe Permukaan</label>
                        <select 
                          value={editForm.surface_type}
                          onChange={(e) => setEditForm({...editForm, surface_type: e.target.value})}
                          className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium appearance-none"
                        >
                          <option value="vinyl">Vinyl</option>
                          <option value="sintetis">Rumput Sintetis</option>
                          <option value="kayu">Lantai Kayu</option>
                          <option value="semen">Semen / Plester</option>
                          <option value="tanah">Tanah / Rumput Asli</option>
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
                )}

                {/* TAB SPESIFIKASI */}
                {activeTab === 'spesifikasi' && (
                  <div className="space-y-4 fade-in animate-in duration-300">
                    <div>
                      <div className="space-y-3">
                        {editForm.spesifikasi.map((spec, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input 
                              type="text"
                              value={spec}
                              onChange={(e) => {
                                const newSpecs = [...editForm.spesifikasi];
                                newSpecs[index] = e.target.value;
                                setEditForm({...editForm, spesifikasi: newSpecs});
                              }}
                              placeholder={`Spesifikasi ${index + 1}`}
                              className="flex-1 px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecs = editForm.spesifikasi.filter((_, i) => i !== index);
                                setEditForm({...editForm, spesifikasi: newSpecs});
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {editForm.spesifikasi.length < 4 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (editForm.spesifikasi.length < 4) {
                                setEditForm({...editForm, spesifikasi: [...editForm.spesifikasi, '']});
                              }
                            }}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold text-sm hover:border-ugo-primary hover:text-ugo-primary transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Tambah Spesifikasi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB MEDIA (FOTO & CAROUSEL) */}
                {activeTab === 'media' && (
                  <div className="space-y-6 fade-in animate-in duration-300">
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Foto Fasilitas Utama</p>
                      <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 group flex items-center justify-center mb-4">
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
                                Ubah Foto Utama
                              </div>
                            </label>
                          </>
                        ) : (
                          <label htmlFor="facility-image-upload" className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-ugo-primary transition-colors cursor-pointer w-full h-full justify-center">
                            <UploadCloud className="w-8 h-8" />
                            <span className="text-sm font-medium">Upload Foto Utama</span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Additional Images Carousel */}
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-700">Galeri Tambahan (Carousel)</p>
                        <label htmlFor="additional-image-upload" className="text-xs font-bold text-ugo-primary hover:text-ugo-sidebar cursor-pointer bg-ugo-primary/10 px-3 py-1 rounded-full transition-colors flex items-center gap-1">
                          <UploadCloud className="w-3 h-3" /> Tambah Foto
                        </label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="additional-image-upload" 
                          className="hidden" 
                          multiple
                          onChange={handleAddMoreImages}
                        />
                      </div>
                      
                      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {editForm.additionalImageUrls.map((url, idx) => (
                          <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              onClick={(e) => { e.preventDefault(); removeAdditionalImage(idx); }}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {editForm.additionalImageUrls.length === 0 && (
                          <div className="w-full py-6 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                            <span className="text-xs font-medium">Belum ada foto tambahan.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB MAINTENANCE */}
                {activeTab === 'maintenance' && (
                  <div className="space-y-4 fade-in animate-in duration-300">
                    <p className="text-sm text-gray-500 text-center py-8">
                      Pengaturan maintenance atau jadwal perawatan lapangan (Dalam pengembangan).
                    </p>
                  </div>
                )}
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
