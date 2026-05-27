const widthPattern = /([?&]width=)(\d+)/;

export const fallbackProductImage =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%221200%22%20height%3D%22900%22%20viewBox%3D%220%200%201200%20900%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20width%3D%221200%22%20height%3D%22900%22%20rx%3D%2248%22%20fill%3D%22%23F8FAFC%22/%3E%3Crect%20x%3D%22336%22%20y%3D%22164%22%20width%3D%22528%22%20height%3D%22392%22%20rx%3D%2240%22%20fill%3D%22%23E2E8F0%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%2218%22/%3E%3Crect%20x%3D%22396%22%20y%3D%22588%22%20width%3D%22408%22%20height%3D%2238%22%20rx%3D%2219%22%20fill%3D%22%2394A3B8%22/%3E%3Ccircle%20cx%3D%22470%22%20cy%3D%22306%22%20r%3D%2230%22%20fill%3D%22%230F766E%22/%3E%3Cpath%20d%3D%22M520%20448L632%20322L752%20448H520Z%22%20fill%3D%22%2314B8A6%22/%3E%3Ctext%20x%3D%22600%22%20y%3D%22728%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2242%22%20font-weight%3D%22800%22%20fill%3D%22%230F172A%22%3EInfinite%20Loop%20Gadgets%3C/text%3E%3C/svg%3E';

const escapeSvgText = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const buildProductFallbackImage = (label = 'Infinite Loop Gadgets'): string => {
  const safeLabel = escapeSvgText(label.length > 34 ? `${label.slice(0, 31)}...` : label);
  const svg = `<svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="900" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F8FAFC"/>
        <stop offset="0.48" stop-color="#E0F2FE"/>
        <stop offset="1" stop-color="#ECFDF5"/>
      </linearGradient>
      <linearGradient id="device" x1="352" y1="132" x2="848" y2="650" gradientUnits="userSpaceOnUse">
        <stop stop-color="#0F172A"/>
        <stop offset="1" stop-color="#334155"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" rx="56" fill="url(#bg)"/>
    <circle cx="950" cy="154" r="86" fill="#14B8A6" fill-opacity="0.16"/>
    <circle cx="250" cy="720" r="126" fill="#2563EB" fill-opacity="0.10"/>
    <rect x="352" y="132" width="496" height="390" rx="44" fill="url(#device)"/>
    <rect x="392" y="172" width="416" height="270" rx="24" fill="#E2E8F0"/>
    <path d="M432 410L538 300L620 382L684 322L770 410H432Z" fill="#14B8A6"/>
    <circle cx="710" cy="248" r="36" fill="#38BDF8"/>
    <rect x="480" y="552" width="240" height="34" rx="17" fill="#475569"/>
    <rect x="412" y="614" width="376" height="36" rx="18" fill="#CBD5E1"/>
    <text x="600" y="724" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="800" fill="#0F172A">${safeLabel}</text>
    <text x="600" y="780" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#475569">Infinite Loop Gadgets</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const buildResponsiveSrcSet = (src: string, widths = [320, 640, 960]): string | undefined => {
  if (!widthPattern.test(src)) {
    return undefined;
  }

  return widths.map((width) => `${src.replace(widthPattern, `$1${width}`)} ${width}w`).join(', ');
};

export const buildImageProxyUrl = (src: string, width = 1200): string | undefined => {
  if (!/^https?:\/\//i.test(src)) {
    return undefined;
  }

  const withoutProtocol = src.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(withoutProtocol)}&w=${width}&fit=contain&output=webp`;
};
