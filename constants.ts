
import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `
# ROLE
You are an "Enterprise-Grade Live Session Analyzer." You are an expert-level AI assistant designed for a top-tier edtech company.

Your purpose is to provide a comprehensive, accurate, and actionable analysis of any live session chat log. Your users are educators and operations executives who need to understand *which specific learners* are facing problems and *what systemic improvements* are needed.

# OBJECTIVE
To read a provided chat log, filter all "Noise," and provide a "360-Degree Analysis" that attributes feedback to specific individuals and recommends strategic improvements.

# STEP 1: DEFINE "NOISE" (What to IGNORE)
You MUST ignore all non-substantive conversational messages, including but not limited to:
* **Greetings:** "hello," "hi," "good morning/evening," "bye."
* **Simple Acknowledgments:** "yes," "no," "ok," "got it," "done," "understood," "present," "sir," "ma'am," "okay."
* **Simple Politeness:** "thanks," "thank you," "ty," "np," "welcome," "sorry."
* **Simple Agreement:** "+1," "agreed," "same," "same here," "true."
* **Common Abbreviations:** "lol," "thx," "mb," "gg," "brb," "idk."
* **Instructor/Host Monologue:** Any message from the specified instructor(s), host(s), or admin(s).

# STEP 2: DEFINE "SIGNAL" (What to EXTRACT)
You MUST actively search for and extract the following from **LEARNERS ONLY**:
* **Learner Name:** The name of the user who sent the message.
* **Learner Questions:** Any message asking "what," "where," "why," or "how."
* **Statements of Confusion:** Any message indicating a learner is lost, stuck, or doesn't understand.
* **Technical Issues:** Any message about audio, video, links, or software.
* **Actionable Feedback:** Any message that suggests an improvement or criticizes pace/content.
* **Positive Highlights:** Any message that expresses strong positive sentiment.

# STEP 3: OUTPUT FORMAT
Analyze the provided chat log and generate the 360-Degree Report. You MUST return the output in a valid JSON format that adheres strictly to the provided response schema.

A critical part of this task is to group similar feedback in the 'detailedExtractionLog'. Instead of listing every individual message, you MUST group identical or highly similar messages. For each category (conceptualConfusion, technicalIssues, etc.), create an array of objects. Each object must have a "theme" (representing the common question or issue) and a "learners" array (listing the names of all learners who expressed that theme). This makes the report concise and solves output size limits.

Synthesize all other extracted signals into the appropriate sections of the JSON report (executiveSummary, keyAreasForImprovement, etc.). For grouped sections like keyProblems and positiveHighlights, consolidate similar issues. For actionableInsights, create concrete, solvable action items.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.OBJECT,
      description: "A high-level overview of the session.",
      properties: {
        overallSessionSentiment: { type: Type.STRING, description: "e.g., Mixed, Positive with Technical Frustrations, etc." },
        keyTakeaway: { type: Type.STRING, description: "One-sentence summary of the key finding." },
      },
      required: ["overallSessionSentiment", "keyTakeaway"],
    },
    keyAreasForImprovement: {
      type: Type.ARRAY,
      description: "High-level summary of themes that need improvement.",
      items: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING, description: "e.g., Technical Readiness, Content Pacing" },
          description: { type: Type.STRING, description: "A summary of the issue within this theme." },
        },
        required: ["theme", "description"],
      },
    },
    actionableInsights: {
      type: Type.ARRAY,
      description: "Specific, immediate fixes to implement for the next session.",
      items: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, description: "The problem that occurred." },
          recommendation: { type: Type.STRING, description: "The recommended solution." },
          reportedBy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who reported this." },
        },
        required: ["action", "recommendation", "reportedBy"],
      },
    },
    keyProblems: {
      type: Type.ARRAY,
      description: "The top 3 most significant problems, grouped by issue.",
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: "Description of the problem." },
          reportedBy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who reported this issue." },
        },
        required: ["issue", "reportedBy"],
      },
    },
    positiveHighlights: {
      type: Type.ARRAY,
      description: "The top 3 positive highlights, grouped by topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: "Description of the highlight." },
          reportedBy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who mentioned this." },
        },
        required: ["issue", "reportedBy"],
      },
    },
    detailedExtractionLog: {
      type: Type.OBJECT,
      description: "A log of extracted messages, grouped by theme.",
      properties: {
        conceptualConfusion: {
          type: Type.ARRAY,
          description: "Grouped list of conceptual questions and points of confusion.",
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING, description: "The common theme, question, or point of confusion." },
              learners: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who raised this point." },
            },
            required: ["theme", "learners"],
          },
        },
        technicalIssues: {
          type: Type.ARRAY,
          description: "Grouped list of technical issues and errors.",
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING, description: "The common technical issue or error reported." },
              learners: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who reported this issue." },
            },
            required: ["theme", "learners"],
          },
        },
        actionableFeedback: {
          type: Type.ARRAY,
          description: "Grouped list of actionable feedback, suggestions, and negative comments.",
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING, description: "The common theme of the feedback or suggestion." },
              learners: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who provided this feedback." },
            },
            required: ["theme", "learners"],
          },
        },
        positiveFeedback: {
          type: Type.ARRAY,
          description: "Grouped list of positive feedback and highlights.",
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING, description: "The common theme of the positive feedback or praise." },
              learners: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of learners who gave this praise." },
            },
            required: ["theme", "learners"],
          },
        },
      },
      required: ["conceptualConfusion", "technicalIssues", "actionableFeedback", "positiveFeedback"],
    },
  },
  required: ["executiveSummary", "keyAreasForImprovement", "actionableInsights", "keyProblems", "positiveHighlights", "detailedExtractionLog"],
};