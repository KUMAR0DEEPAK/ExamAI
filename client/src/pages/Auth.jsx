import React, { useState } from "react";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/logo.jpg";
import { FaGraduationCap, FaCheckCircle, FaGem, FaBolt, FaProjectDiagram, FaFilePdf } from "react-icons/fa";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setSigningIn(true);
      const response = await signInWithPopup(auth, provider);
      const name = response.user.displayName;
      const email = response.user.email;

      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success(`Welcome to ExamAI, ${name || "Student"}! 🎉`);
      navigate("/");
    } catch (err) {
      console.error("Auth Error:", err);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen px-4 sm:px-8 py-8 transition-colors duration-300 flex flex-col justify-between">
      {/* Brand Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="ExamAI Logo" className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-xs" />
          <span className="text-xl font-extrabold font-heading tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            ExamAI
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <FaGem className="text-[10px]" /> 50 Free Credits on Signup
        </span>
      </header>

      {/* Main Split Section */}
      <main className="max-w-6xl mx-auto w-full py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Col: Welcome & Sign-In */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <span>🚀 Instant Student Access</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight leading-[1.15] bg-linear-to-r from-gray-950 via-indigo-950 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
            Unlock Smart <br />
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Study Notes
            </span>
          </h1>

          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Create structured, exam-oriented study notes, visual concept flowcharts, and practice questions in seconds using Google Gemini AI.
          </p>

          {/* Google Sign In Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={signingIn}
              onClick={handleGoogleAuth}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
            >
              {signingIn ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <FcGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you receive <strong className="text-gray-900 dark:text-white">50 free credits</strong> immediately to test note generation, Mermaid diagrams, and PDF exports.
          </p>
        </motion.div>

        {/* Right Col: Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <AuthFeatureCard
            icon={<FaGem className="text-indigo-500" />}
            title="50 Free Welcome Credits"
            description="Generate comprehensive syllabus notes right away without entering payment details."
          />
          <AuthFeatureCard
            icon={<FaBolt className="text-amber-500" />}
            title="Exam Revision Mode"
            description="High-yield bulleted cheat sheets summarizing formulas and definitions for test day."
          />
          <AuthFeatureCard
            icon={<FaProjectDiagram className="text-purple-500" />}
            title="Mermaid Concept Maps"
            description="Interactive flowcharts making complex biology, physics, and computer science processes intuitive."
          />
          <AuthFeatureCard
            icon={<FaFilePdf className="text-rose-500" />}
            title="1-Click PDF Downloads"
            description="Export clean, print-ready study notes directly to your local device for offline revision."
          />
        </motion.div>
      </main>

      {/* Footer reassurance */}
      <footer className="text-center text-xs text-gray-400 py-4">
        ExamAI &copy; {new Date().getFullYear()} · All rights reserved.
      </footer>
    </div>
  );
}

function AuthFeatureCard({ icon, title, description }) {
  return (
    <div className="p-5 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
      <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-base mb-3">
        {icon}
      </div>
      <h3 className="text-xs font-bold font-heading text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default Auth;
