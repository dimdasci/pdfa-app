import { createContext, useContext, useState, useEffect } from 'react';

export const LocaleContext = createContext(null);

// Helper function to load messages
// Vite supports dynamic import glob: https://vitejs.dev/guide/features.html#glob-import
const loadMessages = async (locale) => {
  try {
    // Use import.meta.glob to find the JSON file matching the locale
    const modules = import.meta.glob('../locales/*.json');
    const modulePath = `../locales/${locale}.json`;
    if (modules[modulePath]) {
      const module = await modules[modulePath]();
      return module.default;
    } else {
      console.warn(`Messages for locale "${locale}" not found. Falling back to 'en'.`);
      // Fallback to English if the specific locale file isn't found
      const fallbackModule = await modules['../locales/en.json']();
      return fallbackModule.default;
    }
  } catch (error) {
    console.error('Error loading locale messages:', error);
    // Return empty object or default messages in case of error
    return {};
  }
};

// Function to get the initial locale
const getInitialLocale = () => {
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale && ['en', 'es'].includes(savedLocale)) {
    return savedLocale;
  }

  const browserLang = navigator.language?.split('-')[0]; // Get primary language code (e.g., 'en' from 'en-US')
  if (browserLang && ['en', 'es'].includes(browserLang)) {
    return browserLang;
  }

  return 'en'; // Default locale
};


export const LocaleProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(getInitialLocale());
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      const loadedMessages = await loadMessages(locale);
      setMessages(loadedMessages);
    };
    fetchMessages();

    // Save locale preference to localStorage
    localStorage.setItem('locale', locale);

  }, [locale]); // Re-run effect when locale changes

  const setLocale = (newLocale) => {
    if (['en', 'es'].includes(newLocale)) {
        setLocaleState(newLocale);
    } else {
        console.warn(`Attempted to set unsupported locale: ${newLocale}`);
    }
  };


  // Display loading or fallback while messages are being fetched
  if (Object.keys(messages).length === 0 && locale) {
     // You might want a better loading state here
     // For now, we render children immediately, IntlProvider might show warnings initially
     // Or return null/a spinner until messages are loaded
     console.log(`Loading messages for ${locale}...`);
  }


  const value = {
    locale,
    messages,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}; 