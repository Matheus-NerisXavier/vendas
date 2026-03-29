import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Smartphone, Home as HomeIcon, Shirt, Zap, ShoppingBag, Flame, User, UserPlus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'Tudo', icon: ShoppingBag },
  { id: 'Eletrônicos', label: 'Tech', icon: Smartphone },
  { id: 'Casa', label: 'Casa', icon: HomeIcon },
  { id: 'Moda', label: 'Moda', icon: Shirt },
  { id: 'Acessórios', label: 'Acessórios', icon: Zap },
];

export default function Home({ products }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAudience, setActiveAudience] = useState('all');

  const promoOfDay = products.filter(p => {
    if (!p.is_promo_of_day) return false;
    const createdDate = new Date(p.created_at).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    return p.is_pinned || createdDate === todayDate;
  });

  // Lógica de Filtro Combinada (Categoria + Público)
  const filteredItems = products.filter(p => {
    if (p.is_promo_of_day && activeCategory === 'all' && activeAudience === 'all') return false;
    
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesAudience = activeAudience === 'all' || p.target_audience === activeAudience || p.target_audience === 'Unissex';
    
    return matchesCategory && matchesAudience;
  }).slice(0, 12);

  return (
    <main className="container mx-auto px-4 mt-8 pb-20">
      <SEO 
        title={activeCategory === 'all' ? 'Home' : `Ofertas de ${activeCategory}`}
        description={`Confira os melhores achadinhos de ${activeCategory === 'all' ? 'diversas categorias' : activeCategory} da Shopee no Busca Finder.`}
      />
      
      {/* Hero / Banner Elite Dark */}
      <section className="relative mb-12 min-h-[480px] flex items-center overflow-hidden rounded-[3.5rem] bg-[#0c0c0c] border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center md:text-left"
          >
            <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-[0.4em] text-primary uppercase">
              <Sparkles size={14} /> Seleção Especial 2026
            </div>
            
            <h2 className="text-4xl md:text-7xl font-bold text-white leading-none tracking-tight uppercase italic">
              A melhor busca<br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary font-['Instrument_Serif'] not-italic lowercase tracking-normal">começa aqui.</span>
            </h2>
            
            <p className="mt-8 text-gray-200 text-lg md:text-xl font-light leading-relaxed max-w-sm mx-auto md:mx-0 opacity-100">
              Curadoria manual dos itens mais desejados da internet. Economia real <span className="text-white border-b border-white/20 font-bold">todos os dias.</span>
            </p>

            <div className="mt-12">
              <Link 
                to="/catalog"
                className="inline-flex items-center gap-4 vibrant-gradient text-white px-12 py-5 rounded-3xl text-sm font-black tracking-widest hover:scale-105 active:scale-95 transition-all shadow-neon uppercase italic"
              >
                Explorar Tudo <ArrowRight size={20} strokeWidth={3} />
              </Link>
            </div>
          </motion.div>

          {/* Dinamic Grid */}
          <div className="relative hidden lg:flex items-center justify-center w-1/3">
             <div className="grid grid-cols-2 gap-8 scale-110 lg:rotate-6">
                {products.slice(0, 4).map((p, i) => (
                  <motion.div key={p.id} animate={{ y: [0, i % 2 === 0 ? -20 : 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: i * 0.4 }}>
                    <Link to={`/p/${p.id}`} className="block w-32 h-32 rounded-[2.5rem] bg-[#1a1a1a] border border-white/10 p-4 shadow-2xl transition-all hover:border-primary/50 hover:scale-110 group">
                      <img src={p.image_url} alt="" className="w-full h-full object-contain transition-transform" />
                    </Link>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO BENTO: SEGMENTAÇÃO POR PÚBLICO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
         <motion.button 
           whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
           onClick={() => setActiveAudience(activeAudience === 'Masculino' ? 'all' : 'Masculino')}
           className={`relative h-48 rounded-[2.5rem] overflow-hidden border transition-all p-8 flex flex-col justify-end group ${activeAudience === 'Masculino' ? 'border-primary ring-2 ring-primary/20' : 'border-white/5 bg-[#111111]'}`}
         >
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-primary transition-colors">
               <User size={80} strokeWidth={1} />
            </div>
            <div className="relative z-10">
               <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Curadoria Premium</span>
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1">ESTILO MASCULINO</h3>
               <p className="text-gray-500 text-xs font-bold mt-2 group-hover:text-white transition-colors">Os itens que eles amam →</p>
            </div>
         </motion.button>

         <motion.button 
           whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
           onClick={() => setActiveAudience(activeAudience === 'Feminino' ? 'all' : 'Feminino')}
           className={`relative h-48 rounded-[2.5rem] overflow-hidden border transition-all p-8 flex flex-col justify-end group ${activeAudience === 'Feminino' ? 'border-secondary ring-2 ring-secondary/20' : 'border-white/5 bg-[#111111]'}`}
         >
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-secondary transition-colors">
               <UserPlus size={80} strokeWidth={1} />
            </div>
            <div className="relative z-10">
               <span className="text-secondary text-[10px] font-black uppercase tracking-[0.3em]">Seleção Exclusiva</span>
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1">UNIVERSO FEMININO</h3>
               <p className="text-gray-500 text-xs font-bold mt-2 group-hover:text-white transition-colors">Achadinhos essenciais →</p>
            </div>
         </motion.button>
      </section>

      {/* Seletor de Categoria */}
      <section className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary rounded-full shadow-neon" />
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Explore por Categoria</h3>
        </div>

        <div className="relative w-full md:w-72 group">
          <select 
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full bg-[#111111] text-white border border-white/10 px-6 py-4 rounded-2xl appearance-none cursor-pointer focus:outline-none focus:border-primary transition-all font-bold text-sm tracking-widest uppercase italic"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-[#080808] py-4">
                {cat.label.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
            <Zap size={18} fill="currentColor" />
          </div>
        </div>
      </section>

      {/* Grid de Ofertas */}
      <div className="space-y-32">
        {/* Promoções do Dia */}
        {promoOfDay.length > 0 && activeCategory === 'all' && activeAudience === 'all' && (
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="flex items-center gap-3 text-3xl font-black text-white uppercase italic tracking-tighter">
                <Flame className="text-primary animate-pulse" fill="currentColor" />
                Promoções do Dia
              </div>
              <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <AnimatePresence>
                {promoOfDay.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Galeria Geral */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {activeAudience !== 'all' ? `EXCLUSIVO ${activeAudience.toUpperCase()}` : activeCategory === 'all' ? 'Confira Também ✨' : `Ofertas de ${activeCategory} ✨`}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-32 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10">
              <p className="text-gray-500 uppercase font-black tracking-widest text-sm">Aguardando novos achadinhos nesta seção.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
