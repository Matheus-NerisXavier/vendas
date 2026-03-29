import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteName = 'Busca Finder';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Encontre os melhores achadinhos da Shopee e promoções imperdíveis selecionadas a dedo.';
  const defaultImage = 'https://ajvmlatvpsgvxwuhyqmu.supabase.co/storage/v1/object/public/assets/og-image.png'; // Placeholder para imagem real
  const siteUrl = window.location.origin;

  return (
    <Helmet>
      {/* Base Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <link rel="canonical" href={url || window.location.href} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
