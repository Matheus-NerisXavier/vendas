import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ShoppingCart, Video, Share2, ShieldCheck, Truck, Play, CheckCircle, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { trackAffiliateClick, getParameterizedLink } from '../lib/analytics';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const activeItem = mediaItems[activeIndex] || mediaItems[0];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % mediaItems.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

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

        {/* INFO PRINCIPAL: Título em Arial 40px (Desktop) */}
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

        {/* Layout: Galeria e Ações */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* GALERIA */}
          <div className="flex-[7] space-y-6">
            <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-[#1a1a1a] border border-white/10 overflow-hidden flex items-center justify-center p-8 group shadow-2xl">
               {/* Setas de Navegação */}
               {mediaItems.length > 1 && (
                 <>
                   <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all">
                     <ChevronLeft size={24} />
                   </button>
                   <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all">
                     <ChevronRight size={24} />
                   </button>
                 </>
               )}

               <AnimatePresence mode="wait">
                 {activeItem.type === 'image' ? (
                   <motion.img 
                     key={activeItem.url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     src={activeItem.url} alt="" className="max-w-full max-h-full object-contain"
                   />
                 ) : (
                   <motion.div key="video" className="w-full h-full">
                     <video src={activeItem.url} className="w-full h-full object-contain" controls autoPlay muted loop />
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Miniaturas */}
            {mediaItems.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
                {mediaItems.map((item, idx) => (
                  <button 
                    key={idx} onClick={() => setActiveIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeIndex === idx ? "border-primary opacity-100 shadow-neon" : "border-white/10 opacity-40 hover:opacity-100"}`}
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary"><Play size={20} fill="currentColor" /></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETALHES & COMPRA */}
          <div className="flex-[5] flex flex-col space-y-10">
            <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 space-y-6">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Compra Segura Shopee</span>
               </div>

               {/* Descrição Justificada e Menor */}
               <p className="text-base text-gray-200 font-light leading-relaxed text-justify italic opacity-90">
                 "{product.description}"
               </p>
            </div>

            {/* AÇÕES (Empilhadas no Mobile) */}
            <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
              <a 
                href={getParameterizedLink(product.affiliate_url)} target="_blank" rel="noopener noreferrer" onClick={handleAffiliateClick}
                className="md:col-span-3 flex items-center justify-center gap-4 vibrant-gradient py-6 rounded-[2rem] text-lg font-black text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all uppercase italic tracking-widest"
              >
                <ShoppingCart size={24} /> Eu Quero Já!
              </a>
              <button 
                onClick={handleShare} 
                className="md:col-span-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-6 rounded-[2rem] text-white transition-all active:scale-95"
              >
                <Share2 size={24} />
                <span className="md:hidden font-bold uppercase tracking-widest text-xs">Compartilhar</span>
              </button>
            </div>

            {/* Texto Longo */}
            {product.long_description && (
              <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/10">
                <h3 className="text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-4">Análise Detalhada</h3>
                <div className="text-white/80 leading-relaxed text-sm font-light text-justify whitespace-pre-wrap">
                  {product.long_description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
