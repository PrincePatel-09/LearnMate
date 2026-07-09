/**
 * Courses Page — Browse, search, filter, bookmark courses
 */
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MdSearch, MdBookmark, MdBookmarkBorder, MdOpenInNew, MdAutoAwesome, MdStar } from "react-icons/md";
import { getCourses, toggleBookmark } from "../services/api";

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Full Stack" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "data-science", label: "Data Science" },
  { id: "database", label: "Database" },
  { id: "fundamentals", label: "CS Fundamentals" },
];

const DIFFICULTY_COLORS = {
  "Beginner":              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Intermediate":          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Advanced":              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Beginner–Intermediate": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

function CourseCard({ course, onBookmark }) {
  const [bookmarked, setBookmarked] = useState(course.bookmarked || false);
  const [toggling, setToggling]     = useState(false);

  const handleBookmark = async () => {
    setToggling(true);
    try {
      const res = await toggleBookmark({ course_id: course.id, course_data: course });
      setBookmarked(res.data.bookmarked);
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 card-hover flex flex-col"
    >
      {/* Color header */}
      <div className="h-2" style={{ background: `linear-gradient(135deg, ${course.image_color || "#0F62FE"}, #8A3FFC)` }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Platform + badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {course.platform}
          </span>
          <div className="flex items-center gap-1">
            {course.recommended && (
              <span className="text-[10px] px-2 py-0.5 bg-ibm-blue text-white rounded-full font-bold flex items-center gap-1">
                <MdAutoAwesome size={10} /> Recommended
              </span>
            )}
            {course.free && (
              <span className="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded-full font-bold">FREE</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-snug flex-1">{course.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{course.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${DIFFICULTY_COLORS[course.difficulty] || DIFFICULTY_COLORS["Beginner"]}`}>
            {course.difficulty}
          </span>
          <span className="text-xs text-gray-400">⏱ {course.duration}</span>
          <span className="text-xs text-yellow-500 flex items-center gap-1">
            <MdStar size={13} /> {course.rating}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <a href={course.url} target="_blank" rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-ibm-blue text-white rounded-xl text-sm font-semibold hover:bg-ibm-hover transition-colors"
          >
            Visit Course <MdOpenInNew size={15} />
          </a>
          <button onClick={handleBookmark} disabled={toggling}
            className={`p-2.5 rounded-xl border-2 transition-all ${bookmarked ? "border-ibm-blue bg-ibm-blue/10 text-ibm-blue" : "border-gray-200 dark:border-gray-700 text-gray-400 hover:border-ibm-blue"}`}
          >
            {bookmarked ? <MdBookmark size={20} /> : <MdBookmarkBorder size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [category, setCategory]   = useState("");
  const [search, setSearch]       = useState("");
  const [aiMode, setAiMode]       = useState(false);

  const fetchCourses = useCallback(async (cat, q, ai) => {
    setLoading(true);
    try {
      const res = await getCourses({ category: cat, search: q, ai: String(ai) });
      setCourses(res.data.courses || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(category, search, aiMode); }, [category, aiMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses(category, search, aiMode);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">📚 Course Library</h1>
        <p className="text-gray-500 text-sm mt-1">Curated free & paid courses from top platforms</p>
      </div>

      {/* Search + AI toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue text-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-ibm-blue text-white rounded-xl font-semibold text-sm hover:bg-ibm-hover transition-colors">
            Search
          </button>
        </form>
        <button
          onClick={() => setAiMode((a) => !a)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all
            ${aiMode ? "bg-ibm-blue text-white border-ibm-blue shadow-lg shadow-ibm-blue/30" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-ibm-blue"}`}
        >
          <MdAutoAwesome size={18} /> AI Recommendations
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all
              ${category === c.id ? "bg-ibm-blue text-white shadow-lg shadow-ibm-blue/30" : "bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-ibm-blue"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-2xl h-64 shimmer" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="font-bold text-gray-700 dark:text-gray-300">No courses found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
