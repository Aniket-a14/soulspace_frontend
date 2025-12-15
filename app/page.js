"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../utils/api"
import WelcomePage from "../components/WelcomePage"
import Header from "../components/Header"
import MoodJournal from "../components/MoodJournal"
import PeaceGarden from "../components/PeaceGarden"
import PeaceJar from "../components/PeaceJar"
import Footer from "../components/Footer"
import MusicPlayer from "@/components/MusicPlayer"
import Link from "next/link"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [dayCount, setDayCount] = useState(1)
  const [quoteOfTheDay, setQuoteOfTheDay] = useState("")
  const { user, loading } = useAuth()

  useEffect(() => {
    // Load quote of the day (UI concern, can remain frontend-driven or be moved to API)
    // For now, keeping the logic but using User Stats for day count
    const loadQuotes = async () => {
      try {
        const [peaceQuotesRes, dailyQuoteRes] = await Promise.all([
          fetch("/peace-quotes.json"),
          fetch("/quote-of-the-day.json")
        ])
        const peaceData = await peaceQuotesRes.json()
        const dailyData = await dailyQuoteRes.json()

        // Calculate effective day count for quotes
        const count = user?.stats?.dayCount || 1
        setDayCount(count)

        // Set quote based on day count
        const quoteIndex = (count - 1) % dailyData.quotes.length
        setQuoteOfTheDay(dailyData.quotes[quoteIndex])

      } catch (error) {
        console.error("Error loading quotes", error)
        setQuoteOfTheDay("Start each day with a positive thought.")
      }
    }

    if (!loading) {
      loadQuotes()

      // Check for new day visit if user is logged in
      if (user) {
        updateUserStats()
      }
    }
  }, [user, loading])

  const updateUserStats = async () => {
    try {
      const today = new Date().toDateString()
      const lastVisit = user?.stats?.lastVisited ? new Date(user.stats.lastVisited).toDateString() : null

      if (lastVisit !== today) {
        const newDayCount = (user?.stats?.dayCount || 0) + 1
        // Call API to update
        // Note: Backend might handle increment logic or we send specific values. 
        // Controller `updateStats` accepts `dayCount` and `lastVisited`.
        await api.put('/user/stats', {
          dayCount: newDayCount,
          lastVisited: new Date().toISOString()
        })
        setDayCount(newDayCount)
      }
    } catch (err) {
      console.error("Failed to update stats", err)
    }
  }

  const handleEnterApp = () => {
    setShowWelcome(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50">Loading SoulSpace...</div>
  }

  // If not logged in, show only Welcome and Login prompt (or specific restricted view)
  // But requirement says "replace LocalStorage with API", implying we might expect auth.
  // We can let them see the landing page but MoodJournal blocks access internally.

  if (showWelcome) {
    return <WelcomePage dayCount={dayCount} quoteOfTheDay={quoteOfTheDay} onEnter={handleEnterApp} user={user} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      <MusicPlayer />

      <main className="container mx-auto px-4 py-8 space-y-16">
        {!user && (
          <div className="text-center p-8 bg-white/50 rounded-2xl shadow-sm">
            <h2 className="text-xl text-gray-700 mb-4">Join SoulSpace to track your journey</h2>
            <div className="space-x-4">
              <Link href="/login" className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">Log In</Link>
              <Link href="/signup" className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition">Sign Up</Link>
            </div>
          </div>
        )}

        <section id="mood-journal">
          <MoodJournal />
        </section>

        <section id="peace-garden">
          <PeaceGarden dayCount={dayCount} />
        </section>

        <section id="peace-jar">
          <PeaceJar />
        </section>
      </main>

      <Footer quoteOfTheDay={quoteOfTheDay} />
    </div>
  )
}
