import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    normalizedTopic: {
      type: String,
      index: true,
      trim: true,
      lowercase: true,
    },
    classLevel: String,
    examType: String,

    revisionMode: {
      type: Boolean,
      default: false,
    },
    includeDiagram: Boolean,
    includeChart: Boolean,

    content: {
      type: mongoose.Schema.Types.Mixed,
      require: true,
    },
  },
  { timestamps: true }
);

// Auto-populate normalizedTopic for instant indexed lookups
notesSchema.pre("save", function () {
  if (this.topic) {
    this.normalizedTopic = this.topic.trim().toLowerCase();
  }
});

// High performance query & sub-100ms cache indexing
notesSchema.index({ user: 1, createdAt: -1 });
notesSchema.index({ _id: 1, user: 1 });
notesSchema.index({ user: 1, normalizedTopic: 1, classLevel: 1, examType: 1, revisionMode: 1 });
notesSchema.index({ normalizedTopic: 1, classLevel: 1, examType: 1, revisionMode: 1, includeDiagram: 1, includeChart: 1 });

const Notes = mongoose.model("Notes", notesSchema);

export default Notes;
