"use client";

import { useState } from "react";

const navItems = [
  { label: "WORK", href: "#portfolio" },
  { label: "TUTORIALS", href: "#tutorials" },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
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
                  className="text-xs font-semibold tracking-[0.2em] text-white uppercase transition-colors hover:text-white/80"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-1 sm:hidden"
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

      {/* Mobile menu overlay */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full border-b border-border bg-background/95 px-6 py-8 backdrop-blur-md sm:hidden">
          <ul className="flex flex-col gap-5">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm tracking-wider text-muted transition-colors hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
