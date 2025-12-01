import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface EssayResultProps {
  content: string;
  onReset: () => void;
}

export const EssayResult: React.FC<EssayResultProps> = ({ content, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Simple formatter to handle basic bolding if the AI uses **text** despite instructions,
  // and ensure paragraphs have good spacing.
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <br key={index} />;
      
      // Simple parse for **bold** text to prevent "lỗi chữ" visual artifacts
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <p key={index} className="mb-4 last:mb-0">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-500">
          Bài Văn Hoàn Chỉnh
        </h3>
        <div className="flex gap-2">
           <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg 
              transition-colors duration-200 
              text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            <RefreshCw size={16} />
            Tạo mới
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg 
              transition-colors duration-200 border
              ${copied 
                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-700'
              }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
      </div>

      <div className="p-8 md:p-10 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
        <article className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif leading-loose text-justify">
          {renderContent(content)}
        </article>
      </div>
    </div>
  );
};
