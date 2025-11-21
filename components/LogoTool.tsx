/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { LogoStyle, UiLanguage } from '../types';
import { translations } from '../translations';
import { generateLogo } from '../services/geminiService';
import Loading from './Loading';
import { Hexagon, Layers, Type, Briefcase, Download, Maximize2, X } from 'lucide-react';

interface LogoToolProps {
  onError: (error: string) => void;
  uiLanguage: UiLanguage;
}

const LogoTool: React.FC<LogoToolProps> = ({ onError, uiLanguage }) => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<LogoStyle>('Minimalist');
  
  const [isLoading, setIsLoading] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const t = translations[uiLanguage];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setIsLoading(true);
    setLogoImage(null);

    try {
      const result = await generateLogo(brandName, description, style);
      setLogoImage(result);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
        onError(t.errorAccessDenied);
      } else {
        // Handle locally if strictly needed
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">
             {uiLanguage === 'ar' ? (
                 <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">هوية</span> العلامة التجارية
                 </>
             ) : (
                 <>
                  Brand <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Identity</span>
                 </>
             )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t.descLogo}
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="order-2 lg:order-1">
            <form onSubmit={handleGenerate} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-5 h-full">
                
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Type className="w-4 h-4" /> {t.labelBrandName}
                    </label>
                    <input 
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder={t.placeholderBrand}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none text-slate-900 dark:text-white font-bold text-lg placeholder:font-normal"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Briefcase className="w-4 h-4" /> {t.labelIndustry}
                    </label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.placeholderIndustry}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none text-slate-900 dark:text-white h-32 resize-none"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Layers className="w-4 h-4" /> {t.labelStyle}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['Minimalist', 'Vintage', '3D', 'Abstract', 'Mascot', 'Emblem'].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setStyle(s as LogoStyle)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${style === s ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-500/50'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !brandName}
                    className="mt-auto w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-bold font-display tracking-wide hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Hexagon className="w-5 h-5" />
                    <span>{t.generateLogo}</span>
                </button>
            </form>
          </div>

          {/* Output Section */}
          <div className="order-1 lg:order-2 min-h-[300px] lg:min-h-auto">
              {isLoading ? (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 p-8">
                      <Loading status={t.loadingLogo} step={2} uiLanguage={uiLanguage} />
                  </div>
              ) : logoImage ? (
                  <div className="h-full w-full relative group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center bg-checkered">
                      <img src={logoImage} alt="Generated Logo" className="w-full h-full object-contain max-h-[500px]" />
                      
                      <div className={`absolute top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${uiLanguage === 'ar' ? 'left-4' : 'right-4'}`}>
                          <button 
                             onClick={() => setIsFullscreen(true)}
                             className="p-2 bg-black/50 hover:bg-amber-600 text-white rounded-lg backdrop-blur-md"
                          >
                              <Maximize2 className="w-5 h-5" />
                          </button>
                          <a 
                             href={logoImage}
                             download={`logo-${brandName}.png`}
                             className="p-2 bg-black/50 hover:bg-amber-600 text-white rounded-lg backdrop-blur-md"
                          >
                              <Download className="w-5 h-5" />
                          </a>
                      </div>
                  </div>
              ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-slate-400">
                      <Hexagon className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-sm font-medium">{t.logoOutputPlaceholder}</p>
                  </div>
              )}
          </div>
      </div>

       {/* Fullscreen Modal */}
       {isFullscreen && logoImage && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
            <button 
                onClick={() => setIsFullscreen(false)}
                className={`absolute top-6 p-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors ${uiLanguage === 'ar' ? 'left-6' : 'right-6'}`}
            >
                <X className="w-6 h-6" />
            </button>
            <img src={logoImage} alt="Logo Fullscreen" className="max-w-full max-h-full object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default LogoTool;