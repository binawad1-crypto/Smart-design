/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Atom, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { UiLanguage } from '../types';
import { translations } from '../translations';

interface LoginScreenProps {
    uiLanguage: UiLanguage;
    onLanguageToggle: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ uiLanguage, onLanguageToggle }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const t = translations[uiLanguage];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error(err);
            setError(t.authError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center relative overflow-hidden p-4" dir={uiLanguage === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Background FX */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-white/10 mb-4 shadow-2xl shadow-cyan-500/10">
                         <Atom className="w-10 h-10 text-cyan-400 animate-[spin_10s_linear_infinite]" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">
                        {t.appTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{t.appSubtitle}</span>
                    </h1>
                    <p className="text-slate-400 text-sm">{t.appTagline}</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 font-display">
                        {isRegistering ? t.registerTitle : t.loginTitle}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t.emailLabel}</label>
                            <div className="relative">
                                <Mail className={`absolute top-3.5 w-5 h-5 text-slate-500 ${uiLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all ${uiLanguage === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t.passwordLabel}</label>
                            <div className="relative">
                                <Lock className={`absolute top-3.5 w-5 h-5 text-slate-500 ${uiLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all ${uiLanguage === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{isRegistering ? t.register : t.signIn}</span>
                                    <ArrowRight className={`w-4 h-4 ${uiLanguage === 'ar' ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <button 
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-slate-400 hover:text-white text-sm transition-colors"
                        >
                            {isRegistering ? t.hasAccount : t.noAccount} <span className="text-cyan-400 font-bold">{isRegistering ? t.signIn : t.register}</span>
                        </button>
                    </div>
                    
                    <div className="mt-4 text-center">
                         <button 
                            onClick={onLanguageToggle}
                            className="text-xs font-bold text-slate-600 hover:text-slate-400 uppercase tracking-wider transition-colors"
                         >
                            {uiLanguage === 'en' ? 'العربية' : 'English'}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;