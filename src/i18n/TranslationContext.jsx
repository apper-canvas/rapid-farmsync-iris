import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Load from localStorage or default to English
    return localStorage.getItem('farmSync_language') || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('farmSync_language', currentLanguage);
  }, [currentLanguage]);

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
    ]
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;