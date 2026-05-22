"use client";
import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Users, Package, AlertCircle, CheckCircle2, Loader2, Download, X, Info } from "lucide-react";

type UploadType = "productos" | "socios";

interface UploadResult {
  created: number;
  skipped: number;
  errors: string[];
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Detect separator
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, "").toLowerCase());

  return lines.slice(1).map((line) => {
    const values = line.split(sep).map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

const columnMappings: Record<UploadType, Record<string, string[]>> = {
  productos: {
    name: ["name", "nombre", "producto", "product"],
    description: ["description", "descripcion", "descripción", "desc"],
    price: ["price", "precio", "valor"],
    comparePrice: ["compareprice", "precio_anterior", "precio_comparacion", "preciocomparacion"],
    category: ["category", "categoria", "categoría", "cat"],
    stock: ["stock", "cantidad", "qty", "inventario"],
    featured: ["featured", "destacado", "dest"],
    image: ["image", "imagen", "img", "foto", "url_imagen"],
  },
  socios: {
    nombre: ["nombre", "name", "socio"],
    rut: ["rut", "run"],
    telefono: ["telefono", "teléfono", "phone", "tel", "celular", "fono"],
    email: ["email", "correo", "mail", "e-mail"],
    direccion: ["direccion", "dirección", "address", "dir"],
  },
};

function mapColumns(rows: Record<string, string>[], type: UploadType): Record<string, string>[] {
  const mapping = columnMappings[type];
  return rows.map((row) => {
    const mapped: Record<string, string> = {};
    for (const [field, aliases] of Object.entries(mapping)) {
      for (const alias of aliases) {
        if (row[alias] !== undefined && row[alias] !== "") {
          mapped[field] = row[alias];
          break;
        }
      }
    }
    return mapped;
  });
}

export default function CargaMasivaPage() {
  const [type, setType] = useState<UploadType>("productos");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f);
    setResult(null);
    setError("");

    try {
      const text = await f.text();
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setError("El archivo no contiene datos válidos");
        setPreview([]);
        return;
      }
      const mapped = mapColumns(rows, type);
      setPreview(mapped);
    } catch {
      setError("Error al leer el archivo");
      setPreview([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".txt"))) {
      handleFile(f);
    } else {
      setError("Solo se permiten archivos .csv");
    }
  };

  const handleUpload = async () => {
    if (preview.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const endpoint = type === "productos" ? "/api/products/bulk" : "/api/socios/bulk";
      const payload = type === "productos" ? { products: preview } : { socios: preview };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error en la carga");
      } else {
        setResult(data);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview([]);
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const downloadTemplate = () => {
    let headers: string;
    let example: string;
    if (type === "productos") {
      headers = "nombre;precio;descripcion;categoria;stock;destacado;imagen";
      example = 'Paracetamol 500mg;2990;Analgésico y antipirético;medicamentos;50;si;';
    } else {
      headers = "nombre;rut;telefono;email;direccion";
      example = "Juan Pérez;12345678-5;+56912345678;juan@email.com;Av. Principal 123, Rancagua";
    }
    const csv = `${headers}\n${example}`;
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plantilla-${type}-nexofarma.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewHeaders = type === "productos"
    ? ["name", "price", "description", "category", "stock"]
    : ["nombre", "rut", "telefono", "email", "direccion"];

  const headerLabels: Record<string, string> = {
    name: "Nombre", price: "Precio", description: "Descripción", category: "Categoría", stock: "Stock",
    nombre: "Nombre", rut: "RUT", telefono: "Teléfono", email: "Email", direccion: "Dirección",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">Carga Masiva</h1>
        <p className="text-sm text-gray-500 mt-1">Importa productos o socios desde archivos CSV</p>
      </div>

      {/* Type Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => { setType("productos"); reset(); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            type === "productos"
              ? "bg-gradient-corp text-white shadow-corp"
              : "bg-white border border-gray-200 text-gray-600 hover:border-corp-verde"
          }`}
        >
          <Package className="w-4 h-4" />
          Productos
        </button>
        <button
          onClick={() => { setType("socios"); reset(); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            type === "socios"
              ? "bg-gradient-corp text-white shadow-corp"
              : "bg-white border border-gray-200 text-gray-600 hover:border-corp-verde"
          }`}
        >
          <Users className="w-4 h-4" />
          Socios
        </button>
      </div>

      {/* Template + Instructions */}
      <div className="bg-blue-50 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-blue-900">Formato del archivo</p>
            <p className="text-xs text-blue-700 mt-1">
              {type === "productos"
                ? "Columnas: nombre, precio, descripcion, categoria, stock, destacado, imagen"
                : "Columnas: nombre, rut, telefono, email, direccion"}
            </p>
            <p className="text-xs text-blue-600 mt-0.5">Separador: punto y coma (;) o coma (,). Máximo 500 registros.</p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Descargar Plantilla
        </button>
      </div>

      {/* Upload Area */}
      {!result && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-corp-verde transition-colors p-10 text-center"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />

          {file ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-corp-verde/10 rounded-xl">
                <FileSpreadsheet className="w-5 h-5 text-corp-verde" />
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{preview.length} registros detectados</p>
                </div>
                <button onClick={reset} className="p-1 hover:bg-gray-200 rounded-lg ml-2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-700">Arrastra tu archivo CSV aquí</p>
              <p className="text-xs text-gray-400 mt-1">o</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-3 px-5 py-2.5 bg-gradient-corp text-white text-sm font-bold rounded-xl hover:shadow-corp transition-all"
              >
                Seleccionar archivo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 text-red-700 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && !result && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Vista previa ({preview.length} registros)</h3>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-corp text-white text-sm font-bold rounded-xl hover:shadow-corp transition-all disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Cargando..." : `Cargar ${preview.length} ${type}`}
            </button>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-bold uppercase text-gray-500 w-10">#</th>
                  {previewHeaders.map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-bold uppercase text-gray-500">{headerLabels[h]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 text-xs text-gray-400">{i + 1}</td>
                    {previewHeaders.map((h) => (
                      <td key={h} className="px-4 py-2.5 text-xs text-gray-700 max-w-[200px] truncate">
                        {row[h] || <span className="text-gray-300">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
                {preview.length > 20 && (
                  <tr>
                    <td colSpan={previewHeaders.length + 1} className="px-4 py-3 text-center text-xs text-gray-400">
                      ... y {preview.length - 20} registros más
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Carga completada</h3>
              <p className="text-sm text-gray-500">
                {result.created} creados · {result.skipped} omitidos
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-700">{result.created}</p>
              <p className="text-xs font-bold text-green-600 uppercase mt-1">Creados</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-yellow-700">{result.skipped}</p>
              <p className="text-xs font-bold text-yellow-600 uppercase mt-1">Omitidos</p>
            </div>
          </div>

          {/* Errors Detail */}
          {result.errors.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs font-bold text-red-700 uppercase mb-2">Errores ({result.errors.length})</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-600">{err}</p>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={reset}
            className="px-5 py-2.5 bg-gradient-corp text-white text-sm font-bold rounded-xl hover:shadow-corp transition-all"
          >
            Nueva carga
          </button>
        </div>
      )}
    </div>
  );
}
