import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '../theme-toggle'

const mockSetTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: function useTheme() {
    return {
      setTheme: mockSetTheme,
      theme: 'light',
      resolvedTheme: 'light',
    }
  },
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('should render the toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should have accessible label', () => {
    render(<ThemeToggle />)
    expect(screen.getByText('切換主題')).toBeInTheDocument()
  })

  it('should have dropdown menu trigger attribute', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-slot', 'dropdown-menu-trigger')
  })

  it('should have initial closed state', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-state', 'closed')
  })

  it('should render sun and moon icons', () => {
    const { container } = render(<ThemeToggle />)
    // Check for svg elements (icons)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })

  it('should have ghost variant button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'ghost')
  })

  it('should have icon size', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'icon')
  })

  it('should have correct button type', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should have aria attributes for accessibility', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup', 'menu')
  })
})
