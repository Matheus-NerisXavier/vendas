import { Search, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl shadow-neon">
            <Zap className="text-white" size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            BUSCA <span className="text-primary tracking-normal">FINDER</span>
          </h1>
        </Link>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" size={18} />
          <input 
            type="text" 
            placeholder="O que você está procurando hoje?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (window.location.pathname !== '/catalog') {
                navigate('/catalog');
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
