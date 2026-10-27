import React from "react";
import Navbar from "../component/Navbar.jsx";
import { motion } from "motion/react";
import HomeLogo from "../assets/homepage.jpg";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaMagic, 
  FaBolt, 
  FaProjectDiagram, 
  FaChartLine, 
  FaFilePdf, 
  FaQuestionCircle, 
  FaCheckCircle,
  FaShieldAlt,
  FaGem
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const stats = [
    { label: "Free Credits on Signup", value: "50 💎" },
    { label: "Study Note Engine", value: "Gemini AI" },
    { label: "Generation Speed", value: "< 5 Sec" },
    { label: "Offline Ready", value: "1-Click PDF" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Next-Gen Study Companion · Google Gemini AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading tracking-tight leading-[1.15] bg-linear-to-r from-gray-950 via-indigo-950 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
            Create Smart <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Exam Notes
            </span>{" "}
            in Seconds
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
            Stop drowning in lengthy textbooks. ExamAI synthesizes any topic into high-yield syllabus notes, interactive Mermaid flowcharts, visual data graphs, and exam practice questions with model answers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/notes")}
              className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center gap-2.5 cursor-pointer transition-all"
            >
              <FaMagic className="text-xs" />
              <span>Generate Notes Now</span>
              <FaArrowRight className="text-xs" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/pricing")}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 font-semibold text-sm sm:text-base transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <FaGem className="text-indigo-500 text-xs" />
              <span>View Credit Plans</span>
            </motion.button>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" /> 50 Free Credits on Signup
            </span>
            <span className="flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" /> CBSE, JEE, NEET & University
            </span>
            <span className="flex items-center gap-1.5">
              <FaCheckCircle className="text-emerald-500" /> No Credit Card Required
            </span>
          </div>
        </motion.div>

        {/* Hero Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-2xl shadow-indigo-500/10 group">
            <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none z-10" />
            <img
              src={HomeLogo}
              alt="ExamAI Study Platform Demo"
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Topic: Photosynthesis</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Class 10 · CBSE · Flowchart Generated</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                ⚡ Ready in 3.2s
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Counter Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 shadow-lg shadow-black/5 dark:shadow-black/20 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">
                {s.value}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-gray-900 dark:text-white">
            Everything You Need to Ace Your Exams
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Purpose-built tools to help students understand difficult topics faster and retain knowledge longer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FaBolt className="text-amber-500" />}
            title="Syllabus-Aligned Notes"
            description="Clear, concise, exam-focused explanations formatted specifically for your grade level and target exam board."
          />
          <FeatureCard
            icon={<FaProjectDiagram className="text-purple-500" />}
            title="Interactive Flowcharts"
            description="Dynamic Mermaid concept maps visualizing cycles, biochemical loops, algorithms, and logical hierarchies."
          />
          <FeatureCard
            icon={<FaChartLine className="text-emerald-500" />}
            title="Visual Data Graphs"
            description="Automatic Recharts integration showing tabular comparisons, weightage charts, and stage-by-stage graphs."
          />
          <FeatureCard
            icon={<FaQuestionCircle className="text-rose-500" />}
            title="Model Q&A with Self-Test"
            description="Short, long, and diagram questions with interactive show/hide answer accordions to test your recall."
          />
          <FeatureCard
            icon={<FaMagic className="text-indigo-500" />}
            title="Quick Revision Mode"
            description="One-click toggle transforms extensive notes into a bulleted formula and definition cheat sheet for exam day."
          />
          <FeatureCard
            icon={<FaFilePdf className="text-blue-500" />}
            title="Clean Printable PDF"
            description="Export all generated notes, subtopics, and practice questions into clean, formatted study documents."
          />
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="rounded-3xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 sm:p-12 text-center text-white shadow-2xl shadow-indigo-500/20 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
            Ready to Accelerate Your Exam Prep?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Join students using ExamAI to revise faster, understand difficult concepts visually, and score higher marks.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/notes")}
              className="px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm sm:text-base shadow-lg hover:bg-gray-100 transition-all cursor-pointer"
            >
              Get Started for Free &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl mb-4 border border-gray-100 dark:border-gray-700/60">
        {icon}
      </div>
      <h3 className="text-base font-bold font-heading text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default Home;
