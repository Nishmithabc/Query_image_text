import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (file: File, preview: string) => void;
  preview: string | null;
  onClear: () => void;
}

const ImageUploader = ({ onImageSelected, preview, onClear }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    },
    [onImageSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (preview) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-border bg-card">
        <img src={preview} alt="Uploaded" className="w-full max-h-72 object-contain bg-muted" />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-foreground/70 text-background hover:bg-foreground/90 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-primary bg-accent"
          : "border-border bg-dropzone hover:border-dropzone-border hover:bg-accent"
      }`}
    >
      <div className="p-3 rounded-full bg-accent">
        <Upload size={24} className="text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Drop an image here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </label>
  );
};

export default ImageUploader;
