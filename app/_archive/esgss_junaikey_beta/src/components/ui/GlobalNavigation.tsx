import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const GlobalNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on home page if desired, or keep for consistency.
  // Showing on all sub-pages is usually requested.
  if (location.pathname === '/') return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-24 left-6 z-[90] flex flex-col gap-3"
    >
      <button
        onClick={() => navigate(-1)}
        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 shadow-lg group relative"
        title="Go Back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-xs rounded text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Back
        </span>
      </button>
      <button
        onClick={() => navigate('/')}
        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all hover:scale-110 shadow-lg group relative"
        title="Return Home"
      >
        <Home className="w-5 h-5" />
        <span className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-xs rounded text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Sanctuary
        </span>
      </button>
    </motion.div>
  );
};
