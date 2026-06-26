import React from "react";
import { motion, scale } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../utils/firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const name = response.user.displayName;
      const email = response.user.email;

      const result = await axios.post(serverUrl + "/api/auth/google", { name, email }, { withCredentials: true });
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-950 text-black dark:text-white px-4 sm:px-8 min-h-screen transition-colors duration-300">
      <motion.header
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="mx-auto mt-8 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-5 shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
      >
        <h1 className="text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
          ExamAI
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          AI powered exam-oriented notes & revision
        </p>
      </motion.header>

      <main className="max-w-7xl mx-auto py-10 grid grid-cols-1  lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-linear-to-br from-black/90 via-black/60 to-black/90 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
            Unlock Smart <br /> AI Notes
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => console.log("hover started!")}
            className="mt-10 px-10 py-3 rounded-xl flex items-center gap-3 bg-linear-to-br from-black/90 via-black/80 to-black/90 border border-white/10 text-white font-semibold text-lg cursor-pointer"
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={22} />
            Continue with Google
          </motion.button>
          <p className="mt-6 max-w-xl text-lg bg-linear-to-br from-black/90 via-black/60 to-black/90 dark:from-gray-300 dark:via-gray-400 dark:to-gray-300 bg-clip-text text-transparent">
            No matter your grade or subject, our AI creates clear, structured,
            and easy-to-understand notes in seconds.Just enter the topic, select
            your class, and get exam-ready notes instantly!
          </p>
          <p className="text-lg bg-linear-to-br from-black/90 via-black/60 to-black/90 dark:from-gray-300 dark:via-gray-400 dark:to-gray-300 bg-clip-text text-transparent">
            <span className="font-semibold ">start with 50 FREE credit</span>{" "}
            Upgrate any time for ctredit, instant access.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Feature
            icon="🎁"
            title="50 Free Credits"
            des="Start with 50 credits to generate notes without paying."
          />
          <Feature
            icon="📒"
            title="Exam Notes"
            des="Concise, exam-focused notes designed to help you revise faster and score better."
          />

          <Feature
            icon="📂"
            title="Project Notes"
            des="Well-structured project notes with clear explanations and ready-to-use content."
          />

          <Feature
            icon="📊"
            title="Charts & Graphs"
            des="Visual charts and graphs to make complex topics easy to understand."
          />

          <Feature
            icon="⬇️"
            title="Free PDF Download"
            des="Download high-quality study PDFs instantly, completely free."
          />
        </div>
      </main>
    </div>
  );
}
function Feature({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="max-w-7xl rounded-2xl px-6 py-4 sm:py-2 bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-xl border border-white/10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.7)] cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative z-10" style={{ transform: "tranlateZ(30px)" }}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{des}</p>
      </div>
    </motion.div>
  );
}
export default Auth;
