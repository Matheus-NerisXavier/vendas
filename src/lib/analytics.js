// Utilitário para rastreamento de eventos no Google Analytics 4 (GA4)

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      platform: 'web_busca_finder'
    });
  } else {
    // Modo de desenvolvimento / GA ainda não configurado
    console.log(`[Analytics] Evento: ${eventName}`, params);
  }
};

export const trackAffiliateClick = (productTitle, category) => {
  trackEvent('click_affiliate_link', {
    product_title: productTitle,
    category: category,
    event_label: `Afiliado: ${productTitle}`
  });
};

export const trackVideoClick = (productTitle) => {
  trackEvent('view_product_video', {
    product_title: productTitle,
    event_label: `Vídeo: ${productTitle}`
  });
};

// Adiciona parâmetros de rastreio automaticamente aos links
export const getParameterizedLink = (url) => {
  if (!url || url === '#') return '#';
  try {
    const trackingParam = 'utm_source=buscafinder&utm_medium=site_vendas';
    return url.includes('?') ? `${url}&${trackingParam}` : `${url}?${trackingParam}`;
  } catch (e) {
    return url;
  }
};
