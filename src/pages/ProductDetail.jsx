import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ShoppingCart, Video, Share2, ShieldCheck, Play, Zap, ChevronLeft, ChevronRight, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { trackAffiliateClick, getParameterizedLink } from '../lib/analytics';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleAffiliateClick = () => {
    trackAffiliateClick(product.title, product.category);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado! 🔥 ✅");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (data) setProduct(data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary shadow-neon" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080808] text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Página indisponível 😢</h2>
      <Link to="/" className="text-primary hover:underline font-black uppercase tracking-widest text-xs">Voltar para Home</Link>
    </div>
  );

  const mediaItems = [
    { type: 'image', url: product.image_url },
    ...(product.secondary_images ? product.secondary_images.split(',').map(img => ({ type: 'image', url: img.trim() })) : []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ].filter(item => item.url);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  const activeItem = mediaItems[activeIndex] || mediaItems[0];

  return (
    <main className="min-h-screen bg-[#080808] pt-32 pb-24 text-white font-sans">
      <SEO 
        title={product.title} 
        description={product.description} 
        image={product.image_url}
        url={window.location.href}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Navegação Topo */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-all group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
               <ArrowLeft size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Ver mais ofertas</span>
          </Link>
        </div>

        {/* Hero Título */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-5xl mx-auto lg:text-center"
        >
          <div className="flex flex-wrap lg:justify-center gap-3 mb-6">
             <span className="px-3 py-1 bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-md border border-primary/20">
                {product.category}
             </span>
             <span className="px-3 py-1 bg-white/5 text-gray-300 text-[9px] font-black uppercase tracking-widest rounded-md border border-white/5">
                ⭐ Oferta de Elite
             </span>
          </div>
          
          <h1 
            style={{ fontFamily: 'Arial, sans-serif' }}
            className="text-3xl md:text-[40px] font-black text-white leading-tight uppercase tracking-tight italic"
          >
            {product.title}
          </h1>
        </motion.div>

        {/* Layout: Galeria e Detalhes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* GALERIA (Esquerda) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square rounded-[3rem] bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center group">
               {mediaItems.length > 1 && (
                 <>
                   <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100">
                     <ChevronLeft size={24} />
                   </button>
                   <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100">
                     <ChevronRight size={24} />
                   </button>
                 </>
               )}

               <AnimatePresence mode="wait">
                 {activeItem.type === 'image' ? (
                   <motion.img 
                     key={activeItem.url} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                     src={activeItem.url} alt="" className="max-w-[85%] max-h-[85%] object-contain cursor-zoom-in transition-transform duration-500 hover:scale-110"
                     onClick={() => setFullscreenImage(activeItem.url)}
                   />
                 ) : (
                   <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                     <video src={activeItem.url} className="w-full h-full object-contain" controls autoPlay muted loop />
                   </motion.div>
                 )}
               </AnimatePresence>

               {product.is_promo_of_day && (
                <div className="absolute top-6 left-6 bg-primary/90 text-white text-[10px] font-black py-2 px-4 rounded-full shadow-neon flex items-center gap-2">
                   <Zap size={12} fill="currentColor" /> OFERTA DO DIA
                </div>
               )}
            </div>

            {/* Miniaturas */}
            {mediaItems.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeIndex === i ? 'border-primary scale-95 shadow-neon' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                  >
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                        <Play size={16} fill="currentColor" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AÇÕES E DESCR (Direita) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Verificado</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.target_audience || 'Unissex'}</span>
               </div>
            </div>

            {/* BOTÕES DE AÇÃO (PROEMINENTES) */}
            <div className="flex flex-col gap-4 lg:mt-12">
              <a 
                href={getParameterizedLink(product.affiliate_url)} target="_blank" rel="noopener noreferrer" onClick={handleAffiliateClick}
                className="group flex items-center justify-center gap-4 vibrant-gradient py-8 rounded-[2.5rem] text-xl font-black text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all uppercase italic tracking-widest"
              >
                <ShoppingCart size={28} /> Eu Quero Já!
              </a>
              <button 
                onClick={handleShare} 
                className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-6 rounded-[2rem] text-white transition-all active:scale-95 group"
              >
                <Share2 size={24} />
                <span className="font-black uppercase tracking-widest text-[10px]">Compartilhar</span>
              </button>
            </div>
          </div>

          {/* DESCRIÇÃO - LARGURA TOTAL NO DESKTOP */}
          <div className="lg:col-span-12">
            <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative">
               <h4 className="text-xs font-black text-primary uppercase tracking-[0.4em] italic flex items-center gap-2 mb-8">
                 <Zap size={14} fill="currentColor" /> Descrição do Produto
               </h4>
               
               <div className={`text-base md:text-lg text-white font-medium leading-[1.8] text-justify opacity-100 whitespace-pre-line ${!isDescriptionExpanded ? 'max-h-48 overflow-hidden mask-fade-mobile lg:max-h-none lg:overflow-visible' : 'max-h-none overflow-visible'}`}>
                 {product.description}
               </div>

               <div className="lg:hidden">
                 {product.description.length > 200 && (
                   <button 
                     onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                     className="mt-8 text-[11px] font-black text-primary hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                   >
                     {isDescriptionExpanded ? "Ver Menos ☝️" : "Ler Tudo 👇"}
                   </button>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-20"
            onClick={() => setFullscreenImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={fullscreenImage} alt="" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
            />
          </motion.div>
        )}
       </AnimatePresence>
    </main>
  );
}
