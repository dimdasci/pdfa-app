import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import './index.css'
import App from './App.jsx'
import { LocaleProvider, useLocale } from './context/LocaleContext.jsx'

// Intermediate component to access locale context for IntlProvider
function AppWrapper() {
  const { locale, messages } = useLocale();

  // Ensure messages are loaded before rendering IntlProvider
  if (Object.keys(messages).length === 0) {
    // Optional: Render a loading indicator or null
    return null; // Or <p>Loading translations...</p>
  }

  return (
    <IntlProvider locale={locale} messages={messages} onError={(err) => {
        // Suppress missing translation errors initially if desired
        if (err.code === 'MISSING_TRANSLATION') {
          // console.warn('Missing translation:', err.message);
          return;
        }
        // console.error(err); // Log other errors
      }}>
      <App />
    </IntlProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocaleProvider>
      <AppWrapper />
    </LocaleProvider>
  </StrictMode>,
)
