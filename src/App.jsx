import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';

const MOCK_PRODUCTS = []; // Limpando mocks para escala real

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(MOCK_PRODUCTS); // Começa com Mock
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Buscar produtos do Supabase
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && data.length > 0) setProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Gerenciar Sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#08060d] flex items-center justify-center">
      <div className="text-primary font-black animate-pulse text-2xl italic tracking-tighter uppercase p-8 text-center">
        BUSCA FINDER...<br/>
        <span className="text-[10px] text-gray-500 font-sans tracking-normal not-italic opacity-50">PROCURANDO OFERTAS</span>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#08060d] text-gray-100 font-['Outfit']">
        <Routes>
          <Route path="/" element={
            <>
              <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <Home products={products} />
            </>
          } />
          <Route path="/catalog" element={
            <>
              <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <Catalog products={products} searchTerm={searchTerm} />
            </>
          } />
          <Route path="/p/:id" element={
            <>
              <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <ProductDetail />
            </>
          } />
          <Route path="/login" element={session ? <Navigate to="/admin" /> : <Login />} />
          <Route path="/admin" element={session ? <Admin /> : <Navigate to="/login" />} />
        </Routes>

        <footer className="mt-0 py-8 px-6 border-t border-white/5 text-center text-white/90 text-[10px] uppercase tracking-[0.4em]">
          <p>© 2026 Busca Finder - As melhores ofertas da Shopee separadas para você.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
