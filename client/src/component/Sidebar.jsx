import React from "react";
import { FaBookmark, FaStar, FaBookOpen, FaProjectDiagram, FaChartPie, FaQuestionCircle } from "react-icons/fa";

function Sidebar({ result }) {
  if (
    !result ||
    !result.questions?.long ||
    !result.questions?.short ||
    !result.subTopics
  ) {
    return null;
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navItems = [
    { id: "subtopics", label: "Priority Subtopics", icon: <FaStar className="text-amber-500" /> },
    { id: "notes", label: "Detailed Notes", icon: <FaBookOpen className="text-indigo-500" /> },
    ...(result.diagram?.data ? [{ id: "diagram", label: "Concept Diagram", icon: <FaProjectDiagram className="text-purple-500" /> }] : []),
    ...(result.charts?.length > 0 ? [{ id: "charts", label: "Visual Charts", icon: <FaChartPie className="text-emerald-500" /> }] : []),
    { id: "questions", label: "Practice Questions", icon: <FaQuestionCircle className="text-rose-500" /> },
  ];

  const totalQuestions = (result.questions?.short?.length || 0) + (result.questions?.long?.length || 0) + (result.questions?.diagram ? 1 : 0);

  return (
    <div className="sticky top-24 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-lg shadow-black/5 dark:shadow-black/20 space-y-6 transition-colors">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs">
            <FaBookmark />
          </span>
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            Table of Contents
          </span>
        </div>
        {result.importance && (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            {result.importance}
          </span>
        )}
      </div>

      {/* Quick Jump Links */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 mb-2">
          Jump to Section
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
          >
            <span className="text-xs shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Topic Weightage Overview */}
      <div className="pt-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 mb-2.5">
          Topic Breakdown
        </p>
        <div className="space-y-2">
          {Object.entries(result.subTopics).map(([star, topics]) => (
            <div
              key={star}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs"
            >
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {star} Priority
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {topics.length} topics
              </span>
            </div>
          ))}

          <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
              Exam Practice Q&A
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {totalQuestions} questions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
