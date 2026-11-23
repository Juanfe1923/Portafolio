"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectSigif from "@/components/ProjectSigif";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";
import { soundManager } from "@/utils/audio";

export default function Home() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        soundManager.playClick();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="relative selection:bg-cyan-500/30 selection:text-white">
      <Navbar onOpenCommand={() => setIsCommandOpen(true)} />
      <Hero />
      <Skills />
      <ProjectSigif />
      <Timeline />
      <Contact />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </main>
  );
}
