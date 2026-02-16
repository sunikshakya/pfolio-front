"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="/"
          className="text-xs font-semibold tracking-[0.3em] text-white uppercase"
        >
          SunikCaptures.co
        </a>
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

      {/* Mobile menu overlay */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full border-b border-border bg-background/95 px-6 py-8 backdrop-blur-md sm:px-10">
          <ul className="flex flex-col gap-5">
            {["Home", "Portfolio", "About", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  className="text-sm tracking-wider text-muted transition-colors hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
