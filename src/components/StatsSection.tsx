import { motion } from "framer-motion";
import { FileQuestion, Users, Award } from "lucide-react";
import GlassCard from "./GlassCard";

const stats = [
  { icon: FileQuestion, value: "10K+", label: "Quizzes Generated", color: "text-neon-purple" },
  { icon: Users, value: "50+", label: "Subjects Covered", color: "text-neon-blue" },
  { icon: Award, value: "98%", label: "Student Satisfaction", color: "text-neon-cyan" },
];

const StatsSection = () => (
  <section className="py-20 px-4">
    <div className="container max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
        >
          <GlassCard className="p-8 text-center hover:neon-glow transition-shadow duration-300">
            <s.icon className={`w-10 h-10 mx-auto mb-4 ${s.color}`} />
            <div className="text-4xl font-bold gradient-text mb-2">{s.value}</div>
            <div className="text-muted-foreground text-sm">{s.label}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StatsSection;
