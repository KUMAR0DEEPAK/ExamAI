import UserModel from "../models/user.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import Notes from "../models/notes.model.js";
import { notesCache } from "../utils/notesCache.js";

export const generateNotes = async (req, res) => {
  const startTime = performance.now();
  try {
    const {
      topic,
      classLevel = "",
      examType = "",
      revisionMode = false,
      includeDiagram = false,
      includeChart = false,
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic is Required!" });
    }

    const cleanTopic = topic.trim();
    const normalizedTopic = cleanTopic.toLowerCase();
    const cleanClass = classLevel.trim();
    const cleanExam = examType.trim();
    const boolRevision = Boolean(revisionMode);
    const boolDiagram = Boolean(includeDiagram);
    const boolChart = Boolean(includeChart);

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User is not found!" });
    }

    // 1. Check if user already generated this exact note recently (Free instant reload, sub-100ms)
    const existingUserNote = await Notes.findOne({
      user: user._id,
      $or: [{ normalizedTopic }, { topic: cleanTopic }],
      classLevel: cleanClass,
      examType: cleanExam,
      revisionMode: boolRevision,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (existingUserNote && existingUserNote.content) {
      const durationMs = Number((performance.now() - startTime).toFixed(1));
      res.setHeader("X-Cache-Status", "HIT");
      res.setHeader("X-Response-Time", `${durationMs}ms`);
      res.setHeader("Server-Timing", `cache;dur=${durationMs}`);

      return res.status(200).json({
        data: existingUserNote.content,
        noteId: existingUserNote._id,
        creditLeft: user.credits,
        isCached: true,
        source: "personal-cache",
        retrievalTimeMs: durationMs,
        message: `Loaded from your existing notes in ${durationMs}ms (0 credits used)`,
      });
    }

    // Verify user has sufficient credits before generation
    if (user.credits < 10) {
      return res
        .status(403)
        .json({ message: "Insufficient Credit! Please recharge.", creditLeft: user.credits });
    }

    // 2. Check global notes cache (In-memory RAM cache first for < 5ms response, then DB lean query)
    const globalCacheKey = `global:${normalizedTopic}:${cleanClass}:${cleanExam}:${boolRevision}:${boolDiagram}:${boolChart}`;
    let aiResponse = notesCache.get(globalCacheKey);
    let isGlobalCached = false;

    if (aiResponse) {
      isGlobalCached = true;
    } else {
      const cachedGlobalNote = await Notes.findOne({
        $or: [{ normalizedTopic }, { topic: cleanTopic }],
        classLevel: cleanClass,
        examType: cleanExam,
        revisionMode: boolRevision,
        includeDiagram: boolDiagram,
        includeChart: boolChart,
      })
        .sort({ createdAt: -1 })
        .lean();

      if (cachedGlobalNote && cachedGlobalNote.content?.notes) {
        aiResponse = cachedGlobalNote.content;
        isGlobalCached = true;
        // Warm up RAM cache for future users
        notesCache.set(globalCacheKey, aiResponse, 60 * 60 * 1000);
      }
    }

    // 3. Fallback to Gemini AI generation if not in cache
    if (!aiResponse) {
      const prompt = buildPrompt({
        topic: cleanTopic,
        classLevel: cleanClass,
        examType: cleanExam,
        revisionMode: boolRevision,
        includeDiagram: boolDiagram,
        includeChart: boolChart,
      });

      aiResponse = await generateGeminiResponse(prompt);

      // Cache the fresh AI response in memory
      notesCache.set(globalCacheKey, aiResponse, 60 * 60 * 1000);
    }

    // Create note record for current user
    const notes = await Notes.create({
      user: user._id,
      topic: cleanTopic,
      normalizedTopic,
      classLevel: cleanClass,
      examType: cleanExam,
      revisionMode: boolRevision,
      includeDiagram: boolDiagram,
      includeChart: boolChart,
      content: aiResponse,
    });

    // Deduct credits and save
    user.credits = Math.max(0, user.credits - 10);
    if (user.credits <= 0) {
      user.isCreditAvailavle = false;
    }

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }
    user.notes.push(notes.id);
    await user.save();

    // Invalidate user's notes history cache so new note appears immediately
    notesCache.delPattern(`user:notes:${user._id}`);
    // Pre-populate note in RAM cache for instant next view
    notesCache.set(`note:${notes._id}:${user._id}`, {
      content: aiResponse,
      topic: cleanTopic,
      classLevel: cleanClass,
      examType: cleanExam,
      createdAt: notes.createdAt,
    }, 30 * 60 * 1000);

    const totalDurationMs = Number((performance.now() - startTime).toFixed(1));
    res.setHeader("X-Cache-Status", isGlobalCached ? "HIT" : "MISS");
    res.setHeader("X-Response-Time", `${totalDurationMs}ms`);
    res.setHeader("Server-Timing", `${isGlobalCached ? "cache" : "ai"};dur=${totalDurationMs}`);

    return res.status(200).json({
      data: aiResponse,
      noteId: notes._id,
      creditLeft: user.credits,
      isCached: isGlobalCached,
      source: isGlobalCached ? "global-cache" : "gemini-ai",
      retrievalTimeMs: totalDurationMs,
    });
  } catch (err) {
    console.error("Generate Notes Error:", err);
    return res.status(500).json({ 
      message: "Failed to generate notes. Please try again.", 
      error: err.message 
    });
  }
};
