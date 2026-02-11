'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { SearchCommand } from '@/components/search'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/portfolio', label: '作品集' },
  { href: '/about', label: '關於我' },
  { href: '/tech-page', label: '技術文章' },
  { href: '/photo', label: '攝影集' },
  { href: '/tags', label: '標籤' },
]

interface NavbarProps {
  articles?: Array<{ title: string; slug: string; date: string }>
}

export function Navbar({ articles }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // 使用 ref 追蹤 scroll 狀態，避免不必要的重新渲染
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const updateNavbarVisibility = useCallback(() => {
    const currentScrollY = window.scrollY

    if (isMobileMenuOpen) {
      ticking.current = false
      return
    }

    if (currentScrollY < 50) {
      setIsVisible(true)
    } else if (currentScrollY > lastScrollY.current) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    lastScrollY.current = currentScrollY
    ticking.current = false
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      // 使用 requestAnimationFrame 節流
      if (!ticking.current) {
        requestAnimationFrame(updateNavbarVisibility)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateNavbarVisibility])

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          水土曜來了
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://note.wedsatcoming.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            筆記站
          </a>
          {articles && <SearchCommand articles={articles} />}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="container mx-auto px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block py-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://note.wedsatcoming.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              筆記站
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
