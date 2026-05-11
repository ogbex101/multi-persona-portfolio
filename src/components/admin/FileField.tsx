import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadToPortfolio } from "@/lib/upload";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Called only when a file upload completes or the value is cleared. Use for auto-persist. */
  onPersist?: (url: string) => void;
  accept?: string;
  folder?: string;
  preview?: "image" | "video" | "auto" | "none";
  helperText?: string;
};

export function FileField({
  label,
  value,
  onChange,
  onPersist,
  accept = "image/*",
  folder = "uploads",
  preview = "auto",
  helperText,
}: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const url = await uploadToPortfolio(file, folder);
      onChange(url);
      onPersist?.(url);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange("");
    onPersist?.("");
  }

  const isVideo =
    preview === "video" ||
    (preview === "auto" && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(value));
  const isImage =
    preview === "image" ||
    (preview === "auto" && value && !isVideo);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : value ? "Replace file" : "Upload from device"}
        </Button>
        {value && (
          <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
            <X className="mr-1 h-3 w-3" /> Remove
          </Button>
        )}
        <span className="text-xs text-muted-foreground">or paste a URL</span>
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="h-8 max-w-xs flex-1"
        />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      {value && preview !== "none" && (
        <div className="overflow-hidden rounded-md border border-border bg-muted">
          {isVideo ? (
            <video src={value} controls className="max-h-48 w-full object-contain" />
          ) : isImage ? (
            <img src={value} alt="" className="max-h-48 w-full object-contain" />
          ) : null}
        </div>
      )}
    </div>
  );
}
