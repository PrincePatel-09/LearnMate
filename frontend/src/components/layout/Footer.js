/**
 * Shared footer shown on public and protected pages.
 */
import React from "react";
import { FaHeart, FaCloud } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161616] text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center justify-center gap-1 text-xs text-center sm:flex-row sm:justify-between sm:text-left">
        <p>© 2026 LearnMate. All rights reserved.</p>
        <div className="flex flex-col items-center sm:items-end gap-1">
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            Made with <FaHeart className="text-red-500" aria-hidden="true" />
          </span>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            Powered by IBM Cloud <FaCloud className="text-ibm-blue" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}