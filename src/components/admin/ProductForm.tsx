"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Category, Product } from "@/types";

interface Props {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    comparePrice: product?.comparePrice?.toString() || "",
    categoryId: product?.categoryId || "",
    stock: product?.stock?.toString() || "0",
    featured: product?.featured || false,
    active: product?.active ?? true,
  });

  const [image, setImage] = useState<string | null>(product?.image || null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setImage(data.path);
        showToast("Imagen subida exitosamente");
      } else {
        showToast("Error al subir imagen", "error");
      }
    } catch {
      showToast("Error al subir imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nombre requerido";
    if (!form.description.trim()) errs.description = "Descripción requerida";
    if (!form.price || parseInt(form.price) <= 0) errs.price = "Precio inválido";
    if (!form.categoryId) errs.categoryId = "Categoría requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image }),
      });

      if (res.ok) {
        showToast(isEdit ? "Producto actualizado" : "Producto creado");
        router.push("/admin/productos");
        router.refresh();
      } else {
        showToast("Error al guardar", "error");
      }
    } catch {
      showToast("Error al guardar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h3 className="font-bold text-lg text-text-title">Información del Producto</h3>

        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
        <Textarea label="Descripción" name="description" value={form.description} onChange={handleChange} error={errors.description} required />

        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Precio (CLP)" name="price" type="number" value={form.price} onChange={handleChange} error={errors.price} required />
          <Input label="Precio anterior (opcional)" name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} />
          <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field" required>
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>}
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-corp-verde focus:ring-corp-verde" />
            <span className="text-sm font-semibold text-gray-700">Producto destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-corp-verde focus:ring-corp-verde" />
            <span className="text-sm font-semibold text-gray-700">Activo</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-lg text-text-title mb-4">Imagen del Producto</h3>

        {image ? (
          <div className="relative inline-block">
            <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Imagen del producto"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs text-gray-400 mt-2 truncate max-w-[160px]">{image}</p>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-corp-verde/50 hover:bg-corp-verde/5 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">
              {uploading ? "Subiendo..." : "Haz clic para subir imagen"}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP (máx 5MB)</p>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading} size="lg">
          {isEdit ? "Guardar Cambios" : "Crear Producto"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
