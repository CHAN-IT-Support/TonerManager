import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { languageMeta, translations } from './i18n/translations';

const LANGUAGE_STORAGE_KEY = 'tm_language';

const I18nContext = createContext(null);

const format = (value, vars = {}) => {
  if (!value) return value;
  return String(value).replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] ?? ''));
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState('de');
  const [defaultLanguage, setDefaultLanguage] = useState('de');

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const response = await fetch('/api/public-settings');
        if (response.ok) {
          const data = await response.json();
          const apiDefault = data?.default_language || 'de';
          if (active) setDefaultLanguage(apiDefault);
        }
      } catch (error) {
        // ignore
      } finally {
        if (!active) return;
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        setLanguageState(stored || defaultLanguage);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [defaultLanguage]);

  const setLanguage = (code) => {
    setLanguageState(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  };

  const value = useMemo(() => {
    const dict = translations[language] || translations.de;
    const t = (key, vars) => {
      const parts = key.split('.');
      let current = dict;
      for (const part of parts) {
        current = current?.[part];
      }
      if (current == null) {
        return format(key, vars);
      }
      return format(current, vars);
    };
    return {
      language,
      setLanguage,
      defaultLanguage,
      languages: languageMeta,
      t
    };
  }, [language, defaultLanguage]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};
