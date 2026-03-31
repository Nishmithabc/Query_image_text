import { FileText } from "lucide-react";

interface ExtractedTextProps {
  text: string;
  isExtracting: boolean;
}

const ExtractedText = ({ text, isExtracting }: ExtractedTextProps) => {
  if (isExtracting) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Extracting text…</span>
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="h-3 bg-muted rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (!text) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-primary" />
        <span className="text-sm font-medium text-foreground">Extracted Text</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
        {text}
      </p>
    </div>
  );
};

export default ExtractedText;
