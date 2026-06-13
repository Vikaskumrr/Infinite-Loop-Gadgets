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

export const trackEvent = (eventName: string, params: Record<string, unknown> = {}): void => {
  const analyticsWindow = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  if (analyticsWindow.gtag) {
    analyticsWindow.gtag('event', eventName, params);
    return;
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(['event', eventName, params]);
};

export const trackProductView = (name: string): void => trackEvent('product_view', { item_name: name });
export const trackAddToCart = (name: string, price: number): void => trackEvent('add_to_cart', { item_name: name, value: price });
export const trackCheckoutStarted = (value: number): void => trackEvent('checkout_started', { value });
