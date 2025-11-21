/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef } from 'react';
import { MarketingModel, MarketingBackground, AspectRatio, UiLanguage } from '../types';
import { translations } from '../translations';
import { generateMarketingImage } from '../services/geminiService';
import Loading from './Loading';
import { Megaphone, Image as ImageIcon, Upload, Monitor, Maximize2, Download, X, Trash2 } from 'lucide-react';

interface MarketingToolProps {
  onError: (error: string) => void;
  uiLanguage: UiLanguage;
}

const MarketingTool: React.FC<MarketingToolProps> = ({ onError, uiLanguage }) => {
  const [productDesc, setProductDesc] = useState('');
  const [modelOption, setModelOption] = useState<MarketingModel>('No Model');
  const [backgroundStyle, setBackgroundStyle] = useState<MarketingBackground>('Luxury Studio');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[uiLanguage];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDesc.trim()) return;

    setIsLoading(true);
    setResultImage(null);

    try {
      const result = await generateMarketingImage(productDesc, uploadedImage, modelOption, backgroundStyle, aspectRatio);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("Requested entity was not found") || err.message.includes("404") || err.message.includes("403"))) {
        onError(t.errorAccessDenied);
      } else {
        // Handle local error
      }
    } finally {
      setIsLoading(false);
    }
  };

  const aspectRatioOptions = [
      { value: '1:1', label: '1:1 (Instagram Feed)', icon: '■' },
      { value: '3:4', label: '4:5 (Instagram Portrait)', icon: '▮' }, // Mapping 4:5 intent to 3:4 supported ratio
      { value: '9:16', label: '9:16 (Reels/TikTok)', icon: '▯' },
      { value: '16:9', label: '16:9 (YouTube Cover)', icon: '▭' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">
             {uiLanguage === 'ar' ? (
                 <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">استوديو</span> التسويق
                 </>
             ) : (
                 <>
                  Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Studio</span>
                 </>
             )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t.descMarketing}
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
             <form onSubmit={handleGenerate} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-xl flex flex-col gap-5">
                
                {/* Product Description */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <Megaphone className="w-4 h-4" /> {t.labelProductDesc}
                    </label>
                    <textarea 
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                        placeholder={t.placeholderProductDesc}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none text-slate-900 dark:text-white h-24 resize-none"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <ImageIcon className="w-4 h-4" /> {t.labelProductImage}
                    </label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${uploadedImage ? 'border-purple-500 bg-purple-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-purple-500/50'}`}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        
                        {uploadedImage ? (
                            <>
                                <img src={uploadedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
                                <div className="relative z-10 flex items-center gap-2 text-purple-500 font-bold text-xs bg-white/90 dark:bg-black/90 px-3 py-1.5 rounded-full shadow-sm">
                                    <Monitor className="w-3 h-3" />
                                    <span>Image Loaded</span>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full z-20 hover:bg-red-600"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 group-hover:text-purple-500 transition-colors">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">{t.btnUpload}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selectors Grid */}
                <div className="grid grid-cols-1 gap-4">
                    
                    {/* Model Selection */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.labelModel}</label>
                        <select 
                            value={modelOption}
                            onChange={(e) => setModelOption(e.target.value as MarketingModel)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-purple-500/50 outline-none"
                        >
                            <option value="No Model">No Model (Product Only)</option>
                            <option value="Arab Male">Elegant Arab Male</option>
                            <option value="Arab Female">Elegant Arab Female</option>
                            <option value="Hand Model">Hand Model</option>
                        </select>
                    </div>

                    {/* Background Selection */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.labelBackground}</label>
                        <select 
                            value={backgroundStyle}
                            onChange={(e) => setBackgroundStyle(e.target.value as MarketingBackground)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-purple-500/50 outline-none"
                        >
                            <option value="Luxury Studio">Luxury Studio Gradient</option>
                            <option value="Minimal Modern">Minimal Modern Interior</option>
                            <option value="Spotlight Cinematic">Spotlight Cinematic</option>
                            <option value="Outdoor Lifestyle">Outdoor Lifestyle</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Office">Office</option>
                            <option value="Desert">Desert</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Retail Store">Retail Store</option>
                        </select>
                    </div>

                    {/* Aspect Ratio Pills */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.labelAspectRatio}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {aspectRatioOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setAspectRatio(option.value as AspectRatio)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                                        aspectRatio === option.value 
                                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                                        : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="text-lg leading-none opacity-50">{option.icon}</span>
                                    <span>{option.label.split('(')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <button
                    type="submit"
                    disabled={isLoading || !productDesc}
                    className="mt-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold font-display tracking-wide hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Megaphone className="w-5 h-5" />
                    <span>{t.generateVisual}</span>
                </button>
             </form>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 h-full min-h-[400px] lg:min-h-auto">
              {isLoading ? (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 p-8">
                      <Loading status={t.loadingMarketing} step={2} uiLanguage={uiLanguage} />
                  </div>
              ) : resultImage ? (
                  <div className="h-full w-full relative group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center bg-checkered">
                      <img src={resultImage} alt="Marketing Visual" className="w-full h-full object-contain max-h-[700px]" />
                      
                      <div className={`absolute top-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${uiLanguage === 'ar' ? 'left-6' : 'right-6'}`}>
                          <button 
                             onClick={() => setIsFullscreen(true)}
                             className="p-3 bg-black/60 hover:bg-purple-600 text-white rounded-xl backdrop-blur-md shadow-lg transition-colors"
                          >
                              <Maximize2 className="w-5 h-5" />
                          </button>
                          <a 
                             href={resultImage}
                             download={`marketing-${Date.now()}.png`}
                             className="p-3 bg-black/60 hover:bg-purple-600 text-white rounded-xl backdrop-blur-md shadow-lg transition-colors"
                          >
                              <Download className="w-5 h-5" />
                          </a>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs font-mono opacity-80 mb-1">{modelOption} • {backgroundStyle}</p>
                          <p className="font-bold text-sm line-clamp-1">{productDesc}</p>
                      </div>
                  </div>
              ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-slate-400 text-center">
                      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Megaphone className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-sm font-medium max-w-xs">{t.marketingOutputPlaceholder}</p>
                  </div>
              )}
          </div>
      </div>

       {/* Fullscreen Modal */}
       {isFullscreen && resultImage && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
            <button 
                onClick={() => setIsFullscreen(false)}
                className={`absolute top-6 p-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors ${uiLanguage === 'ar' ? 'left-6' : 'right-6'}`}
            >
                <X className="w-6 h-6" />
            </button>
            <img src={resultImage} alt="Fullscreen" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default MarketingTool;