import React, { useState } from 'react';
import { BookOpen, FileText, Languages, Ruler, PenTool, Loader2 } from 'lucide-react';
import { EssayParams, LANGUAGE_OPTIONS, LENGTH_OPTIONS } from '../types';

interface EssayFormProps {
  onSubmit: (params: EssayParams) => void;
  isLoading: boolean;
}

export const EssayForm: React.FC<EssayFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<EssayParams>({
    topic: '',
    outline: '',
    length: LENGTH_OPTIONS[1], // Default Medium
    language: LANGUAGE_OPTIONS[0], // Default Vietnamese
  });

  const handleChange = (field: keyof EssayParams, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium opacity-80">
          <BookOpen size={16} />
          Đề bài / Chủ đề (Topic)
        </label>
        <input
          type="text"
          required
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          placeholder="Ví dụ: Phân tích bài thơ 'Sóng' của Xuân Quỳnh..."
          className="w-full px-4 py-3 rounded-lg border bg-transparent transition-all duration-200 
            focus:ring-2 focus:ring-primary-500 outline-none
            dark:border-slate-600 dark:bg-slate-800/50 dark:focus:border-primary-500
            border-gray-300 focus:border-primary-500"
        />
      </div>

      {/* Outline Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium opacity-80">
          <FileText size={16} />
          Dàn ý (Outline)
        </label>
        <textarea
          required
          value={formData.outline}
          onChange={(e) => handleChange('outline', e.target.value)}
          placeholder="- Mở bài: Giới thiệu tác giả, tác phẩm...&#10;- Thân bài:&#10;  + Luận điểm 1: ...&#10;  + Luận điểm 2: ...&#10;- Kết bài: Cảm nghĩ chung..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg border bg-transparent transition-all duration-200 
            focus:ring-2 focus:ring-primary-500 outline-none resize-y
            dark:border-slate-600 dark:bg-slate-800/50 dark:focus:border-primary-500
            border-gray-300 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Length Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium opacity-80">
            <Ruler size={16} />
            Độ dài (Length)
          </label>
          <select
            value={formData.length}
            onChange={(e) => handleChange('length', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-transparent transition-all duration-200 
              focus:ring-2 focus:ring-primary-500 outline-none appearance-none
              dark:border-slate-600 dark:bg-slate-800/50 dark:focus:border-primary-500
              border-gray-300 focus:border-primary-500"
          >
            {LENGTH_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="dark:bg-slate-800">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Language Select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium opacity-80">
            <Languages size={16} />
            Ngôn ngữ (Language)
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-transparent transition-all duration-200 
              focus:ring-2 focus:ring-primary-500 outline-none appearance-none
              dark:border-slate-600 dark:bg-slate-800/50 dark:focus:border-primary-500
              border-gray-300 focus:border-primary-500"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang} className="dark:bg-slate-800">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1
          flex items-center justify-center gap-2
          ${isLoading 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-primary-500/30'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Đang Viết... (Generating...)
          </>
        ) : (
          <>
            <PenTool size={24} />
            Tạo Bài Văn (Create Essay)
          </>
        )}
      </button>
    </form>
  );
};