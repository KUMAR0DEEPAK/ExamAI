import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./services/api.js";
import Footer from "./component/Footer.jsx";
import ThemeToggle from "./component/ThemeToggle.jsx";
import { Toaster } from "sonner";
import axios from "axios";

// Code-Split Route Modules
const Home = lazy(() => import("./pages/Home.jsx"));
const Auth = lazy(() => import("./pages/Auth.jsx"));
const History = lazy(() => import("./pages/History.jsx"));
const Notes = lazy(() => import("./pages/Notes.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));

axios.defaults.withCredentials = true;

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-70"></span>
        <div className="relative inline-flex rounded-full h-10 w-10 bg-linear-to-tr from-indigo-600 to-purple-600 items-center justify-center text-white font-bold text-xs shadow-lg">
          AI
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-400 animate-pulse">Loading ExamAI...</p>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const { userData } = useSelector((state) => state.user);
  return (
  <BrowserRouter>
    <Toaster position="top-right" richColors closeButton expand={false} />
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-indigo-500 selection:text-white">

      {/* Main Content with Suspense */}
      <div className="grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={userData ? <Home /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/auth"
              element={userData ? <Navigate to="/" replace /> : <Auth />}
            />
            <Route path="/history" element={<History />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  </BrowserRouter>
  );
}

export default App;
