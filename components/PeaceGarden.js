"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

function Rain({ drops = 20 }) {
  const [width, setWidth] = useState(400) // default width

  useEffect(() => {
    // Update width on mount and resize
    function updateWidth() {
      setWidth(window.innerWidth)
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Animated rain droplets in the foreground
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }} width={width} height={220}>
      {[...Array(drops)].map((_, i) => {
        const startX = Math.random() * width
        const startY = Math.random() * 40 - 40
        const endY = 220
        // raindrop: ellipse, taller than wide
        return (
          <motion.ellipse
            key={i}
            cx={startX}
            cy={startY}
            rx={2.5}
            ry={7 + Math.random() * 2} // height 7-9, width 2.5
            fill="url(#rain-gradient)"
            initial={{ opacity: 0.7, cy: startY }}
            animate={{ opacity: [0.7, 1, 0.7], cy: [startY, endY] }}
            transition={{
              repeat: Infinity,
              duration: 1.2 + Math.random() * 0.8,
              delay: Math.random(),
            }}
          />
        )
      })}
      {/* Blue gradient for raindrops */}
      <defs>
        <linearGradient id="rain-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function Sun() {
  // Simple animated sun
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="absolute top-4 right-4"
      style={{ zIndex: 1 }}
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: [0.8, 1, 0.8], opacity: [0.7, 1, 0.7] }}
      transition={{ repeat: Infinity, duration: 4 }}
    >
      <circle cx="40" cy="40" r="20" fill="#fde68a" />
      {[...Array(8)].map((_, i) => (
        <rect
          key={i}
          x="38"
          y="8"
          width="4"
          height="16"
          fill="#fde68a"
          transform={`rotate(${i * 45} 40 40)`}
        />
      ))}
    </motion.svg>
  )
}

function GrowingPlant({ stage }) {
  // Animate plant growth based on stage (0=seed, 1=sprout, 2=sapling, 3=tree, 4=flowering)
  return (
    <svg width="160" height="220" viewBox="0 0 160 220" className="mx-auto relative z-10">
      {/* Soil */}
      <ellipse cx="80" cy="200" rx="50" ry="18" fill="#a3a3a3" />
      {/* Seed */}
      <motion.ellipse
        cx="80"
        cy="190"
        rx="8"
        ry="6"
        fill="#b45309"
        initial={false}
        animate={{
          opacity: stage === 0 ? 1 : 0,
          scale: stage === 0 ? [1, 1.08, 1] : 0.5,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{ originX: "80px", originY: "190px" }}
      />
      {/* Sprout */}
      <motion.path
        d="M80 190 Q78 170 80 160 Q82 170 80 190"
        stroke="#15803d"
        strokeWidth="4"
        fill="none"
        initial={false}
        animate={{
          opacity: stage >= 1 ? 1 : 0,
          pathLength: stage >= 1 ? 1 : 0,
          rotate: stage >= 1 ? [-2, 2, -2] : 0,
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{ originX: "80px", originY: "190px" }}
      />
      {/* Sapling stem */}
      <motion.rect
        x="77"
        y="140"
        width="6"
        height="50"
        rx="3"
        fill="#15803d"
        initial={false}
        animate={{
          opacity: stage >= 2 ? 1 : 0,
          height: stage >= 2 ? 50 : 0,
          y: stage >= 2 ? [140, 138, 140] : 140,
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      {/* Tree trunk */}
      <motion.rect
        x="74"
        y="100"
        width="12"
        height="90"
        rx="6"
        fill="#92400e"
        initial={false}
        animate={{
          opacity: stage >= 3 ? 1 : 0,
          height: stage >= 3 ? 90 : 0,
          y: stage >= 3 ? [100, 98, 100] : 100,
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      {/* Tree canopy */}
      <motion.circle
        cx="80"
        cy="100"
        r="40"
        fill="#22c55e"
        initial={false}
        animate={{
          opacity: stage >= 3 ? 1 : 0,
          r: stage >= 3 ? [40, 43, 40] : 0,
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      {/* Flowering */}
      <motion.circle
        cx="80"
        cy="80"
        r="10"
        fill="#f472b6"
        initial={false}
        animate={{
          opacity: stage === 4 ? 1 : 0,
          scale: stage === 4 ? [1, 1.15, 1] : 0.5,
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{ originX: "80px", originY: "80px" }}
      />
    </svg>
  )
}

function getStage(day) {
  if (day >= 1 && day <= 5) return 0 // seed
  if (day >= 6 && day <= 15) return 1 // sprout
  if (day >= 16 && day <= 40) return 2 // sapling
  if (day >= 41 && day <= 300) return 3 // tree
  if (day >= 301 && day <= 365) return 4 // flowering
  return 0
}

export default function PeaceGarden({ dayCount }) {
  const stage = getStage(dayCount)
  const progress = Math.min((dayCount / 365) * 100, 100)

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Sun in the background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <Sun />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <h2 className="text-4xl font-light text-gray-800 mb-4">Peace Garden</h2>
        <p className="text-gray-600">Watch your inner peace grow day by day</p>
      </motion.div>

      <div className="bg-gradient-to-b from-sky-100 to-green-100 rounded-2xl shadow-lg p-8 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 relative"
        >
          {/* Plant in the middle */}
          <GrowingPlant stage={stage} />
          {/* Rain in the foreground */}
          <Rain drops={24} />
          <h3 className="text-2xl font-medium text-gray-800 mb-2">
            {["Seedling", "Sprout", "Sapling", "Tree", "Flowering Tree"][stage]}
          </h3>
          <p className="text-gray-600 italic max-w-md mx-auto">
            {
              [
                "Your journey begins with a tiny seed of hope",
                "Growth is happening, even when you can't see it",
                "Your resilience is taking root and growing stronger",
                "You are becoming more grounded and stable each day",
                "You are blooming beautifully, sharing your light with the world",
              ][stage]
            }
          </p>
        </motion.div>

        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Day {dayCount}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-lg mb-1">🌱</div>
            <div className="font-medium">Days 1-5</div>
            <div className="text-gray-600">Seedling</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-lg mb-1">🪴</div>
            <div className="font-medium">Days 6-15</div>
            <div className="text-gray-600">Sprout</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-lg mb-1">🌿</div>
            <div className="font-medium">Days 16-40</div>
            <div className="text-gray-600">Sapling</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-lg mb-1">🌳</div>
            <div className="font-medium">Days 41+</div>
            <div className="text-gray-600">Tree</div>
          </div>
        </div>

        {dayCount >= 365 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"
          >
            <p className="text-purple-800 font-medium">
              🎉 Congratulations! You&apos;ve completed a full year of growth. Your journey continues with renewed wisdom and
              strength.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
