import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'en' | 'roman-urdu' | 'ur';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (en: string, ur?: string, romanUrdu?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('ym_language') as AppLanguage;
    return saved === 'en' || saved === 'roman-urdu' || saved === 'ur' ? saved : 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('ym_language', lang);
  };

  const t = (en: string, ur?: string, romanUrdu?: string): string => {
    if (language === 'ur' && ur) return ur;
    if (language === 'roman-urdu' && romanUrdu) return romanUrdu;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en' as AppLanguage,
      setLanguage: () => {},
      t: (en: string) => en,
    };
  }
  return context;
};
