"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../utils/api"
import { useAuth } from "../context/AuthContext"

export default function MoodJournal() {
  const [activeTab, setActiveTab] = useState("read")
  const [selectedMood, setSelectedMood] = useState("")
  const [journalEntry, setJournalEntry] = useState("")
  const [entries, setEntries] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const { user } = useAuth()

  // Reading journal states
  const [currentQuote, setCurrentQuote] = useState(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [readingHistory, setReadingHistory] = useState([])

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Peaceful" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😴", label: "Tired" },
    { emoji: "🤗", label: "Grateful" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "😕", label: "Confused" },
    { emoji: "✨", label: "Hopeful" },
  ]

  // Helper to get today's date string
  const getToday = () => new Date().toLocaleDateString()

  useEffect(() => {
    if (user) {
      fetchEntries()
      fetchReadingHistory()
    }
  }, [user])

  const fetchEntries = async () => {
    try {
      const response = await api.get('/journal')
      setEntries(response.data)
    } catch (error) {
      console.error("Failed to fetch entries:", error)
    }
  }

  const fetchReadingHistory = async () => {
    try {
      const response = await api.get('/quotes/history')
      setReadingHistory(response.data)
      const today = getToday()
      const todayQuote = response.data.find((q) => q.date === today)
      if (todayQuote) {
        setCurrentQuote(todayQuote)
      }
    } catch (error) {
      console.error("Failed to fetch reading history:", error)
    }
  }

  // Only allow one quote per day
  const fetchRandomQuote = async () => {
    const today = getToday()
    const todayQuote = readingHistory.find((q) => q.date === today)
    if (todayQuote) {
      setCurrentQuote(todayQuote)
      return
    }

    setIsLoadingQuote(true)
    try {
      const response = await fetch("https://api.quotable.io/random?minLength=50&maxLength=200")
      const data = await response.json()

      const quoteData = {
        quoteId: data._id,
        content: data.content,
        author: data.author,
        tags: data.tags,
        date: today,
      }

      await api.post('/quotes/history', quoteData)

      // Optimistic update or refetch
      const newHistory = [quoteData, ...readingHistory].slice(0, 10)
      setReadingHistory(newHistory)
      setCurrentQuote(quoteData)
    } catch (error) {
      // Fallback quote
      const fallbackQuote = {
        content: "The present moment is the only time over which we have dominion.",
        author: "Thich Nhat Hanh",
        tags: ["mindfulness"],
        date: today,
      }
      await api.post('/quotes/history', fallbackQuote)
      setReadingHistory([fallbackQuote, ...readingHistory])
      setCurrentQuote(fallbackQuote)
    }
    setIsLoadingQuote(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedMood || !journalEntry.trim()) return

    const newEntry = {
      moodLabel: selectedMood.label,
      moodEmoji: selectedMood.emoji,
      message: journalEntry.trim(),
      date: getToday(),
    }

    try {
      const response = await api.post('/journal', newEntry)
      // Transform response to match UI expectation if needed or just prepend
      // Assuming API returns the created object
      const createdEntry = {
        ...response.data,
        mood: { emoji: response.data.moodEmoji, label: response.data.moodLabel }
      }

      setEntries([createdEntry, ...entries])

      // Reset form and show message
      setSelectedMood("")
      setJournalEntry("")
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    } catch (error) {
      console.error("Failed to save entry:", error)
      alert("Failed to save entry. Please try again.")
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-light text-gray-800 mb-4">Please log in to use your Journal</h2>
        <p className="text-gray-600">Your thoughts are safe and secure with us.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-4xl font-light text-gray-800 mb-2 sm:mb-4">Mood Journal</h2>
        <p className="text-gray-600 text-sm sm:text-base">Discover wisdom or share your thoughts in this safe space</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl p-1 sm:p-2 shadow-lg flex overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab("read")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${activeTab === "read"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:text-blue-600"
              }`}
          >
            📖 Read Journal
          </button>
          <button
            onClick={() => setActiveTab("write")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${activeTab === "write"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-600 hover:text-purple-600"
              }`}
          >
            ✍️ Write Journal
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "read" ? (
          <motion.div
            key="read"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
          >
            {/* Current Quote Display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-4 sm:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-medium text-gray-800 mb-2 sm:mb-4">Daily Inspiration</h3>
                <motion.button
                  onClick={fetchRandomQuote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoadingQuote || readingHistory.some((q) => q.date === getToday())}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                >
                  {readingHistory.some((q) => q.date === getToday())
                    ? "Come back tomorrow for more inspiration!"
                    : isLoadingQuote
                      ? "Finding wisdom..."
                      : "New Inspiration"}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {currentQuote && (
                  <motion.div
                    key={currentQuote.id || currentQuote.quoteId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6"
                  >
                    <div className="text-2xl text-blue-600 mb-4 text-center">✨</div>
                    <blockquote className="text-lg text-gray-800 leading-relaxed italic mb-4">
                      &quot;{currentQuote.content}&quot;
                    </blockquote>
                    <div className="text-right">
                      <cite className="text-gray-600 font-medium">— {currentQuote.author}</cite>
                    </div>
                    {currentQuote.tags && currentQuote.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {currentQuote.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reading History */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-4">Recent Readings</h3>
              <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {readingHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your reading history will appear here</p>
                ) : (
                  readingHistory.map((quote) => (
                    <motion.div
                      key={quote.id || quote.quoteId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setCurrentQuote(quote)}
                    >
                      <p className="text-gray-700 text-sm leading-relaxed mb-2 line-clamp-2">
                        &quot;{quote.content.substring(0, 100)}...&quot;
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">— {quote.author}</span>
                        <span className="text-xs text-gray-400">{quote.date}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="write"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
          >
            {/* Journal Entry Form */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">How are you feeling?</label>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {moods.map((mood) => (
                      <motion.button
                        key={mood.label}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood)}
                        className={`p-2 sm:p-3 rounded-xl text-xl sm:text-2xl transition-all duration-200 ${selectedMood.label === mood.label
                            ? "bg-purple-100 ring-2 ring-purple-400"
                            : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        title={mood.label}
                      >
                        {mood.emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">What&apos;s on your mind?</label>
                  <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Share your thoughts, feelings, or what happened today..."
                    className="w-full p-3 sm:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-sm sm:text-base"
                    rows={4}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedMood || !journalEntry.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                >
                  Save Entry
                </motion.button>
              </form>

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center"
                  >
                    <p className="text-green-800 font-medium">You are safe here ✨</p>
                    <p className="text-green-600 text-sm">Your entry has been saved</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Past Entries */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-4">Your Journey</h3>
              <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your journal entries will appear here</p>
                ) : (
                  entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{entry.moodEmoji || (entry.mood && entry.mood.emoji)}</span>
                          <span className="text-sm font-medium text-gray-600">{entry.moodLabel || (entry.mood && entry.mood.label)}</span>
                        </div>
                        <span className="text-xs text-gray-400">{entry.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{entry.message}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
