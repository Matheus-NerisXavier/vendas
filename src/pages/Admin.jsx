import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Trash2, Video, Link as LinkIcon, Image as ImageIcon, CheckCircle } from 'lucide-react';

const CATEGORIES = ["Eletrônicos", "Moda", "Games", "Áudio", "Casa", "Outros"];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", description: "", category: "Eletrônicos", 
    image_url: "", affiliate_url: "", video_url: "", 
    is_promo_of_day: false, is_pinned: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
    };
    checkAuth();
  }, [navigate]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('products').insert([form]);
    if (!error) {
      setForm({ 
        title: "", description: "", category: "Eletrônicos", 
        image_url: "", affiliate_url: "", video_url: "", 
        is_promo_of_day: false, is_pinned: false 
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchProducts();
    }
    setSubmitting(false);
  }

  async function deleteProduct(id) {
    if (window.confirm("Deseja mesmo excluir este produto?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          PAINEL <span className="text-primary">ADMIN</span>
        </h2>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-bold text-sm">
          <LogOut size={18} /> SAIR
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2rem] border-white/5 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="text-primary" /> Novo Achadinho
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Título do Produto" required
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              />
              <textarea 
                placeholder="Descrição/Review" rows="3"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              />
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#08060d]">{c}</option>)}
              </select>
              
              <div className="space-y-3">
                <div className="relative">
                   <ImageIcon className="absolute left-3 top-3 text-gray-500" size={16} />
                   <input type="text" placeholder="URL da Imagem" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-xs text-white outline-none" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                </div>
                <div className="relative">
                   <LinkIcon className="absolute left-3 top-3 text-gray-500" size={16} />
                   <input type="text" placeholder="Link de Afiliado" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-xs text-white outline-none" value={form.affiliate_url} onChange={e => setForm({...form, affiliate_url: e.target.value})} />
                </div>
                <div className="relative">
                   <Video className="absolute left-3 top-3 text-gray-500" size={16} />
                   <input type="text" placeholder="Link do Vídeo (Opcional)" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-xs text-white outline-none" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" className="hidden" 
                    checked={form.is_promo_of_day} onChange={e => setForm({...form, is_promo_of_day: e.target.checked})} 
                  />
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${form.is_promo_of_day ? "bg-primary border-primary" : "border-white/20"}`}>
                    {form.is_promo_of_day && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors uppercase font-bold tracking-tighter italic">Promoção do Dia? 🔥</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" className="hidden" 
                    checked={form.is_pinned} onChange={e => setForm({...form, is_pinned: e.target.checked})} 
                  />
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${form.is_pinned ? "bg-secondary border-secondary" : "border-white/20"}`}>
                    {form.is_pinned && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors uppercase font-bold tracking-tighter italic">Fixar no Topo? 📌</span>
                </label>
              </div>

              <button 
                type="submit" disabled={submitting}
                className="w-full vibrant-gradient py-4 rounded-xl font-black text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
              >
                {submitting ? "SALVANDO..." : success ? "CADASTRADO! ✅" : "CADASTRAR PRODUTO"}
              </button>
            </form>
          </div>
        </div>

        {/* Listagem de Produtos Existentes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white mb-6 uppercase italic">Gerenciar Itens ({products.length})</h3>
          
          {loading ? <p className="text-gray-500">Carregando...</p> : (
            products.map(p => (
              <div key={p.id} className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={p.image_url} alt="" className="w-16 h-16 rounded-xl object-cover bg-white/5" />
                  <div className="min-w-0">
                    <h4 className="text-white font-bold truncate text-sm">{p.title}</h4>
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest">{p.category}</span>
                  </div>
                </div>
                <button onClick={() => deleteProduct(p.id)} className="p-3 text-gray-500 hover:text-primary transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
