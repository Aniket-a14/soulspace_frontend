"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import Link from "next/link"

export default function WelcomePage({ dayCount, quoteOfTheDay, onEnter, user }) {
  // Store dot positions in state
  const [dotPositions, setDotPositions] = useState([])

  useEffect(() => {
    // Only run on client
    const positions = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
    setDotPositions(positions)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {dotPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: pos.left,
              top: pos.top,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: pos.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: pos.delay,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="text-6xl md:text-7xl font-light text-white mb-4">SoulSpace</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mb-8"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            {user ? "Welcome back to your sanctuary" : "Begin your journey to inner peace"}
          </h2>
          {user && (
            <div className="text-8xl md:text-9xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
              Day {dayCount}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <p className="text-lg text-white/90 italic leading-relaxed">&quot;{quoteOfTheDay}&quot;</p>
            <p className="text-sm text-white/70 mt-2">Quote of the Day</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-medium shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
            >
              Enter Your Sanctuary
            </motion.button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-900 px-12 py-4 rounded-full text-xl font-medium shadow-xl hover:bg-gray-50 transition-all duration-300 min-w-[200px]"
                >
                  Log In
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-medium shadow-xl hover:shadow-pink-500/25 transition-all duration-300 min-w-[200px]"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
