import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '../article-card'

describe('ArticleCard', () => {
  const defaultProps = {
    title: '測試文章標題',
    date: '2024-01-15',
    slug: 'test-article',
  }

  it('should render the article title', () => {
    render(<ArticleCard {...defaultProps} />)
    expect(screen.getByText('測試文章標題')).toBeInTheDocument()
  })

  it('should format the date correctly', () => {
    render(<ArticleCard {...defaultProps} />)
    // dayjs format: YYYY-MM-DD ddd
    expect(screen.getByText('2024-01-15 Mon')).toBeInTheDocument()
  })

  it('should have correct link href', () => {
    render(<ArticleCard {...defaultProps} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tech-page/test-article')
  })

  it('should render with different dates', () => {
    render(<ArticleCard {...defaultProps} date="2023-12-25" />)
    expect(screen.getByText('2023-12-25 Mon')).toBeInTheDocument()
  })

  it('should render with special characters in title', () => {
    render(
      <ArticleCard
        {...defaultProps}
        title="React & TypeScript: 最佳實踐"
      />
    )
    expect(screen.getByText('React & TypeScript: 最佳實踐')).toBeInTheDocument()
  })

  it('should render within a Card component', () => {
    const { container } = render(<ArticleCard {...defaultProps} />)
    // Card component has a specific className pattern
    expect(container.querySelector('.transition-colors')).toBeInTheDocument()
  })
})
