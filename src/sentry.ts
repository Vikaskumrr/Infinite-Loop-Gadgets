// Optional Sentry initialization without bundler dependency
// If using Sentry, either install @sentry/browser or include the CDN script to expose window.Sentry
const dsn = process.env.REACT_APP_SENTRY_DSN as string | undefined;
const w = window as unknown as { Sentry?: any };
if (dsn && w.Sentry && typeof w.Sentry.init === 'function') {
  w.Sentry.init({ dsn, tracesSampleRate: 1.0 });
}

export {};
