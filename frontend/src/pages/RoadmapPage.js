/**
 * Roadmap Page — Generate, visualise, and track learning roadmap
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdAutoAwesome, MdOpenInNew, MdCheck, MdLock, MdPlayArrow, MdRefresh } from "react-icons/md";
import { FaMap } from "react-icons/fa";
import { generateRoadmap, getActiveRoadmap, updateRoadmapProgress } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  completed:   { bg: "bg-green-50 dark:bg-green-900/20",  text: "text-green-600", border: "border-green-200 dark:border-green-800",  icon: MdCheck },
  in_progress: { bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-ibm-blue",  border: "border-ibm-blue/30",                       icon: MdPlayArrow },
  not_started: { bg: "bg-gray-50 dark:bg-gray-800",       text: "text-gray-500",  border: "border-gray-200 dark:border-gray-700",      icon: MdLock },
};

function TopicCard({ topic, onStatusChange }) {
  const s = STATUS_STYLES[topic.status] || STATUS_STYLES.not_started;
  const Icon = s.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${s.bg} ${s.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${s.text} bg-white dark:bg-gray-900 border ${s.border}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{topic.name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.text} bg-white dark:bg-gray-900 border ${s.border} flex-shrink-0`}>
              {topic.level}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{topic.description}</p>

          {/* Resources */}
          {topic.resources?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topic.resources.slice(0, 3).map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-xs px-2.5 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-ibm-blue hover:border-ibm-blue transition-colors"
                >
                  {r.title}
                  {r.free && <span className="text-green-500 text-[9px] font-bold">FREE</span>}
                  <MdOpenInNew size={10} />
                </a>
              ))}
            </div>
          )}

          {/* Status change */}
          <div className="flex gap-2">
            {["not_started", "in_progress", "completed"].map((st) => (
              <button key={st} onClick={() => onStatusChange(topic.name, st)}
                className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-all capitalize
                  ${topic.status === st
                    ? "bg-ibm-blue text-white border-ibm-blue"
                    : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-ibm-blue"}`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PhaseTimeline({ phase, phaseIndex, onStatusChange }) {
  const [open, setOpen] = useState(phaseIndex === 0);
  const completedTopics = phase.topics?.filter((t) => t.status === "completed").length || 0;
  const totalTopics = phase.topics?.length || 0;
  const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: phaseIndex * 0.1 }}
      className="flex gap-4"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 shadow-lg
          ${pct === 100 ? "bg-green-500 text-white" : "bg-gradient-to-br from-ibm-blue to-ibm-purple text-white"}`}>
          {pct === 100 ? <MdCheck size={20} /> : phase.phase}
        </div>
        {phaseIndex < 99 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-2 min-h-[1rem]" />}
      </div>

      {/* Phase content */}
      <div className="flex-1 pb-8">
        <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
          <div className="flex items-center justify-between bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-ibm-blue/40 transition-colors">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{phase.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {phase.duration_weeks} weeks • {totalTopics} topics
                {phase.milestone && <span className="ml-2 text-ibm-blue">→ {phase.milestone}</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{pct}%</p>
                <p className="text-xs text-gray-400">{completedTopics}/{totalTopics}</p>
              </div>
              <div className="w-10 h-10 relative">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#0F62FE" strokeWidth="3"
                    strokeDasharray={`${pct * 0.975} 100`} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                {phase.topics?.map((topic) => (
                  <TopicCard key={topic.name} topic={topic} onStatusChange={onStatusChange} />
                ))}
                {phase.project && (
                  <div className="p-4 bg-ibm-purple/5 dark:bg-ibm-purple/10 border border-ibm-purple/20 rounded-xl">
                    <p className="text-xs font-bold text-ibm-purple mb-1">🚀 Phase Project</p>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{phase.project.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{phase.project.description}</p>
                    {phase.project.skills_used?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {phase.project.skills_used.map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 bg-ibm-purple/10 text-ibm-purple rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const CAREER_GOALS = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
  "Android Developer", "Cybersecurity Analyst", "Cloud Engineer",
];

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap]   = useState(null);
  const [phases, setPhases]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ goal: user?.career_goal || "", skill_level: user?.skill_level || "Beginner", weekly_hours: user?.weekly_hours || 10 });

  useEffect(() => {
    getActiveRoadmap()
      .then((r) => {
        if (r.data.roadmap) {
          setRoadmap(r.data.roadmap);
          setPhases(r.data.data?.phases || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const r = await generateRoadmap(form);
      setRoadmap(r.data.roadmap);
      setPhases(r.data.data?.phases || []);
    } catch (e) {
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (topicName, newStatus) => {
    if (!roadmap) return;
    // Optimistically update UI
    setPhases((prev) =>
      prev.map((phase) => ({
        ...phase,
        topics: phase.topics?.map((t) =>
          t.name === topicName ? { ...t, status: newStatus } : t
        ),
      }))
    );
    // Calculate new completion pct
    const allTopics = phases.flatMap((p) => p.topics || []);
    const updatedTopics = allTopics.map((t) => t.name === topicName ? { ...t, status: newStatus } : t);
    const completed = updatedTopics.filter((t) => t.status === "completed").length;
    const pct = allTopics.length > 0 ? (completed / allTopics.length) * 100 : 0;
    const updates = { [topicName]: newStatus };
    await updateRoadmapProgress(roadmap.id, { completion_pct: pct, topic_updates: updates });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-ibm-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <FaMap className="text-ibm-blue" /> Learning Roadmap
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your personalised path to {form.goal || "your career goal"}</p>
        </div>
        {roadmap && (
          <button onClick={() => { setRoadmap(null); setPhases([]); }} className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-ibm-blue transition-colors">
            <MdRefresh size={16} /> New Roadmap
          </button>
        )}
      </div>

      {!roadmap ? (
        /* Generate form */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-100 dark:border-gray-800"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center mx-auto mb-4 text-2xl">🗺️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generate Your Roadmap</h2>
            <p className="text-gray-500 text-sm">We will build a roadmap with direct roadmap.sh links for your selected path</p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Career Goal</label>
              <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue text-sm"
              >
                <option value="">Select your goal</option>
                {CAREER_GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skill Level</label>
                <select value={form.skill_level} onChange={(e) => setForm({ ...form, skill_level: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue text-sm"
                >
                  {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hrs/Week</label>
                <input type="number" min="1" max="80" value={form.weekly_hours}
                  onChange={(e) => setForm({ ...form, weekly_hours: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ibm-blue text-sm"
                />
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!form.goal || generating}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-ibm-blue text-white rounded-xl font-bold hover:bg-ibm-hover transition-colors disabled:opacity-50 shadow-lg shadow-ibm-blue/30"
            >
              {generating ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating roadmap…</>
              ) : (
                <><MdAutoAwesome size={20} /> Generate My Roadmap</>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Roadmap header */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{roadmap.title}</h2>
                <p className="text-gray-500 text-sm mt-1">Goal: {roadmap.goal}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-ibm-blue">{Math.round(roadmap.completion_pct || 0)}%</p>
                <p className="text-xs text-gray-500">completed</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                <div className="progress-bar h-3 rounded-full transition-all duration-700" style={{ width: `${roadmap.completion_pct || 0}%` }} />
              </div>
            </div>

            {/* roadmap.sh link */}
            {roadmap.roadmapsh_url && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-ibm-blue mb-1">📍 Official Industry Roadmap Available</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  roadmap.sh has an official roadmap for this path. Use it alongside your personalised plan.
                </p>
                <a href={roadmap.roadmapsh_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ibm-blue text-white rounded-xl text-xs font-bold hover:bg-ibm-hover transition-colors"
                >
                  Open Industry Roadmap <MdOpenInNew size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-1">
            {phases.map((phase, i) => (
              <PhaseTimeline key={i} phase={phase} phaseIndex={i} onStatusChange={handleStatusChange} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
