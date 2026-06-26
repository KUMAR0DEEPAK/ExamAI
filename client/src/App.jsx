import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import { BrowserRouter } from "react-router";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./services/api.js";
import History from "./pages/History.jsx";
import Notes from "./pages/Notes.jsx";
import Pricing from "./pages/Pricing.jsx";
import Footer from "./component/Footer.jsx";
import ThemeToggle from "./component/ThemeToggle.jsx";
import axios from "axios";
axios.defaults.withCredentials = true;
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getCurrentUser(dispatch);
  }, [dispatch]);

  const {userData} = useSelector((state) => state.user);
  console.log(userData);
  return (
  <BrowserRouter>
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">

      {/* Main Content */}
      <div className="grow">
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
