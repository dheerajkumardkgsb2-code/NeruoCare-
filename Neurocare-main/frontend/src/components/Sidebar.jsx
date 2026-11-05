// src/components/Sidebar.jsx
// Subpath imports, not the barrel (`@tabler/icons-react`) — the barrel
// re-exports thousands of icons from one file, which esbuild/Vite's
// dependency pre-bundler hangs on indefinitely trying to process. Subpath
// imports pull in only the specific icon files actually used.
import IconChartLine from "@tabler/icons-react/dist/esm/icons/IconChartLine.mjs";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NeuroCareLogo from "./NeuroCareLogo.jsx";

/**
 * Lightweight, dependency-free Sidebar
 * - No framer-motion, gsap, or icon libs
 * - Exports Sidebar, SidebarLink, Logo, LogoIcon, SidebarDemo, default AppSidebar
 */

/* ---------- small SVG icon helpers ---------- */
const Svg = {
  Dashboard: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
    </svg>
  ),
  Calendar: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  ),
  Heart: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.8 8.6c0 6-8.8 10.4-8.8 10.4S3.2 14.6 3.2 8.6a4.4 4.4 0 0 1 7.6-3.1l1.2 1.3 1.2-1.3a4.4 4.4 0 0 1 7.6 3.1z" />
    </svg>
  ),
  Users: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Book: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 19.5A2.5 2.5 0 0 1 5.5 17H21" />
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H21v18H5.5A2.5 2.5 0 0 1 3 19.5z" />
    </svg>
  ),
  Chart: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 3v18h18" />
      <path d="M7 13l3-5 4 7 3-9" />
    </svg>
  ),
  Music: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 17V5l10-2v12" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="15" r="2" />
    </svg>
  ),
  Search: (props) => (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
};

/* ---------- Sidebar and helpers ---------- */

/**
 * Sidebar component: accepts `open` (bool) and `setOpen` function to let parent control it.
 * Contains overlay for mobile.
 */
export function Sidebar({ open, setOpen, children }) {
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [showScrollIndicators, setShowScrollIndicators] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  // compute scroll indicator visibility
  const checkScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop < el.scrollHeight - el.clientHeight - 5);
    setShowScrollIndicators(el.scrollHeight > el.clientHeight + 8);
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    // initial check
    setTimeout(checkScroll, 50);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [open]);

  // continuous scroll helper
  const startScrolling = (dir = "down") => {
    stopScrolling();
    const el = contentRef.current;
    if (!el) return;
    scrollIntervalRef.current = setInterval(() => {
      el.scrollBy({ top: dir === "down" ? 60 : -60, behavior: "smooth" });
      // run check after scroll
      setTimeout(checkScroll, 80);
    }, 120);
  };
  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // close when clicking overlay (mobile)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className="nc-sidebar fixed z-40 left-0 top-0 h-full border-r flex flex-col md:transition-all md:duration-200"
        style={{ width: open ? "12.5rem" : "4rem" }}
        onMouseEnter={() => {
          if (window.innerWidth >= 768) setOpen(true);
        }}
        onMouseLeave={() => {
          if (window.innerWidth >= 768) setOpen(false);
        }}
      >
        {/* top area & decorative circles */}
        <div className="relative p-4 flex flex-col h-full">
          <div className="absolute -left-8 top-16 w-20 h-20 nc-sidebar__decor dark:bg-slate-700 rounded-full opacity-60 pointer-events-none" />
          <div className="absolute -right-8 bottom-20 w-16 h-16 nc-sidebar__decor dark:bg-slate-700 rounded-full opacity-60 pointer-events-none" />

          {/* content container (scrollable) */}
          <div
            ref={contentRef}
            className="nc-sidebar__scroll flex-1 overflow-y-auto pr-2 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {children}
          </div>

          {/* scroll indicators */}
          {showScrollIndicators && (
            <div className="flex flex-col items-center gap-1 mt-2">
              <button
                aria-label="Scroll up"
                onMouseDown={() => startScrolling("up")}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
                className={`nc-sidebar__scroll-button w-full py-1 rounded-md ${!canScrollUp ? "opacity-30 pointer-events-none" : ""}`}
              >
                ▲
              </button>
              <button
                aria-label="Scroll down"
                onMouseDown={() => startScrolling("down")}
                onMouseUp={stopScrolling}
                onMouseLeave={stopScrolling}
                className={`nc-sidebar__scroll-button w-full py-1 rounded-md ${!canScrollDown ? "opacity-30 pointer-events-none" : ""}`}
              >
                ▼
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* mobile toggle button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="nc-sidebar__mobile-toggle fixed left-3 bottom-4 z-50 md:hidden p-2 rounded-full shadow"
        aria-label="Toggle sidebar"
      >
        {open ? "✕" : "☰"}
      </button>
    </>
  );
}

/* ---------- SidebarLink ---------- */
/**
 * accepts { link: { href, label, icon? }, open, isActive }
 * uses link.icon when provided (React node), otherwise fallback small SVG
 */
