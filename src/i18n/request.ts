import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'nb' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale: locale as 'nb' | 'en',
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Surface missing translation keys during development
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Translation error:', error.message);
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter(Boolean).join('.');

      if (process.env.NODE_ENV === 'development') {
        // In development, show the missing key clearly
        return `⚠️ Missing: ${path}`;
      }

      // In production, log but show a generic message
      console.error(`Missing translation: ${path}`, error);
      return path;
    },
  };
});
