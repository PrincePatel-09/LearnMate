/**
 * Progress Page — Charts, streaks, achievements, skill tracking
 */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler,
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";
import { MdEmojiEvents, MdLocalFireDepartment, MdTrendingUp } from "react-icons/md";
import { getAnalytics } from "../services/api";
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler
);

const CircleProgress = ({ percentage, label, color = "#0F62FE", size = 120 }) => {
  const r = 46;
  const c = 2 * Math.PI * r;
  const dash = (percentage / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill={color}>
          {Math.round(percentage)}%
        </text>
      </svg>
      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center">{label}</p>
    </div>
  );
};

const CHART_OPTIONS = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: "#f0f0f0" } } },
};

export default function ProgressPage() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-ibm-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completionPct = data?.total_topics > 0
    ? (data.completed / data.total_topics) * 100
    : 0;

  const doughnutData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [{
      data: [
        data?.skill_distribution?.completed   || 0,
        data?.skill_distribution?.in_progress || 0,
        data?.skill_distribution?.not_started || 0,
      ],
      backgroundColor: ["#0F62FE", "#8A3FFC", "#e5e7eb"],
      borderWidth: 0,
    }],
  };

  const recentTopics = data?.recent_topics || [];
  const barData = {
    labels: recentTopics.map((t) => t.topic?.slice(0, 12) || ""),
    datasets: [{
      label: "Completion %",
      data: recentTopics.map((t) => t.completion_pct || 0),
      backgroundColor: "#0F62FE",
      borderRadius: 8,
    }],
  };

  const radarData = {
    labels: ["Consistency", "Depth", "Speed", "Practice", "Completion", "Engagement"],
    datasets: [{
      label: "Skill Profile",
      data: [
        Math.min(100, (data?.streak || 0) * 10),
        Math.min(100, completionPct),
        Math.min(100, (data?.total_hours || 0) * 2),
        Math.min(100, (data?.completed || 0) * 15),
        completionPct,
        Math.min(100, (data?.xp || 0) / 5),
      ],
      backgroundColor: "rgba(15,98,254,0.15)",
      borderColor: "#0F62FE",
      pointBackgroundColor: "#0F62FE",
    }],
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">📊 My Progress</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Topics Completed", value: data?.completed || 0, icon: "✅", color: "text-green-500" },
          { label: "Total Hours", value: `${data?.total_hours || 0}h`, icon: "⏱", color: "text-ibm-blue" },
          { label: "XP Points", value: data?.xp || 0, icon: "⚡", color: "text-yellow-500" },
          { label: "Day Streak", value: data?.streak || 0, icon: "🔥", color: "text-orange-500" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 text-center"
          >
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circle progress cards */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-5">Completion Overview</h2>
          <div className="flex justify-around">
            <CircleProgress percentage={completionPct} label="Topics Done" color="#0F62FE" />
            <CircleProgress
              percentage={Math.min(100, (data?.total_hours / Math.max(1, data?.total_hours + 10)) * 100)}
              label="Hours Goal"
              color="#8A3FFC"
            />
          </div>
          <div className="mt-4 flex gap-2 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1"><MdLocalFireDepartment className="text-orange-500" size={12} /> {data?.streak} day streak</span>
            <span className="flex items-center gap-1"><MdTrendingUp className="text-ibm-blue" size={12} /> {data?.in_progress} in progress</span>
          </div>
        </div>

        {/* Doughnut */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Topic Distribution</h2>
          <div className="h-44 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } }, cutout: "70%" }} />
          </div>
        </div>

        {/* Radar */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Skill Profile</h2>
          <div className="h-48">
            <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { color: "#e5e7eb" } } } }} />
          </div>
        </div>
      </div>

      {/* Bar chart */}
      {recentTopics.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-5">Recent Topics Progress</h2>
          <div className="h-56">
            <Bar data={barData} options={CHART_OPTIONS} />
          </div>
        </div>
      )}

      {/* Achievements */}
      {data?.achievements?.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MdEmojiEvents className="text-yellow-500" /> Achievements
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {data.achievements.map((a) => (
              <motion.div key={a.id} whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2 p-3 bg-ibm-gray dark:bg-gray-800 rounded-xl text-center cursor-default"
                title={a.description}
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 leading-tight">{a.badge}</span>
                <span className="text-[9px] text-gray-400">{new Date(a.earned_at).toLocaleDateString()}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {data?.total_topics === 0 && (
        <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-4xl mb-4">📈</p>
          <p className="font-bold text-gray-700 dark:text-gray-300">No progress recorded yet</p>
          <p className="text-sm text-gray-500 mt-1">Generate your roadmap and start learning to see progress here!</p>
        </div>
      )}
    </div>
  );
}
