import { LoginForm } from "@/components/login-form";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-black text-white overflow-hidden font-sans">
      {/* Left: Clean Login Form + Professional Text */}
      <div className="flex flex-col gap-6 p-8 md:p-12 justify-center">
        <div className="mb-6">
          <motion.h1
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold text-cyan-400 tracking-tight"
          >
            IRIS
          </motion.h1>
          <motion.p
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="mt-2 text-gray-400 text-lg md:text-xl"
          >
            Your intelligent AI assistant for real-time stock market insights,
            analysis, and smarter trading decisions.
          </motion.p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right: Stock Market Animated Background */}
      <div className="hidden lg:flex relative items-center justify-center bg-black overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-l border-cyan-700 h-full"></div>
          ))}
          {[...Array(12)].map((_, i) => (
            <div key={i + 12} className="border-t border-cyan-700 w-full"></div>
          ))}
        </div>

        {/* Moving Line Chart */}
        <motion.svg
          viewBox="0 0 300 150"
          className="w-3/4 h-3/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.polyline
            fill="none"
            stroke="#00ffff"
            strokeWidth="2"
            points="0,140 30,120 60,130 90,80 120,100 150,60 180,90 210,50 240,70 270,40 300,60"
            animate={{ pathLength: [0, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          />
        </motion.svg>

        {/* Candlestick bars */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-10 w-2 bg-cyan-400"
            style={{
              left: `${i * 10 + 5}%`,
              height: `${30 + Math.random() * 80}px`,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2 + i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
