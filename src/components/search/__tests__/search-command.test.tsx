import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchCommand } from '../search-command'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

describe('SearchCommand', () => {
  const articles = [
    { title: 'React Tutorial', slug: 'react-tutorial', date: '2024-01-01' },
    { title: 'TypeScript Guide', slug: 'typescript-guide', date: '2024-01-02' },
    { title: 'Next.js Basics', slug: 'nextjs-basics', date: '2024-01-03' },
  ]

  beforeEach(() => {
    mockPush.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render the search button', () => {
    render(<SearchCommand articles={articles} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should show search icon', () => {
    const { container } = render(<SearchCommand articles={articles} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should show keyboard shortcut hint', () => {
    render(<SearchCommand articles={articles} />)
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('should open dialog when clicking search button', async () => {
    render(<SearchCommand articles={articles} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByPlaceholderText('搜尋文章標題...')).toBeInTheDocument()
  })

  it('should show all articles in the dialog', async () => {
    render(<SearchCommand articles={articles} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByText('React Tutorial')).toBeInTheDocument()
    expect(screen.getByText('TypeScript Guide')).toBeInTheDocument()
    expect(screen.getByText('Next.js Basics')).toBeInTheDocument()
  })

  it('should navigate to article when selecting', async () => {
    render(<SearchCommand articles={articles} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    const article = screen.getByText('React Tutorial')
    await userEvent.click(article)

    expect(mockPush).toHaveBeenCalledWith('/tech-page/react-tutorial')
  })

  it('should open dialog with Cmd+K shortcut', async () => {
    render(<SearchCommand articles={articles} />)

    // Simulate Cmd+K
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('搜尋文章標題...')).toBeInTheDocument()
    })
  })

  it('should open dialog with Ctrl+K shortcut', async () => {
    render(<SearchCommand articles={articles} />)

    // Simulate Ctrl+K
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('搜尋文章標題...')).toBeInTheDocument()
    })
  })

  it('should close dialog and toggle with shortcut', async () => {
    render(<SearchCommand articles={articles} />)

    // Open dialog
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('搜尋文章標題...')).toBeInTheDocument()
    })

    // Toggle to close
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('搜尋文章標題...')).not.toBeInTheDocument()
    })
  })

  it('should show empty state when no results', async () => {
    render(<SearchCommand articles={[]} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    // Type something that doesn't match
    const input = screen.getByPlaceholderText('搜尋文章標題...')
    await userEvent.type(input, 'nonexistent')

    expect(screen.getByText('找不到相關文章')).toBeInTheDocument()
  })

  it('should filter articles based on input', async () => {
    render(<SearchCommand articles={articles} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    const input = screen.getByPlaceholderText('搜尋文章標題...')
    await userEvent.type(input, 'React')

    // Only React Tutorial should be visible (cmdk filters automatically)
    expect(screen.getByText('React Tutorial')).toBeInTheDocument()
  })

  it('should have group heading', async () => {
    render(<SearchCommand articles={articles} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(screen.getByText('文章')).toBeInTheDocument()
  })

  it('should close dialog after selecting article', async () => {
    render(<SearchCommand articles={articles} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)

    const article = screen.getByText('React Tutorial')
    await userEvent.click(article)

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('搜尋文章標題...')).not.toBeInTheDocument()
    })
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = render(<SearchCommand articles={articles} />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )

    removeEventListenerSpy.mockRestore()
  })
})
