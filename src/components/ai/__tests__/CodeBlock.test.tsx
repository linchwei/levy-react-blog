import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CodeBlock } from '../CodeBlock'

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('should render code with language label', () => {
    render(<CodeBlock code="const x = 1" language="javascript" />)
    expect(screen.getByText('javascript')).toBeInTheDocument()
  })

  it('should render code without language', () => {
    render(<CodeBlock code="some text" />)
    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('should copy code when copy button is clicked', async () => {
    const code = 'const x = 1'
    render(<CodeBlock code={code} language="javascript" />)

    const copyButton = screen.getByText('复制')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code)
    })
  })

  it('should show copied state after copying', async () => {
    render(<CodeBlock code="const x = 1" language="javascript" />)

    const copyButton = screen.getByText('复制')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByText('已复制')).toBeInTheDocument()
    })
  })

  it('should render in dark mode', () => {
    render(<CodeBlock code="const x = 1" language="javascript" isDark />)
    expect(screen.getByText('javascript')).toBeInTheDocument()
  })

  it('should handle unsupported languages gracefully', () => {
    render(<CodeBlock code="some code" language="unsupported-language" />)
    expect(screen.getByText('unsupported-language')).toBeInTheDocument()
  })

  it('should show line numbers', () => {
    const code = 'line1\nline2\nline3'
    render(<CodeBlock code={code} language="javascript" />)
    // SyntaxHighlighter should render with line numbers
    expect(screen.getByText('line1')).toBeInTheDocument()
  })

  it('should handle copy error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Copy failed')),
      },
    })

    render(<CodeBlock code="const x = 1" language="javascript" />)
    const copyButton = screen.getByText('复制')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })
})
