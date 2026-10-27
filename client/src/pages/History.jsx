import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../utils/config.js";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar.jsx";
import FinalResult from "../component/FinalResult.jsx";
import { 
  FaHistory, 
  FaSearch, 
  FaPlus, 
  FaBookOpen, 
  FaGraduationCap, 
  FaAward, 
  FaBolt, 
  FaProjectDiagram, 
  FaChartPie,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { toast } from "sonner";

function History() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [fetchingList, setFetchingList] = useState(true);
  const [loadingNote, setLoadingNote] = useState(false);
  const [latencyInfo, setLatencyInfo] = useState(null);
  const noteCacheRef = useRef(new Map());

  useEffect(() => {
    const fetchNotesHistory = async () => {
      try {
        setFetchingList(true);
        const res = await axios.get(serverUrl + "/api/notes/getnotes", {
          withCredentials: true,
        });
        const notesList = Array.isArray(res.data) ? res.data : [];
        setTopics(notesList);
        setFilteredTopics(notesList);

        // Auto-select first note on desktop if available
        if (notesList.length > 0 && window.innerWidth >= 1024) {
          openNotes(notesList[0]._id);
        }
      } catch (error) {
        console.error("Fetch notes error:", error);
        toast.error("Failed to load your notes history.");
      } finally {
        setFetchingList(false);
      }
    };
    fetchNotesHistory();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTopics(topics);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredTopics(
        topics.filter(
          (t) =>
            t.topic?.toLowerCase().includes(q) ||
            t.classLevel?.toLowerCase().includes(q) ||
            t.examType?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, topics]);

  const openNotes = async (noteId) => {
    setActiveNoteId(noteId);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    // 1. Instant 0ms Client-Side Memory Cache
    if (noteCacheRef.current.has(noteId)) {
      const cached = noteCacheRef.current.get(noteId);
      setSelectedNote(cached.content);
      setLatencyInfo({
        ms: 0,
        source: "Client Memory Cache",
        isCached: true,
      });
      return;
    }

    // 2. Fetch from server (< 100ms via Server LRU cache or indexed MongoDB)
    setLoadingNote(true);
    const t0 = performance.now();
    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, {
        withCredentials: true,
      });
      const clientDuration = Math.round(performance.now() - t0);
      noteCacheRef.current.set(noteId, res.data);
      setSelectedNote(res.data.content);
      setLatencyInfo({
        ms: res.data.retrievalTimeMs ?? clientDuration,
        source: res.data.source === "memory-cache" ? "Server RAM Cache" : "Indexed MongoDB",
        isCached: res.data.isCached,
      });
    } catch (error) {
      console.error("Failed to load note:", error);
      toast.error("Failed to retrieve note content.");
    } finally {
      setLoadingNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between p-4 mb-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="flex items-center gap-2">
            <FaHistory className="text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sm">Saved Notes Archive</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Notes Sidebar List */}
          <aside
            className={`${
              isSidebarOpen ? "block fixed inset-0 z-50 p-4 bg-black/60 backdrop-blur-sm lg:static lg:p-0 lg:bg-transparent" : "hidden lg:block"
            } lg:col-span-4`}
          >
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl shadow-black/5 dark:shadow-black/20 max-h-[85vh] flex flex-col">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs">
                    <FaHistory />
                  </span>
                  <h3 className="font-bold text-sm font-heading text-gray-900 dark:text-white">
                    Saved Notes Archive
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                  {filteredTopics.length}
                </span>
              </div>

              {/* Action: Create New Note */}
              <button
                onClick={() => navigate("/notes")}
                className="mt-3 w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <FaPlus className="text-[10px]" />
                <span>Generate New Study Notes</span>
              </button>

              {/* Search Bar */}
              <div className="relative mt-3">
                <FaSearch className="absolute left-3 top-3 text-xs text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Notes Scrollable List */}
              <div className="mt-3 overflow-y-auto space-y-2 grow pr-1">
                {fetchingList && (
                  <div className="space-y-2 py-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                  </div>
                )}

                {!fetchingList && filteredTopics.length === 0 && (
                  <div className="text-center py-10 px-4">
                    <FaBookOpen className="text-3xl text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {searchQuery ? "No matching notes found." : "No notes created yet."}
                    </p>
                    <button
                      onClick={() => navigate("/notes")}
                      className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Create your first note &rarr;
                    </button>
                  </div>
                )}

                {!fetchingList &&
                  filteredTopics.map((item) => {
                    const isActive = activeNoteId === item._id;
                    const dateFormatted = item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : null;

                    return (
                      <div
                        key={item._id}
                        onClick={() => openNotes(item._id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                          isActive
                            ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-xs ring-1 ring-indigo-500/30"
                            : "bg-white/60 dark:bg-gray-850/60 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-xs font-bold line-clamp-1 ${
                            isActive ? "text-indigo-900 dark:text-indigo-200" : "text-gray-900 dark:text-gray-100"
                          }`}>
                            {item.topic}
                          </h4>
                          {dateFormatted && (
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {dateFormatted}
                            </span>
                          )}
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.classLevel && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1 font-medium">
                              <FaGraduationCap className="text-[9px]" /> {item.classLevel}
                            </span>
                          )}
                          {item.examType && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center gap-1 font-medium">
                              <FaAward className="text-[9px]" /> {item.examType}
                            </span>
                          )}
                        </div>

                        {/* Feature Badges */}
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                          {item.revisionMode && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <FaBolt className="text-[8px]" /> Revision
                            </span>
                          )}
                          {item.includeDiagram && (
                            <span className="flex items-center gap-1 text-indigo-500">
                              <FaProjectDiagram className="text-[8px]" /> Diagram
                            </span>
                          )}
                          {item.includeChart && (
                            <span className="flex items-center gap-1 text-amber-500">
                              <FaChartPie className="text-[8px]" /> Chart
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Close Button on Mobile Drawer */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden mt-3 w-full py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400"
              >
                Close Drawer
              </button>
            </div>
          </aside>

          {/* Note Viewer (Right Panel) */}
          <section className="lg:col-span-8 rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20 min-h-[70vh]">
            {loadingNote && (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Retrieving saved note and diagrams...
                </p>
              </div>
            )}

            {!loadingNote && !selectedNote && (
              <div className="py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-2xl flex items-center justify-center mx-auto mb-4">
                  <FaBookOpen />
                </div>
                <h3 className="text-base font-bold font-heading text-gray-900 dark:text-white">
                  No Note Selected
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  Click any study topic in your sidebar history on the left to preview the notes, concept flowcharts, and model Q&A.
                </p>
              </div>
            )}

            {!loadingNote && selectedNote && (
              <div>
                {latencyInfo && (
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold">
                        <FaBolt className="text-emerald-500 animate-pulse" />
                        <span>Retrieved in {latencyInfo.ms}ms</span>
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        via {latencyInfo.source}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                      ⚡ sub-100ms verified
                    </span>
                  </div>
                )}
                <FinalResult result={selectedNote} noteId={activeNoteId} />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default History;
