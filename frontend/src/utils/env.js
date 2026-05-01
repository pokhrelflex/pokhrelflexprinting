export const env = {
  baseUrl: import.meta.env.VITE_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3300' : ''),
  apiBaseUrl: import.meta.env.VITE_API_URL || '',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Pokhrel Flex Printing',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Quality printing solutions for retail and wholesale',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '',
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || '',
  enableContactForm: import.meta.env.VITE_ENABLE_CONTACT_FORM === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

export default env;
