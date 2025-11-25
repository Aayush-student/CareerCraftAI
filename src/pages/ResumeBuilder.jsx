import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
  });

  const resumeRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const downloadPDF = () => {
    const element = resumeRef.current;

    const options = {
      margin: 0,
      filename: `${form.name || "Resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex gap-6 p-6">
      <div className="w-1/2 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-5">Resume Builder</h1>

        <div className="flex flex-col gap-3">
          <input className="border rounded p-2" placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
          <input className="border rounded p-2" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
          <input className="border rounded p-2" placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
          <textarea className="border rounded p-2" rows="2" placeholder="Education" name="education" value={form.education} onChange={handleChange} />
          <textarea className="border rounded p-2" rows="2" placeholder="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />
          <textarea className="border rounded p-2" rows="2" placeholder="Experience" name="experience" value={form.experience} onChange={handleChange} />
        </div>

        <button
          onClick={downloadPDF}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Download PDF
        </button>
      </div>

      <div ref={resumeRef} className="w-1/2 bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-3xl font-bold">{form.name || "Your Name"}</h1>
        <p className="text-gray-600 mt-1">{form.email} | {form.phone}</p>

        <h2 className="mt-5 text-lg font-semibold border-b pb-1">Education</h2>
        <p className="mt-2 whitespace-pre-line">{form.education}</p>

        <h2 className="mt-5 text-lg font-semibold border-b pb-1">Skills</h2>
        <ul className="list-disc ml-6 mt-2">
          {form.skills.split(",").filter(s => s.trim() !== "").map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>

        <h2 className="mt-5 text-lg font-semibold border-b pb-1">Experience</h2>
        <p className="mt-2 whitespace-pre-line">{form.experience}</p>
      </div>
    </div>
  );
}

