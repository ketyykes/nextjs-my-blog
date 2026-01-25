import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Navbar } from '../navbar'

// Mock SearchCommand
vi.mock('@/components/search', () => ({
  SearchCommand: ({ articles }: { articles: Array<{ title: string; slug: string; date: string }> }) => (
    <button data-testid="search-command" data-articles-count={articles.length}>
      Search
    </button>
  ),
}))

// Mock ThemeToggle
vi.mock('@/components/shared/theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}))

const mockPathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('Navbar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/')
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('should render the logo', () => {
    render(<Navbar />)
    expect(screen.getByText('水土曜來了')).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: '首頁' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '關於我' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '技術文章' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '攝影集' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '標籤' })).toBeInTheDocument()
  })

  it('should render external link to notes', () => {
    render(<Navbar />)
    const externalLinks = screen.getAllByRole('link', { name: '筆記站' })
    expect(externalLinks[0]).toHaveAttribute('href', 'https://note.wedsatcoming.com')
    expect(externalLinks[0]).toHaveAttribute('target', '_blank')
  })

  it('should highlight current page link', () => {
    mockPathname.mockReturnValue('/tech-page')
    render(<Navbar />)
    const techPageLink = screen.getAllByRole('link', { name: '技術文章' })[0]
    expect(techPageLink).toHaveClass('text-primary')
  })

  it('should render ThemeToggle', () => {
    render(<Navbar />)
    expect(screen.getAllByTestId('theme-toggle').length).toBeGreaterThan(0)
  })

  it('should render SearchCommand when articles are provided', () => {
    const articles = [
      { title: 'Test Article', slug: 'test', date: '2024-01-01' },
    ]
    render(<Navbar articles={articles} />)
    expect(screen.getByTestId('search-command')).toBeInTheDocument()
    expect(screen.getByTestId('search-command')).toHaveAttribute('data-articles-count', '1')
  })

  it('should not render SearchCommand when no articles', () => {
    render(<Navbar />)
    expect(screen.queryByTestId('search-command')).not.toBeInTheDocument()
  })

  it('should toggle mobile menu', () => {
    render(<Navbar />)
    // Find the mobile menu button (it has Menu or X icon)
    const menuButtons = screen.getAllByRole('button')
    const mobileMenuButton = menuButtons.find(btn =>
      btn.querySelector('svg')
    )

    if (mobileMenuButton) {
      // Initially closed
      expect(screen.queryByText('首頁', { selector: '.md\\:hidden a' })).not.toBeInTheDocument()

      // Open menu
      fireEvent.click(mobileMenuButton)

      // Check mobile menu is visible - look for the mobile menu container
      const mobileMenu = document.querySelector('.md\\:hidden.border-t')
      expect(mobileMenu).toBeInTheDocument()
    }
  })

  it('should close mobile menu when clicking a link', async () => {
    render(<Navbar />)
    const menuButtons = screen.getAllByRole('button')
    const mobileMenuButton = menuButtons.find(btn =>
      btn.querySelector('svg')
    )

    if (mobileMenuButton) {
      // Open menu
      fireEvent.click(mobileMenuButton)

      // Find and click a link in mobile menu
      const mobileMenu = document.querySelector('.md\\:hidden.border-t')
      if (mobileMenu) {
        const link = mobileMenu.querySelector('a')
        if (link) {
          fireEvent.click(link)
          // Menu should close after clicking
          await waitFor(() => {
            expect(document.querySelector('.md\\:hidden.border-t')).not.toBeInTheDocument()
          })
        }
      }
    }
  })

  it('should have correct link href values', () => {
    render(<Navbar />)
    expect(screen.getAllByRole('link', { name: '首頁' })[0]).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('link', { name: '關於我' })[0]).toHaveAttribute('href', '/about')
    expect(screen.getAllByRole('link', { name: '技術文章' })[0]).toHaveAttribute('href', '/tech-page')
    expect(screen.getAllByRole('link', { name: '攝影集' })[0]).toHaveAttribute('href', '/photo')
    expect(screen.getAllByRole('link', { name: '標籤' })[0]).toHaveAttribute('href', '/tags')
  })

  it('should have fixed positioning', () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('fixed')
  })

  it('should hide on scroll down', async () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    fireEvent.scroll(window)

    await waitFor(() => {
      // First scroll sets lastScrollY
    })

    Object.defineProperty(window, 'scrollY', { value: 200, writable: true })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(nav).toHaveClass('-translate-y-full')
    })
  })

  it('should show on scroll up', async () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')

    // Scroll down first
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true })
    fireEvent.scroll(window)

    await waitFor(() => {
      // Wait for state update
    })

    // Then scroll up
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(nav).toHaveClass('translate-y-0')
    })
  })

  it('should always show when scroll position is less than 50', async () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')

    // Scroll to position less than 50
    Object.defineProperty(window, 'scrollY', { value: 30, writable: true })
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(nav).toHaveClass('translate-y-0')
    })
  })

  it('should not update visibility when mobile menu is open', async () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')
    const menuButtons = screen.getAllByRole('button')
    const mobileMenuButton = menuButtons.find(btn => btn.querySelector('svg'))

    if (mobileMenuButton) {
      // Open mobile menu
      fireEvent.click(mobileMenuButton)

      // Initial scroll position
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
      fireEvent.scroll(window)

      await waitFor(() => {
        // Nav should stay visible because menu is open
        expect(nav).toHaveClass('translate-y-0')
      })
    }
  })
})
