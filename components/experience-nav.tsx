"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard, Heart } from "lucide-react"
import { motion } from "framer-motion"

export function ExperienceNav() {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY

      if (current < 40) {
        setShowNav(true)
      } else if (current > lastScrollY) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }

      setLastScrollY(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showNav ? 0 : -80 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-6 px-6 py-2 rounded-full 
                      backdrop-blur-xl bg-background/40 
                      border border-border/40 shadow-lg">

        {/* Back */}
        <Link
          href="/premium-gifts"
          className="p-2 rounded-full hover:bg-muted/40 transition"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
        </Link>

        {/* Branding Center */}
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary fill-primary" />
          <span className="text-sm font-semibold tracking-wide">
            Tohfaah
          </span>
        </Link>

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className="p-2 rounded-full hover:bg-muted/40 transition"
        >
          <LayoutDashboard className="h-5 w-5 text-muted-foreground hover:text-primary" />
        </Link>

      </div>
    </motion.header>
  )
}