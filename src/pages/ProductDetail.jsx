import { ArrowLeft, ShoppingCart, Video, Share2, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { trackAffiliateClick } from '../lib/analytics';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAffiliateClick = () => {
    trackAffiliateClick(product.title, product.category);
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
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Produto não encontrado 😢</h2>
      <Link to="/" className="text-primary hover:underline">Voltar para a Home</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] pt-24 pb-20">
      <SEO 
        title={product.title} 
        description={product.description} 
        image={product.image_url}
        url={window.location.href}
      />

      <div className="container mx-auto px-4">
        {/* Navegação */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Voltar para ofertas</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Lado Esquerdo: Imagem */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-[3rem] bg-white/[0.03] border border-white/5 overflow-hidden flex items-center justify-center p-12"
          >
             <img 
               src={product.image_url} 
               alt={product.title} 
               className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-700 hover:scale-110"
             />
             <div className="absolute top-8 left-8 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {product.category}
             </div>
          </motion.div>

          {/* Lado Direito: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase italic mb-6">
              {product.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-10">
               <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-xl text-xs font-bold">
                  <ShieldCheck size={16} /> Loja Verificada
               </div>
               <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-xl text-xs font-bold">
                  <Truck size={16} /> Envio para todo Brasil
               </div>
            </div>

            <p className="text-xl text-gray-400 leading-relaxed font-light mb-12">
              {product.description || "Este produto foi selecionado por nossa equipe como uma das melhores oportunidades do dia. Aproveite enquanto durar o estoque!"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a 
                href={product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAffiliateClick}
                className="flex-grow flex items-center justify-center gap-3 vibrant-gradient py-6 rounded-[2rem] text-lg font-black text-white shadow-neon hover:scale-[1.03] active:scale-95 transition-all uppercase italic"
              >
                <ShoppingCart size={22} /> Garanta o Seu Agora
              </a>
              
              <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-6 px-10 rounded-[2rem] text-white transition-all active:scale-95">
                <Share2 size={22} />
              </button>
            </div>

            {product.video_url && (
               <div className="mt-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <Video className="text-primary" /> Review do Produto
                  </h3>
                  <div className="aspect-video rounded-3xl overflow-hidden bg-black">
                     {/* Aqui poderia vir o embed do vídeo */}
                     <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center px-12">
                        Review disponível no link oficial da oferta
                     </div>
                  </div>
               </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
