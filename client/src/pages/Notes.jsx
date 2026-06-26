import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import TopicName from "../component/topicName.jsx";
import Sidebar from "../component/Sidebar.jsx";
import FinalResult from "../component/FinalResult.jsx";
function Notes() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const credits = userData ? userData.credits : "0";
  // console.log(credits);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-black dark:text-white transition-colors duration-300 px-1 sm:px-4 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className=" mx-6 mt-8 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 py-4 px-4 max-sm:mx-1 shadow-[0_25px_50px_rgba(0,0,0,0.75)]
 flex flex-wrap gap-5 items-center justify-between"
      >
        <div
          className="cursor-pointer hover:text-white/50"
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Exam
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            AI powered exam-oriented notes & revision
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative" onClick={() => navigate("/pricing")}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 cursor-pointer rounded-full px-4 py-2 bg-black/10 border border-white/20 text-white text-sm shadow-md"
            >
              <span>{credits}</span>
              <span className="text-xl flex items-center">💎</span>
              <span className="flex justify-center items-center h-5 w-5 bg-white rounded-full text-black">
                ➕
              </span>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              onClick={() => navigate("/history")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-1 cursor-pointer rounded-full px-4 py-2 bg-black/10 border border-white/20 text-white text-sm shadow-md"
            >
              <span className="text-lg">📚 Your Notes</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <TopicName
          loading={loading}
          setLoading={setLoading}
          setResult={setResult}
          setError={setError}
        />

        {loading && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-center text-black font-medium my-6"
          >
            Generating Your Notes...
          </motion.div>
        )}
        {error && 
          <div className="my-6 text-center text-red-600 font-medium">
            {error}
          </div>
        }
      </motion.div>
      {!result && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="h-64 rounded-2xl flex flex-col items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-lg border border-dashed border-gray-300 dark:border-gray-800 text-gray-500 dark:text-gray-400 shadow-inner "
        >
          <span className=" text-4xl mb-3">📘</span>
          <p className="text-sm ">Generated Notes will be appear here</p>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-6 my-10 flex flex-col lg:grid lg:grid-cols-4 gap-6"
        >
          <div className="lg:col-span-1">
            <Sidebar result={result} />
          </div>
          <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-[0_15px_40px_rgba(0,0,0,0.5)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6">
            <FinalResult result={result} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Notes;
