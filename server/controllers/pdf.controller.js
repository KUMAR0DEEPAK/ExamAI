import PDFdocument from "pdfkit";
export const downloadPdf = async (req, res) => {
  try {
    const { result } = req.body;
    if (!result) {
      return res.status(400).json({ error: "No Content Provided" });
    }

    const doc = new PDFdocument({ margin: 50 });
    res.setHeader("Content-type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ExamAI.pdf"'
    );

    doc.pipe(res);

    doc.fontSize(20).text("ExamAI", { align: "center" });
    doc.moveDown();
    if (result.importance) {
      doc.fontSize(14).text(`Importance:${result.importance}`);
      doc.moveDown();
    }

    if (result.subTopics) {
      doc.fontSize(16).text("Sub Topics");
      doc.moveDown(0.5);
      Object.entries(result.subTopics).forEach(([star, topics]) => {
        if (Array.isArray(topics)) {
          doc.moveDown(0.5);
          doc.fontSize(13).text(`${star} Topics:`);
          topics.forEach((t) => {
            doc.fontSize(12).text(`• ${t}`);
          });
        }
      });
    }

    doc.moveDown();

    //notes
    if (result.notes) {
      doc.fontSize(16).text("Notes");
      doc.moveDown(0.5);
      doc.fontSize(12).text(result.notes.replace(/[#*]/g, ""));
    }

    doc.moveDown();

    //revision Point
    if (Array.isArray(result.revisionPoints)) {
      doc.fontSize(16).text("Revision Point");
      doc.moveDown(0.5);
      result.revisionPoints.forEach((p) => {
        doc.fontSize(12).text(`• ${p}`);
      });
      doc.moveDown();
    }

    //Questions
    if (result.questions) {
      doc.fontSize(16).text("Important Questions");
      doc.moveDown(0.5);

      if (Array.isArray(result.questions.short)) {
        doc.fontSize(13).text("Short Questions");
        result.questions.short.forEach((q) => {
          if (typeof q === "string") {
            doc.fontSize(12).text(`• ${q}`);
          } else if (q && q.question) {
            doc.fontSize(12).text(`• Q: ${q.question}`);
            if (q.answer) {
              doc.fontSize(11).text(`  A: ${q.answer}`, { indent: 15 });
            }
          }
        });
        doc.moveDown();
      }

      if (Array.isArray(result.questions.long)) {
        doc.fontSize(13).text("Long Questions");
        result.questions.long.forEach((q) => {
          if (typeof q === "string") {
            doc.fontSize(12).text(`• ${q}`);
          } else if (q && q.question) {
            doc.fontSize(12).text(`• Q: ${q.question}`);
            if (q.answer) {
              doc.fontSize(11).text(`  A: ${q.answer}`, { indent: 15 });
            }
          }
        });
      }

      doc.moveDown(0.5);

      if (result.questions.diagram) {
        doc.fontSize(13).text("Diagram Questions");
        const dq = result.questions.diagram;
        if (typeof dq === "string") {
          doc.fontSize(12).text(dq);
        } else if (dq && dq.question) {
          doc.fontSize(12).text(`Q: ${dq.question}`);
          if (dq.answer) {
            doc.fontSize(11).text(`A: ${dq.answer}`, { indent: 15 });
          }
        }
      }
    }
    doc.end();
  } catch (error) {
    console.error("PDF Generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
};
