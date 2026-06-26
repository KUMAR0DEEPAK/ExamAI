import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { animate, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { GiHamburgerMenu } from "react-icons/gi";
import FinalResult from "../component/FinalResult";
function History() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const credits = userData ? userData.credits : "0";
  const [topics, setTopics] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", {
          withCredentials: true,
        });
        console.log(res.data);
        setTopics(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log("error : ", error);
      }
    };
    myNotes();
  }, []);

  const openNotes = async (noteId) => {
    setLoading(true);
    setActiveNoteId(noteId);
    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, {
        withCredentials: true,
      });
      setSelectedNote(res.data.content);
      setLoading(false);
    } catch (error) {
      console.log("error : ", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 px-6 py-8 text-black dark:text-white transition-colors duration-300">
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-5 items-start flex justify-between md:items-center gap-4 flex-wrap  shadow-[0_20px_45px_rgba(0,0,0,0.6)]"
      >
        <div
          className="cursor-pointer hover:text-white/50"
          onClick={() => navigate("/")}
        >
          <h1 className="text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            ExamAI
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
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white text-2xl cursor-pointer"
            >
              <GiHamburgerMenu />
            </button>
          )}
        </div>
      </motion.header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed lg:static lg:rounded-3xl top-0 left-0 z-50 lg:z-auto w-72 lg:w-auto h-full lg:h-screen lg:col-span-1 bg-black/90 lg:bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] p-5 overflow-y-auto "
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white mb-4 cursor-pointer"
              >
                ⬅️ Back
              </button>
              <div className="mb-4 space-y-1">
                <button
                  onClick={() => navigate("/notes")}
                  className="w-full px-3 py-2 rounded-lg text-sm text-gray-200 bg-white/10 hover:bg-white/20"
                >
                  ➕ New Notes
                </button>

                <hr className="border-white/10 mb-4" />
                <h2 className="mb-4 text-lg font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  📘 Your Notes
                </h2>
                {topics.length == 0 && (
                  <p className="text-sm text-gray-400">No notes created yet</p>
                )}

                <ul className="space-y-3">
                  {topics.map((t, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        openNotes(t._id);
                      }}
                      className={`cursor-pointer rounded-xl px-3 py-2.5  border transition-all ${activeNoteId==t._id ? "bg-indigo-500/30 border-indigo-400 shadow-[0_0_0_1px_rgba(99,102,241,0.6)]" : "border-white/10 bg-white/5  hover:bg-white/10"}
                    `}
                    >
                      <p className="text-white text-semibold">{t.topic}</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        {t.classLevel && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 ">
                            classLevel : {t.classLevel}
                          </span>
                        )}

                        {t.examType && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 ">
                            examType : {t.examType}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap mt-2 gap-3 text-gray-300 text-xs">
                        {t.revisionMode && <span>✨ Revision</span>}
                        {t.includeDiagram && <span>📊 Diagram</span>}
                        {t.includeChart && <span>📉 Chart</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6 min-h-screen"
        >
          {loading && (
            <p className="text-center text-gray-500 "> Loading notes...</p>
          )}
          {!loading && !selectedNote && (
            <div className="h-full flex items-center justify-center text-gray-400 ">
              Select a topic from Sidebar
            </div>
          )}
          {!loading && selectedNote && <FinalResult result={selectedNote} />}
        </motion.div>
      </div>
    </div>
  );
}

export default History;
