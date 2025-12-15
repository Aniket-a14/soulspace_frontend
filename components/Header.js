"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false) // Close menu on navigation
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.h1 className="text-2xl font-light text-gray-800" whileHover={{ scale: 1.05 }}>
            <Image
              src="/logo.png"
              alt="SoulSpace Logo"
              width={40}
              height={40}
              className="inline-block mr-2"
            />
            SoulSpace
          </motion.h1>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex space-x-6">
            <button
              onClick={() => scrollToSection("mood-journal")}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Mood Journal
            </button>
            <button
              onClick={() => scrollToSection("peace-garden")}
              className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              Peace Garden
            </button>
            <button
              onClick={() => scrollToSection("peace-jar")}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Peace Jar
            </button>
            {user && (
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Hamburger for mobile */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Open menu"
            >
              {/* Hamburger Icon */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <rect y="5" width="24" height="2" rx="1" fill="#6B7280" />
                <rect y="11" width="24" height="2" rx="1" fill="#6B7280" />
                <rect y="17" width="24" height="2" rx="1" fill="#6B7280" />
              </svg>
            </button>
            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-4 top-16 bg-white rounded-xl shadow-lg py-2 w-44 z-50 flex flex-col">
                <button
                  onClick={() => scrollToSection("mood-journal")}
                  className="text-gray-700 hover:bg-purple-50 px-4 py-2 text-left"
                >
                  Mood Journal
                </button>
                <button
                  onClick={() => scrollToSection("peace-garden")}
                  className="text-gray-700 hover:bg-green-50 px-4 py-2 text-left"
                >
                  Peace Garden
                </button>
                <button
                  onClick={() => scrollToSection("peace-jar")}
                  className="text-gray-700 hover:bg-blue-50 px-4 py-2 text-left"
                >
                  Peace Jar
                </button>
                {user && (
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="text-gray-700 hover:bg-red-50 px-4 py-2 text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
