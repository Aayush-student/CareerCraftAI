import { useEffect, useState, useMemo } from "react";

const USER_SKILLS = ["javascript", "react", "node", "sql", "mongodb", "python"];
const HERO_IMAGE = "https://i.imgur.com/6uZpUqz.jpeg";

export default function JobAggregator() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("software developer");
  const [onlyIndia, setOnlyIndia] = useState(true);

  const [page, setPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";
  const ADZUNA_ID = import.meta.env.VITE_ADZUNA_APP_ID || "";
  const ADZUNA_KEY = import.meta.env.VITE_ADZUNA_API_KEY || "";

  function normalize(item, source) {
    return {
      id: item.id || item.job_id || item.slug || item.url,
      title: item.title || item.job_title,
      company: item.company_name || item.company || item.employer_name,
      location:
        item.candidate_required_location ||
        item.location ||
        item.job_location ||
        "",
      url: item.url || item.redirect_url || item.job_apply_link,
      desc: item.description || item.job_description || "",
      source,
    };
  }

  async function safe(url, options) {
    try {
      const r = await fetch(url, options);
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch {
      return null;
    }
  }

  async function fetchJobs() {
    setLoading(true);
    setPage(1);

    const jobsList = [];

    const remotive = await safe(
      `https://remotive.com/api/remote-jobs?search=${query}`
    );
    if (remotive?.jobs) {
      remotive.jobs.forEach((j) => jobsList.push(normalize(j, "remotive")));
    }

    if (ADZUNA_ID && ADZUNA_KEY) {
      const adzuna = await safe(
        `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=50&what=${query}`
      );
      if (adzuna?.results) {
        adzuna.results.forEach((j) => jobsList.push(normalize(j, "adzuna")));
      }
    }

    if (RAPID_API_KEY) {
      const j = await safe(
        `https://jsearch.p.rapidapi.com/search?query=${query}+India&num_pages=1`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );
      if (j?.data) {
        j.data.forEach((job) => jobsList.push(normalize(job, "jsearch")));
      }
    }

    const unique = Array.from(
      new Map(jobsList.map((j) => [j.title + j.company, j])).values()
    );

    const final = onlyIndia
      ? unique.filter((j) => String(j.location).toLowerCase().includes("india"))
      : unique;

    setJobs(final);
    setFilteredJobs(final);
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const paginated = useMemo(() => {
    const start = (page - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, page]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex gap-4 items-center mb-8">
        <img
          src={HERO_IMAGE}
          alt="Hero"
          className="w-24 rounded-lg shadow-lg border-2 border-blue-500"
        />
        <div>
          <h1 className="text-3xl font-extrabold text-blue-700">
            Job Aggregator
          </h1>
          <p className="text-gray-600 italic">Merged jobs from 3 APIs. Apply faster.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-5 rounded-2xl shadow-md mb-8 items-center">
        <input
          className="border border-gray-300 p-3 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search role (e.g. React developer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label className="flex gap-2 items-center text-gray-700 select-none">
          <input
            type="checkbox"
            checked={onlyIndia}
            onChange={() => setOnlyIndia(!onlyIndia)}
            className="accent-blue-600"
          />
          India Only
        </label>

        <button
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-3 rounded-lg font-semibold shadow-md"
          onClick={fetchJobs}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg
            className="animate-spin h-12 w-12 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg font-semibold">
          No jobs found.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {paginated.map((job) => (
              <div
                key={job.id}
                className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <h2 className="font-bold text-xl mb-1 text-blue-700">{job.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  {job.company} • {job.location}
                </p>
                <p className="text-gray-700 text-sm line-clamp-4">
                  {job.desc.replace(/<[^>]+>/g, "")}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Apply
                  </a>
                  <span className="border border-blue-600 text-blue-600 px-2 py-1 rounded-full text-xs uppercase tracking-wide font-semibold">
                    {job.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center items-center gap-6">
            <button
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-colors"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span className="font-semibold text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-colors"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
