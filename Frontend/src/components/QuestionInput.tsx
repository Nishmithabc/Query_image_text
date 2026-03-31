import { useState } from "react";
import { Send } from "lucide-react";

interface QuestionInputProps {
  onAsk: (question: string) => void;
  disabled: boolean;
  isLoading: boolean;
}

const QuestionInput = ({ onAsk, disabled, isLoading }: QuestionInputProps) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || disabled) return;
    onAsk(question.trim());
    setQuestion("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={disabled ? "Upload an image first…" : "Ask a question about the content…"}
        disabled={disabled}
        className="flex-1 rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
      />
      <button
        type="submit"
        disabled={disabled || !question.trim() || isLoading}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </form>
  );
};

export default QuestionInput;
