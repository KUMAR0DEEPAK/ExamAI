import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../utils/config.js";
const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate=useNavigate();
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMsg("Enter valid email ❌");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await axios.post(`${serverUrl}/api/subscribe`, {
        email
      },{withCredentials: true});

      if (res.data.success) {
        setMsg("Subscribed successfully ✅");
        setEmail("");
      } else {
        setMsg("Failed ❌");
      }
    } catch (error) {
      console.error(error);
      setMsg("Server error ❌");
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.footer
      className=" bg-black/90 text-white mx-4 sm:mx-6 pt-10 sm:pt-12 pb-6 px-4 sm:px-6 rounded-t-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Logo */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              ExamAI
            </h2>
            <p className="text-gray-400 mt-3 text-sm">
              Generate exam-ready notes instantly with AI.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">
              <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-blue-600 cursor-pointer text-sm">
                f
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-sky-500 cursor-pointer text-sm">
                t
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-blue-700 cursor-pointer text-sm">
                in
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-red-600 cursor-pointer text-sm">
                yt
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li onClick={()=> navigate("/")} className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer" onClick={()=> navigate("/history")}>History</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Resources
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">FAQs</li>
              <li className="hover:text-white cursor-pointer">Study Tips</li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Subscribe
            </h3>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 outline-none w-full"
              />

              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-4 rounded-lg font-medium whitespace-nowrap ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>

            {msg && <p className="text-sm mt-2 text-gray-400">{msg}</p>}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-4 sm:pt-5 text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} ExamAI. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
