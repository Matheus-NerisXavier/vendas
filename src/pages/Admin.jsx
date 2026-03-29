import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Trash2, Video, Link as LinkIcon, Image as ImageIcon, CheckCircle, Users, User, UserPlus, Edit3, X } from 'lucide-react';

const CATEGORIES = ["Eletrônicos", "Moda", "Games", "Áudio", "Casa", "Outros"];
const AUDIENCES = [
  { id: 'Unissex', label: 'Unissex', icon: Users },
  { id: 'Masculino', label: 'Masculino', icon: User },
  { id: 'Feminino', label: 'Feminino', icon: UserPlus },
];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", long_description: "", category: "Eletrônicos", 
    target_audience: "Unissex",
    image_url: "", secondary_images: "", affiliate_url: "", video_url: "", 
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
    
    if (editingId) {
      // MODO EDIÇÃO
      const { error } = await supabase
        .from('products')
        .update(form)
        .eq('id', editingId);
        
      if (!error) {
        setEditingId(null);
        resetForm();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchProducts();
      }
    } else {
      // MODO CADASTRO
      const { error } = await supabase.from('products').insert([form]);
      if (!error) {
        resetForm();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        fetchProducts();
      }
    }
    setSubmitting(false);
  }

  function resetForm() {
    setForm({ 
      title: "", description: "", long_description: "", category: "Eletrônicos", 
      target_audience: "Unissex",
      image_url: "", secondary_images: "", affiliate_url: "", video_url: "", 
      is_promo_of_day: false, is_pinned: false 
    });
    setEditingId(null);
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      long_description: p.long_description || "",
      category: p.category || "Eletrônicos",
      target_audience: p.target_audience || "Unissex",
      image_url: p.image_url || "",
      secondary_images: p.secondary_images || "",
      affiliate_url: p.affiliate_url || "",
      video_url: p.video_url || "",
      is_promo_of_day: !!p.is_promo_of_day,
      is_pinned: !!p.is_pinned
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* Formulário de Cadastro / Edição */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2rem] border-white/5 sticky top-24 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tighter italic">
                 {editingId ? <Edit3 className="text-secondary" /> : <Plus className="text-primary" />}
                 {editingId ? "Editar Item" : "Novo Produto"}
               </h3>
               {editingId && (
                 <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                 </button>
               )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Título do Produto" required
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-3">
                 <select 
                   className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                   value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                 >
                   {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#08060d]">{c}</option>)}
                 </select>

                 <select 
                   className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                   value={form.target_audience} onChange={e => setForm({...form, target_audience: e.target.value})}
                 >
                   {AUDIENCES.map(a => <option key={a.id} value={a.id} className="bg-[#08060d]">{a.label}</option>)}
                 </select>
              </div>

              <textarea 
                placeholder="Descrição Curta" rows="2"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              />
              <textarea 
                placeholder="Análise do Especialista" rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none"
                value={form.long_description} onChange={e => setForm({...form, long_description: e.target.value})}
              />
              
              <div className="space-y-3">
                <input type="text" placeholder="URL Principal" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary/50" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                <input type="text" placeholder="Outras Fotos (URLs, SEPARADAS POR VÍRGULA)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary/50" value={form.secondary_images} onChange={e => setForm({...form, secondary_images: e.target.value})} />
                <input type="text" placeholder="Link de Afiliado" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary/50" value={form.affiliate_url} onChange={e => setForm({...form, affiliate_url: e.target.value})} />
                <input type="text" placeholder="Vídeo MP4 (Opcional)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-primary/50" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} />
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="hidden" checked={form.is_promo_of_day} onChange={e => setForm({...form, is_promo_of_day: e.target.checked})} />
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${form.is_promo_of_day ? "bg-primary border-primary shadow-neon" : "border-white/20"}`}>
                    {form.is_promo_of_day && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white uppercase font-black italic">Oferta do Dia 🔥</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="hidden" checked={form.is_pinned} onChange={e => setForm({...form, is_pinned: e.target.checked})} />
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${form.is_pinned ? "bg-secondary border-secondary shadow-neon" : "border-white/20"}`}>
                    {form.is_pinned && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white uppercase font-black italic">Destaque Pin 📌</span>
                </label>
              </div>

              <button 
                type="submit" disabled={submitting}
                className={`w-full py-4 rounded-xl font-black text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 uppercase italic tracking-widest ${editingId ? "bg-secondary" : "vibrant-gradient"}`}
              >
                {submitting ? "ENVIANDO..." : success ? "SUCESSO! ✅" : editingId ? "Atualizar Produto" : "Publicar Agora"}
              </button>
            </form>
          </div>
        </div>

        {/* Listagem de Produtos Existentes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white mb-6 uppercase italic tracking-tighter">Gerenciar Estoque ({products.length})</h3>
          
          {loading ? <div className="animate-pulse space-y-4"><div className="h-20 bg-white/5 rounded-2xl w-full"></div></div> : (
            products.map(p => (
              <div key={p.id} className={`glass p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${editingId === p.id ? "border-secondary/50 bg-secondary/5" : "border-white/5 hover:border-white/20"}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={p.image_url} alt="" className="w-16 h-16 rounded-xl object-cover bg-white/5 shadow-2xl" />
                  <div className="min-w-0">
                    <h4 className="text-white font-bold truncate text-sm">{p.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-primary font-black uppercase tracking-widest">{p.category}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">{p.target_audience || 'Unissex'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => startEdit(p)}
                    className={`p-3 rounded-xl transition-all ${editingId === p.id ? "bg-secondary text-white" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-3 text-gray-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
