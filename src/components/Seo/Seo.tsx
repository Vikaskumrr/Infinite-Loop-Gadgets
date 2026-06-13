import React from 'react';

interface SeoProps {
  title: string;
  description: string;
}

const upsertMeta = (name: string, content: string) => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const Seo: React.FC<SeoProps> = ({ title, description }) => {
  React.useEffect(() => {
    document.title = `${title} | Infinite Loop Gadgets`;
    upsertMeta('description', description);
    upsertMeta('og:title', title);
    upsertMeta('og:description', description);
  }, [description, title]);

  return null;
};

export default Seo;
