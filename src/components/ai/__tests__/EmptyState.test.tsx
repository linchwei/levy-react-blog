import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '../EmptyState'

describe('EmptyState', () => {
  const mockOnSuggestionClick = vi.fn()

  it('should render title and description', () => {
    render(<EmptyState isDark={false} />)
    expect(screen.getByText('AI 助手')).toBeInTheDocument()
    expect(screen.getByText(/我可以帮你解答技术问题/)).toBeInTheDocument()
  })

  it('should render all suggestion cards', () => {
    render(<EmptyState isDark={false} />)
    expect(screen.getByText('解释一下')).toBeInTheDocument()
    expect(screen.getByText('帮我写代码')).toBeInTheDocument()
    expect(screen.getByText('给我建议')).toBeInTheDocument()
    expect(screen.getByText('创意写作')).toBeInTheDocument()
  })

  it('should call onSuggestionClick when suggestion is clicked', () => {
    render(<EmptyState isDark={false} onSuggestionClick={mockOnSuggestionClick} />)
    
    const suggestionButton = screen.getByText('解释一下').closest('button')
    if (suggestionButton) {
      fireEvent.click(suggestionButton)
    }
    
    expect(mockOnSuggestionClick).toHaveBeenCalled()
  })

  it('should render in dark mode', () => {
    render(<EmptyState isDark={true} />)
    expect(screen.getByText('AI 助手')).toBeInTheDocument()
  })

  it('should show tips text', () => {
    render(<EmptyState isDark={false} />)
    expect(screen.getByText(/提示：支持 Markdown 格式/)).toBeInTheDocument()
  })
})
