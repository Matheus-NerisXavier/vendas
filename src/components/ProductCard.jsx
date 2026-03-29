import { ExternalLink, Video, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trackAffiliateClick, trackVideoClick } from '../lib/analytics';

export default function ProductCard({ product }) {
  const handleAffiliateClick = () => {
    trackAffiliateClick(product.title, product.category);
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    trackVideoClick(product.title);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden transition-all hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
    >
      {/* Imagem do Produto */}
      <Link to={`/p/${product.id}`} className="relative aspect-square overflow-hidden bg-white/[0.03]">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=400"} 
          alt={product.title}
          className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      {/* Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest border border-primary/20">
            {product.category}
          </span>
        </div>

        <Link to={`/p/${product.id}`}>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="mt-4 text-sm text-gray-300 line-clamp-3 leading-relaxed">
          {product.description || "O produto perfeito selecionado para você."}
        </p>

        {/* Ações */}
        <div className="mt-auto pt-6 flex flex-col gap-3">
          <a 
            href={product.affiliate_url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="flex items-center justify-center gap-2 vibrant-gradient py-4 rounded-2xl text-sm font-black text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all"
          >
            EU QUERO <ArrowRight size={18} />
          </a>
          
          {product.video_url && (
            <button 
              onClick={handleVideoClick}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl text-xs font-bold text-gray-400 hover:text-white hover:border-white/30 transition-all"
            >
              <Video size={14} /> VER REVIEW
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
