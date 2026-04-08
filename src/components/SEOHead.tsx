import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const SEOHead = ({
  title = 'Ad Atelier AI — AI-Powered Caption Generator for Social Media',
  description = 'Transform your images into viral social media content. Generate AI-powered captions for Instagram, LinkedIn, Twitter & more. Free to start.',
  canonical,
  type = 'website',
  jsonLd,
}: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', type, 'property');
    setMeta('twitter:title', title, 'name');
    setMeta('twitter:description', description, 'name');

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // JSON-LD
    if (jsonLd) {
      const id = 'seo-jsonld';
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      const script = document.getElementById('seo-jsonld');
      if (script) script.remove();
    };
  }, [title, description, canonical, type, jsonLd]);

  return null;
};

export default SEOHead;
