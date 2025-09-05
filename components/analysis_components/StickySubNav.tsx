"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface StickySubNavProps {
  stockName: string;
  sections: Section[];
  onNavClick: (sectionId: string) => void;
}

export default function StickySubNav({
  stockName,
  sections,
  onNavClick,
}: StickySubNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Effect to handle stickiness and active section highlighting
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    // Use a placeholder div to measure the original top position
    const observerPlaceholder = document.createElement("div");
    navElement.before(observerPlaceholder);
    const navTop = observerPlaceholder.offsetTop;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Toggle sticky state
      setIsSticky(scrollY > navTop);

      // Determine active section (scrollspy logic)
      let currentSectionId = "";
      const threshold = 100; // px from top of viewport to trigger active state

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= threshold && rect.bottom >= threshold) {
            currentSectionId = section.id;
          }
        }
      });
      setActiveSection(currentSectionId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerPlaceholder.remove();
    };
  }, [sections]);

  return (
    <div
      ref={navRef}
      className={cn(
        "top-0 z-40 w-full transition-all duration-200",
        isSticky
          ? "fixed bg-content-bg/80 backdrop-blur-md border-b border-element-border shadow-md"
          : "relative"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* On mobile, stock name can be part of the bar */}
        <div className="py-1 text-center text-sm font-semibold text-text-primary md:hidden">
          {stockName}
        </div>
        <nav className="flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap py-2 custom-scrollbar">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(section.id);
              }}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md border-b-2 transition-all duration-200",
                activeSection === section.id
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:bg-element-bg hover:text-text-primary"
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
