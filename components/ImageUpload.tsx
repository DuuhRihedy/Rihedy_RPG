"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (url: string | null) => void;
  label?: string;
  size?: "small" | "medium" | "large";
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label = "Imagem",
  size = "medium",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const sizeMap = {
    small: { width: 80, height: 80 },
    medium: { width: 150, height: 150 },
    large: { width: 250, height: 250 },
  };
  const dimensions = sizeMap[size];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha no upload");
      }

      setPreview(data.url);
      onImageChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    setPreview(urlInput.trim());
    onImageChange(urlInput.trim());
    setUrlInput("");
    setError(null);
  }

  async function handleRemove() {
    if (preview && preview.includes("vercel-storage.com")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: preview }),
        });
      } catch {
        // Ignora erro ao deletar
      }
    }
    setPreview(null);
    onImageChange(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="image-upload">
      <label className="image-upload-label">{label}</label>

      {preview ? (
        <div className="image-upload-preview" style={{ width: dimensions.width, height: dimensions.height }}>
          <img
            src={preview}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius)" }}
          />
          <button
            type="button"
            className="image-upload-remove"
            onClick={handleRemove}
            title="Remover imagem"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="image-upload-empty" style={{ width: dimensions.width, height: dimensions.height }}>
          <div className="image-upload-tabs">
            <button
              type="button"
              className={`image-tab ${mode === "upload" ? "active" : ""}`}
              onClick={() => setMode("upload")}
            >
              📤 Upload
            </button>
            <button
              type="button"
              className={`image-tab ${mode === "url" ? "active" : ""}`}
              onClick={() => setMode("url")}
            >
              🔗 URL
            </button>
          </div>

          {mode === "upload" ? (
            <label className="image-upload-dropzone">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: "none" }}
              />
              {uploading ? (
                <span className="image-upload-loading">⏳ Enviando...</span>
              ) : (
                <span className="image-upload-hint">📷 Clique para enviar<br /><small>JPG, PNG, WebP (max 5MB)</small></span>
              )}
            </label>
          ) : (
            <div className="image-upload-url-form">
              <input
                type="text"
                className="input"
                placeholder="Cole a URL da imagem..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                style={{ fontSize: "0.7rem", padding: "4px 6px" }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                style={{ fontSize: "0.7rem", padding: "4px 8px" }}
              >
                OK
              </button>
            </div>
          )}
        </div>
      )}

      {error && <div className="image-upload-error">❌ {error}</div>}
    </div>
  );
}
