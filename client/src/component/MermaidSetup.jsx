import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { FaCopy, FaCheck, FaProjectDiagram } from "react-icons/fa";
import { toast } from "sonner";

const cleanMermaidChart = (diagram) => {
  if (!diagram) return "";

  let clean = diagram.replace(/\r\n/g, "\n");

  if (!clean.trim().startsWith("graph") && !clean.trim().startsWith("flowchart")) {
    clean = `graph TD\n${clean}`;
  }
  return clean;
};

const autoFixNodes = (diagram) => {
  let index = 0;
  const used = new Map();
  return diagram.replace(/\[(.*?)\]/g, (match, label) => {
    const key = label.trim();

    if (used.has(key)) {
      return used.get(key);
    }
    index++;
    const id = `N${index}`;
    const node = `${id}["${key}"]`;
    used.set(key, node);
    return node;
  });
};

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;

    const isDarkMode = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      themeVariables: isDarkMode ? {
        darkMode: true,
        background: "#0f172a",
        primaryColor: "#6366f1",
        primaryTextColor: "#f8fafc",
        primaryBorderColor: "#818cf8",
        lineColor: "#94a3b8",
        secondaryColor: "#1e1b4b",
        tertiaryColor: "#1e293b",
      } : {
        primaryColor: "#e0e7ff",
        primaryTextColor: "#1e1b4b",
        primaryBorderColor: "#6366f1",
        lineColor: "#64748b",
      },
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      try {
        setHasError(false);
        containerRef.current.innerHTML = "";
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const safeChart = autoFixNodes(cleanMermaidChart(diagram));
        const { svg } = await mermaid.render(uniqueId, safeChart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        setHasError(true);
      }
    };

    renderDiagram();
  }, [diagram]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(diagram);
    setCopied(true);
    toast.success("Mermaid diagram code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/60 p-4 sm:p-6 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          <FaProjectDiagram className="text-indigo-500" />
          <span>Interactive Concept Flowchart</span>
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer font-medium"
        >
          {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy className="text-gray-400" />}
          <span>{copied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>

      <div className="w-full overflow-x-auto flex justify-center py-2 min-h-35">
        {hasError ? (
          <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500 italic">
            Diagram representation unavailable for this topic.
          </div>
        ) : (
          <div ref={containerRef} className="mermaid-container flex justify-center w-full" />
        )}
      </div>
    </div>
  );
}

export default MermaidSetup;
