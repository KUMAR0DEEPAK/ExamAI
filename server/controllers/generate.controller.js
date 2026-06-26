import UserModel from "../models/user.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import Notes from "../models/notes.model.js";
export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false,
    } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is Required!" });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User is not found!" });
    }

    if (user.credits < 10) {
      return res
        .status(403)
        .json({ message: "Insufficient Credit!", creditLeft: user.credits });
    }

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
    });
    // console.log("Prompt being sent:\n", prompt);
    const aiResponse = await generateGeminiResponse(prompt);
    // console.log(aiResponse);

    const notes = await Notes.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: aiResponse,
    });
    user.credits -= 10;
    if (user.credits <= 0) {
      user.isCreditAvailavle = false;
    }

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }
    user.notes.push(notes.id);
    await user.save();

    return res.status(200).json({
      data: aiResponse,
      noteId: notes._id,
      creditLeft: user.credits,
    });
  } catch (err) {
    console.error("Generate Notes Error:", err);
    return res.status(500).json({ message: "Failed to generate notes. Please try again.", error: err.message });
  }
};
