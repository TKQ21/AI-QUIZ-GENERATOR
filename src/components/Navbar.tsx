import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onAuthOpen: () => void;
}

const Navbar = ({ onAuthOpen }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 glass-strong"
    >
      <div className="container max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="#" className="text-xl font-bold gradient-text">QuizMaster AI</a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAuthOpen}
            className="gradient-bg text-primary-foreground text-sm font-medium px-5 py-2 rounded-lg neon-glow"
          >
            Sign In
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong border-t border-border px-4 py-4 space-y-3"
        >
          <a href="#dashboard" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Dashboard</a>
          <a href="#features" className="block text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</a>
          <button
            onClick={() => { onAuthOpen(); setMobileOpen(false); }}
            className="w-full gradient-bg text-primary-foreground text-sm font-medium py-2 rounded-lg"
          >
            Sign In
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
