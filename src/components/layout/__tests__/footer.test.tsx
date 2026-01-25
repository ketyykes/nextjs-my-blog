import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../footer'

describe('Footer', () => {
  const originalDate = global.Date

  beforeEach(() => {
    // Mock Date to return a consistent year
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
    global.Date = originalDate
  })

  it('should render the footer element', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should display the correct copyright year', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2024/)).toBeInTheDocument()
  })

  it('should display the site name', () => {
    render(<Footer />)
    expect(screen.getByText(/水土曜來了/)).toBeInTheDocument()
  })

  it('should display all rights reserved text', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('border-t')
    expect(footer).toHaveClass('bg-background')
  })

  it('should have centered text', () => {
    const { container } = render(<Footer />)
    const textDiv = container.querySelector('.text-center')
    expect(textDiv).toBeInTheDocument()
  })

  it('should have muted text color', () => {
    const { container } = render(<Footer />)
    const textDiv = container.querySelector('.text-muted-foreground')
    expect(textDiv).toBeInTheDocument()
  })

  it('should update year when date changes', () => {
    vi.setSystemTime(new Date('2025-01-01'))
    render(<Footer />)
    expect(screen.getByText(/© 2025/)).toBeInTheDocument()
  })
})
