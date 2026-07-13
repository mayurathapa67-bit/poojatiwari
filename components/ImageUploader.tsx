"use client";

import { useRef, useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import type { ImageSet } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  label: string;
  kind: "profile" | "project";
  value?: ImageSet;
  onUploaded: (image: ImageSet) => void;
  maxSizeMB?: number;
  aspect?: "1:1" | "16:9";
}

export default function ImageUploader({
  label,
  kind,
  value,
  onUploaded,
  maxSizeMB = 5,
  aspect = "1:1",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const maxBytes = maxSizeMB * 1024 * 1024;
  const aspectClass = aspect === "1:1" ? "aspect-square" : "aspect-video";

  function handleFile(file: File) {
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG or WebP images are allowed.");
      setStatus("error");
      return;
    }
    if (file.size > maxBytes) {
      setError(`Image too large (max ${maxSizeMB}MB).`);
      setStatus("error");
      return;
    }

    handleUpload(file);
  }

  async function handleUpload(file: File) {
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setStatus("uploading");
    setError("");
    setProgress(15);

    const timer = setInterval(() => setProgress((p) => Math.min(p + 20, 90)), 150);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(timer);
      setProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.success) {
        onUploaded({ original: result.url, thumb: result.thumb } as ImageSet);
        setStatus("done");
      }
    } catch (err) {
      clearInterval(timer);
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  const shown = preview || value?.thumb || value?.medium || value?.original || null;

  return (
    <div>
      <label className="field-label">{label}</label>

      <div
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
          status === "error" ? "border-danger/60 bg-dangerbg" : "border-line bg-background hover:border-primary/50",
          aspect === "1:1" ? "aspect-square" : "aspect-video"
        )}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label={`Upload ${label}`}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shown}
            alt={label}
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          />
        ) : (
          <>
            <ImageIcon size={28} className="text-muted" />
            <p className="text-sm text-muted">
              Drag &amp; drop or <span className="font-medium text-primary">browse</span>
            </p>
            <p className="text-xs text-muted/70">
              JPG / PNG / WebP · max {maxSizeMB}MB · {aspect}
            </p>
          </>
        )}

        {status === "uploading" && (
          <div className="absolute inset-x-3 bottom-3 progress-track">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        {status === "done" && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
            <CheckCircle2 size={12} /> Saved
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {status === "done" && value && (
        <p className="mt-2 truncate font-mono text-xs text-muted">
          Saved: <span className="text-primary">{value.original}</span>
        </p>
      )}
      {status === "error" && error && (
        <p className="mt-2 flex items-center gap-1 text-xs text-danger">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
