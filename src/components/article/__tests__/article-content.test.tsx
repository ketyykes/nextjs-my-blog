import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleContent } from '../article-content'

// Mock mermaid-renderer
vi.mock('../mermaid-renderer', () => ({
  MermaidRenderer: ({ content }: { content: string }) => (
    <div data-testid="mermaid-renderer" data-content={content} />
  ),
}))

describe('ArticleContent', () => {
  it('should render HTML content', () => {
    const html = '<p>This is test content</p>'
    render(<ArticleContent html={html} />)
    expect(screen.getByText('This is test content')).toBeInTheDocument()
  })

  it('should render the MermaidRenderer component', () => {
    const html = '<p>Content with mermaid</p>'
    render(<ArticleContent html={html} />)
    expect(screen.getByTestId('mermaid-renderer')).toBeInTheDocument()
  })

  it('should pass HTML content to MermaidRenderer', () => {
    const html = '<code class="language-mermaid">graph TD</code>'
    render(<ArticleContent html={html} />)
    const mermaidRenderer = screen.getByTestId('mermaid-renderer')
    expect(mermaidRenderer).toHaveAttribute('data-content', html)
  })

  it('should render complex HTML structure', () => {
    const html = `
      <h1>Title</h1>
      <p>Paragraph 1</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `
    render(<ArticleContent html={html} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should handle empty HTML', () => {
    const { container } = render(<ArticleContent html="" />)
    expect(screen.getByTestId('mermaid-renderer')).toBeInTheDocument()
    // The div should exist but be empty
    expect(container.querySelector('div[data-testid="mermaid-renderer"] + div')).toBeEmptyDOMElement()
  })

  it('should render code blocks', () => {
    const html = '<pre><code class="language-javascript">const x = 1;</code></pre>'
    render(<ArticleContent html={html} />)
    expect(screen.getByText('const x = 1;')).toBeInTheDocument()
  })
})
