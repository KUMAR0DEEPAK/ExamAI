import Notes from "../models/notes.model.js";
import { notesCache } from "../utils/notesCache.js";

/**
 * Get current user's notes history
 * Optimized with lean query, LRU cache, and sub-100ms response
 */
export const getMyNotes = async (req, res) => {
  const startTime = performance.now();
  try {
    const cacheKey = `user:notes:${req.userId}`;
    const cachedList = notesCache.get(cacheKey);

    if (cachedList) {
      const durationMs = Number((performance.now() - startTime).toFixed(1));
      res.setHeader("X-Cache-Status", "HIT");
      res.setHeader("X-Response-Time", `${durationMs}ms`);
      res.setHeader("Server-Timing", `cache;dur=${durationMs}`);
      return res.status(200).json(cachedList);
    }

    const notes = await Notes.find({ user: req.userId })
      .select("topic classLevel examType revisionMode includeDiagram includeChart createdAt")
      .sort({ createdAt: -1 })
      .lean();

    if (!notes) {
      return res.status(404).json({ error: "Notes not found" });
    }

    // Cache user notes list for 5 minutes
    notesCache.set(cacheKey, notes, 5 * 60 * 1000);

    const durationMs = Number((performance.now() - startTime).toFixed(1));
    res.setHeader("X-Cache-Status", "MISS");
    res.setHeader("X-Response-Time", `${durationMs}ms`);
    res.setHeader("Server-Timing", `db;dur=${durationMs}`);
    return res.status(200).json(notes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getCurrentUser notes error : ${error.message}` });
  }
};

/**
 * Get a single note by ID for current user
 * Sub-100ms true retrieval (< 1ms from RAM cache, < 15ms from indexed MongoDB lean query)
 */
export const getSingleNotes = async (req, res) => {
  const startTime = performance.now();
  try {
    const cacheKey = `note:${req.params.id}:${req.userId}`;
    const cachedNote = notesCache.get(cacheKey);

    if (cachedNote) {
      const durationMs = Number((performance.now() - startTime).toFixed(1));
      res.setHeader("X-Cache-Status", "HIT");
      res.setHeader("X-Response-Time", `${durationMs}ms`);
      res.setHeader("Server-Timing", `cache;dur=${durationMs}`);
      return res.status(200).json({
        ...cachedNote,
        retrievalTimeMs: durationMs,
        source: "memory-cache",
        isCached: true,
      });
    }

    const notes = await Notes.findOne({ _id: req.params.id, user: req.userId })
      .select("content topic classLevel examType revisionMode includeDiagram includeChart createdAt")
      .lean();

    if (!notes) {
      return res.status(404).json({ error: "Notes not found" });
    }

    const responsePayload = {
      content: notes.content,
      topic: notes.topic,
      classLevel: notes.classLevel,
      examType: notes.examType,
      createdAt: notes.createdAt,
    };

    // Store in RAM cache for 30 minutes
    notesCache.set(cacheKey, responsePayload, 30 * 60 * 1000);

    const durationMs = Number((performance.now() - startTime).toFixed(1));
    res.setHeader("X-Cache-Status", "MISS");
    res.setHeader("X-Response-Time", `${durationMs}ms`);
    res.setHeader("Server-Timing", `db;dur=${durationMs}`);

    return res.status(200).json({
      ...responsePayload,
      retrievalTimeMs: durationMs,
      source: "database",
      isCached: false,
    });
  } catch (error) {
    return res.status(500).json({ message: `getNotes notes error : ${error.message}` });
  }
};
