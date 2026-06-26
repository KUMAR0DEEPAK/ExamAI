import React, { useEffect, useState } from "react";
import { motion, scale } from "motion/react";
import { generateNotes } from "../services/api";
import { useDispatch } from "react-redux";
import { updateCredits } from "../redux/userSlice.js";
function TopicName({ setResult, setLoading, loading, setError }) {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncudeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please Enter the topic");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart,
      });
      setResult(result.data);
      setLoading(false);
      setTopic("");
      setClassLevel("");
      setExamType("");
      setRevisionMode(false);
      setIncludeDiagram(false);
      setIncudeChart(false);

      if (typeof result.creditLeft === "number") {
        dispatch(updateCredits(result.creditLeft));
      }
      //  console.log(result.creditLeft)
    } catch (err) {
      console.log(err);
      setError("Failed to fetch notes from the server");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressText("");
      return;
    }

    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 8;
      if (value >= 95) {
        value = 95;
        setProgressText("Almost Done...");
        clearInterval(interval);
      } else if (value > 70) {
        setProgressText("Finalizing notes...");
      } else if (value > 40) {
        setProgressText("Processing content...");
      } else {
        setProgressText("Generating notes...");
      }
      setProgress(Math.floor(value));
    }, 700);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 mx-6 max-sm:mx-1 rounded-2xl bg-linear-to-br bg-black/80 backdrop-blur-xl border border-white/10 p-8 grid grid-cols-1 gap-7"
      style={{ transformStyle: "preserve-3d" }}
    >
      <input
        type="text"
        className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border placeholder-gray-400  border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        placeholder="Enter Topic(e.g. Web Development)"
        onChange={(e) => setTopic(e.target.value)}
        value={topic}
      />
      <input
        type="text"
        className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border placeholder-gray-400  border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        placeholder="Enter Class(Class/Level e.g. class 10)"
        onChange={(e) => setClassLevel(e.target.value)}
        value={classLevel}
      />
      <input
        type="text"
        className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border placeholder-gray-400  border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
        placeholder="Exam Type(e.g. CBSE, JEE, NEET)"
        onChange={(e) => setExamType(e.target.value)}
        value={examType}
      />
      <div className="flex  gap-7 flex-wrap max-sm:flex-col">
        <Toggle
          lable="Exam Revision Mode"
          chacked={revisionMode}
          onChange={(e) => setRevisionMode(!revisionMode)}
        />
        <Toggle
          lable="Include Diagram"
          chacked={includeDiagram}
          onChange={(e) => setIncludeDiagram(!includeDiagram)}
        />
        <Toggle
          lable="Include Chart"
          chacked={includeChart}
          onChange={(e) => setIncudeChart(!includeChart)}
        />
      </div>

      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full mt-4 py-3 rounded-xl  font-semibold flex items-center justify-center gap-3 transition ${
          loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed "
            : "bg-linear-to-br  from-white to-gray-200 text-black shadow(0_15px_35px_rgba(0,0,0,0.4))"
        }`}
      >
        {loading ? "Generating Notes..." : "Generate Notes"}
      </motion.button>

      {loading && (
        <div className="mt-4 space-y-2">
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.6 }}
              className="h-full bg-linear-to-r from-green-400 via-emerald-400 to-green-500"
            ></motion.div>
          </div>
          <div className="flex justify-between text-xs text-gray-300">
            <span>{progressText}</span>
            <span>{progress}%</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            this may take upto 2-5 minutes. Please don't close or refresh the
            page.
          </p>
        </div>
      )}
    </motion.div>
  );
}
function Toggle({ lable, chacked, onChange }) {
  return (
    <div
      className="flex items-center gap-4 cursor-pointer select-none"
      onClick={onChange}
    >
      <motion.div
        animate={{
          backgroundColor: chacked
            ? "rgba(34,197,94,0.35)"
            : "rgba(255,255,255,0.15)",
        }}
        transition={{ duration: 0.25 }}
        className="relative w-14 h-7 rounded-full border border-white/20 backdrop-blur-lg"
      >
        <motion.div
          layout
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="absolute top-1/2 w-6 h-6 bg-white rounded-full -translate-y-1/2"
          style={{ left: chacked ? "1.75rem" : "0.05rem" }}
        />
      </motion.div>

      <span
        className={`text-sm transition-colors ${
          chacked ? "text-green-300" : "text-gray-300"
        }`}
      >
        {lable}
      </span>
    </div>
  );
}

export default TopicName;
