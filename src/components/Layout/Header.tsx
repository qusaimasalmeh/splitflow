import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Globe, Layers, ChevronDown, Settings, Folder, LogOut, HelpCircle } from 'lucide-react';
import { Language } from '../../i18n';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenHelp }) => {
  const { state, t, setActiveGroupId, setLanguage, isGlobalMode, setIsGlobalMode, signOut } = useApp();
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const activeGroup = state.groups.find((g) => g.id === state.activeGroupId);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'he', label: 'עברית' },
  ];

  return (
    <div className="sticky top-2 z-40 px-2 md:px-0">
      <header className="max-w-2xl mx-auto w-full px-4 py-3 glass-panel rounded-2xl shadow-lg flex items-center justify-between gap-2 transition-all">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-glow-teal">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
              {t('appName')}
            </h1>
            <p className="text-[10px] text-emerald-600 font-medium tracking-wide">
              {isGlobalMode ? t('globalNetting') : activeGroup?.name || t('isolatedNetting')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Group Selector Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsGroupDropdownOpen(!isGroupDropdownOpen);
                setIsLangDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-white border border-white/50  text-xs font-semibold text-slate-700 transition-all active:scale-95 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[100px] truncate">
                {isGlobalMode || !activeGroup ? t('allGroups') : activeGroup.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isGroupDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsGroupDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 end-0 z-20 w-56 rounded-2xl bg-white border border-white/50  shadow-glass-lg p-2 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setActiveGroupId(null);
                      setIsGlobalMode(true);
                      setIsGroupDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      isGlobalMode || !state.activeGroupId
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      <span>{t('allGroups')}</span>
                    </span>
                    {isGlobalMode && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </button>

                  <div className="h-px bg-slate-100 my-1.5" />

                  {state.groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setActiveGroupId(g.id);
                        setIsGlobalMode(false);
                        setIsGroupDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-colors ${
                        !isGlobalMode && state.activeGroupId === g.id
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Folder className="w-4 h-4 text-emerald-500" />
                        <span className="truncate">{g.name}</span>
                      </span>
                      {!isGlobalMode && state.activeGroupId === g.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Language Switcher Button */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsGroupDropdownOpen(false);
              }}
              className="p-2 rounded-full bg-white hover:bg-white border border-white/50 text-slate-600 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4" />
            </button>

            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute top-full mt-2 end-0 z-20 w-36 rounded-2xl bg-white border border-white/50  shadow-glass-lg p-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                        state.language === lang.code
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.label}</span>
                      </span>
                      {state.language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-white hover:bg-white border border-white/50 text-slate-600 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              signOut();
            }}
            className="p-2 rounded-full bg-white hover:bg-rose-50 border border-white/50 text-slate-600 hover:text-rose-600 transition-all active:scale-95 shadow-sm"
            aria-label="Sign Out"
            title={t('signOut')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
    </div>
  );
};
