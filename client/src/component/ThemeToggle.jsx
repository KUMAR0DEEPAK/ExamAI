import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiSun, FiMoon } from "react-icons/fi";

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black border border-white/10 dark:border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.2)] backdrop-blur-md cursor-pointer flex items-center justify-center transition-colors duration-300"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? <FiMoon size={22} /> : <FiSun size={22} />}
    </motion.button>
  );
}

export default ThemeToggle;
