"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PeaceJar() {
  const [currentQuote, setCurrentQuote] = useState("")
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch("/peace-quotes.json")
        const data = await response.json()
        setQuotes(data.quotes)
      } catch (error) {
        console.error("Error loading quotes:", error)
        setQuotes(["Peace begins with a smile."])
      }
    }

    loadQuotes()
  }, [])

  const getRandomQuote = () => {
    if (quotes.length === 0) return

    setIsLoading(true)

    // Add a small delay for better UX
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-light text-gray-800 mb-4">Peace Jar</h2>
        <p className="text-gray-600">Draw wisdom and comfort from gentle affirmations</p>
      </motion.div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="text-6xl mb-6 filter drop-shadow-lg">
            🫙
          </motion.div>

          <motion.button
            onClick={getRandomQuote}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 mb-8"
          >
            {isLoading ? "Finding peace..." : "Give me peace"}
          </motion.button>

          <AnimatePresence mode="wait">
            {currentQuote && (
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto"
              >
                <div className="text-2xl text-blue-600 mb-4">✨</div>
                <blockquote className="text-lg text-gray-800 leading-relaxed italic">&quot;{currentQuote}&quot;</blockquote>
                <div className="mt-4 w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
              </motion.div>
            )}
          </AnimatePresence>

          {!currentQuote && !isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 italic">
              Click the button above to receive a peaceful message
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
