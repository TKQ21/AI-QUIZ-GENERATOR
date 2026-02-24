import { motion } from "framer-motion";
import { Cpu, SlidersHorizontal, BookOpen, BarChart3 } from "lucide-react";
import GlassCard from "./GlassCard";

const features = [
  { icon: Cpu, title: "AI-based Question Generation", desc: "Leverage cutting-edge AI models to auto-generate high-quality quiz questions from any topic." },
  { icon: SlidersHorizontal, title: "Difficulty Adaptation", desc: "Smart difficulty scaling adapts questions to learner's level in real-time." },
  { icon: BookOpen, title: "Topic Customization", desc: "Full control over subjects, subtopics, and question types for tailored assessments." },
  { icon: BarChart3, title: "Scalable Assessment System", desc: "Built for classrooms and enterprises. Scale from 10 to 10,000 users effortlessly." },
];

const FeaturesSection = () => (
  <section className="py-20 px-4">
    <div className="container max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Powerful Features</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to create intelligent, engaging quizzes at scale.</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <GlassCard className="p-6 h-full hover:neon-glow transition-shadow duration-300 gradient-border">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
