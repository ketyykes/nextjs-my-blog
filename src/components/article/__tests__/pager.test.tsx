import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pager } from '../pager'

// Mock next/navigation with different values for different tests
const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}))

describe('Pager', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('should not render when totalPages is 1', () => {
    const { container } = render(<Pager currentPage={1} totalPages={1} />)
    expect(container.querySelector('nav')).not.toBeInTheDocument()
  })

  it('should render pagination for multiple pages', () => {
    render(<Pager currentPage={1} totalPages={5} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should show correct page numbers', () => {
    render(<Pager currentPage={1} totalPages={5} />)
    // Should show pages 1-5
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should mark current page as active', () => {
    render(<Pager currentPage={3} totalPages={5} />)
    const currentPageLink = screen.getByText('3').closest('a')
    expect(currentPageLink).toHaveAttribute('aria-current', 'page')
  })

  it('should disable previous button on first page', () => {
    render(<Pager currentPage={1} totalPages={5} />)
    const prevButton = screen.getByLabelText(/previous/i).closest('a')
    expect(prevButton).toHaveClass('pointer-events-none')
    expect(prevButton).toHaveClass('opacity-50')
  })

  it('should disable next button on last page', () => {
    render(<Pager currentPage={5} totalPages={5} />)
    const nextButton = screen.getByLabelText(/next/i).closest('a')
    expect(nextButton).toHaveClass('pointer-events-none')
    expect(nextButton).toHaveClass('opacity-50')
  })

  it('should navigate to previous page when clicking previous', () => {
    render(<Pager currentPage={3} totalPages={5} />)
    const prevButton = screen.getByLabelText(/previous/i)
    fireEvent.click(prevButton)
    expect(mockPush).toHaveBeenCalledWith('/tech-page/2')
  })

  it('should navigate to next page when clicking next', () => {
    render(<Pager currentPage={3} totalPages={5} />)
    const nextButton = screen.getByLabelText(/next/i)
    fireEvent.click(nextButton)
    expect(mockPush).toHaveBeenCalledWith('/tech-page/4')
  })

  it('should navigate to specific page when clicking page number', () => {
    render(<Pager currentPage={1} totalPages={5} />)
    const page3 = screen.getByText('3')
    fireEvent.click(page3)
    expect(mockPush).toHaveBeenCalledWith('/tech-page/3')
  })

  it('should navigate to base path for page 1', () => {
    render(<Pager currentPage={2} totalPages={5} />)
    const page1 = screen.getByText('1')
    fireEvent.click(page1)
    expect(mockPush).toHaveBeenCalledWith('/tech-page')
  })

  it('should show limited page numbers for many pages', () => {
    render(<Pager currentPage={5} totalPages={10} />)
    // Should show 5 pages centered around current page
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    // Should not show pages outside range
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('10')).not.toBeInTheDocument()
  })

  it('should not navigate previous when on first page', () => {
    render(<Pager currentPage={1} totalPages={5} />)
    const prevButton = screen.getByLabelText(/previous/i)
    fireEvent.click(prevButton)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should not navigate next when on last page', () => {
    render(<Pager currentPage={5} totalPages={5} />)
    const nextButton = screen.getByLabelText(/next/i)
    fireEvent.click(nextButton)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should preserve query string when navigating', () => {
    // Add a query parameter
    mockSearchParams.set('tag', 'react')

    render(<Pager currentPage={1} totalPages={5} />)
    const page2 = screen.getByText('2')
    fireEvent.click(page2)
    expect(mockPush).toHaveBeenCalledWith('/tech-page/2?tag=react')

    // Clean up
    mockSearchParams.delete('tag')
  })

  it('should preserve query string when navigating to page 1', () => {
    // Add a query parameter
    mockSearchParams.set('tag', 'react')

    render(<Pager currentPage={2} totalPages={5} />)
    const page1 = screen.getByText('1')
    fireEvent.click(page1)
    expect(mockPush).toHaveBeenCalledWith('/tech-page?tag=react')

    // Clean up
    mockSearchParams.delete('tag')
  })
})
