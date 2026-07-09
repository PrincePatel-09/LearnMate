/**
 * Dashboard — Welcome, Roadmap Preview, Progress, Recent AI, Achievements
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdArrowForward, MdChat, MdMap, MdTrendingUp, MdEmojiEvents } from "react-icons/md";
import { getDashboard } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CardSkeleton = () => (
  <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shimmer h-32 animate-pulse" />
);

const StatCard = ({ label, value, icon: Icon, color, suffix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4 card-hover"
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}{suffix}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-ibm-blue via-ibm-purple to-ibm-teal text-white"
      >
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">{greet()} 👋</p>
          <h1 className="text-2xl md:text-3xl font-black mb-2">{user?.name || "Student"}!</h1>
          <p className="text-white/80 text-sm max-w-lg">
            {user?.career_goal
              ? `Working towards: ${user.career_goal} • ${user?.skill_level} level`
              : "Set your career goal to get started with your personalized roadmap."}
          </p>
          {data?.streak > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold">
              🔥 {data.streak} day learning streak — Keep it up!
            </div>
          )}
        </div>
        <div className="absolute right-6 top-6 text-6xl opacity-10 select-none">🚀</div>
      </motion.div>

      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Topics Completed"    value={data?.progress?.completed   || 0}  icon={MdTrendingUp}  color="#0F62FE" />
          <StatCard label="Hours Learned"       value={data?.progress?.total_hours || 0}  icon={MdMap}         color="#8A3FFC" suffix="h" />
          <StatCard label="XP Earned"           value={data?.xp || 0}                     icon={MdEmojiEvents} color="#F1C21B" />
          <StatCard label="Learning Streak"     value={data?.streak || 0}                 icon={MdChat}        color="#08BDBA" suffix=" days" />
        </div>
      )}


      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Roadmap preview */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Current Roadmap</h2>
            <Link to="/app/roadmap" className="text-ibm-blue text-sm font-semibold flex items-center gap-1 hover:underline">
              View Full <MdArrowForward size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-10 rounded-xl shimmer" />)}
            </div>
          ) : data?.roadmap ? (
            <>
              <p className="text-sm text-gray-500 mb-3">{data.roadmap.goal}</p>
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round(data.roadmap.completion_pct || 0)}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <div className="progress-bar h-2.5" style={{ width: `${data.roadmap.completion_pct || 0}%` }} />
                </div>
              </div>
              {/* Phase previews */}
              {data.roadmap_phases?.slice(0, 2).map((phase, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-ibm-blue/10 text-ibm-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {phase.phase}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{phase.title}</p>
                    <p className="text-xs text-gray-500">{phase.duration_weeks} weeks • {phase.topics?.length || 0} topics</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-ibm-blue font-medium flex-shrink-0">
                    {phase.milestone?.slice(0, 20) || "In Progress"}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No roadmap yet. Generate yours in seconds!</p>
              <Link to="/app/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 bg-ibm-blue text-white rounded-xl font-semibold hover:bg-ibm-hover transition-colors text-sm">
                Generate Roadmap <MdArrowForward size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Achievements */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Achievements</h2>
            {loading ? (
              <div className="h-20 shimmer rounded-xl" />
            ) : data?.achievements?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.achievements.slice(0, 6).map((a) => (
                  <div key={a.id} title={a.description} className="flex flex-col items-center gap-1 p-2.5 bg-ibm-gray dark:bg-gray-800 rounded-xl text-center">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium max-w-[56px] leading-tight">{a.badge}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Complete topics to earn badges! 🏆</p>
            )}
          </div>

          {/* Recent AI */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">AI Suggestions</h2>
              <Link to="/app/chat" className="text-ibm-blue text-xs font-semibold hover:underline">Open Chat</Link>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1,2].map((i) => <div key={i} className="h-14 shimmer rounded-xl" />)}
              </div>
            ) : data?.recent_ai?.length > 0 ? (
              <div className="space-y-3">
                {data.recent_ai.slice(0, 2).map((msg) => (
                  <div key={msg.id} className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">{msg.content?.slice(0, 120)}…</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">Ask your AI coach anything!</p>
                <Link to="/app/chat" className="inline-flex items-center gap-2 px-4 py-2 bg-ibm-blue text-white rounded-xl text-xs font-semibold hover:bg-ibm-hover">
                  Chat Now <MdChat size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: "/app/chat",     icon: "💬", label: "Ask AI Coach",    desc: "Chat with Granite" },
          { to: "/app/roadmap",  icon: "🗺️",  label: "My Roadmap",     desc: "View your path" },
          { to: "/app/courses",  icon: "📚", label: "Explore Courses", desc: "Browse & bookmark" },
          { to: "/app/progress", icon: "📊", label: "My Progress",     desc: "Track your growth" },
        ].map((item) => (
          <Link key={item.to} to={item.to}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-ibm-blue transition-all group card-hover text-center"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-ibm-blue transition-colors">{item.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
