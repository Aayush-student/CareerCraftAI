import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Search, Brain, Rocket, Edit3 } from "lucide-react";

const features = [
  {
    name: "Resume Builder",
    desc: "Create a fully ATS-optimized resume using smart templates.",
    icon: <FileText className="w-10 h-10 text-blue-500" />,
    link: "/resume-builder",
  },
  {
    name: "ATS Checker",
    desc: "Score your resume based on top industry ATS systems.",
    icon: <Search className="w-10 h-10 text-purple-500" />,
    link: "/ats-checker",
  },
  {
    name: "Job Aggregator",
    desc: "Find real remote jobs curated from multiple platforms.",
    icon: <Rocket className="w-10 h-10 text-green-500" />,
    link: "/find-jobs",
  },
  {
    name: "Career Roadmaps",
    desc: "Structured role-based learning paths for tech careers.",
    icon: <Brain className="w-10 h-10 text-orange-500" />,
    link: "/roadmaps",
  },
  {
    name: "LinkedIn Post Generator",
    desc: "Generate engaging professional posts in seconds.",
    icon: <Edit3 className="w-10 h-10 text-red-500" />,
    link: "/linkedin-post-generator",
  },
];

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-center pt-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight text-gray-900"
        >
          🚀 CareerCraft AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          One platform to build resumes, check ATS score, find jobs, generate roadmaps, and create LinkedIn posts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link
            to="/resume-builder"
            className="px-6 py-3 bg-black text-white text-lg font-semibold rounded-xl hover:scale-105 hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16 px-6 pb-20"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md p-6 rounded-2xl border border-gray-200 cursor-pointer hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              {feature.icon}
              <h2 className="text-xl font-semibold text-gray-900">{feature.name}</h2>
            </div>
            <p className="text-gray-600 mt-3">{feature.desc}</p>

            <Link
              to={feature.link}
              className="text-blue-600 font-medium mt-6 inline-flex items-center gap-2 hover:underline"
            >
              Open Tool <ArrowRight size={16} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
