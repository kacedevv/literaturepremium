import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { EssayForm } from './components/EssayForm';
import { EssayResult } from './components/EssayResult';
import { ThemeToggle } from './components/ThemeToggle';
import { ChatWidget } from './components/ChatWidget';
import { generateEssayContent } from './services/geminiService';
import { EssayParams, Theme } from './types';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize theme from system preference or default
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Update body class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleGenerate = async (params: EssayParams) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedText = await generateEssayContent(params);
      setResult(generatedText);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans
      ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg shadow-lg shadow-primary-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">EssayGen Pro</h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">Trình tạo bài văn tự động</p>
            </div>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center gap-2 animate-pulse">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* Form or Result */}
          {!result ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-6 md:p-8 border border-gray-100 dark:border-slate-700">
               <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Thông tin bài viết</h2>
                <p className="text-gray-500 dark:text-slate-400">
                  Nhập thông tin chi tiết bên dưới để AI tạo ra bài văn hoàn chỉnh cho bạn.
                </p>
              </div>
              <EssayForm onSubmit={handleGenerate} isLoading={loading} />
            </div>
          ) : (
            <EssayResult content={result} onReset={resetForm} />
          )}

        </div>
      </main>

      <ChatWidget />

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 dark:text-slate-600">
        <p>© 2025 EssayGen Pro. Powered by KaceDev</p>
      </footer>
    </div>
  );
}

export default App;