export function SidebarLink({ link, open, isActive }) {
  const base =
    "nc-sidebar__link flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm w-full";
  const activeClass = "nc-sidebar__link--active shadow dark:shadow-none";
  const normalClass = "hover:bg-white dark:hover:bg-slate-800";

  return (
    <Link
      to={link.href}
      title={!open ? link.label : undefined}
      aria-label={!open ? link.label : undefined}
      className={`${base} ${isActive ? activeClass : normalClass}`}
    >
      <div className="nc-sidebar__icon w-8 h-8 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
        {link.icon ? (
          // allow icons passed as React nodes
          <span className="w-5 h-5">{link.icon}</span>
        ) : (
          <Svg.Dashboard className="w-4 h-4" />
        )}
      </div>
      {open && (
        <div className={`truncate ${isActive ? "text-indigo-700 dark:!text-indigo-100" : ""}`}>
          {link.label}
        </div>
      )}
    </Link>
  );
}

/* ---------- Logos ---------- */
export const Logo = () => (
  <NeuroCareLogo className="p-2" />
);

export const LogoIcon = () => (
  <NeuroCareLogo compact className="p-2" />
);

/* ---------- SidebarDemo (main exported sidebar with links) ---------- */
export function SidebarDemo({ role = "student", id }) {
  const [open, setOpen] = useState(() => window.innerWidth >= 768);
  const location = useLocation();

  // close on small-width outside click
  useEffect(() => {
    const handler = (e) => {
      setOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // build links using small inline icons (no external lib)
  const studentLinks = [
    { label: "Dashboard", href: `/student/${id}`, icon: <Svg.Dashboard /> },
    {
      label: "Book Session",
      href: `/student/${id}/slots`,
      icon: <Svg.Calendar />,
    },
    {
      label: "My Sessions",
      href: `/student/${id}/appointments`,
      icon: <Svg.Heart />,
    },
    {
      label: "Peer Support",
      href: `/student/${id}/peer-support`,
      icon: <Svg.Users />,
    },
    {
      label: "AI Support",
      href: `/${role}/${id}/ai-support`,
      icon: <Svg.Search />,
    },
    { label: "Tests", href: `/student/${id}/tests`, icon: <Svg.Book /> },
    { label: "Reports", href: `/student/${id}/reports`, icon: <Svg.Chart /> },
    {
      label: "Wellness Profile",
      href: `/student/${id}/wellness-intake`,
      icon: <Svg.Heart />,
    },
    {
      label: "Resources",
      href: `/${role}/${id}/resources`,
      icon: <Svg.Book />,
    },
    {
      label: "Music Therapy",
      href: `/student/${id}/music-therapy`,
      icon: <IconChartLine className="h-5 w-5 shrink-0" />,
    },
  ];

  const counsellorLinks = [
    { label: "Dashboard", href: `/counsellor/${id}`, icon: <Svg.Dashboard /> },
    {
      label: "Appointments",
      href: `/counsellor/${id}/appointments`,
      icon: <Svg.Heart />,
    },
    {
      label: "Student Reports",
      href: `/counsellor/${id}/students`,
      icon: <Svg.Users />,
    },
    {
      label: "Analysis",
      href: `/counsellor/${id}/analysis`,
      icon: <Svg.Chart />,
    },
  ];

  const links = role === "student" ? studentLinks : counsellorLinks;

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <div className="flex flex-col h-full min-w-0">
        <div className="flex items-center justify-between">
          {open ? <Logo /> : <LogoIcon />}
          {/* small collapse button when expanded */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="nc-sidebar__collapse hidden md:inline-block text-sm text-indigo-600 bg-white dark:bg-slate-800 dark:text-indigo-200 px-2 py-1 rounded"
            aria-label="Collapse sidebar"
          >
            {open ? "◀" : "▶"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className={`px-2 ${open ? "" : "hidden"}`}>
            <div className="nc-sidebar__eyebrow text-xs text-indigo-500 dark:text-indigo-300 uppercase tracking-wide">
              Dashboard
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-1">
            {links.map((l) => (
              <SidebarLink
                key={l.href}
                link={l}
                open={open}
                isActive={location.pathname === l.href}
              />
            ))}
          </nav>
        </div>

        <div className="nc-sidebar__footer mt-auto px-2 pb-4 pt-3 border-t border-indigo-100 dark:border-slate-700">
          <button
            onClick={() => {
              localStorage.removeItem("userInfo");
              window.location.href = window.location.origin + "/";
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            {open && <span className="truncate">Logout</span>}
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

/* default export for compatibility with your imports */
export default function AppSidebar({ role = "student", id, children }) {
  return (
    // full-height two column layout
    <div className="nc-page min-h-screen flex">
      {/* Sidebar column (fixed-ish) */}
      <div className="z-40">
        <SidebarDemo role={role} id={id} />
      </div>

      {/* Main content area:
          ml-16 on small screens (collapsed sidebar width),
          md:ml-64 on medium+ screens (expanded sidebar width) */}
      <main className="nc-page__main flex-1 p-4 ml-16 md:ml-64">{children}</main>
    </div>
  );
}
