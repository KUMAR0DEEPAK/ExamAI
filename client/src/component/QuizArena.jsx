import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRedo, 
  FaArrowRight, 
  FaArrowLeft, 
  FaTrophy, 
  FaLightbulb,
  FaAward
} from "react-icons/fa";

// Helper to synthesize quiz if note doesn't have explicit quiz array (for backward compatibility)
const normalizeQuiz = (result) => {
  if (Array.isArray(result?.quiz) && result.quiz.length > 0) {
    return result.quiz;
  }

  // Fallback: build from questions.short
  if (Array.isArray(result?.questions?.short) && result.questions.short.length > 0) {
    return result.questions.short.slice(0, 5).map((q, idx) => {
      const qText = typeof q === "string" ? q : q.question;
      const aText = typeof q === "string" ? "Review note for detailed answer." : q.answer;
      return {
        question: qText,
        options: [
          aText.slice(0, 80) + (aText.length > 80 ? "..." : ""),
          "Incorrect distractor statement based on general knowledge.",
          "Alternative hypothesis that does not apply here.",
          "Common student misconception regarding this concept.",
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        explanation: aText,
      };
    });
  }

  return [];
};

function QuizArena({ result, onExit }) {
  const questions = normalizeQuiz(result);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45);
  const [isFinished, setIsFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isFinished || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, currentIndex]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(45);
  }, [currentIndex]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // prevent changing once selected
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    // Calculate score
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 60) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(45);
    setIsFinished(false);
    setShowReview(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-gray-500">Quiz questions are not available for this note.</p>
        <button
          onClick={onExit}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-6">
      
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 text-base">
            <FaAward />
          </span>
          <div>
            <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white">
              Interactive AI Mock Exam
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Test your exam recall before checking notes
            </p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Exit Quiz
        </button>
      </div>

      {/* IN PROGRESS VIEW */}
      {!isFinished && (
        <div className="space-y-6">
          {/* Progress and Timer Bar */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-500 dark:text-gray-400">
              Question <strong className="text-indigo-600 dark:text-indigo-400">{currentIndex + 1}</strong> of {questions.length}
            </span>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
              timeLeft <= 10 
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            }`}>
              <FaClock className="text-xs" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Progress tracker dots */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-indigo-600 dark:bg-indigo-400"
                    : selectedAnswers[i] !== undefined
                    ? "bg-emerald-500/60"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            ))}
          </div>

          {/* Question Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-md space-y-6"
          >
            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h4>

            {/* 4 Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const letter = ["A", "B", "C", "D"][optIdx];

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/30"
                        : "bg-gray-50/70 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm font-medium leading-relaxed grow">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswers[currentIndex] === undefined}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <span>{currentIndex === questions.length - 1 ? "Finish Exam" : "Next Question"}</span>
                <FaArrowRight className="text-[10px]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* FINAL SCORECARD VIEW */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 text-3xl flex items-center justify-center mx-auto ring-8 ring-amber-500/10">
            <FaTrophy />
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Exam Scorecard</span>
            <h3 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mt-1">
              You Scored {score} / {questions.length} ({percentage}%)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {percentage >= 80 
                ? "🌟 Outstanding! You have mastered this exam concept."
                : percentage >= 60
                ? "👍 Solid recall! A quick revision of the notes will get you to 100%."
                : "📚 Good practice! Review the detailed notes and try again."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {showReview ? "Hide Answer Review" : "Review All Answers & Explanations"}
            </button>

            <button
              onClick={restartQuiz}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <FaRedo className="text-[10px]" /> Retake Exam
            </button>
          </div>

          {/* Detailed Question Review Accordion */}
          <AnimatePresence>
            {showReview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-left space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Question Breakdown
                </h4>

                {questions.map((q, idx) => {
                  const studentAns = selectedAnswers[idx];
                  const isCorrect = studentAns === q.correctAnswer;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${
                        isCorrect
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                          {idx + 1}. {q.question}
                        </p>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                            <FaCheckCircle /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-bold shrink-0">
                            <FaTimesCircle /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs space-y-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Your Answer:</strong> {q.options[studentAns] || "Time Ran Out"}
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                          </p>
                        )}
                        {q.explanation && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-200/50 dark:border-gray-700/50 italic flex items-center gap-1.5">
                            <FaLightbulb className="text-amber-500 shrink-0" />
                            <span>{q.explanation}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default QuizArena;
