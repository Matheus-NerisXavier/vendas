import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Zap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError("E-mail ou senha incorretos. Verifique os dados.");
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass max-w-md w-full p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-40 w-40 bg-primary/20 blur-[60px]" />
        
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary p-3 rounded-2xl shadow-neon mb-4">
            <Zap className="text-white" size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            ACESSO <span className="text-primary">ADMIN</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Entre para gerenciar seus achadinhos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="email" 
              required
              placeholder="Seu e-mail"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="password" 
              required
              placeholder="Sua senha"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-primary text-xs font-bold text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full vibrant-gradient py-4 rounded-2xl font-black text-white shadow-neon hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "ENTRANDO..." : "ACESSAR PAINEL"}
          </button>
        </form>
      </div>
    </div>
  );
}
