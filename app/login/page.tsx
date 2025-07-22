// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "../lib/store";
import { loginUser } from "../lib/api";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginUser({ email, name: name || undefined });
      setUser(userData);
      router.push("/");
      setIsLoading(false); // add here
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
      setIsLoading(false); // add here
    }
  };

  return (
    <HeroGeometric>
      {/* Pass the login form JSX as the child */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full p-8 space-y-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-300">
            IRIS
          </h1>
          <p className="mt-2 text-gray-400">Your AI Financial Analyst</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-black/30 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          <div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 bg-black/30 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold text-white bg-gradient-to-r bg-[#15151C] rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 focus:ring-purple-500 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Signing In..." : "Continue"}
            </button>
          </div>
        </form>
      </motion.div>
    </HeroGeometric>
  );
}
