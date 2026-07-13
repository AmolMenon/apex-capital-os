export const analytics = {
  identify: (userId: string, traits?: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] Identify: ${userId}`, traits);
    }
    // Future: Route to PostHog/Amplitude
  },
  track: (eventName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] Track: ${eventName}`, properties);
    }
    // Future: Route to PostHog/Amplitude
  },
  page: (pageName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] Page: ${pageName}`, properties);
    }
    // Future: Route to PostHog/Amplitude
  },
  error: (errorName: string, errorContext?: Record<string, any>) => {
    console.error(`[Analytics Error] ${errorName}`, errorContext);
    // Future: Route to Sentry/Datadog
  }
};
