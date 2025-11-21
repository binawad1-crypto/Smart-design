/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { ToolView, UiLanguage } from './types';
import { translations } from './translations';
import { auth } from './services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import InfographicTool from './components/InfographicTool';
import ArticleTool from './components/ArticleTool';
import LogoTool from './components/LogoTool';
import MarketingTool from './components/MarketingTool';
import Loading from './components/Loading';
import { 
  Atom, 
  Sun, 
  Moon, 
  Key, 
  CreditCard, 
  ExternalLink, 
  DollarSign, 
  FileBarChart, 
  ScrollText, 
  Hexagon, 
  Megaphone,
  ArrowLeft,
  ArrowRight,
  Globe,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const ADMIN_EMAIL = "binawad1@gmail.com";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<ToolView>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>('ar');

  // API Key State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[uiLanguage];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check for API Key on Mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
          setHasApiKey(true);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
        setError(null);
      } catch (e) {
        console.error("Failed to open key selector:", e);
      }
    }
  };

  const handleError = (msg: string) => {
    setError(msg);
    if (msg.includes("Access denied") || msg.includes("تم رفض الوصول")) {
        setHasApiKey(false);
    }
  };

  const toggleLanguage = () => {
    setUiLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        setShowIntro(true); // Reset intro on logout
        setCurrentView('home');
    } catch (e) {
        console.error("Logout failed", e);
    }
  };

  // Modal for API Key Selection
  const KeySelectionModal = () => (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300" dir={uiLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
            
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 border-4 border-white dark:border-slate-900 shadow-lg">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white dark:border-slate-900 uppercase tracking-wide">
                        {t.paidApp}
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                        {t.paidKeyRequired}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                        {t.billingDesc}
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 w-full text-left rtl:text-right">
                    <div className="flex items-start gap-3">
                         <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                            <DollarSign className="w-4 h-4" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{t.billingRequired}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t.billingShort}
                            </p>
                             <a 
                                href="https://ai.google.dev/gemini-api/docs/billing" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline mt-1"
                            >
                                {t.viewBilling} <ExternalLink className="w-3 h-3" />
                            </a>
                         </div>
                    </div>
                </div>

                <button 
                    onClick={handleSelectKey}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <Key className="w-4 h-4" />
                    <span>{t.selectKey}</span>
                </button>
            </div>
        </div>
    </div>
  );

  const ServiceCard = ({ icon: Icon, title, desc, view, colorClass }: { icon: any, title: string, desc: string, view: ToolView, colorClass: string }) => (
      <button 
        onClick={() => setCurrentView(view)}
        className="group relative flex flex-col p-6 md:p-8 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:border-white/20 transition-all duration-300 text-left rtl:text-right overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
      >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${colorClass}`}></div>
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorClass.replace('from-', 'bg-').replace('to-', 'text-white')} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
          
          <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
              <span>{t.launchTool}</span>
              {uiLanguage === 'ar' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </div>
      </button>
  );

  // 1. Loading State
  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
              <div className="flex flex-col items-center gap-4">
                  <Loading status={t.loadingConnect} step={1} uiLanguage={uiLanguage} />
              </div>
          </div>
      );
  }

  // 2. Unauthenticated State
  if (!user) {
      return <LoginScreen uiLanguage={uiLanguage} onLanguageToggle={toggleLanguage} />;
  }

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div dir={uiLanguage === 'ar' ? 'rtl' : 'ltr'}>
    {!checkingKey && !hasApiKey && <KeySelectionModal />}

    {showIntro ? (
      <IntroScreen onComplete={() => setShowIntro(false)} uiLanguage={uiLanguage} />
    ) : (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-cyan-500 selection:text-white pb-20 relative overflow-x-hidden animate-in fade-in duration-1000 transition-colors">
      
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-indigo-950 dark:via-slate-950 dark:to-black z-0 transition-colors"></div>
      <div className="fixed inset-0 opacity-5 dark:opacity-20 z-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }}></div>

      {/* Navbar */}
      <header className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="relative scale-90 md:scale-100">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 dark:opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 relative z-10 shadow-sm dark:shadow-none">
                   <Atom className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-[spin_10s_linear_infinite]" />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg md:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                    {t.appTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-amber-400">{t.appSubtitle}</span>
                    </span>
                    {isAdmin && (
                        <span className="hidden md:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> {t.adminBadge}
                        </span>
                    )}
                </div>
                <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">
                    {t.appTagline}
                </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
              {currentView !== 'home' && (
                <button 
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-200 dark:border-white/10 mx-2"
                >
                    {uiLanguage === 'ar' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                    <span className="hidden sm:inline">{t.backToHome}</span>
                </button>
              )}

              <button 
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-200 dark:border-white/10"
                title={t.language}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{uiLanguage === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors border border-slate-200 dark:border-white/10 shadow-sm"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors border border-red-100 dark:border-red-500/20 ml-2"
                title={t.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t.logout}</span>
              </button>
          </div>
        </div>
      </header>

      <main className="px-3 sm:px-6 py-4 md:py-8 relative z-10">
        
        {/* Dashboard View */}
        {currentView === 'home' && (
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 mt-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                    <h1 className="text-4xl md:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        {t.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500">{t.heroTitleSuffix}</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        {t.heroDesc}
                    </p>
                    {isAdmin && (
                        <div className="mt-4 inline-block bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-bold">
                             👋 Welcome, Admin ({user.email})
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-100 fade-in">
                    <ServiceCard 
                        icon={FileBarChart}
                        title={t.toolInfographic}
                        desc={t.descInfographic}
                        view="infographic"
                        colorClass="from-cyan-600 to-blue-600"
                    />
                    <ServiceCard 
                        icon={ScrollText}
                        title={t.toolArticle}
                        desc={t.descArticle}
                        view="article"
                        colorClass="from-emerald-500 to-teal-600"
                    />
                     <ServiceCard 
                        icon={Hexagon}
                        title={t.toolLogo}
                        desc={t.descLogo}
                        view="logo"
                        colorClass="from-amber-500 to-orange-600"
                    />
                    <ServiceCard 
                        icon={Megaphone}
                        title={t.toolMarketing}
                        desc={t.descMarketing}
                        view="marketing"
                        colorClass="from-purple-600 to-pink-600"
                    />
                </div>
            </div>
        )}

        {/* Tool Views */}
        {currentView === 'infographic' && <InfographicTool onError={handleError} uiLanguage={uiLanguage} />}
        {currentView === 'article' && <ArticleTool onError={handleError} uiLanguage={uiLanguage} />}
        {currentView === 'logo' && <LogoTool onError={handleError} uiLanguage={uiLanguage} />}
        {currentView === 'marketing' && <MarketingTool onError={handleError} uiLanguage={uiLanguage} />}

      </main>
    </div>
    )}
    </div>
  );
};

export default App;