/**
 * Register Page — full profile collection in 2 steps
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowForward, MdArrowBack } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CAREER_GOALS = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
  "Android Developer", "iOS Developer", "Cybersecurity Analyst",
  "Cloud Engineer", "UI/UX Designer", "Other",
];
const INTERESTS = [
  "Web Development", "Data Science", "AI / ML", "Mobile Apps",
  "DevOps", "Cybersecurity", "Cloud Computing", "UI/UX Design",
  "Competitive Programming", "Open Source",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    education: "", college: "", semester: "",
    skill_level: "Beginner", career_goal: "", weekly_hours: "10",
    language: "English",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (i) =>
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      await register({ ...form, interests: JSON.stringify(selected) });
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue transition-all text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-ibm-gray dark:bg-ibm-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-[#161616] rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Join LearnMate</h1>
          <p className="text-gray-500 text-sm mt-1">Step {step} of 2 — {step === 1 ? "Account Details" : "Learning Profile"}</p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
          <div className="progress-bar h-2 rounded-full" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                <input className={inputCls} placeholder="Aryan Sharma" value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                <input type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
                <input type="password" className={inputCls} placeholder="Min 8 characters" value={form.password} onChange={(e) => set("password", e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Education</label>
                  <input className={inputCls} placeholder="B.Tech CSE" value={form.education} onChange={(e) => set("education", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">College</label>
                  <input className={inputCls} placeholder="IIIT Delhi" value={form.college} onChange={(e) => set("college", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Semester</label>
                <input className={inputCls} placeholder="e.g. 3rd Semester" value={form.semester} onChange={(e) => set("semester", e.target.value)} />
              </div>

              <button
                onClick={() => {
                  if (!form.name || !form.email || !form.password) { setError("Name, email, and password are required"); return; }
                  setError(""); setStep(2);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-ibm-blue text-white rounded-xl font-bold hover:bg-ibm-hover transition-colors shadow-lg shadow-ibm-blue/30"
              >
                Next <MdArrowForward size={20} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Career Goal *</label>
                <select className={inputCls} value={form.career_goal} onChange={(e) => set("career_goal", e.target.value)}>
                  <option value="">Select your goal</option>
                  {CAREER_GOALS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Current Skill Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {SKILL_LEVELS.map((s) => (
                    <button key={s} type="button"
                      onClick={() => set("skill_level", s)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                        ${form.skill_level === s ? "border-ibm-blue bg-ibm-blue text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-ibm-blue"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Weekly Study Hours</label>
                <input type="number" min="1" max="80" className={inputCls} value={form.weekly_hours} onChange={(e) => set("weekly_hours", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Interests (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button key={i} type="button"
                      onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                        ${selected.includes(i) ? "bg-ibm-blue border-ibm-blue text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-ibm-blue"}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold hover:border-ibm-blue transition-all">
                  <MdArrowBack size={18} /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading || !form.career_goal}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-ibm-blue text-white rounded-xl font-bold hover:bg-ibm-hover transition-colors disabled:opacity-50 shadow-lg shadow-ibm-blue/30"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <MdArrowForward size={18} /></>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-ibm-blue font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
