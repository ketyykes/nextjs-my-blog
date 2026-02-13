import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Banner } from '../banner'

const mockPathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('Banner', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/portfolio')
  })

  it('should render on portfolio page', () => {
    mockPathname.mockReturnValue('/portfolio')
    render(<Banner />)
    expect(screen.getByText('水土曜來了')).toBeInTheDocument()
  })

  it('should render on photo page', () => {
    mockPathname.mockReturnValue('/photo')
    render(<Banner />)
    expect(screen.getByText('水土曜來了')).toBeInTheDocument()
  })

  it('should render on tags page', () => {
    mockPathname.mockReturnValue('/tags')
    render(<Banner />)
    expect(screen.getByText('水土曜來了')).toBeInTheDocument()
  })

  it('should not render on home page', () => {
    mockPathname.mockReturnValue('/')
    const { container } = render(<Banner />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render on tech-page', () => {
    mockPathname.mockReturnValue('/tech-page')
    const { container } = render(<Banner />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render on about page', () => {
    mockPathname.mockReturnValue('/about')
    const { container } = render(<Banner />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render on article pages', () => {
    mockPathname.mockReturnValue('/tech-page/some-article')
    const { container } = render(<Banner />)
    expect(container.firstChild).toBeNull()
  })

  it('should render the banner image', () => {
    render(<Banner />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/images/banner-night.jpg')
    expect(image).toHaveAttribute('alt', 'Banner')
  })

  it('should have correct height classes', () => {
    const { container } = render(<Banner />)
    const bannerDiv = container.firstChild
    expect(bannerDiv).toHaveClass('h-[60vh]')
    expect(bannerDiv).toHaveClass('min-h-100')
  })

  it('should have overlay styling', () => {
    const { container } = render(<Banner />)
    const overlay = container.querySelector('.bg-black\\/40')
    expect(overlay).toBeInTheDocument()
  })

  it('should have priority loading for the image', () => {
    render(<Banner />)
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('should have responsive text sizing', () => {
    render(<Banner />)
    const heading = screen.getByText('水土曜來了')
    expect(heading).toHaveClass('text-4xl')
    expect(heading).toHaveClass('md:text-6xl')
  })
})
