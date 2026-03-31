import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";

interface AnswerCardProps {
  question: string;
  answer: string;
}

const AnswerCard = ({ question, answer }: AnswerCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-3">
      <div className="flex items-start gap-2">
        <MessageSquare size={16} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm font-medium text-foreground">{question}</p>
      </div>
      <div className="relative rounded-md bg-answer p-4">
        <p className="text-sm text-foreground leading-relaxed pr-8 whitespace-pre-wrap">{answer}</p>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Copy answer"
        >
          {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

export default AnswerCard;
