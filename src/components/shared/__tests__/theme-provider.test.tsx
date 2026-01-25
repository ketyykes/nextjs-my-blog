import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme-provider'

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <div data-testid="next-themes-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}))

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child content</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('should pass props to NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div>Content</div>
      </ThemeProvider>
    )
    const provider = screen.getByTestId('next-themes-provider')
    const props = JSON.parse(provider.getAttribute('data-props') || '{}')
    expect(props.attribute).toBe('class')
    expect(props.defaultTheme).toBe('dark')
    expect(props.enableSystem).toBe(true)
  })

  it('should render without extra props', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child1">First</div>
        <div data-testid="child2">Second</div>
      </ThemeProvider>
    )
    expect(screen.getByTestId('child1')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
  })

  it('should handle disableTransitionOnChange prop', () => {
    render(
      <ThemeProvider disableTransitionOnChange>
        <div>Content</div>
      </ThemeProvider>
    )
    const provider = screen.getByTestId('next-themes-provider')
    const props = JSON.parse(provider.getAttribute('data-props') || '{}')
    expect(props.disableTransitionOnChange).toBe(true)
  })

  it('should handle storageKey prop', () => {
    render(
      <ThemeProvider storageKey="my-theme">
        <div>Content</div>
      </ThemeProvider>
    )
    const provider = screen.getByTestId('next-themes-provider')
    const props = JSON.parse(provider.getAttribute('data-props') || '{}')
    expect(props.storageKey).toBe('my-theme')
  })
})
