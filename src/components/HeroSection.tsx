import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      <div className="container max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-sm text-muted-foreground"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            Powered by Advanced AI
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-2 leading-tight">
            <span className="gradient-text animate-gradient-text neon-text">QuizMaster</span>
            <span className="text-foreground"> AI</span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-muted-foreground mb-3">
            Intelligent Quiz Generator
          </p>
          <p className="text-base sm:text-lg text-muted-foreground/80 max-w-xl mb-8 mx-auto lg:mx-0">
            AI-powered subject-wise and difficulty-based quiz creation for smart learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.a
              href="#dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="gradient-bg text-primary-foreground font-semibold px-8 py-3.5 rounded-xl neon-glow-strong transition-all text-lg text-center"
            >
              Generate Smart Quiz
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="glass font-semibold px-8 py-3.5 rounded-xl text-foreground hover:bg-muted/20 transition-all text-lg gradient-border text-center"
            >
              View Demo
            </motion.a>
          </div>
        </motion.div>

        {/* Right illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-64 sm:w-80 sm:h-80 glass-strong rounded-3xl flex items-center justify-center neon-glow gradient-border"
            >
              <Brain className="w-32 h-32 sm:w-40 sm:h-40 text-neon-purple opacity-80" />
            </motion.div>
            {/* Floating quiz cards */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-6 -right-6 glass rounded-xl px-4 py-3 neon-glow"
            >
              <span className="text-sm font-medium text-neon-cyan">Q: What is AI?</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-8 glass rounded-xl px-4 py-3 neon-glow"
            >
              <span className="text-sm font-medium text-neon-blue">Score: 98%</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
