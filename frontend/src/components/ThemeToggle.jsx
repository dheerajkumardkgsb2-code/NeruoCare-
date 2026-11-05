import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext.jsx";

export default function ThemeToggle({ inline = false }) {
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isDashboardRoute =
    /^\/(student|counsellor)\/[^/]+(?:\/|$)/.test(pathname) && pathname !== "/student/verify";

  if (!inline && (pathname === "/" || isDashboardRoute)) return null;

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      onClick={toggleTheme}
      className={`group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-white/90 text-purple-700 shadow-sm transition-colors hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:border-slate-600 dark:bg-slate-800 dark:text-purple-200 dark:hover:bg-slate-700 ${inline ? "" : "fixed right-4 top-4 z-[60]"}`}
    >
      {isDark
        ? <Sun aria-hidden="true" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
        : <Moon aria-hidden="true" className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />}
    </button>
  );
}