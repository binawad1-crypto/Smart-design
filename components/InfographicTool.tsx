/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { GeneratedImage, ComplexityLevel, VisualStyle, Language, SearchResultItem, UiLanguage } from '../types';
import { translations } from '../translations';
import { 
  researchTopicForPrompt, 
  generateInfographicImage, 
  editInfographicImage,
} from '../services/geminiService';
import Infographic from './Infographic';
import Loading from './Loading';
import SearchResults from './SearchResults';
import { Search, AlertCircle, History, GraduationCap, Palette, Globe, Microscope } from 'lucide-react';

interface InfographicToolProps {
  onError: (error: string) => void;
  uiLanguage: UiLanguage;
}

const InfographicTool: React.FC<InfographicToolProps> = ({ onError, uiLanguage }) => {
  const [topic, setTopic] = useState('');
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>('High School');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Default');
  const [language, setLanguage] = useState<Language>('English');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResultItem[]>([]);
  
  const t = translations[uiLanguage];

  // Sync output language default with UI language
  useEffect(() => {
    if (uiLanguage === 'ar') setLanguage('Arabic');
    else setLanguage('English');
  }, [uiLanguage]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!topic.trim()) {
        setLocalError(t.errorNoTopic);
        return;
    }

    setIsLoading(true);
    setLocalError(null);
    setLoadingStep(1);
    setLoadingFacts([]);
    setCurrentSearchResults([]);
    setLoadingMessage(t.loadingResearch);

    try {
      const researchResult = await researchTopicForPrompt(topic, complexityLevel, visualStyle, language);
      
      setLoadingFacts(researchResult.facts);
      setCurrentSearchResults(researchResult.searchResults);
      
      setLoadingStep(2);
      setLoadingMessage(t.loadingDesign);
      
      let base64Data = await generateInfographicImage(researchResult.imagePrompt);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        data: base64Data,
        prompt: topic,
        timestamp: Date.now(),
        level: complexityLevel,
        style: visualStyle,
        language: language
      };

      setImageHistory([newImage, ...imageHistory]);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
          onError(t.errorAccessDenied);
      } else {
          setLocalError(t.errorGeneric);
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleEdit = async (editPrompt: string) => {
    if (imageHistory.length === 0) return;
    const currentImage = imageHistory[0];
    setIsLoading(true);
    setLocalError(null);
    setLoadingStep(2);
    setLoadingMessage(`${t.enhance}: "${editPrompt}"...`);

    try {
      const base64Data = await editInfographicImage(currentImage.data, editPrompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        data: base64Data,
        prompt: editPrompt,
        timestamp: Date.now(),
        level: currentImage.level,
        style: currentImage.style,
        language: currentImage.language
      };
      setImageHistory([newImage, ...imageHistory]);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
        onError(t.errorAccessDenied);
      } else {
        setLocalError(t.errorModification);
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const restoreImage = (img: GeneratedImage) => {
     const newHistory = imageHistory.filter(i => i.id !== img.id);
     setImageHistory([img, ...newHistory]);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">
             {uiLanguage === 'ar' ? (
                 <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">مولد</span> الانفوجرافيك
                 </>
             ) : (
                 <>
                  Infographic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">Generator</span>
                 </>
             )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t.descInfographic}
          </p>
      </div>

      <form onSubmit={handleGenerate} className={`relative z-20 max-w-6xl mx-auto transition-all duration-300 ${isLoading ? 'opacity-50 pointer-events-none scale-95 blur-sm' : 'scale-100'}`}>
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition duration-500 blur-xl"></div>
                
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-2 rounded-3xl shadow-2xl">
                    <div className="relative flex items-center">
                        <Search className={`absolute w-5 h-5 md:w-6 md:h-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors ${uiLanguage === 'ar' ? 'right-4 md:right-6' : 'left-4 md:left-6'}`} />
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={t.topicPlaceholder}
                            className={`w-full py-3 md:py-6 bg-transparent border-none outline-none text-base md:text-2xl placeholder:text-slate-400 font-medium text-slate-900 dark:text-white ${uiLanguage === 'ar' ? 'pr-12 md:pr-16 pl-4 md:pl-6 text-right' : 'pl-12 md:pl-16 pr-4 md:pr-6 text-left'}`}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 p-2 mt-2">
                    
                    {/* Level Selector */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3 hover:border-cyan-500/30 transition-colors relative overflow-hidden group/item">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col z-10 w-full overflow-hidden">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.labelAudience}</label>
                            <select 
                                value={complexityLevel} 
                                onChange={(e) => setComplexityLevel(e.target.value as ComplexityLevel)}
                                className={`bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors truncate [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100 ${uiLanguage === 'ar' ? 'pl-4' : 'pr-4'}`}
                            >
                                <option value="Elementary">Elementary</option>
                                <option value="High School">High School</option>
                                <option value="College">College</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                    </div>

                    {/* Style Selector */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3 hover:border-purple-500/30 transition-colors relative overflow-hidden group/item">
                         <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
                            <Palette className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col z-10 w-full overflow-hidden">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.labelAesthetic}</label>
                            <select 
                                value={visualStyle} 
                                onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                                className={`bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-purple-600 dark:hover:text-purple-300 transition-colors truncate [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100 ${uiLanguage === 'ar' ? 'pl-4' : 'pr-4'}`}
                            >
                                <option value="Default">Standard Scientific</option>
                                <option value="Minimalist">Minimalist</option>
                                <option value="Realistic">Photorealistic</option>
                                <option value="Cartoon">Graphic Novel</option>
                                <option value="Vintage">Vintage Lithograph</option>
                                <option value="Futuristic">Cyberpunk HUD</option>
                                <option value="3D Render">3D Isometric</option>
                                <option value="Sketch">Technical Blueprint</option>
                            </select>
                        </div>
                    </div>

                     {/* Language Selector */}
                     <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-white/5 px-4 py-3 flex items-center gap-3 hover:border-green-500/30 transition-colors relative overflow-hidden group/item">
                         <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-green-600 dark:text-green-400 shrink-0 shadow-sm">
                            <Globe className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col z-10 w-full overflow-hidden">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.labelLanguage}</label>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className={`bg-transparent border-none text-base font-bold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-green-600 dark:hover:text-green-300 transition-colors truncate [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-900 dark:[&>option]:text-slate-100 ${uiLanguage === 'ar' ? 'pl-4' : 'pr-4'}`}
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

                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto h-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold font-display tracking-wide hover:brightness-110 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <Microscope className="w-5 h-5" />
                            <span>{t.initiate}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </form>

      {isLoading && <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} uiLanguage={uiLanguage} />}

      {localError && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center gap-4 text-red-800 dark:text-red-200 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-500 dark:text-red-400" />
            <div className="flex-1">
                <p className="font-medium">{localError}</p>
            </div>
          </div>
      )}

      {imageHistory.length > 0 && !isLoading && (
        <>
            <Infographic 
                image={imageHistory[0]} 
                onEdit={handleEdit} 
                isEditing={isLoading}
                uiLanguage={uiLanguage}
            />
            <SearchResults results={currentSearchResults} uiLanguage={uiLanguage} />
        </>
      )}

      {imageHistory.length > 1 && (
            <div className="max-w-7xl mx-auto mt-16 md:mt-24 border-t border-slate-200 dark:border-white/10 pt-12 transition-colors">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <History className="w-4 h-4" />
                    {t.sessionArchives}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {imageHistory.slice(1).map((img) => (
                        <div 
                            key={img.id} 
                            onClick={() => restoreImage(img)}
                            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all shadow-lg bg-white dark:bg-slate-900/50 backdrop-blur-sm"
                        >
                            <img src={img.data} alt={img.prompt} className="w-full aspect-video object-cover opacity-90 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-xs text-white font-bold truncate mb-1 font-display text-left rtl:text-right">{img.prompt}</p>
                                <div className="flex gap-2">
                                    {img.level && <span className="text-[9px] text-cyan-100 uppercase font-bold tracking-wide px-1.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-500/20">{img.level}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default InfographicTool;