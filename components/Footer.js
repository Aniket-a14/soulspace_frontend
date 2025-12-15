"use client"

import { motion } from "framer-motion"
import {RiCopyrightLine} from "react-icons/ri"

export default function Footer({ quoteOfTheDay }) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-12 mt-16"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-light mb-4">Quote of the Day</h3>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <blockquote className="text-lg leading-relaxed italic">&quot;{quoteOfTheDay}&quot;</blockquote>
          </div>
          <div className="flex pt-2 items-center justify-center space-x-2 text-sm text-white/70">
            <span><RiCopyrightLine className="text-xl" /> </span>
            <span>Aniket Saha, All rights reserved.</span>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
