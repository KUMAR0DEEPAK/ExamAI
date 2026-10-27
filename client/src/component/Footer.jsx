import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../utils/config.js";
import { toast } from "sonner";
import logo from "../assets/logo.jpg";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube, FaPaperPlane } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${serverUrl}/api/subscribe`,
        { email },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Subscribed to ExamAI newsletter! 🎉");
        setEmail("");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-gray-700 dark:text-gray-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="ExamAI Logo" className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/20" />
              <span className="text-xl font-extrabold font-heading tracking-tight bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent">
                ExamAI
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              AI-powered study partner transforming syllabus topics into high-yield notes, interactive Mermaid flowcharts, and model exam questions.
            </p>
            <div className="flex gap-2.5 pt-1">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center text-xs transition-colors"
              >
                <FaGithub />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-sky-500 flex items-center justify-center text-xs transition-colors"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 flex items-center justify-center text-xs transition-colors"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-600 flex items-center justify-center text-xs transition-colors"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 font-heading">
              Study Tools
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li onClick={() => navigate("/notes")} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                AI Notes Generator
              </li>
              <li onClick={() => navigate("/history")} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                Saved Notes Archive
              </li>
              <li onClick={() => navigate("/pricing")} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                Study Credit Packages
              </li>
              <li onClick={() => navigate("/")} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                Interactive Concept Maps
              </li>
            </ul>
          </div>

          {/* Supported Boards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 font-heading">
              Exam Coverage
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>CBSE / ICSE Board Exams</li>
              <li>JEE Main & Advanced Revision</li>
              <li>NEET Medical Exam Prep</li>
              <li>College & University Syllabi</li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 font-heading">
              Exam Tips & Updates
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Get weekly high-yield study hacks, formulas, and updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter student email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <FaPaperPlane className="text-[10px]" />
                <span>{loading ? "Subscribing..." : "Subscribe for Free"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>ExamAI &copy; {new Date().getFullYear()} · Built for students worldwide.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
