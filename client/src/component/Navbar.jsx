import React, { useState } from "react";
import { AnimatePresence, motion, scale } from "motion/react";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../utils/config.js";

function Navbar() {
  const userData = useSelector((state) => state.user.userData);
  const [showCredits, setShowCredits] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      console.log(result);
      dispatch(setUserData(null));
      navigate("/auth");
    } catch (err) {
      console.log("Sign Out : ", err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative z-50 mt-8 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 py-2 px-4 max-sm:mx-1 shadow-[0_25px_50px_rgba(0,0,0,0.75)] flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="rounded-full h-9 w-9" />
        <span className="text-lg text-white hidden md:block font-semibold">
          ExamAI <div className="text-gray-400">AI-Powered Exam Notes</div>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 cursor-pointer rounded-full px-4 py-2 bg-black/10 border border-white/20 text-white text-sm shadow-md"
          >
            <span>{userData ? userData.credits : "10"}</span>
            <span className="text-xl flex items-center">💎</span>
            <span
              onClick={() => {
                setShowCredits(!showCredits);
                setShowProfile(false);
              }}
              className="flex justify-center items-center h-5 w-5 bg-white rounded-full text-black"
            >
              ➕
            </span>
          </motion.div>

          {showCredits && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 10, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.7 }}
                className="absolute -right-15 z-10 bg-black/90 mt-4 w-64 p-4 text-white rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
              >
                <h1 className="font-semibold mb-2">Buy Credits</h1>
                <p className="text-base text-gray-300 mb-4">
                  Use Credit to generate Ai Notes, Diagram and PDF
                </p>
                <button
                  onClick={() => {setShowCredits(false); navigate("/pricing")}}
                  className="w-full bg-white text-black py-2 rounded-lg cursor-pointer hover:bg-white/90"
                >
                  Buy More Credits
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="relative">
          <motion.div
            onClick={() => {
              setShowProfile(!showProfile);
              setShowCredits(false);
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-1 cursor-pointer rounded-full px-4 py-2 bg-black/10 border border-white/20 text-white text-sm shadow-md"
          >
            <span className="text-lg">
              {userData ? userData.name.slice(0, 1).toUpperCase() : "R"}
            </span>
          </motion.div>
          {showProfile && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 10, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="absolute right-0 bg-black/90 mt-4 w-50 p-4 text-white rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_20px_45px_rgba(0,0,0,0.6)] z-10"
              >
                <MenuItem
                  onClick={() => {setShowProfile(false); navigate("/history")}}
                  text="History"
                />
                <div className="h-px mx-5 py-1"></div>
                <MenuItem onClick={handleSignOut} text="Sign out" red="red" />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
function MenuItem({ onClick, text, red }) {
  return (
    <div
      onClick={onClick}
      className={`border border-white/10 px-5 py-2 cursor-pointer rounded-2xl hover:bg-black/20 ${
        red ? "text-red-400 text-semibold" : ""
      }`}
    >
      {text}
    </div>
  );
}
export default Navbar;
