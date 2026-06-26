import React from "react";
import Navbar from "../component/Navbar.jsx";
import { motion } from "motion/react";
import HomeLogo from "../assets/homepage.jpg";
import { useNavigate } from "react-router";
function Home() {
  const navigate = useNavigate();
  return (
    <div className=" bg-white dark:bg-gray-950 mx-4 text-black dark:text-white transition-colors duration-300">
      <Navbar />

      {/* top */}
      <section className=" max-w-7xl mx-auto px-6 pt-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -12, rotateX: 6, rotateY: -6 }}
            style={{ transformStyle: "preserve-3d" }}
            className="transform-gpu"
          >
            <motion.h1
              whileHover={{ y: -4 }}
              style={{
                transform: "translateZ(40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
              className="mt-6 max-w-xl text-6xl lg:7xl font-extrabold leading-tight bg-linear-to-br from-black/90 via-black/60 to-black/90 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent"
            >
              Create Smart <br />
              Ai notes in <br />
              Second
            </motion.h1>

            <motion.p
              whileHover={{ y: -4 }}
              style={{
                transform: "translateZ(40px)",
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
              className="mt-6 max-w-xl text-lg bg-linear-to-br from-gray-700/90 via-gray-500/60 to-gray-700/90 dark:from-gray-300 dark:via-gray-400 dark:to-gray-300 bg-clip-text text-transparent"
            >
              Welcome to AI Exam Notes Generator, your smart study partner.
              Enter any topic and get clear, exam-ready notes instantly using
              AI.
            </motion.p>
          </motion.div>
          <motion.button
            onClick={() => {
              navigate("/notes");
            }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -8, rotateX: 6, rotateY: -6 }}
            style={{ transformStyle: "preserve-3d" }}
            onHoverStart={() => console.log("hover started!")}
            className="mt-8 px-10 py-3 rounded-xl flex items-center gap-3 bg-linear-to-br from-black/90 via-black/80 to-black/90 border border-white/10 text-white font-semibold text-lg cursor-pointer shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          >
            Get Started
          </motion.button>
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -4, rotateX: 6, rotateY: -6, scale: 1.02 }}
            style={{ transformStyle: "preserve-3d" }}
            className="transform-gpu"
          >
            <div className="overflow-hidden z-0 ">
              <img
                src={HomeLogo}
                size={22}
                alt="Home Page icon"
                style={{ transform: "translateZ(35px)" }}
              />
            </div>
          </motion.div>
        </div>
      </section>
      <section className="max-w-6xl  mx-auto  py-32 grid grid-cols-1 gap-10 max-sm:grid-cols-1 max-md:grid-cols-2 md:grid-cols-4 md:gap-15">
        <Feature
          icon="📝"
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
      </section>
    </div>
  );
}

function Feature({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -5, rotateX: 10, rotateY: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="max-w-7xl rounded-2xl px-6 py-5 bg-linear-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-xl border border-white/10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.7)] cursor-pointer"
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
export default Home;
