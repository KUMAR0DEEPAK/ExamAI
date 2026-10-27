import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MermaidSetup from "./MermaidSetup";
import RechartSetup from "./RechartSetup";
import QuizArena from "./QuizArena";
import { downloadPdf } from "../services/api";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { 
  FaDownload, 
  FaCopy, 
  FaCheck, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaStar, 
  FaBookOpen, 
  FaBolt, 
  FaProjectDiagram, 
  FaChartBar, 
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaAward
} from "react-icons/fa";

const markDownComponent = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold font-heading text-indigo-700 dark:text-indigo-400 mt-6 mb-3 border-b pb-2 border-gray-200 dark:border-gray-800">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold font-heading text-indigo-600 dark:text-indigo-400 mt-5 mb-2.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold font-heading text-gray-800 dark:text-gray-200 mt-4 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 text-sm">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-6 space-y-1.5 text-gray-700 dark:text-gray-300 text-sm mb-3">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-6 space-y-1.5 text-gray-700 dark:text-gray-300 text-sm mb-3">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="marker:text-indigo-500 leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2 rounded-r-lg my-3 text-sm text-gray-700 dark:text-gray-300 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">
      {children}
    </code>
  ),
};

function FinalResult({ result, noteId }) {
  const [activeMode, setActiveMode] = useState("notes"); // "notes" | "quiz"
  const [quickRevision, setQuickRevision] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (
    !result ||
    !result.questions?.long ||
    !result.questions?.short ||
    !result.subTopics
  ) {
    return null;
  }

  const handleCopyNotes = () => {
    let fullText = `${result.notes}\n\n`;
    if (result.revisionPoints?.length) {
      fullText += `Revision Points:\n${result.revisionPoints.map(p => `• ${p}`).join("\n")}\n\n`;
    }
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("All notes copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechToggle = () => {
    if (!('speechSynthesis' in window)) {
      toast.error("Speech synthesis not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.info("Audio paused");
      return;
    }

    const textToSpeak = result.revisionPoints?.length 
      ? `Quick revision points for this topic. ${result.revisionPoints.join(". ")}`
      : result.notes.replace(/[#*`_]/g, "");

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    toast.success("Playing audio revision summary 🎧");
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await downloadPdf(result);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 bg-transparent text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-400 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Generated Study Guide
            </h2>
            {result.importance && (
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {result.importance} Weightage
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Exam-focused notes, interactive flowchart, data charts, and practice Q&A
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Audio TTS Button */}
          <button
            onClick={handleSpeechToggle}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isSpeaking
                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20 animate-pulse"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            title="Listen to notes read aloud"
          >
            {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
            <span>{isSpeaking ? "Pause Audio" : "Listen (TTS)"}</span>
          </button>

          {/* Quick Revision Toggle */}
          <button
            onClick={() => setQuickRevision(!quickRevision)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              quickRevision
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/70"
            }`}
          >
            <FaBolt className={quickRevision ? "text-amber-300" : "text-emerald-500"} />
            <span>{quickRevision ? "Exit Revision" : "Quick Revision"}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyNotes}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Copy entire study notes"
          >
            {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy className="text-gray-400" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FaDownload />
            <span>{downloading ? "Preparing PDF..." : "Export PDF"}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs: Notes | Mock Exam */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/50 max-w-xs">
        <button
          onClick={() => setActiveMode("notes")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === "notes"
              ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <FaBookOpen />
          <span>Study Guide</span>
        </button>

        <button
          onClick={() => setActiveMode("quiz")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === "quiz"
              ? "bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <FaAward />
          <span>Mock Exam</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            5Q
          </span>
        </button>
      </div>

      {/* QUIZ ARENA VIEW */}
      {activeMode === "quiz" && (
        <QuizArena result={result} onExit={() => setActiveMode("notes")} />
      )}

      {/* NOTES VIEW */}
      {activeMode === "notes" && (
        <div className="space-y-8">

      {/* Priority Subtopics Pill Grid */}
      {!quickRevision && result.subTopics && (
        <section id="subtopics">
          <SectionHeader icon={<FaStar className="text-amber-500" />} title="Syllabus Subtopics (By Exam Priority)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(result.subTopics).map(([star, topics]) => (
              <div
                key={star}
                className="rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-800"
              >
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {star} Priority
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {topics.length} concepts
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {topics.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Revision Highlight Box (If active) */}
      {quickRevision && result.revisionPoints && (
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-emerald-300/50 dark:border-emerald-800/60 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-base">
              <FaBolt />
            </span>
            <div>
              <h3 className="font-bold font-heading text-lg text-emerald-800 dark:text-emerald-300">
                Exam Quick Revision Cheat Sheet
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                High-yield definitions, key formulas, and must-remember keywords for last-minute cramming
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-800 dark:text-gray-200">
            {result.revisionPoints.map((point, idx) => (
              <li 
                key={idx} 
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-emerald-100 dark:border-emerald-900/50 shadow-xs flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* Detailed Notes Section */}
      {!quickRevision && result.notes && (
        <section id="notes">
          <SectionHeader icon={<FaBookOpen className="text-indigo-500" />} title="Detailed Syllabus Notes" />
          <div className="rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-xs">
            <ReactMarkdown components={markDownComponent}>
              {result.notes}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Mermaid Concept Diagram */}
      {result.diagram?.data && (
        <section id="diagram">
          <SectionHeader icon={<FaProjectDiagram className="text-purple-500" />} title="Interactive Concept Diagram" />
          <MermaidSetup diagram={result.diagram.data} />
        </section>
      )}

      {/* Visual Charts */}
      {result.charts && result.charts.length > 0 && (
        <section id="charts">
          <SectionHeader icon={<FaChartBar className="text-emerald-500" />} title="Visual Performance & Data Charts" />
          <RechartSetup charts={result.charts} />
        </section>
      )}

      {/* Exam Practice Questions */}
      {result.questions && (
        <section id="questions">
          <SectionHeader icon={<FaQuestionCircle className="text-rose-500" />} title="Exam Practice Questions & Model Answers" />
          <div className="rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-5 sm:p-7 space-y-6 shadow-xs">
            
            {/* Short Questions */}
            {Array.isArray(result.questions.short) && result.questions.short.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    Short-Answer Questions ({result.questions.short.length})
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {result.questions.short.map((q, i) => (
                    <QuestionItem key={i} q={q} index={i} type="Short" />
                  ))}
                </div>
              </div>
            )}

            {/* Long Questions */}
            {Array.isArray(result.questions.long) && result.questions.long.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Long-Answer Comprehensive Questions ({result.questions.long.length})
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {result.questions.long.map((q, i) => (
                    <QuestionItem key={i} q={q} index={i} type="Long" />
                  ))}
                </div>
              </div>
            )}

            {/* Diagram Question */}
            {result.questions.diagram && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    Diagram-Based Question
                  </h4>
                </div>
                <QuestionItem q={result.questions.diagram} index={0} type="Diagram" />
              </div>
            )}
          </div>
        </section>
      )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <span className="text-base">{icon}</span>
      <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white tracking-tight">
        {title}
      </h3>
    </div>
  );
}

function QuestionItem({ q, index, type }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!q) return null;

  const questionText = typeof q === "string" ? q : q.question;
  const answerText = typeof q === "string" ? null : q.answer;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Question: ${questionText}\n\nAnswer: ${answerText || ""}`);
    setCopied(true);
    toast.success("Question & answer copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/40 p-4 transition-all hover:border-gray-300 dark:hover:border-gray-700">
      <div 
        onClick={() => answerText && setShowAnswer(!showAnswer)}
        className={`flex items-start justify-between gap-3 ${answerText ? "cursor-pointer" : ""}`}
      >
        <div className="flex items-start gap-2.5">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
            Q{index + 1}.
          </span>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
            {questionText}
          </p>
        </div>

        {answerText && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="p-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-md"
              title="Copy Q&A"
            >
              {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaCopy className="text-xs" />}
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 select-none">
              {showAnswer ? (
                <>
                  <span>Hide</span>
                  <FaChevronUp className="text-[10px]" />
                </>
              ) : (
                <>
                  <span>Answer</span>
                  <FaChevronDown className="text-[10px]" />
                </>
              )}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAnswer && answerText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-3 border-l-2 border-indigo-500 whitespace-pre-line bg-white/50 dark:bg-gray-900/40 p-3 rounded-r-lg">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                Model Exam Answer:
              </span>
              {answerText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FinalResult;
