/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Language, ArticleTone, UiLanguage } from '../types';
import { translations } from '../translations';
import { generateArticle } from '../services/geminiService';
import Loading from './Loading';
import { ScrollText, Feather, Globe, BookOpen, Copy, Check } from 'lucide-react';

interface ArticleToolProps {
  onError: (error: string) => void;
  uiLanguage: UiLanguage;
}

const ArticleTool: React.FC<ArticleToolProps> = ({ onError, uiLanguage }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ArticleTone>('Professional');
  const [language, setLanguage] = useState<Language>('English');
  
  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const t = translations[uiLanguage];

   // Sync output language default with UI language
  useEffect(() => {
    if (uiLanguage === 'ar') setLanguage('Arabic');
    else setLanguage('English');
  }, [uiLanguage]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setArticle(null);

    try {
      const result = await generateArticle(topic, tone, language);
      setArticle(result);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
        onError(t.errorAccessDenied);
      } else {
        setArticle(t.errorGeneric);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (article) {
      navigator.clipboard.writeText(article);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">
             {uiLanguage === 'ar' ? (
                 <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">كاتب</span> المقالات
                 </>
             ) : (
                 <>
                  Article <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Writer</span>
                 </>
             )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t.descArticle}
          </p>
      </div>

      <form onSubmit={handleGenerate} className="relative z-20 transition-all duration-300">
         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-3xl shadow-2xl">
            
            <div className="flex flex-col gap-4">
                {/* Topic Input */}
                <div className="relative">
                     <BookOpen className={`absolute top-4 w-5 h-5 text-slate-400 ${uiLanguage === 'ar' ? 'right-4' : 'left-4'}`} />
                     <textarea 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={t.articleTopicPlaceholder}
                        className={`w-full py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none h-24 ${uiLanguage === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                     />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Tone Selector */}
                     <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3">
                         <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Feather className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.labelTone}</label>
                            <select 
                                value={tone} 
                                onChange={(e) => setTone(e.target.value as ArticleTone)}
                                className="bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full"
                            >
                                <option value="Professional">Professional</option>
                                <option value="Casual">Casual</option>
                                <option value="Academic">Academic</option>
                                <option value="Creative">Creative</option>
                                <option value="Journalistic">Journalistic</option>
                            </select>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3">
                         <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.labelLanguage}</label>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Mandarin">Mandarin</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Arabic">Arabic</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Russian">Russian</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !topic}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold font-display tracking-wide hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <ScrollText className="w-5 h-5" />
                    <span>{t.writeArticle}</span>
                </button>
            </div>
         </div>
      </form>

      {isLoading && (
          <div className="mt-8">
            <Loading status={t.loadingDraft} step={2} uiLanguage={uiLanguage} />
          </div>
      )}

      {article && !isLoading && (
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-slate-50 dark:bg-slate-950/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? t.copied : t.copyText}
                </button>
            </div>
            <div className="p-8 md:p-12 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                {article}
            </div>
        </div>
      )}
    </div>
  );
};

export default ArticleTool;