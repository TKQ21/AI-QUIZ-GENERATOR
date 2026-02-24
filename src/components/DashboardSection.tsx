import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, X, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GlassCard from "./GlassCard";

const subjects = ["Mathematics", "Science", "History", "Computer Science", "Literature", "Geography"];
const quizTypes = ["MCQ", "True/False", "Short Answer"];
const difficulties = ["Easy", "Medium", "Hard"];

interface MCQQuestion {
  q: string;
  options: string[];
  correct: number;
}

interface ShortAnswerQuestion {
  q: string;
  answer: string;
}

type Question = MCQQuestion | ShortAnswerQuestion;

const isMCQ = (q: Question): q is MCQQuestion => "options" in q;

const DashboardSection = () => {
  const [subject, setSubject] = useState("Computer Science");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizType, setQuizType] = useState("MCQ");
  const [timeLimit, setTimeLimit] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});
  const [showScore, setShowScore] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setShowQuiz(false);
    setSelected({});
    setShortAnswers({});
    setShowScore(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { subject, topic, difficulty, numQuestions, quizType },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setQuestions(data.questions || []);
      setShowQuiz(true);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Quiz generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setShowQuiz(false);
    setQuestions([]);
    setSelected({});
    setShortAnswers({});
    setShowScore(false);
    setTopic("");
  };

  const score = questions.reduce((acc, q, i) => {
    if (isMCQ(q)) {
      return acc + (selected[i] === q.correct ? 1 : 0);
    }
    return acc + (shortAnswers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase() ? 1 : 0);
  }, 0);

  const answeredCount = quizType === "Short Answer"
    ? Object.keys(shortAnswers).filter(k => shortAnswers[Number(k)]?.trim()).length
    : Object.keys(selected).length;

  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <section className="py-20 px-4" id="dashboard">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Quiz Dashboard</h2>
          <p className="text-muted-foreground">Configure and generate your AI-powered quiz.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 space-y-5" tilt={false}>
              <h3 className="text-lg font-semibold text-foreground">Quiz Configuration</h3>

              {/* Subject */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full glass rounded-lg px-4 py-2.5 text-foreground bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="w-full glass rounded-lg px-4 py-2.5 text-foreground bg-transparent placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Difficulty</label>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        difficulty === d
                          ? "gradient-bg text-primary-foreground neon-glow"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Num questions */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1.5 block">Questions</label>
                  <div className="flex items-center gap-3 glass rounded-lg px-3 py-2">
                    <button onClick={() => setNumQuestions(Math.max(1, numQuestions - 1))} className="text-muted-foreground hover:text-foreground text-lg">−</button>
                    <span className="flex-1 text-center font-medium text-foreground">{numQuestions}</span>
                    <button onClick={() => setNumQuestions(Math.min(50, numQuestions + 1))} className="text-muted-foreground hover:text-foreground text-lg">+</button>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1.5 block">Time (min)</label>
                  <div className="flex items-center gap-3 glass rounded-lg px-3 py-2">
                    <button onClick={() => setTimeLimit(Math.max(1, timeLimit - 1))} className="text-muted-foreground hover:text-foreground text-lg">−</button>
                    <span className="flex-1 text-center font-medium text-foreground">{timeLimit}</span>
                    <button onClick={() => setTimeLimit(Math.min(120, timeLimit + 1))} className="text-muted-foreground hover:text-foreground text-lg">+</button>
                  </div>
                </div>
              </div>

              {/* Quiz Type */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Quiz Type</label>
                <div className="flex gap-2">
                  {quizTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuizType(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        quizType === t
                          ? "gradient-bg text-primary-foreground neon-glow"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 gradient-bg text-primary-foreground font-semibold py-3 rounded-xl neon-glow-strong disabled:opacity-50 transition-all"
                >
                  {generating ? "Generating..." : "Generate Quiz"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="glass px-5 py-3 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          {/* RIGHT: Output */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 min-h-[400px]" tilt={false}>
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full min-h-[350px] gap-4"
                  >
                    <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
                    <p className="text-muted-foreground animate-pulse">AI is generating your quiz...</p>
                  </motion.div>
                ) : showQuiz && questions.length > 0 ? (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{answeredCount}/{questions.length}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full gradient-bg rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>

                    {/* Questions */}
                    {questions.map((q, qi) => (
                      <GlassCard key={qi} className="p-4" tilt={false}>
                        <p className="text-sm font-medium text-foreground mb-3">
                          {qi + 1}. {q.q}
                        </p>
                        {isMCQ(q) ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                              const isSelected = selected[qi] === oi;
                              const isCorrect = showScore && q.correct === oi;
                              const isWrong = showScore && isSelected && q.correct !== oi;
                              return (
                                <button
                                  key={oi}
                                  onClick={() => !showScore && setSelected((p) => ({ ...p, [qi]: oi }))}
                                  className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                                    isCorrect
                                      ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                                      : isWrong
                                      ? "border-destructive bg-destructive/10 text-destructive"
                                      : isSelected
                                      ? "border-primary bg-primary/10 text-foreground neon-glow"
                                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {isCorrect && <Check className="w-3.5 h-3.5" />}
                                    {isWrong && <X className="w-3.5 h-3.5" />}
                                    {opt}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div>
                            <input
                              value={shortAnswers[qi] || ""}
                              onChange={(e) => !showScore && setShortAnswers((p) => ({ ...p, [qi]: e.target.value }))}
                              placeholder="Type your answer..."
                              className={`w-full glass rounded-lg px-4 py-2.5 text-foreground bg-transparent placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary ${
                                showScore
                                  ? shortAnswers[qi]?.trim().toLowerCase() === (q as ShortAnswerQuestion).answer.trim().toLowerCase()
                                    ? "border-neon-cyan ring-1 ring-neon-cyan"
                                    : "border-destructive ring-1 ring-destructive"
                                  : ""
                              }`}
                              disabled={showScore}
                            />
                            {showScore && shortAnswers[qi]?.trim().toLowerCase() !== (q as ShortAnswerQuestion).answer.trim().toLowerCase() && (
                              <p className="text-xs text-neon-cyan mt-1">Correct: {(q as ShortAnswerQuestion).answer}</p>
                            )}
                          </div>
                        )}
                      </GlassCard>
                    ))}

                    {/* Submit / Score */}
                    {!showScore ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowScore(true)}
                        disabled={answeredCount < questions.length}
                        className="w-full gradient-bg text-primary-foreground font-semibold py-3 rounded-xl neon-glow disabled:opacity-40 transition-all"
                      >
                        Submit Quiz
                      </motion.button>
                    ) : (
                      <GlassCard className="p-5 text-center neon-glow-strong" tilt={false}>
                        <p className="text-3xl font-bold gradient-text mb-1">
                          {score}/{questions.length}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {score === questions.length
                            ? "Perfect score! Outstanding! 🎉"
                            : score >= questions.length * 0.7
                            ? "Great job! Keep improving! 💪"
                            : "Keep practicing, you'll get there! 📚"}
                        </p>
                      </GlassCard>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full min-h-[350px] gap-3"
                  >
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center opacity-30">
                      <Loader2 className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">Configure and generate a quiz to get started</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
