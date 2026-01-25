import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: function useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }
  },
  usePathname: function usePathname() {
    return '/'
  },
  useSearchParams: function useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: function Image({
    src,
    alt,
    fill,
    priority,
    unoptimized,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    priority?: boolean
    unoptimized?: boolean
    [key: string]: unknown
  }) {
    // Filter out Next.js specific props
    const filteredProps = { ...props }
    delete filteredProps.onLoad
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', {
      src,
      alt,
      'data-fill': fill ? 'true' : undefined,
      'data-priority': priority ? 'true' : undefined,
      'data-unoptimized': unoptimized ? 'true' : undefined,
      ...filteredProps,
    })
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: function Link({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) {
    return React.createElement('a', { href, ...props }, children)
  },
}))

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: function useTheme() {
    return {
      theme: 'light',
      setTheme: vi.fn(),
      resolvedTheme: 'light',
    }
  },
  ThemeProvider: function ThemeProvider({
    children,
  }: {
    children: React.ReactNode
  }) {
    return children
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function matchMedia(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  },
})

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.ResizeObserver = MockResizeObserver

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
