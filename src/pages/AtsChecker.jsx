import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
// OR use .mjs if .js doesn't exist

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


// 🔹 Master Skills per Role
const ROLE_BASED_SKILLS = {
  "frontend developer": [
    "javascript",
    "react",
    "html",
    "css",
    "tailwind",
    "redux",
    "vite",
    "npm",
    "git",
    "github",
  ],
  "backend developer": [
    "node",
    "express",
    "mongodb",
    "sql",
    "rest api",
    "jwt",
    "docker",
    "aws",
    "git",
  ],
  "full stack developer": [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
    "git",
    "api",
    "tailwind",
  ],
  "data analyst": [
    "python",
    "excel",
    "power bi",
    "sql",
    "pandas",
    "numpy",
    "statistics",
  ],
};

export default function ATSChecker() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState("");
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("pdf"); // "pdf" | "text"

  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  // 🔹 Extract text from PDF
  const extractPDF = async (file) => {
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let allText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        allText += content.items.map((item) => item.str).join(" ");
      }

      setText(allText);
      setMode("pdf"); // auto switch to PDF mode
    } catch (err) {
      console.error("PDF extraction error:", err);
      alert("Failed to extract text from PDF.");
    }
  };

  // 🔹 Analyze Resume
  const analyze = () => {
    if (!role) {
      alert("Please select a role.");
      return;
    }
    if (!text.trim()) {
      alert("Upload a PDF or paste resume text.");
      return;
    }

    const ROLE_SKILLS = ROLE_BASED_SKILLS[role.toLowerCase()];
    const lower = text.toLowerCase();

    const found = ROLE_SKILLS.filter((skill) => lower.includes(skill));
    const notFound = ROLE_SKILLS.filter((skill) => !lower.includes(skill));

    setMatched(found);
    setMissing(notFound);

    // Score
    const calculatedScore = Math.round(
      (found.length / ROLE_SKILLS.length) * 100
    );
    setScore(calculatedScore);

    // Suggestions
    const sug = [];
    if (calculatedScore < 50) sug.push("Add more technical keywords related to the role.");
    if (text.length < 200) sug.push("Your resume looks short. Add more detailed experience.");
    if (!lower.includes("project")) sug.push("Include at least 2–3 strong projects.");
    if (!lower.includes("experience")) sug.push("Add an Experience section for ATS impact.");

    setSuggestions(sug);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Advanced ATS Resume Checker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Upload or Paste Resume</h2>

          {/* Mode Toggle */}
          <div className="flex gap-3 mb-4">
            <button
              className={`px-4 py-2 rounded-lg border ${
                mode === "pdf"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-200"
              }`}
              onClick={() => setMode("pdf")}
            >
              PDF Upload
            </button>

            <button
              className={`px-4 py-2 rounded-lg border ${
                mode === "text"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-200"
              }`}
              onClick={() => setMode("text")}
            >
              Paste Text
            </button>
          </div>

          {/* PDF Upload Section */}
          {mode === "pdf" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF)
              </label>

              <label
                htmlFor="resumeUpload"
                className="flex items-center justify-center w-full h-32 px-4 
                  bg-gray-50 border-2 border-dashed border-gray-300 
                  rounded-xl cursor-pointer hover:bg-gray-100 hover:border-blue-500"
              >
                <div className="text-center">
                  <svg
                    className="w-10 h-10 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 018 0m-4-4v8m-4-4h8M16 7h.01M12 3v1m-6.364 1.636l.707.707m12.728-.707l-.707.707M4 12H3m18 0h-1"
                    />
                  </svg>

                  <p className="mt-2 text-gray-600 font-medium">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">PDF files only</p>
                </div>
              </label>

              <input
                id="resumeUpload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  extractPDF(e.target.files[0]);
                }}
              />

              {selectedFile && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Uploaded: {selectedFile.name}
                </p>
              )}
            </div>
          )}

          {/* TEXT AREA MODE */}
          {mode === "text" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Resume Text
              </label>

              <textarea
                className="w-full h-56 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your resume text here..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setMode("text"); // auto switch
                }}
              ></textarea>
            </div>
          )}

          {/* Role Selection */}
          <select
            className="w-full border rounded p-2 mt-4"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select target role</option>
            {Object.keys(ROLE_BASED_SKILLS).map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={analyze}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Analyze Resume
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">ATS Analysis Report</h2>

          <p className="font-semibold">
            ATS Score:
            <span className="text-blue-600"> {score}/100</span>
          </p>

          {/* Matched Skills */}
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Matched Skills</h3>
            <div className="flex flex-wrap gap-2">
              {matched.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-green-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {missing.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-red-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Suggestions</h3>
            <ul className="list-disc ml-5">
              {suggestions.map((s, index) => (
                <li key={index} className="text-gray-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
