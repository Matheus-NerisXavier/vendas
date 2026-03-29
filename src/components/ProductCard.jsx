import { ExternalLink, Video, ArrowRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trackAffiliateClick, trackVideoClick, getParameterizedLink } from '../lib/analytics';

export default function ProductCard({ product }) {
  const handleAffiliateClick = () => {
    trackAffiliateClick(product.title, product.category);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative flex flex-col bg-[#111111] border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
    >
      {/* Imagem do Produto */}
      <Link to={`/p/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-white/[0.03] flex items-center justify-center p-6">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=400"} 
          alt={product.title}
          className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 shadow-2xl"
        />
        {product.is_promo_of_day && (
          <div className="absolute top-4 right-4 bg-secondary px-3 py-1 rounded-full text-[10px] font-black text-white italic uppercase tracking-tighter shadow-xl flex items-center gap-1.5 animate-bounce">
            <Flame size={12} fill="currentColor" /> PROMO
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="px-2.5 py-1 rounded-md bg-white/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 italic">
            {product.category}
          </span>
        </div>

        <Link to={`/p/${product.id}`}>
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[50px]">
            {product.title}
          </h3>
        </Link>
        
        <p className="mt-3 text-sm text-gray-300 line-clamp-2 leading-relaxed font-light opacity-90">
          {product.description || "O produto perfeito selecionado para você."}
        </p>

        {/* Ações */}
        <div className="mt-6 flex flex-col gap-3">
          <a 
            href={getParameterizedLink(product.affiliate_url)} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="flex items-center justify-center gap-3 vibrant-gradient py-3.5 rounded-2xl text-sm font-black text-white shadow-neon hover:scale-[1.03] active:scale-95 transition-all uppercase italic tracking-wider"
          >
             Eu Quero Já <ArrowRight size={18} />
          </a>
          
          <Link 
            to={`/p/${product.id}`}
            className="flex items-center justify-center text-[10px] text-gray-400 hover:text-white font-black transition-colors uppercase tracking-[0.2em] py-2"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
