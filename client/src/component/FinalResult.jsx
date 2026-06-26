import React, { Children, useState } from "react";
import ReactMarkdown from "react-markdown";
import MermaidSerup from "./mermaidSerup";
import RechartSetup from "./RechartSetup";
import { downloadPdf } from "../services/api";
import { motion } from "motion/react";
const markDownComponent = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mt-6 mb-4 border-b pb-2 dark:border-gray-800">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2x font-semibold text-indigo-600 dark:text-indigo-400 mt-5 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  li: ({ children }) => <li className="marker:text-indigo-500">{children}</li>,
};
function FinalResult({ result }) {
  const [quickRevision, setQuickRevision] = useState(false);
  if (
    !result ||
    !result.questions.long ||
    !result.questions.short ||
    !result.subTopics
  ) {
    return null;
  }
  return (
    <div className=" p-1 md:p-3 space-y-10 bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold  bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Generated Notes
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setQuickRevision(!quickRevision)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition hover:cursor-pointer ${
              quickRevision
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700  hover:bg-green-200"
            }`}
          >
            {quickRevision ? "Exit Revisin Mode" : " Quick Revision"}
          </button>
          <button onClick={()=>downloadPdf(result)} className="px-4 py-2  rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 hover:cursor-pointer">
            ⬇️ Download PDF
          </button>
        </div>
      </div>
      {!quickRevision && (
        <section>
          <SectionHeader icon="⭐" title="Sub Topic" color="indigo" />
          {Object.entries(result.subTopics).map(([star, topics]) => (
            <div
              key={star}
              className="mb-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-3 pl-5"
            >
              <p className="text-sm font-bold text-yellow-600 mb-1">
                {star} Priority
              </p>
              <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                {topics.map((topic, i) => (
                  <li key={i}> {topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
      {!quickRevision && (
        <section>
          <SectionHeader icon="📒" title="Detailed Notes" color="purple" />
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-6 py-3">
            <ReactMarkdown components={markDownComponent}>
              {result.notes}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {quickRevision && (
        <section className="rounded-xl bg-linear-to-r from-green-100 to-green-50 dark:from-green-950/20 dark:to-green-900/10 border border-green-200 dark:border-green-900/30 p-6">
          <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 text-lg ">
            ✨ Exam Quick Revision Point
          </h3>
          <ul className="list-disc ml-6 space-y-1 text-gray-800 dark:text-gray-200">
            {result.revisionPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {result.diagram?.data && (
        <section>
          <SectionHeader icon="📊" title="Diagram" color="cyan" />
          <MermaidSerup diagram={result.diagram?.data} />
          <p className="mt-3 text-xs text-gray-500 italic">
           ℹ️ if you need this diagram for future refrence and revision, you can
            save it taking a screenshot
          </p>
        </section>
      )}

      {result.charts && result.charts.length > 0 && (
        <section>
          <SectionHeader icon="📈" title="Visual Charts" color="indigo" />
          <RechartSetup charts={result.charts} />
          <p className="mt-3 text-xs text-gray-500 italic">
            ℹ️ If you need these charts for future reference and revision, you can
            save them by taking a screenshot.
          </p>
        </section>
      )}

      {result.charts && result.charts.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          📉 Charts are not available for this topic.
        </p>
      )}

      <section>
        <SectionHeader icon="❓" title="Important Questions" color="rose" />
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-6 py-4 space-y-4">
          {Array.isArray(result.questions.short) && result.questions.short.length > 0 && (
            <div>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Short Questions</p>
              <div className="space-y-1">
                {result.questions.short.map((q, i) => (
                  <QuestionItem key={i} q={q} index={i} />
                ))}
              </div>
            </div>
          )}

          {Array.isArray(result.questions.long) && result.questions.long.length > 0 && (
            <div className="pt-2">
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Long Questions</p>
              <div className="space-y-1">
                {result.questions.long.map((q, i) => (
                  <QuestionItem key={i} q={q} index={i} />
                ))}
              </div>
            </div>
          )}

          {result.questions.diagram && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Diagram-Based Question</p>
              <DiagramQuestionItem dq={result.questions.diagram} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title, color }) {
  const colors = {
    indigo: "from-indigo-100 to-indigo-50 text-indigo-700 dark:from-indigo-950/30 dark:to-indigo-900/10 dark:text-indigo-400",
    purple: "from-purple-100 to-purple-50 text-purple-700 dark:from-purple-950/30 dark:to-purple-900/10 dark:text-purple-400",
    blue: "from-blue-100 to-blue-50 text-blue-700 dark:from-blue-950/30 dark:to-blue-900/10 dark:text-blue-400",
    green: "from-green-100 to-green-50 text-green-700 dark:from-green-950/30 dark:to-green-900/10 dark:text-green-400",
    cyan: "from-cyan-100 to-cyan-50 text-cyan-700 dark:from-cyan-950/30 dark:to-cyan-900/10 dark:text-cyan-400",
    rose: "from-rose-100 to-rose-50 text-rose-700 dark:from-rose-950/30 dark:to-rose-900/10 dark:text-rose-400",
  };

  return (
    <div
      className={`mb-4 px-4 py-2 rounded-lg bg-linear-to-r ${colors[color]} font-semibold flex items-center gap-2`}
    >
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
}

function QuestionItem({ q, index }) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!q) return null;

  // Backward compatibility for old string-based questions
  if (typeof q === "string") {
    return (
      <li className="text-gray-700 dark:text-gray-300 ml-4 list-disc py-1">
        {q}
      </li>
    );
  }

  return (
    <div className="py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div 
        onClick={() => setShowAnswer(!showAnswer)}
        className="flex justify-between items-start gap-4 cursor-pointer group"
      >
        <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {index + 1}. {q.question}
        </p>
        <button className="text-indigo-500 font-semibold text-xs shrink-0 select-none hover:text-indigo-600 dark:hover:text-indigo-400 bg-transparent border-0 cursor-pointer">
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 pl-4 border-l-2 border-indigo-500 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
        >
          {q.answer}
        </motion.div>
      )}
    </div>
  );
}

function DiagramQuestionItem({ dq }) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!dq) return null;

  // Backward compatibility
  if (typeof dq === "string") {
    return (
      <li className="text-gray-700 dark:text-gray-300 ml-4 list-disc py-1">
        {dq}
      </li>
    );
  }

  return (
    <div className="py-2">
      <div 
        onClick={() => setShowAnswer(!showAnswer)}
        className="flex justify-between items-start gap-4 cursor-pointer group"
      >
        <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {dq.question}
        </p>
        <button className="text-indigo-500 font-semibold text-xs shrink-0 select-none hover:text-indigo-600 dark:hover:text-indigo-400 bg-transparent border-0 cursor-pointer">
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 pl-4 border-l-2 border-indigo-500 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line"
        >
          {dq.answer}
        </motion.div>
      )}
    </div>
  );
}

export default FinalResult;
