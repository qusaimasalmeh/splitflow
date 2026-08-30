import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { dummyUsers } from '../../context/AppContext';
import { Sparkles, Globe, Lock, ArrowRight, Monitor, LogIn, ChevronRight, ChevronLeft } from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    icon: Sparkles,
    color: 'emerald',
    title: 'The Ultimate Settlement Engine',
    description: 'Never overpay again. SplitFlow uses advanced algorithms to find the absolute minimum number of transactions needed to settle debts.',
  },
  {
    id: 2,
    icon: Globe,
    color: 'purple',
    title: 'Global Cross-Group Netting',
    description: "Why pay Sarah $50 in the 'Trip' group when she owes you $50 in the 'Dinner' group? We automatically cancel out debts across all your social circles.",
  },
  {
    id: 3,
    icon: Lock,
    color: 'slate',
    title: 'Absolute Privacy',
    description: 'Strict data isolation. Invite registered friends securely by phone number, or create local ghost accounts that never leave your device.',
  }
];

export const LandingAuthView: React.FC = () => {
  const { login, runLocal, runDemo, t } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (showLoginModal) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [showLoginModal]);

  const handleRunLocal = () => runLocal();
  const handleLogin = (user: any) => login(user);

  const slide = CAROUSEL_SLIDES[currentSlide];
  const Icon = slide.icon;

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'purple': return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'slate': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md z-10 space-y-12 animate-in fade-in zoom-in duration-700">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            SplitFlow
          </h1>
          <p className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">
            Smart Expense Splitting
          </p>
        </div>

        {/* Carousel Area */}
        <div className="relative min-h-[300px] flex flex-col items-center justify-center text-center px-4">
          <div key={slide.id} className="animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center">
            
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-2 mb-8 animate-float shadow-sm ${getColorClasses(slide.color)}`}>
              <Icon className="w-12 h-12" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-4 leading-tight">
              {slide.title}
            </h2>
            
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-sm">
              {slide.description}
            </p>

          </div>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
            <button 
              onClick={() => setCurrentSlide(prev => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
              className="pointer-events-auto p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length)}
              className="pointer-events-auto p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {CAROUSEL_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6">
          <button
            onClick={runDemo}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all border border-indigo-200 shadow-sm group"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500 group-hover:scale-110 transition-transform shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
              </div>
              <div className="text-start min-w-0">
                <div className="font-bold text-slate-800 text-sm sm:text-base truncate">{t('tryPopulatedDemo') || 'Live Demo'}</div>
                <div className="text-xs text-slate-500 font-medium truncate">{t('demoDescription') || 'See it with dummy data'}</div>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 rtl:rotate-180 transition-all shrink-0 ms-2" />
          </button>

          <button
            onClick={handleRunLocal}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 transition-all border border-slate-200 shadow-sm group"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:scale-110 transition-transform shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div className="text-start min-w-0">
                <div className="font-bold text-slate-800 text-sm sm:text-base truncate">{t('runLocal')}</div>
                <div className="text-xs text-slate-500 font-medium truncate">{t('tryInstantly')}</div>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 rtl:rotate-180 transition-all shrink-0 ms-2" />
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-all border border-emerald-400 shadow-lg shadow-emerald-500/20 group"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div className="text-start min-w-0">
                <div className="font-bold text-white text-sm sm:text-base truncate">{t('signIn')}</div>
                <div className="text-xs text-emerald-100 font-medium truncate">{t('accessSharedGroups')}</div>
              </div>
            </div>
            <ArrowRight size={18} className="text-emerald-100 group-hover:text-white group-hover:translate-x-1 rtl:rotate-180 transition-all shrink-0 ms-2" />
          </button>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-5 sm:p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black mb-1 text-slate-800">{t('selectAccount')}</h2>
            <p className="text-xs text-slate-500 font-medium mb-6">{t('chooseTestAccount')}</p>
            
            <div className="space-y-2">
              {dummyUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-start group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0" style={{ backgroundColor: user.color }}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 font-medium truncate">{user.phoneNumber}</div>
                  </div>
                  <ChevronRight size={16} className="ms-auto text-slate-300 group-hover:text-emerald-500 rtl:rotate-180 transition-colors shrink-0" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-6 w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
