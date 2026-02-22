"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { label: "WORK", href: "#featured-gallery" },
  { label: "TUTORIALS", href: "#tutorials" },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 z-50 w-full mix-blend-difference">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="/"
          className="text-xs font-semibold tracking-[0.3em] text-white uppercase"
        >
          SUNIKCAPTURES.CO
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-8">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-xs font-semibold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-70"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white transition-opacity hover:opacity-70"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile: theme toggle + menu button */}
        <div className="flex items-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white transition-opacity hover:opacity-70"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
          >
          <span
            className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${menuOpen ? "translate-y-[4.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[4.5px] -rotate-45" : ""}`}
          />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay — outside mix-blend-difference */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[60px] left-0 w-full overflow-hidden border-b border-border bg-background/95 backdrop-blur-md sm:hidden"
            style={{ mixBlendMode: "normal" }}
          >
            <ul className="flex flex-col gap-5 px-6 py-8">
              {navItems.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm tracking-wider text-muted transition-colors hover:text-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
