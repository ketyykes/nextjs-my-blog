import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PortfolioTabs } from '../portfolio-tabs'

// Mock the portfolio data
vi.mock('@/data/portfolio.json', () => ({
  default: {
    frontEndCardArray: [
      {
        cardHead: 'Frontend Project 1',
        cardContent: 'Frontend description 1',
        cardImageSrc: 'https://example.com/frontend1.jpg',
        webSrc: 'https://example.com/frontend1',
      },
      {
        cardHead: 'Frontend Project 2',
        cardContent: 'Frontend description 2',
        cardImageSrc: 'https://example.com/frontend2.jpg',
        webSrc: '',
      },
    ],
    backEndCardArray: [
      {
        cardHead: 'Backend Project 1',
        cardContent: 'Backend description 1',
        cardImageSrc: 'https://example.com/backend1.jpg',
        webSrc: 'https://example.com/backend1',
      },
    ],
    otherCardArray: [
      {
        cardHead: 'Other Project 1',
        cardContent: 'Other description 1',
        cardImageSrc: 'https://example.com/other1.jpg',
        webSrc: 'https://example.com/other1',
      },
    ],
  },
}))

// Mock the PortfolioCard component
vi.mock('../portfolio-card', () => ({
  PortfolioCard: function PortfolioCard({
    cardHead,
    cardContent,
  }: {
    cardHead: string
    cardContent: string
  }) {
    return (
      <div data-testid="portfolio-card">
        <h3>{cardHead}</h3>
        <p>{cardContent}</p>
      </div>
    )
  },
}))

describe('PortfolioTabs', () => {
  it('should render the tabs component', () => {
    render(<PortfolioTabs />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('should render all three tab triggers', () => {
    render(<PortfolioTabs />)
    expect(screen.getByRole('tab', { name: 'Front-end' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Backend' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Other' })).toBeInTheDocument()
  })

  it('should default to frontend tab', () => {
    render(<PortfolioTabs />)
    const frontendTab = screen.getByRole('tab', { name: 'Front-end' })
    expect(frontendTab).toHaveAttribute('data-state', 'active')
  })

  it('should show frontend projects by default', () => {
    render(<PortfolioTabs />)
    expect(screen.getByText('Frontend Project 1')).toBeInTheDocument()
    expect(screen.getByText('Frontend Project 2')).toBeInTheDocument()
  })

  it('should have inactive state for non-selected tabs', () => {
    render(<PortfolioTabs />)
    const backendTab = screen.getByRole('tab', { name: 'Backend' })
    const otherTab = screen.getByRole('tab', { name: 'Other' })
    expect(backendTab).toHaveAttribute('data-state', 'inactive')
    expect(otherTab).toHaveAttribute('data-state', 'inactive')
  })

  it('should render correct number of frontend cards', () => {
    render(<PortfolioTabs />)
    const cards = screen.getAllByTestId('portfolio-card')
    expect(cards.length).toBe(2)
  })

  it('should have full width styling', () => {
    const { container } = render(<PortfolioTabs />)
    const tabs = container.querySelector('[data-orientation="horizontal"]')
    expect(tabs).toHaveClass('w-full')
  })

  it('should have grid layout for cards', () => {
    const { container } = render(<PortfolioTabs />)
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })

  it('should have horizontal orientation', () => {
    const { container } = render(<PortfolioTabs />)
    const tabs = container.querySelector('[data-orientation]')
    expect(tabs).toHaveAttribute('data-orientation', 'horizontal')
  })
})
