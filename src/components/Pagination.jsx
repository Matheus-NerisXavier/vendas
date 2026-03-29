import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="glass p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
            currentPage === i + 1 
            ? "vibrant-gradient text-white shadow-neon" 
            : "glass text-gray-400 hover:text-white hover:border-white/20"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="glass p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
