import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@i18n/config';

// Singleton for the browser to share cache across islands
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new one per request
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  } else {
    // Browser: reuse the singleton
    if (!browserQueryClient) browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
    return browserQueryClient;
  }
}

const getBrowserLang = () => {
  if (typeof window !== 'undefined') {
    const htmlLang = document.documentElement.lang;
    if (htmlLang === 'es' || htmlLang === 'en') {
      return htmlLang;
    }
  }
  return 'en'; // default to english since english is the root page
};

export default function Providers({ children, lang }: { children: React.ReactNode, lang?: string }) {
  const queryClient = getQueryClient();
  const defaultLang = lang || getBrowserLang();

  React.useEffect(() => {
    if (defaultLang && i18n.language !== defaultLang) {
      i18n.changeLanguage(defaultLang);
    }
  }, [defaultLang]);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export function withProviders<T extends object>(Component: React.ComponentType<T>) {
  return function WrappedComponent(props: T & { lang?: string }) {
    const defaultLang = props.lang || getBrowserLang();
    const { lang, ...rest } = props;
    const queryClient = getQueryClient();
    
    React.useEffect(() => {
      if (defaultLang && i18n.language !== defaultLang) {
        i18n.changeLanguage(defaultLang);
      }
    }, [defaultLang]);

    return (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <Component {...(rest as T)} />
        </QueryClientProvider>
      </I18nextProvider>
    );
  };
}
