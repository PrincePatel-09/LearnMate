/**
 * Profile Page — View & edit user profile + skill assessment
 */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdEdit, MdSave, MdClose, MdSchool, MdWork, MdAccessTime } from "react-icons/md";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CAREER_GOALS = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
  "Android Developer", "iOS Developer", "Cybersecurity Analyst",
  "Cloud Engineer", "UI/UX Designer", "Other",
];

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [form, setForm]         = useState({});

  useEffect(() => {
    if (user) setForm({ ...user });
  }, [user]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue text-sm transition-all ${!editing ? "opacity-60 cursor-not-allowed" : ""}`;

  let interests = [];
  try { interests = JSON.parse(user?.interests || "[]"); } catch {}

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-ibm-blue via-ibm-purple to-ibm-teal rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl font-black">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black">{user?.name}</h1>
            <p className="text-white/80 text-sm mt-1">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">{user?.skill_level}</span>
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">⚡ {user?.xp || 0} XP</span>
              <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">🔥 {user?.streak || 0} streak</span>
            </div>
          </div>
        </div>
      </motion.div>

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-green-700 dark:text-green-400 text-sm font-semibold">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Info cards */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Profile Details</h2>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setForm({ ...user }); }}
                className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 hover:border-red-400 transition-colors">
                <MdClose size={16} /> Cancel
              </button>
              <button onClick={handleSave} disabled={loading}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-ibm-blue text-white rounded-xl font-semibold hover:bg-ibm-hover transition-colors disabled:opacity-50">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MdSave size={16} />}
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-ibm-blue transition-colors">
              <MdEdit size={16} /> Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
            <input className={inputCls} value={form.name || ""} onChange={(e) => set("name", e.target.value)} disabled={!editing} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
            <input className={inputCls} value={form.email || ""} disabled />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1"><MdSchool size={12} /> Education</label>
            <input className={inputCls} placeholder="B.Tech CSE" value={form.education || ""} onChange={(e) => set("education", e.target.value)} disabled={!editing} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">College / University</label>
            <input className={inputCls} placeholder="IIIT Delhi" value={form.college || ""} onChange={(e) => set("college", e.target.value)} disabled={!editing} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current Semester</label>
            <input className={inputCls} placeholder="3rd Semester" value={form.semester || ""} onChange={(e) => set("semester", e.target.value)} disabled={!editing} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1"><MdAccessTime size={12} /> Weekly Study Hours</label>
            <input type="number" min="1" max="80" className={inputCls} value={form.weekly_hours || 10} onChange={(e) => set("weekly_hours", e.target.value)} disabled={!editing} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1"><MdWork size={12} /> Career Goal</label>
            <select className={inputCls} value={form.career_goal || ""} onChange={(e) => set("career_goal", e.target.value)} disabled={!editing}>
              <option value="">Select goal</option>
              {CAREER_GOALS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Skill Level</label>
            <div className={`flex gap-2 ${!editing ? "pointer-events-none opacity-60" : ""}`}>
              {SKILL_LEVELS.map((s) => (
                <button key={s} type="button" onClick={() => set("skill_level", s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all
                    ${form.skill_level === s ? "border-ibm-blue bg-ibm-blue text-white" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Learning Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span key={i} className="px-3 py-1.5 bg-ibm-blue/10 text-ibm-blue rounded-xl text-sm font-semibold">{i}</span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "XP Earned", value: user?.xp || 0, icon: "⚡" },
          { label: "Day Streak", value: user?.streak || 0, icon: "🔥" },
          { label: "Skill Level", value: user?.skill_level || "Beginner", icon: "🎯" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-xl font-black text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
