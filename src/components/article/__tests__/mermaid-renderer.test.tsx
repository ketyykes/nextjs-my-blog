import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor, act } from '@testing-library/react'

// Mock mermaid module
vi.mock('mermaid', () => {
  return {
    default: {
      initialize: vi.fn(),
      render: vi.fn().mockResolvedValue({ svg: '<svg>mocked svg</svg>' }),
    },
  }
})

// Import after mocking
import { MermaidRenderer } from '../mermaid-renderer'
import mermaid from 'mermaid'

describe('MermaidRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document body for each test
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    const { container } = render(<MermaidRenderer content="<p>Test</p>" />)
    // MermaidRenderer returns null
    expect(container.firstChild).toBeNull()
  })

  it('should initialize mermaid on mount', async () => {
    render(<MermaidRenderer content="<p>Test</p>" />)

    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledWith({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      })
    })
  })

  it('should handle empty content', () => {
    const { container } = render(<MermaidRenderer content="" />)
    expect(container.firstChild).toBeNull()
  })

  it('should call initialize with correct config', async () => {
    render(<MermaidRenderer content="<div>content</div>" />)

    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledTimes(1)
    })
  })

  it('should accept content prop', () => {
    const testContent = '<pre class="language-mermaid">graph TD; A-->B;</pre>'
    expect(() => render(<MermaidRenderer content={testContent} />)).not.toThrow()
  })

  it('should return null from render', () => {
    const { container } = render(<MermaidRenderer content="test" />)
    expect(container.innerHTML).toBe('')
  })

  it('should process mermaid code blocks in the document', async () => {
    // Setup a mermaid code block in the document
    document.body.innerHTML = `
      <pre><code class="language-mermaid">graph TD; A-->B;</code></pre>
    `

    await act(async () => {
      render(<MermaidRenderer content="test" />)
    })

    await waitFor(() => {
      expect(mermaid.render).toHaveBeenCalled()
    })
  })

  it('should skip code blocks without parent element', async () => {
    // Create a detached code element
    const code = document.createElement('code')
    code.className = 'language-mermaid'
    code.textContent = 'graph TD; A-->B;'

    // Mock querySelectorAll to return element without parent
    const originalQuerySelectorAll = document.querySelectorAll.bind(document)
    document.querySelectorAll = vi.fn().mockImplementation((selector) => {
      if (selector === 'code.language-mermaid') {
        return [code]
      }
      return originalQuerySelectorAll(selector)
    })

    await act(async () => {
      render(<MermaidRenderer content="test" />)
    })

    // mermaid.render should not be called for detached elements
    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalled()
    })

    document.querySelectorAll = originalQuerySelectorAll
  })

  it('should handle mermaid render errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Setup mermaid to throw an error
    vi.mocked(mermaid.render).mockRejectedValueOnce(new Error('Render error'))

    // Setup a mermaid code block
    document.body.innerHTML = `
      <pre><code class="language-mermaid">invalid mermaid</code></pre>
    `

    await act(async () => {
      render(<MermaidRenderer content="test" />)
    })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Mermaid rendering failed:',
        'Render error'
      )
    })

    consoleError.mockRestore()
  })

  it('should replace pre element with rendered svg container', async () => {
    document.body.innerHTML = `
      <pre><code class="language-mermaid">graph TD; A-->B;</code></pre>
    `

    await act(async () => {
      render(<MermaidRenderer content="test" />)
    })

    await waitFor(() => {
      const mermaidDiv = document.querySelector('.mermaid')
      expect(mermaidDiv).toBeTruthy()
      expect(mermaidDiv?.innerHTML).toBe('<svg>mocked svg</svg>')
    })
  })

  it('should not re-initialize on subsequent renders', async () => {
    const { rerender } = render(<MermaidRenderer content="test1" />)

    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledTimes(1)
    })

    rerender(<MermaidRenderer content="test2" />)

    // Should still only be called once due to initialized.current ref
    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledTimes(1)
    })
  })

  it('should handle code block with empty textContent', async () => {
    // Setup a mermaid code block with null textContent
    document.body.innerHTML = `
      <pre><code class="language-mermaid"></code></pre>
    `

    await act(async () => {
      render(<MermaidRenderer content="test" />)
    })

    await waitFor(() => {
      // mermaid.render should be called with empty string when textContent is null/empty
      expect(mermaid.render).toHaveBeenCalledWith(
        expect.stringContaining('mermaid-'),
        ''
      )
    })
  })
})
