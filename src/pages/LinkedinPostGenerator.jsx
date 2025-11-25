import React, { useState, useEffect } from "react";



const TONES = {
  professional: "Professional",
  casual: "Casual",
  enthusiastic: "Enthusiastic",
};

const POST_TYPES = {
  achievement: "Achievement",
  certification: "Certification",
  learning: "What I learned",
  job_update: "Job update",
};

const DEFAULT_HASHTAGS = [
  "#javascript",
  "#webdev",
  "#reactjs",
  "#100DaysOfCode",
  "#careerdevelopment",
];

function safeText(s) {
  return (s || "").trim();
}

function titleCase(s) {
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

function sampleSynonymPool() {
  return {
    completed: ["completed", "finished", "wrapped up", "just completed"],
    excited: ["Excited", "Thrilled", "Proud", "Happy"],
    learned: ["learned", "picked up", "mastered", "deepened my understanding of"],
    grateful: ["grateful", "thankful"],
  };
}


function generateVariations({
  type,
  title,
  learnings,
  tone,
  includeEmojis,
  hashtags,
  cta,
  name,
  company,
  role,
}) {
  const pool = sampleSynonymPool();
  const safeTitle = safeText(title);
  const safeLearn = safeText(learnings);
  const capsTone = TONES[tone] || TONES.professional;

  const emojiMap = {
    achievement: "🏆",
    certification: "🎓",
    learning: "📚",
    job_update: "💼",
    default: "✨",
  };

  const emoji = includeEmojis ? (emojiMap[type] || emojiMap.default) + " " : "";

  const baseHashtags = (hashtags || []).filter(Boolean).slice(0, 6);
  const hashtagsText = baseHashtags.length ? "\n\n" + baseHashtags.join(" ") : "";

  const variations = [];

 
  const templates = [];

  if (type === "achievement") {
    templates.push(
      `${emoji}${pool.excited[0]} to share that I ${pool.completed[0]} ${safeTitle}. ${safeLearn ? "Through this I " + pool.learned[0] + " " + safeLearn + "." : ""} ${company ? `Big thanks to ${company} and my team.` : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}${pool.excited[1]} — ${safeTitle} successfully ${pool.completed[1]}. ${safeLearn ? "Key takeaway: " + safeLearn + "." : ""} ${cta ? cta : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}${pool.excited[2]} to announce: ${safeTitle}. ${safeLearn ? "What I learned: " + safeLearn + "." : ""} ${company ? `Grateful to colleagues at ${company}.` : ""}${hashtagsText}`,
    );
  } else if (type === "certification") {
    templates.push(
      `${emoji}${pool.completed[0]} the ${safeTitle} certification! ${safeLearn ? "It helped me " + safeLearn + "." : ""} ${company ? `Thanks to ${company} for support.` : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}Proud to have ${pool.completed[2]} ${safeTitle}. ${safeLearn ? "Ideas I gained: " + safeLearn + "." : ""} ${cta ? cta : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}${pool.excited[3]} about completing ${safeTitle}! ${safeLearn ? safeLearn + " was a big part of this journey." : ""}${hashtagsText}`,
    );
  } else if (type === "learning") {
    templates.push(
      `${emoji}I've been focusing on ${safeTitle}. ${pool.learned[0]} ${safeLearn}. ${cta ? cta : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}Quick learning update — ${safeTitle}: ${safeLearn}. Happy to share resources if anyone's interested.${hashtagsText}`,
    );
    templates.push(
      `${emoji}${pool.learned[1]} ${safeLearn} while working on ${safeTitle}. Would love to connect with others learning this.${hashtagsText}`,
    );
  } else if (type === "job_update") {
    templates.push(
      `${emoji}I’m excited to share that I joined ${company || "a new team"} as ${role || "a new role"}. Looking forward to contributing and learning.${hashtagsText}`,
    );
    templates.push(
      `${emoji}${pool.excited[0]} to start a new chapter at ${company || "my new company"} as ${role || "a role"}. Grateful for the support of mentors and friends.${hashtagsText}`,
    );
    templates.push(
      `${emoji}New role: ${role || "role"} at ${company || "company"}! Ready to build, learn, and grow. ${cta ? cta : ""}${hashtagsText}`,
    );
  } else {
   
    templates.push(
      `${emoji}${safeTitle}. ${safeLearn ? "Takeaway: " + safeLearn + "." : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}${safeTitle} — ${safeLearn ? safeLearn + "." : ""}${hashtagsText}`,
    );
    templates.push(
      `${emoji}${safeTitle} ${safeLearn ? "- " + safeLearn + "." : ""}${hashtagsText}`,
    );
  }

  function applyTone(text, toneKey) {
    if (toneKey === "casual") {
      return text.replace(/^/, "").replace(/\bI am\b|\bI'm\b/g, "I'm");
    } else if (toneKey === "enthusiastic") {
     
      return text.endsWith("!") ? text : text + " 🚀";
    }
   
    return text;
  }

  for (let i = 0; i < 3; i++) {
    let t = templates[i % templates.length] || templates[0];
    t = t.replace(/\s+/g, " ").trim();
    t = applyTone(t, tone);
   
    if (name) t = `${name} — ${t}`;
    variations.push(t);
  }

  return variations;
}



export default function LinkedinPostGenerator() {
  const [postType, setPostType] = useState("achievement");
  const [title, setTitle] = useState("");
  const [learnings, setLearnings] = useState("");
  const [tone, setTone] = useState("professional");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [cta, setCta] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");


  const [variations, setVariations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [savedDrafts, setSavedDrafts] = useState(
    JSON.parse(localStorage.getItem("li_drafts") || "[]")
  );

  useEffect(() => {
  
    setSavedDrafts(JSON.parse(localStorage.getItem("li_drafts") || "[]"));
  }, []);

  function parseHashtags(input) {
    if (!input) return [];
    return input
      .split(/[,\s]+/)
      .map((h) => (h.startsWith("#") ? h : `#${h}`))
      .filter(Boolean)
      .slice(0, 8);
  }

  function handleGenerate(e) {
    e?.preventDefault();
    const hs = parseHashtags(hashtagsInput);
    const v = generateVariations({
      type: postType,
      title,
      learnings,
      tone,
      includeEmojis,
      hashtags: hs,
      cta,
      name: name ? titleCase(name) : "",
      company: company ? titleCase(company) : "",
      role,
    });
    setVariations(v);
    setActiveIndex(0);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
    
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      alert("Copied to clipboard!");
    }
  }

  function downloadTxt(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function saveDraft() {
    const draft = {
      id: Date.now(),
      postType,
      title,
      learnings,
      tone,
      includeEmojis,
      hashtagsInput,
      cta,
      name,
      company,
      role,
    };
    const updated = [draft, ...savedDrafts].slice(0, 12); // keep 12
    setSavedDrafts(updated);
    localStorage.setItem("li_drafts", JSON.stringify(updated));
    alert("Draft saved!");
  }

  function loadDraft(draft) {
    setPostType(draft.postType || "achievement");
    setTitle(draft.title || "");
    setLearnings(draft.learnings || "");
    setTone(draft.tone || "professional");
    setIncludeEmojis(Boolean(draft.includeEmojis));
    setHashtagsInput(draft.hashtagsInput || "");
    setCta(draft.cta || "");
    setName(draft.name || "");
    setCompany(draft.company || "");
    setRole(draft.role || "");
    
    setTimeout(handleGenerate, 200);
  }

  function removeDraft(id) {
    const updated = savedDrafts.filter((d) => d.id !== id);
    setSavedDrafts(updated);
    localStorage.setItem("li_drafts", JSON.stringify(updated));
  }


  function shortSummary(text, n = 180) {
    if (!text) return "";
    return text.length > n ? text.slice(0, n).trim() + "…" : text;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">LinkedIn Post Generator</h1>
        <p className="text-gray-600 mb-6">
          Generate professional LinkedIn posts quickly. Fill the form and click{" "}
          <strong>Generate</strong>.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          
          <form
            onSubmit={handleGenerate}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Your name 
                </span>
                <input
                  className="mt-1 block w-full border rounded p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aayush Kumar"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Company / Org (optional)
                </span>
                <input
                  className="mt-1 block w-full border rounded p-2"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Role 
                </span>
                <input
                  className="mt-1 block w-full border rounded p-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Intern"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Post type
                </span>
                <select
                  className="mt-1 block w-full border rounded p-2 bg-white"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                >
                  {Object.keys(POST_TYPES).map((k) => (
                    <option key={k} value={k}>
                      {POST_TYPES[k]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Title / Achievement / Topic
              </span>
              <input
                className="mt-1 block w-full border rounded p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Completed Advanced React Course"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                What you learned / Key details (optional)
              </span>
              <textarea
                className="mt-1 block w-full border rounded p-2 h-28"
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                placeholder="e.g. hooks, context, performance optimization"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Tone</span>
                <select
                  className="mt-1 block w-full border rounded p-2 bg-white"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {Object.entries(TONES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Include emojis
                </span>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={includeEmojis}
                      onChange={(e) => setIncludeEmojis(e.target.checked)}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Custom hashtags (comma or space separated)
              </span>
              <input
                className="mt-1 block w-full border rounded p-2"
                value={hashtagsInput}
                onChange={(e) => setHashtagsInput(e.target.value)}
                placeholder="react, webdev"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: keep 2–5 relevant hashtags for best reach.
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">CTA (optional)</span>
              <input
                className="mt-1 block w-full border rounded p-2"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="e.g. DM me to collaborate / Check my project"
              />
            </label>

            <div className="flex gap-3 items-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                Generate
              </button>

              <button
                type="button"
                onClick={saveDraft}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded border"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setLearnings("");
                  setHashtagsInput("");
                  setCta("");
                  setName("");
                  setCompany("");
                  setRole("");
                  setVariations([]);
                  setActiveIndex(null);
                }}
                className="ml-auto text-sm text-red-600"
              >
                Clear
              </button>
            </div>

            {savedDrafts.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <p className="text-sm font-medium mb-2">Saved drafts</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {savedDrafts.map((d) => (
                    <div
                      key={d.id}
                      className="bg-gray-50 border p-2 rounded min-w-[200px]"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {POST_TYPES[d.postType] || "Draft"}
                      </div>
                      <div className="text-sm font-medium mb-2">
                        {shortSummary(d.title || d.learnings, 80)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadDraft(d)}
                          className="text-xs px-2 py-1 rounded bg-white border"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => removeDraft(d.id)}
                          className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 border"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

        
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Preview & Actions</h3>
                  <p className="text-sm text-gray-600">
                    Generated variations appear here. Copy or download any post.
                  </p>
                </div>

                <div className="text-right text-xs text-gray-500">
                  {variations.length > 0 ? (
                    <div>
                      Variations: <strong>{variations.length}</strong>
                    </div>
                  ) : (
                    <div>No variations yet</div>
                  )}
                </div>
              </div>
            </div>

           
            <div className="space-y-3">
              {variations.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
                  No generated posts yet. Fill the form and click <strong>Generate</strong>.
                </div>
              ) : (
                variations.map((v, idx) => (
                  <div
                    key={idx}
                    className={`bg-white p-4 rounded-xl shadow border ${
                      activeIndex === idx ? "border-blue-200 ring-1 ring-blue-100" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          Variation {idx + 1} • {v.length} chars
                        </div>
                        <div className="whitespace-pre-wrap text-gray-800 mb-3">
                          {v}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setActiveIndex(idx);
                              copyToClipboard(v);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded text-sm"
                          >
                            Copy
                          </button>

                          <button
                            onClick={() =>
                              downloadTxt(
                                `linkedin-post-${idx + 1}.txt`,
                                `@${name ? name + " — " : ""}${v}`
                              )
                            }
                            className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                          >
                            Download .txt
                          </button>

                          <button
                            onClick={() => {
                              
                              const encoded = encodeURIComponent(v);
                              const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=&mini=true&title=${encoded}`;
                              window.open(shareUrl, "_blank");
                            }}
                            className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                          >
                            Open LinkedIn Composer
                          </button>

                          <button
                            onClick={() => {
                          
                              setTitle(title + " | " + shortSummary(v, 80));
                            }}
                            className="px-3 py-2 bg-gray-100 rounded text-sm border"
                          >
                            Use as Title
                          </button>
                        </div>
                      </div>

                      <div className="w-36 text-right text-xs text-gray-500">
                        <div className="mb-2">
                          {parseHashtags(hashtagsInput).length > 0
                            ? parseHashtags(hashtagsInput).join(" ")
                            : DEFAULT_HASHTAGS.slice(0, 3).join(" ")}
                        </div>

                        <div className="text-xs">
                          <div>Estimated read: {Math.max(1, Math.round(v.split(" ").length / 100))} min</div>
                          <div className="mt-2">Tone: {TONES[tone]}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            
            {variations.length > 0 && (
              <div className="bg-white p-4 rounded-xl shadow flex gap-3">
                <button
                  onClick={() => {
                    copyToClipboard(variations.join("\n\n---\n\n"));
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Copy All
                </button>

                <button
                  onClick={() =>
                    downloadTxt(
                      `linkedin-posts-batch.txt`,
                      variations.map((v, i) => `--- Post ${i + 1} ---\n\n${v}\n`).join("\n")
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Download All
                </button>

                <button
                  onClick={() => {
                    
                    setIncludeEmojis(!includeEmojis);
                    setTimeout(handleGenerate, 120);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded border"
                >
                  Regenerate Variations
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Tip: Keep posts under 1300 characters for best LinkedIn performance.
        </footer>
      </div>
    </div>
  );
}
