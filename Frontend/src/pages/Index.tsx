import { useState, useCallback } from "react";
import { ScanText } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ExtractedText from "@/components/ExtractedText";
import QuestionInput from "@/components/QuestionInput";
import AnswerCard from "@/components/AnswerCard";

interface QA {
  question: string;
  answer: string;
}

const Index = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [qaHistory, setQaHistory] = useState<QA[]>([]);

  const handleImageSelected = useCallback((_file: File, previewUrl: string) => {
    setPreview(previewUrl);
    setExtractedText("");
    setQaHistory([]);
    setIsExtracting(true);

    // Simulate OCR extraction (replace with real API later)
    setTimeout(() => {
      setExtractedText(
        "This is simulated extracted text from the uploaded image. In a production setup, this would be replaced by an actual OCR service (like Tesseract.js or a cloud API) that reads the text content from your image.\n\nThe extracted content would appear here, preserving paragraphs and formatting as closely as possible to the original document."
      );
      setIsExtracting(false);
    }, 2000);
  }, []);

  const handleClear = useCallback(() => {
    setPreview(null);
    setExtractedText("");
    setQaHistory([]);
  }, []);

  const handleAsk = useCallback(
    (question: string) => {
      setIsAnswering(true);

      // Simulate Q&A (replace with real AI API later)
      setTimeout(() => {
        setQaHistory((prev) => [
          {
            question,
            answer: `Based on the extracted content, here is a simulated answer to your question: "${question}". In production, this would use an AI model to analyze the extracted text and provide a contextual answer.`,
          },
          ...prev,
        ]);
        setIsAnswering(false);
      }, 1500);
    },
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-accent">
            <ScanText size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Image Q&A</h1>
            <p className="text-sm text-muted-foreground">Extract text from images, then ask questions</p>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-5">
          <ImageUploader onImageSelected={handleImageSelected} preview={preview} onClear={handleClear} />

          <ExtractedText text={extractedText} isExtracting={isExtracting} />

          <QuestionInput
            onAsk={handleAsk}
            disabled={!extractedText || isExtracting}
            isLoading={isAnswering}
          />

          {/* Loading answer skeleton */}
          {isAnswering && (
            <div className="rounded-lg border border-border bg-card p-5 animate-pulse space-y-2">
              <div className="h-3 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          )}

          {/* Q&A history */}
          <div className="space-y-3">
            {qaHistory.map((qa, i) => (
              <AnswerCard key={i} question={qa.question} answer={qa.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
