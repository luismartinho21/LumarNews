export const getFallbackImage = (category) => {
  if (!category) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop';
  
  const cat = category.toLowerCase();
  
  if (cat.includes('desporto') || cat.includes('futebol') || cat.includes('liga') || cat.includes('benfica') || cat.includes('sporting') || cat.includes('porto')) {
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop'; // Desporto
  }
  if (cat.includes('política') || cat.includes('economia') || cat.includes('dinheiro') || cat.includes('mercados')) {
    return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop'; // Economia / Política
  }
  if (cat.includes('mundo') || cat.includes('internacional') || cat.includes('europa')) {
    return 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1000&auto=format&fit=crop'; // Mundo
  }
  if (cat.includes('tecnologia') || cat.includes('ciência') || cat.includes('saúde')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'; // Tech / Ciência
  }
  if (cat.includes('cultura') || cat.includes('cinema') || cat.includes('música') || cat.includes('televisão') || cat.includes('famosos')) {
    return 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1000&auto=format&fit=crop'; // Cultura
  }
  
  // Default news image (jornais/breaking news)
  return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop'; 
};
