import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../utils/config.js";
import { toast } from "sonner";
import { FaGem, FaPlus, FaBook, FaHistory, FaCreditCard, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const userData = useSelector((state) => state.user.userData);
  const [showCredits, setShowCredits] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (err) {
      console.error("Sign Out error: ", err);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "AI Notes", path: "/notes" },
    { label: "History", path: "/history" },
    { label: "Pricing", path: "/pricing" },
  ];

  const userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : "U";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50 max-w-7xl mx-auto my-4 px-4 sm:px-6"
    >
      <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 py-2.5 px-4 sm:px-6 shadow-lg shadow-black/5 dark:shadow-black/30 flex items-center justify-between transition-colors">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img src={logo} alt="ExamAI Logo" className="rounded-xl h-9 w-9 object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all duration-300" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                ExamAI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
              AI Study Assistant
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/60 p-1 rounded-xl border border-gray-200/60 dark:border-gray-700/50">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Credits Pill */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setShowCredits(!showCredits);
                setShowProfile(false);
              }}
              className="flex items-center gap-2 rounded-full px-3.5 py-1.5 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-gray-900 dark:text-white text-sm font-semibold shadow-xs hover:border-indigo-400 transition-colors"
            >
              <FaGem className="text-indigo-600 dark:text-indigo-400 text-xs" />
              <span>{userData ? userData.credits : "0"}</span>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px]">
                <FaPlus />
              </span>
            </motion.button>

            {/* Credits Dropdown */}
            <AnimatePresence>
              {showCredits && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base">Study Credits</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {userData ? userData.credits : "0"} Available
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    Each note generation costs 10 credits. Top up to generate high-yield diagrams, charts, and revision notes.
                  </p>
                  <button
                    onClick={() => {
                      setShowCredits(false);
                      navigate("/pricing");
                    }}
                    className="w-full py-2.5 px-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <FaCreditCard className="text-xs" /> Get More Credits
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowCredits(false);
              }}
              className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30 hover:ring-indigo-500 transition-all"
            >
              {userInitial}
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 p-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 text-gray-800 dark:text-gray-200"
                >
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                      {userData?.name || "Student"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userData?.email || ""}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/notes");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FaBook className="text-indigo-500 text-xs" /> Generate Notes
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/history");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FaHistory className="text-indigo-500 text-xs" /> Saved Notes History
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/pricing");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <FaCreditCard className="text-indigo-500 text-xs" /> Top-Up Credits
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-medium"
                    >
                      <FaSignOutAlt className="text-xs" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;

