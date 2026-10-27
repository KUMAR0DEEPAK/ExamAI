import React, { useState } from "react";
import { motion } from "motion/react";
import Navbar from "../component/Navbar.jsx";
import TopicName from "../component/topicName.jsx";
import Sidebar from "../component/Sidebar.jsx";
import FinalResult from "../component/FinalResult.jsx";
import { FaBookOpen, FaLightbulb, FaProjectDiagram, FaFilePdf } from "react-icons/fa";

function Notes() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-16">
      {/* Unified Global Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Generator Input Section */}
        <TopicName
          loading={loading}
          setLoading={setLoading}
          setResult={setResult}
          setNoteId={setNoteId}
          setError={setError}
        />

        {/* Empty Placeholder State Before Generation */}
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 max-w-5xl mx-auto rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-gray-900/40 p-8 sm:p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-indigo-500/10">
              <FaBookOpen />
            </div>
            <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white mb-2">
              Your AI-Generated Study Notes Will Appear Here
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Enter any topic above or click a suggestion chip to generate syllabus notes, concept flowcharts, and practice questions.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 shadow-xs">
                <FaLightbulb className="text-amber-500 text-base mb-1.5" />
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Exam-Focused Content</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">High-yield revision points prioritized by exam importance.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 shadow-xs">
                <FaProjectDiagram className="text-purple-500 text-base mb-1.5" />
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Interactive Flowcharts</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Dynamic Mermaid diagrams mapping out concepts visually.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 shadow-xs">
                <FaFilePdf className="text-rose-500 text-base mb-1.5" />
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">1-Click PDF Export</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Download formatted, print-ready PDFs for offline study.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generated Result Container */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex flex-col lg:grid lg:grid-cols-4 gap-6 items-start"
          >
            <div className="lg:col-span-1 w-full">
              <Sidebar result={result} />
            </div>
            <div className="lg:col-span-3 w-full rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-black/30 p-6 sm:p-8">
              <FinalResult result={result} noteId={noteId} />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Notes;
