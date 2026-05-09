const gaId = import.meta.env.VITE_GA_ID as string | undefined;

if (gaId) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  const analyticsWindow = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  const gtag = (...args: unknown[]): void => { analyticsWindow.dataLayer?.push(args); };
  analyticsWindow.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId);
}

export {};
