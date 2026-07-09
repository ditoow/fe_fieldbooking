"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getAllFields, Field } from "@/lib/api/field/getAll";
import { createField, updateField, deleteField } from "@/lib/api/admin/field";
import {
  getMaintenances,
  createMaintenance,
  deleteMaintenance,
  MaintenanceItem,
} from "@/lib/api/admin/maintenance";
import { useConfirm } from "@/lib/hooks/use-confirm";
import axios from "axios";
import toast from "react-hot-toast";

const parseDescription = (desc: string) => {
  if (!desc)
    return {
      long_description: "",
      jam_buka: "08:00 - 22:00",
      kapasitas: "Tim Standar",
      spesifikasi: "",
    };
  if (desc.includes("|||")) {
    const p = desc.split("|||");
    return {
      long_description: p[0] || "",
      jam_buka: p[1] || "08:00 - 22:00",
      kapasitas: p[2] || "Tim Standar",
      spesifikasi: p[3] || "",
    };
  }
  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === "object" && "long_description" in parsed)
      return parsed;
  } catch (e) {}
  return {
    long_description: desc,
    jam_buka: "08:00 - 22:00",
    kapasitas: "Tim Standar",
    spesifikasi: "",
  };
};

const MAX_GALLERY = 4;

export default function KelolaLapanganPage() {
  const { confirm, ConfirmModal } = useConfirm();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingFacility, setEditingFacility] = useState<Field | null>(null);
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "umum" | "spesifikasi" | "media" | "maintenance"
  >("umum");
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    surface_type: "vinyl" as string,
    status: "available",
    image: "",
    imageFile: null as File | null,
    additionalImageFiles: [] as File[],
    additionalImageUrls: [] as string[],
  });
  const [specsList, setSpecsList] = useState<
    { name: string; content: string }[]
  >([]);
  const [maintenances, setMaintenances] = useState<MaintenanceItem[]>([]);
  const [newMaintenance, setNewMaintenance] = useState({
    date: "",
    start_time: "",
    end_time: "",
    reason: "",
  });
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false);

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

  const fetchMaintenances = async (fieldId: number) => {
    try {
      const data = await getMaintenances(fieldId);
      setMaintenances(data);
    } catch (error) {
      console.error("Failed to fetch maintenances", error);
    }
  };

  const handleEditClick = (facility: Field) => {
    setEditingFacility(facility);
    setIsAddingFacility(false);
    setActiveTab("umum");
    const parsed = parseDescription(facility.description || "");
    setEditForm({
      name: facility.name || "",
      description: parsed.long_description || "",
      category: facility.category || "",
      surface_type: facility.surface_type || "vinyl",
      status: facility.status || "available",
      image: facility.image_url || "",
      imageFile: null,
      additionalImageFiles: [],
      additionalImageUrls: facility.carousel_urls || [],
    });
    setSpecsList(
      facility.specifications
        ? Object.entries(facility.specifications).map(([name, content]) => ({
            name,
            content,
          }))
        : [],
    );
    setMaintenances([]);
    setNewMaintenance({ date: "", start_time: "", end_time: "", reason: "" });
    setIsAddingMaintenance(false);
    setOpenDropdownId(null);
    fetchMaintenances(facility.id);
  };

  const handleAddClick = () => {
    setIsAddingFacility(true);
    setEditingFacility(null);
    setActiveTab("umum");
    setEditForm({
      name: "",
      description: "",
      category: "",
      surface_type: "vinyl",
      status: "available",
      image: "",
      imageFile: null,
      additionalImageFiles: [],
      additionalImageUrls: [],
    });
    setSpecsList([]);
    setMaintenances([]);
    setNewMaintenance({ date: "", start_time: "", end_time: "", reason: "" });
    setIsAddingMaintenance(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const file = files[0];
      const url = URL.createObjectURL(file);
      setEditForm((p) => {
        const remaining = MAX_GALLERY - p.additionalImageFiles.length;
        if (remaining <= 0) {
          toast.error(`Maksimal ${MAX_GALLERY} foto carousel.`);
          return p;
        }
        const extraFiles = files.slice(1, 1 + remaining);
        const extraUrls = extraFiles.map((f) => URL.createObjectURL(f));
        return {
          ...p,
          image: url,
          imageFile: file,
          additionalImageFiles: [...p.additionalImageFiles, ...extraFiles],
          additionalImageUrls: [...p.additionalImageUrls, ...extraUrls],
        };
      });
    }
  };
  const handleAddMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setEditForm((p) => {
        const remaining = MAX_GALLERY - p.additionalImageFiles.length;
        if (remaining <= 0) {
          toast.error(`Maksimal ${MAX_GALLERY} foto carousel.`);
          return p;
        }
        const taken = files.slice(0, remaining);
        const urls = taken.map((f) => URL.createObjectURL(f));
        return {
          ...p,
          additionalImageFiles: [...p.additionalImageFiles, ...taken],
          additionalImageUrls: [...p.additionalImageUrls, ...urls],
        };
      });
    }
  };
  const removeAdditionalImage = (index: number) =>
    setEditForm((p) => {
      const newFiles = [...p.additionalImageFiles];
      const newUrls = [...p.additionalImageUrls];
      newFiles.splice(index, 1);
      newUrls.splice(index, 1);
      return {
        ...p,
        additionalImageFiles: newFiles,
        additionalImageUrls: newUrls,
      };
    });

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: "Hapus Lapangan",
      message: "Yakin ingin menghapus lapangan ini?",
      variant: "destructive",
    });
    if (!ok) return;
    try {
      setOpenDropdownId(null);
      await deleteField(id);
      await fetchFields();
      toast.success("Lapangan berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus:", error);
      toast.error("Gagal menghapus lapangan.");
    }
  };

  const handleSpecChange = (index: number, value: string) =>
    setSpecsList((prev) =>
      prev.map((s, i) => (i === index ? { ...s, content: value } : s)),
    );

  const handleSave = async () => {
    if (!editForm.name || !editForm.description || !editForm.category) {
      toast.error("Harap lengkapi semua field yang wajib.");
      return;
    }
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("category", editForm.category);
      formData.append("surface_type", editForm.surface_type);
      formData.append("status", editForm.status);
      formData.append("specifications", JSON.stringify(specsList));
      if (editForm.imageFile) formData.append("image_file", editForm.imageFile);
      editForm.additionalImageFiles.forEach((file, idx) =>
        formData.append(`images[${idx}]`, file),
      );
      if (isAddingFacility) {
        await createField(formData);
        toast.success("Lapangan berhasil ditambahkan!");
      } else if (editingFacility) {
        await updateField(editingFacility.id, formData);
        toast.success("Lapangan berhasil diupdate!");
      }
      setEditingFacility(null);
      setIsAddingFacility(false);
      await fetchFields();
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error.response?.data?.message || "Gagal menyimpan data.");
      else toast.error("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMaintenance = async () => {
    if (!editingFacility || !newMaintenance.date || !newMaintenance.reason) {
      toast.error("Tanggal dan alasan maintenance wajib diisi.");
      return;
    }
    try {
      setIsAddingMaintenance(true);
      await createMaintenance(editingFacility.id, {
        date: newMaintenance.date,
        start_time: newMaintenance.start_time || undefined,
        end_time: newMaintenance.end_time || undefined,
        reason: newMaintenance.reason,
      });
      toast.success("Jadwal maintenance ditambahkan.");
      setNewMaintenance({ date: "", start_time: "", end_time: "", reason: "" });
      await fetchMaintenances(editingFacility.id);
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(
          error.response?.data?.message || "Gagal menambah maintenance.",
        );
      else toast.error("Terjadi kesalahan.");
    } finally {
      setIsAddingMaintenance(false);
    }
  };

  const handleDeleteMaintenance = async (id: number) => {
    const ok = await confirm({
      title: "Hapus Maintenance",
      message: "Yakin ingin menghapus jadwal maintenance ini?",
      variant: "destructive",
    });
    if (!ok) return;
    try {
      await deleteMaintenance(id);
      toast.success("Jadwal maintenance dihapus.");
      if (editingFacility) await fetchMaintenances(editingFacility.id);
    } catch (error) {
      toast.error("Gagal menghapus maintenance.");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">
            Kelola Lapangan
          </h1>
          <p className="text-gray-500 text-sm">
            Manajemen unit fasilitas, spesifikasi, dan jadwal maintenance.
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

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-ugo-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
            >
              <div className="h-[180px] w-full relative bg-gray-100">
                <img
                  src={
                    facility.image_url ||
                    "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
                <div className="absolute top-4 left-4">
                  {facility.status === "available" ? (
                    <span className="bg-ugo-status-aktif-bg text-ugo-status-aktif-text px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      AKTIF
                    </span>
                  ) : (
                    <span className="bg-ugo-status-maintenance-bg text-ugo-status-maintenance-text px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      PERBAIKAN
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === facility.id ? null : facility.id,
                      )
                    }
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white shadow-md transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
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
              <div className="p-5">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
                  {facility.category}
                </p>
                <h3 className="font-bold text-lg text-ugo-sidebar mb-2">
                  {facility.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-2">
                  {
                    parseDescription(facility.description || "")
                      .long_description
                  }
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-gray-500 font-medium">Permukaan</p>
                  <p className="font-bold text-sm text-ugo-primary uppercase">
                    {facility.surface_type}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div
            onClick={handleAddClick}
            className="rounded-2xl border-2 border-dashed border-ugo-primary/40 bg-ugo-primary/5 hover:bg-ugo-primary/10 hover:border-ugo-primary cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[300px] text-center p-6 group"
          >
            <div className="w-16 h-16 rounded-full bg-[#D4A574] flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full border-[1.5px] border-white flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-lg text-ugo-sidebar mb-2">
              Tambah Unit Baru
            </h3>
            <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed">
              Klik untuk menambahkan fasilitas atau lapangan baru ke dalam
              sistem.
            </p>
          </div>
        </div>
      )}

      {(editingFacility || isAddingFacility) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ugo-sidebar/40 backdrop-blur-sm p-4 fade-in animate-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-ugo-sidebar">
                {isAddingFacility
                  ? "Tambah Lapangan Baru"
                  : "Edit Data Lapangan"}
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
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex border-b border-gray-200 mb-6">
                {(["umum", "spesifikasi", "media", "maintenance"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? "border-ugo-primary text-ugo-primary" : "border-transparent text-gray-400 hover:text-gray-700"}`}
                    >
                      {tab === "umum"
                        ? "Informasi Umum"
                        : tab === "spesifikasi"
                          ? "Spesifikasi"
                          : tab === "media"
                            ? "Galeri Foto"
                            : "Maintenance"}
                    </button>
                  ),
                )}
              </div>
              {activeTab === "umum" && (
                <div className="space-y-4 fade-in animate-in duration-300">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">
                      Nama Lapangan *
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1.5">
                      Deskripsi *
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1.5">
                        Kategori *
                      </label>
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                      >
                        <option value="">Pilih...</option>
                        <option value="Futsal">Futsal</option>
                        <option value="Mini Soccer">Mini Soccer</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Voli">Voli</option>
                        <option value="Tenis">Tenis</option>
                        <option value="Basket">Basket</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-1.5">
                        Tipe Permukaan
                      </label>
                      <select
                        value={editForm.surface_type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            surface_type: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                      >
                        <option value="vinyl">Vinyl</option>
                        <option value="sintetis">Rumput Sintetis</option>
                        <option value="kayu">Lantai Kayu</option>
                        <option value="semen">Semen</option>
                        <option value="tanah">Tanah / Rumput Asli</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">
                      Status Operasional
                    </label>
                    <div className="relative flex items-center p-1.5 bg-gray-100 rounded-xl w-full h-14 border border-gray-200">
                      <div
                        className={`absolute top-1.5 bottom-1.5 rounded-lg shadow-md transition-all duration-300 ease-in-out ${editForm.status === "available" ? "left-1.5 w-[calc(50%-6px)] bg-ugo-sidebar" : "left-[50%] w-[calc(50%-6px)] bg-ugo-status-menunggu-text"}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({ ...editForm, status: "available" })
                        }
                        className={`relative flex-1 text-center text-sm font-bold z-10 transition-colors ${editForm.status === "available" ? "text-white" : "text-gray-500"}`}
                      >
                        AKTIF
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({ ...editForm, status: "maintenance" })
                        }
                        className={`relative flex-1 text-center text-sm font-bold z-10 transition-colors ${editForm.status === "maintenance" ? "text-white" : "text-gray-500"}`}
                      >
                        PERBAIKAN
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "spesifikasi" && (
                <div className="space-y-4 fade-in animate-in duration-300">
                  {specsList.map((spec, i) => (
                    <div key={i} className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                          Nama Spesifikasi
                        </label>
                        <input
                          type="text"
                          value={spec.name}
                          onChange={(e) => {
                            const newSpecs = [...specsList];
                            newSpecs[i].name = e.target.value;
                            setSpecsList(newSpecs);
                          }}
                          placeholder="Contoh: Ukuran Lapangan"
                          className="w-full px-3 py-2 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                          Nilai / Keterangan
                        </label>
                        <input
                          type="text"
                          value={spec.content}
                          onChange={(e) => handleSpecChange(i, e.target.value)}
                          placeholder="Contoh: 15m x 25m"
                          className="w-full px-3 py-2 bg-ugo-bg border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newSpecs = [...specsList];
                          newSpecs.splice(i, 1);
                          setSpecsList(newSpecs);
                        }}
                        className="h-[38px] w-[38px] flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {specsList.length < 4 && (
                    <button
                    type="button"
                    onClick={() => setSpecsList([...specsList, { name: "", content: "" }])}
                    className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 hover:text-ugo-primary hover:border-ugo-primary hover:bg-ugo-primary/5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Spesifikasi
                  </button>
                  )}
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6 fade-in animate-in duration-300">
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-2">
                      Foto Fasilitas Utama
                    </p>
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
                          <img
                            src={editForm.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/600x400?text=No+Image";
                            }}
                          />
                          <label
                            htmlFor="facility-image-upload"
                            className="absolute inset-0 bg-ugo-sidebar/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <div className="bg-white text-ugo-sidebar px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-ugo-primary hover:text-white transition-colors">
                              <ImageIcon className="w-4 h-4" /> Ubah Foto Utama
                            </div>
                          </label>
                        </>
                      ) : (
                        <label
                          htmlFor="facility-image-upload"
                          className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-ugo-primary transition-colors cursor-pointer w-full h-full justify-center"
                        >
                          <UploadCloud className="w-8 h-8" />
                          <span className="text-sm font-medium">
                            Upload Foto Utama
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-gray-700">
                        Galeri Tambahan
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">
                          {editForm.additionalImageUrls.length}/{MAX_GALLERY}
                        </span>
                        {editForm.additionalImageUrls.length >= MAX_GALLERY ? (
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1 cursor-not-allowed">
                            <UploadCloud className="w-3 h-3" />
                            Maksimal
                          </span>
                        ) : (
                          <label
                            htmlFor="additional-image-upload"
                            className="text-xs font-bold text-ugo-primary hover:text-ugo-sidebar cursor-pointer bg-ugo-primary/10 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                          >
                            <UploadCloud className="w-3 h-3" /> Tambah Foto
                          </label>
                        )}
                      </div>
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
                        <div
                          key={idx}
                          className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 group"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeAdditionalImage(idx);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {editForm.additionalImageUrls.length === 0 && (
                        <div className="w-full py-6 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                          <span className="text-xs font-medium">
                            Belum ada foto tambahan.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "maintenance" && (
                <div className="space-y-4 fade-in animate-in duration-300">
                  {editingFacility && (
                    <div className="bg-ugo-bg rounded-xl p-4 space-y-3 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Tambah Jadwal Maintenance
                      </p>
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                          Tanggal *
                        </label>
                        <input
                          type="date"
                          value={newMaintenance.date}
                          onChange={(e) =>
                            setNewMaintenance({
                              ...newMaintenance,
                              date: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">
                            Jam Mulai
                          </label>
                          <input
                            type="time"
                            value={newMaintenance.start_time}
                            onChange={(e) =>
                              setNewMaintenance({
                                ...newMaintenance,
                                start_time: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-600 block mb-1">
                            Jam Selesai
                          </label>
                          <input
                            type="time"
                            value={newMaintenance.end_time}
                            onChange={(e) =>
                              setNewMaintenance({
                                ...newMaintenance,
                                end_time: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">
                          Alasan *
                        </label>
                        <input
                          type="text"
                          value={newMaintenance.reason}
                          onChange={(e) =>
                            setNewMaintenance({
                              ...newMaintenance,
                              reason: e.target.value,
                            })
                          }
                          placeholder="Contoh: Perbaikan lampu"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/50 text-ugo-sidebar font-medium"
                        />
                      </div>
                      <button
                        onClick={handleAddMaintenance}
                        disabled={isAddingMaintenance}
                        className="w-full py-2 bg-ugo-primary text-white rounded-lg text-sm font-bold hover:bg-ugo-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isAddingMaintenance ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Tambah Jadwal
                      </button>
                    </div>
                  )}
                  {maintenances.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">
                        Belum ada jadwal maintenance.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Jadwal Maintenance
                      </p>
                      {maintenances.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-ugo-sidebar">
                                {m.reason}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {m.date}
                                {m.start_time && (
                                  <>
                                    <Clock className="w-3 h-3 ml-1" />
                                    {m.start_time} - {m.end_time}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMaintenance(m.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
                ) : isAddingFacility ? (
                  "Simpan Unit Baru"
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal />
    </div>
  );
}
