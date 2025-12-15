"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, ChevronUp } from "lucide-react"

const SONGS = [
  {
    trackName: "Samay Samjhayega",
    src: "/Samay Samjhayega.mp4",
  },
  {
    trackName: "Tum Prem ho",
    src: "/Tum Prem Ho.mp4",
  },
  {
    trackName: "Namo Namo",
    src: "/Namo Namo.mp4",
  }
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [volume, setVolume] = useState(15)
  const [isDocked, setIsDocked] = useState(false)
  const [showArrow, setShowArrow] = useState(false)
  const playerRef = useRef(null)
  const audioRef = useRef(null)

  // Move player to docked position after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setIsDocked(true), 1000)
    setShowArrow(true)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    // Don't pause or reset currentTime here, just let the audio src change
    // Play will be handled in onLoadedMetadata if isPlaying is true
    // eslint-disable-next-line
  }, [currentSongIndex])

  const handleLoadedMetadata = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
  }

  // Hide player when clicking outside
  useEffect(() => {
    if (!isDocked) {
      const handleClick = (e) => {
        if (playerRef.current && !playerRef.current.contains(e.target)) {
          setIsDocked(true)
        }
      }
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }
  }, [isDocked])

  const onPlayPause = () => {
    setIsPlaying(prev => {
      const next = !prev
      if (audioRef.current) {
        if (next) audioRef.current.play()
        else audioRef.current.pause()
      }
      return next
    })
  }

  const playNext = () => {
    setCurrentSongIndex(i => {
      const nextIndex = i < SONGS.length - 1 ? i + 1 : 0
      return nextIndex
    })
    setIsPlaying(true)
  }

  const playPrev = () => {
    setCurrentSongIndex(i => {
      const prevIndex = i > 0 ? i - 1 : SONGS.length - 1
      return prevIndex
    })
    setIsPlaying(true)
  }

  const handleEnded = () => {
    playNext()
  }

  // Animation variants for sliding up/down
  const playerVariants = {
    docked: {
      y: 120,
      opacity: 0,
      transition: { type: "spring", stiffness: 120, damping: 32, duration: 0.6, ease: "easeInOut" }
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 32, duration: 0.6, ease: "easeInOut" }
    }
  }

  return (
    <>
      {/* Arrow Button */}
      {showArrow && isDocked && (
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          onClick={() => setIsDocked(false)}
          className="fixed bottom-2 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-pink-100 p-2 flex items-center justify-center"
          style={{ width: 44, height: 44 }}
          aria-label="Show music player"
        >
          <ChevronUp className="w-6 h-6 text-pink-500" />
        </motion.button>
      )}

      {/* Music Player Controls */}
      <AnimatePresence>
        {!isDocked && (
          <motion.div
            key="music-player"
            initial="docked"
            animate="visible"
            exit="docked"
            variants={playerVariants}
            // Centered on mobile, right on desktop
            className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-50"
            ref={playerRef}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-pink-100 min-w-[90vw] max-w-xs sm:min-w-[340px]">
              <div className="flex items-center space-x-2">
                <button
                  onClick={playPrev}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-pink-500"
                  title="Previous"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={onPlayPause}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center text-white"
                  style={{ minWidth: 48, minHeight: 48 }}
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
                </button>
                <button
                  onClick={playNext}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-pink-500"
                  title="Next"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsMuted(m => !m)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-pink-500"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-20 accent-pink-400"
                  title="Volume"
                  disabled={isMuted}
                />
                {/* Song name in a fixed-width container, truncates if too long */}
                <div className="flex-1 min-w-0 pl-2">
                  <span className="block text-base font-semibold text-gray-600 truncate text-right max-w-[110px] sm:max-w-[140px]">
                    {SONGS[currentSongIndex]?.trackName || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-mounted audio element */}
      <audio
        ref={audioRef}
        src={SONGS[currentSongIndex].src}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay={isPlaying}
        muted={isMuted}
        style={{ display: "none" }}
      />
    </>
  )
}
