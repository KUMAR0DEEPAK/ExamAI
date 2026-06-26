import React from "react";

function Sidebar({ result }) {
  if (
    !result ||
    !result.questions.long ||
    !result.questions.short ||
    !result.subTopics
  ) {
    return null;
  }
  return (
    <div className=" bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 space-y-6 text-black dark:text-white transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="text-xl">📌</span>
        <span className="font-bold text-lg text-indigo-600">
          Quick Exam View
        </span>
      </div>
      <section>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ⭐ Sub topics (Priority Wise)
        </p>
        {Object.entries(result.subTopics).map(([star, topics]) => (
          <div
            key={star}
            className="mb-3 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-3"
          >
            <p className="text-sm font-bold text-yellow-600 dark:text-yellow-500 mb-1">
              {star} Priority
            </p>
            <ul className="list-disc ml-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {topics.map((topic, i) => (
                <li key={i}> {topic}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 p-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          🔥 Exam Importance
        </p>
        <span className="text-yellow-700 dark:text-yellow-400 font-bold text-sm">
          {result.importance}
        </span>

        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ❓ Important Questions
        </p>
        <div className="mb-4 rounded-lg  bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 p-3">
          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400 mb-2">
            Short Questions
          </p>
          <ul className="list-disc ml-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {result.questions.short.map((t, i) => (
              <li key={i}>{typeof t === "string" ? t : t?.question}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4 rounded-lg  bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 p-3">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
            Long Questions
          </p>
          <ul className="list-disc ml-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {result.questions.long.map((t, i) => (
              <li key={i}>{typeof t === "string" ? t : t?.question}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4 rounded-lg  bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Diagram</p>
          <ul className="list-disc ml-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              {typeof result.questions.diagram === "string"
                ? result.questions.diagram
                : result.questions.diagram?.question}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Sidebar;
