/**
 * Topbar — dark mode toggle, notifications, user avatar
 */
import React from "react";
import { MdMenu, MdDarkMode, MdLightMode, MdNotifications } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const { dark, toggleDark } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        aria-label="Toggle sidebar"
      >
        <MdMenu size={22} />
      </button>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Streak badge */}
        {user?.streak > 0 && (
          <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
            🔥 {user.streak} day streak
          </div>
        )}

        {/* XP */}
        <div className="hidden sm:flex items-center gap-1 bg-ibm-blue/10 text-ibm-blue px-3 py-1 rounded-full text-xs font-semibold">
          ⚡ {user?.xp || 0} XP
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Notifications (placeholder) */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative transition-colors">
          <MdNotifications size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ibm-blue rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
