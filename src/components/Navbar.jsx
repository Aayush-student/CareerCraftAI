import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "ATS Checker", path: "/ats-checker" },
    { label: "Find Jobs", path: "/find-jobs" },
    { label: "Career Roadmaps", path: "/roadmaps" },
    { label: "LinkedIn Posts", path: "/linkedin-post-generator" },
  ];

  return (
    <header className="shadow bg-white sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold tracking-tight">
          CareerCraft AI 🚀
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `font-medium hover:text-blue-600 transition ${
                  isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 bg-white border-t">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 border-b ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
