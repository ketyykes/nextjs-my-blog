import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GiscusComments } from '../giscus-comments'

const { MockGiscus, mockUseTheme } = vi.hoisted(() => {
  const MockGiscus = (props: Record<string, unknown>) => (
    <div data-testid="giscus" {...props} />
  )
  const mockUseTheme = vi.fn()
  return { MockGiscus, mockUseTheme }
})

vi.mock('@giscus/react', () => ({
  default: MockGiscus,
}))

// Mock next/dynamic，使其直接回傳 mock 元件而非延遲載入
vi.mock('next/dynamic', () => ({
  default: () => MockGiscus,
}))

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}))

describe('GiscusComments', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
    })
  })

  it('should render the Giscus component', () => {
    render(<GiscusComments />)
    expect(screen.getByTestId('giscus')).toBeInTheDocument()
  })

  it('should have correct container styling', () => {
    const { container } = render(<GiscusComments />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('mt-12')
    expect(wrapper).toHaveClass('border-t')
    expect(wrapper).toHaveClass('pt-8')
  })

  it('should pass correct props to Giscus for light theme', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('theme', 'light')
  })

  it('should pass correct props to Giscus for dark theme', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
    })

    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('theme', 'dark')
  })

  it('should have correct repo configuration', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('repo', 'ketyykes/react-my-blog')
    expect(giscus).toHaveAttribute('repoId', 'R_kgDOG8KeJw')
  })

  it('should have correct category configuration', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('category', 'Announcements')
    expect(giscus).toHaveAttribute('categoryId', 'DIC_kwDOG8KeJ84CdyXw')
  })

  it('should have correct language setting', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('lang', 'zh-TW')
  })

  it('should have lazy loading enabled', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('loading', 'lazy')
  })

  it('should have reactions enabled', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('reactionsEnabled', '1')
  })

  it('should have input position at bottom', () => {
    render(<GiscusComments />)
    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('inputPosition', 'bottom')
  })
})
