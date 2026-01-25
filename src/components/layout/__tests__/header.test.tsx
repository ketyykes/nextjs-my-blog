import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../header'

// Mock the child components
vi.mock('../navbar', () => ({
  Navbar: ({ articles }: { articles?: Array<{ title: string; slug: string; date: string }> }) => (
    <nav data-testid="navbar" data-articles={articles ? JSON.stringify(articles) : undefined}>
      Navbar
    </nav>
  ),
}))

vi.mock('../banner', () => ({
  Banner: () => <div data-testid="banner">Banner</div>,
}))

describe('Header', () => {
  it('should render without crashing', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render the Navbar component', () => {
    render(<Header />)
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('should render the Banner component', () => {
    render(<Header />)
    expect(screen.getByTestId('banner')).toBeInTheDocument()
  })

  it('should pass articles to Navbar when provided', () => {
    const articles = [
      { title: 'Article 1', slug: 'article-1', date: '2024-01-01' },
      { title: 'Article 2', slug: 'article-2', date: '2024-01-02' },
    ]
    render(<Header articles={articles} />)
    const navbar = screen.getByTestId('navbar')
    expect(navbar).toHaveAttribute('data-articles', JSON.stringify(articles))
  })

  it('should render without articles prop', () => {
    render(<Header />)
    const navbar = screen.getByTestId('navbar')
    expect(navbar).not.toHaveAttribute('data-articles')
  })

  it('should have semantic header element', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('header')).toBeInTheDocument()
  })
})
