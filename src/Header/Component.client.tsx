'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false)

  // Reset theme on route change
  useEffect(() => {
    setHeaderTheme(null)
    setMenuOpen(false) // close mobile menu on navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className="absolute top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-sm"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="py-4 md:py-5 flex justify-between items-center">
        <Link href="/">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <HeaderNav data={data} />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span
            className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
              menuOpen ? 'rotate-45' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-current transition duration-300 ease-in-out ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
              menuOpen ? '-rotate-45' : 'translate-y-2'
            }`}
          />
        </button>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-black shadow-xl transform transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
