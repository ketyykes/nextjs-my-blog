import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PortfolioCard } from '../portfolio-card'

describe('PortfolioCard', () => {
  const defaultProps = {
    cardHead: 'Test Project',
    cardContent: 'This is a test project description',
    cardImageSrc: 'https://example.com/image.jpg',
    webSrc: 'https://example.com',
  }

  beforeEach(() => {
    // Mock window.open
    vi.stubGlobal('open', vi.fn())
  })

  it('should render the card title', () => {
    render(<PortfolioCard {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('should render the card content', () => {
    render(<PortfolioCard {...defaultProps} />)
    expect(screen.getByText('This is a test project description')).toBeInTheDocument()
  })

  it('should render the image', () => {
    render(<PortfolioCard {...defaultProps} />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Project')
  })

  it('should render the button when webSrc is provided', () => {
    render(<PortfolioCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /點我觀看/i })).toBeInTheDocument()
  })

  it('should not render the button when webSrc is empty', () => {
    render(<PortfolioCard {...defaultProps} webSrc="" />)
    expect(screen.queryByRole('button', { name: /點我觀看/i })).not.toBeInTheDocument()
  })

  it('should open external link when button is clicked', () => {
    render(<PortfolioCard {...defaultProps} />)
    const button = screen.getByRole('button', { name: /點我觀看/i })
    fireEvent.click(button)

    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank')
  })

  it('should render with different props', () => {
    render(
      <PortfolioCard
        cardHead="Another Project"
        cardContent="Different description"
        cardImageSrc="https://example.com/other.jpg"
        webSrc="https://other.com"
      />
    )
    expect(screen.getByText('Another Project')).toBeInTheDocument()
    expect(screen.getByText('Different description')).toBeInTheDocument()
  })

  it('should have responsive image with rounded corners', () => {
    render(<PortfolioCard {...defaultProps} />)
    const image = screen.getByRole('img')
    expect(image).toHaveClass('w-full', 'rounded-md')
  })

  it('should have centered title', () => {
    render(<PortfolioCard {...defaultProps} />)
    const title = screen.getByText('Test Project')
    expect(title).toHaveClass('text-center')
  })

  it('should have muted text for description', () => {
    const { container } = render(<PortfolioCard {...defaultProps} />)
    const description = container.querySelector('.text-muted-foreground')
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent('This is a test project description')
  })

  it('should have full width button', () => {
    render(<PortfolioCard {...defaultProps} />)
    const button = screen.getByRole('button', { name: /點我觀看/i })
    expect(button).toHaveClass('w-full')
  })

  it('should render ExternalLink icon in button', () => {
    render(<PortfolioCard {...defaultProps} />)
    // Check for svg element inside button
    const button = screen.getByRole('button', { name: /點我觀看/i })
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
