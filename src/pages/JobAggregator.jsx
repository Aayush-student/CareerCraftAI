import { useEffect, useState, useMemo } from "react";

const USER_SKILLS = ["javascript", "react", "node", "sql", "mongodb", "python"];
const HERO_IMAGE = "https://i.imgur.com/6uZpUqz.jpeg";

export default function JobAggregator() {

  // UI
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [query, setQuery] = useState("software developer");
  const [location, setLocation] = useState("India");
  const [onlyIndia, setOnlyIndia] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  // API Keys (optional)
  const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";
  const ADZUNA_ID = import.meta.env.VITE_ADZUNA_APP_ID || "";
  const ADZUNA_KEY = import.meta.env.VITE_ADZUNA_API_KEY || "";


  // normalize formats
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
      source
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

    const jobsList = [];

    // Remotive (no key required)
    const remotive = await safe(
      `https://remotive.com/api/remote-jobs?search=${query}`
    );
    if (remotive?.jobs) {
      remotive.jobs.forEach((j) => jobsList.push(normalize(j, "remotive")));
    }

    // Adzuna (if keys exist)
    if (ADZUNA_ID && ADZUNA_KEY) {
      const adzuna = await safe(
        `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_ID}&app_key=${ADZUNA_KEY}&results_per_page=50&what=${query}`
      );
      if (adzuna?.results) {
        adzuna.results.forEach((j) => jobsList.push(normalize(j, "adzuna")));
      }
    }

    // JSearch (RapidAPI)
    if (RAPID_API_KEY) {
      const j = await safe(
        `https://jsearch.p.rapidapi.com/search?query=${query}+${location}&num_pages=1`,
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

    // Remove duplicates
    const unique = Array.from(
      new Map(jobsList.map((j) => [j.title + j.company, j])).values()
    );

    // India filter
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
      {/* Hero */}
      <div className="flex gap-4 items-center mb-6">
        <img src={HERO_IMAGE} className="w-24 rounded-lg shadow" />
        <div>
          <h1 className="text-2xl font-bold">Job Aggregator</h1>
          <p className="text-gray-600">Merged jobs from 3 APIs. Apply faster.</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 bg-white p-4 rounded-xl shadow mb-6">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search role (e.g. React developer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={onlyIndia}
            onChange={() => setOnlyIndia(!onlyIndia)}
          />
          India Only
        </label>

        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={fetchJobs}
        >
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-10">Fetching Jobs...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-10">No jobs found.</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {paginated.map((job) => (
              <div key={job.id} className="p-4 bg-white rounded-xl shadow">
                <h2 className="font-bold">{job.title}</h2>
                <p className="text-gray-600 text-sm">
                  {job.company} • {job.location}
                </p>

                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {job.desc.replace(/<[^>]+>/g, "")}
                </p>

                <div className="mt-4 flex gap-2">
                  <a
                    href={job.url}
                    target="_blank"
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Apply
                  </a>
                  <span className="border px-2 py-1 rounded text-sm">
                    {job.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              className="border px-3 py-2 rounded"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              className="border px-3 py-2 rounded"
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
