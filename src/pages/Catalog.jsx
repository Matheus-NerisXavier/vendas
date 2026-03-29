import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';

const CATEGORIES = ["Todos", "Eletrônicos", "Moda", "Games", "Áudio", "Casa"];
const ITEMS_PER_PAGE = 8;

export default function Catalog({ products, searchTerm }) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      (activeCategory === "Todos" || p.category === activeCategory) &&
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, activeCategory, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="container mx-auto px-4 mt-8 pb-12">
      <SEO 
        title={activeCategory === 'Todos' ? 'Catálogo Completo' : `Achadinhos de ${activeCategory}`}
        description={`Explore nossa seleção completa de ${activeCategory === 'Todos' ? 'ofertas' : activeCategory} da Shopee no Busca Finder.`}
      />

      {/* Filtros de Categoria */}
      <section className="mb-8 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === cat 
              ? "vibrant-gradient text-white shadow-neon" 
              : "glass text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid de Produtos Geral */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-xl font-bold text-white uppercase italic">
          <Sparkles className="text-accent" fill="currentColor" />
          {searchTerm ? `Resultados para "${searchTerm}"` : "Catálogo Completo"}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-400">Nenhum achadinho encontrado. 🤔</p>
          </div>
        )}

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
