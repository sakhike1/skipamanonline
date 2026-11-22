import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  url?: string;
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Skipaman Store | Custom printing, school uniforms & branded merch — South Africa',
  description =
    'Skipaman retail tees and streetwear, plus custom printing for schools, teams, and businesses: uniforms, branded shirts, caps, and drinkware. Delivery across South Africa.',
  keywords = [
    'Skipaman',
    't-shirt printing near me',
    'custom t-shirts South Africa',
    'bulk t-shirt printing',
    'cheap branded t-shirts',
    'uniform printing',
    'school t-shirts',
    'corporate branding',
    't-shirt printer Centurion',
    'tshirt printing Pretoria',
    'shirt printing Johannesburg',
    'DTF printing',
    'screen printing South Africa',
    'vinyl printing',
    'custom t-shirt printing South Africa',
    'school uniforms',
    'branded caps',
    'corporate merch',
    'streetwear',
  ],
  image = '/images/og-image.jpg',
  type = 'website',
  url,
  structuredData,
}) => {
  const location = useLocation();
  const currentUrl = url || `https://skipaman.com${location.pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://skipaman.com${image}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('title', title);

    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', fullImageUrl, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', type, 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', fullImageUrl);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, type, url, currentUrl, fullImageUrl, structuredData]);

  return null;
};





















































