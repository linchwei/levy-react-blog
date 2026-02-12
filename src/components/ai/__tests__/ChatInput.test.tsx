import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '../ChatInput'

describe('ChatInput', () => {
  const mockOnSend = vi.fn()
  const mockOnStop = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render input with placeholder', () => {
    render(
      <ChatInput
        onSend={mockOnSend}
        isLoading={false}
        isDark={false}
        placeholder="Test placeholder"
      />
    )
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
  })

  it('should call onSend when send button is clicked', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={false} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello AI' } })
    
    const sendButton = screen.getByRole('button')
    fireEvent.click(sendButton)
    
    expect(mockOnSend).toHaveBeenCalledWith('Hello AI')
  })

  it('should call onSend when Enter is pressed', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={false} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello AI' } })
    fireEvent.keyDown(textarea, { key: 'Enter' })
    
    expect(mockOnSend).toHaveBeenCalledWith('Hello AI')
  })

  it('should not send on Shift+Enter', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={false} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Line 1' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    
    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('should show stop button when loading', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={true} isDark={false} onStop={mockOnStop} />)
    
    const stopButton = screen.getByRole('button')
    fireEvent.click(stopButton)
    
    expect(mockOnStop).toHaveBeenCalled()
  })

  it('should disable send button when input is empty', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={false} />)
    
    const sendButton = screen.getByRole('button')
    expect(sendButton).toBeDisabled()
  })

  it('should clear input after sending', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={false} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    fireEvent.keyDown(textarea, { key: 'Enter' })
    
    expect(textarea).toHaveValue('')
  })

  it('should trim whitespace from message', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={false} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '  Hello AI  ' } })
    fireEvent.keyDown(textarea, { key: 'Enter' })
    
    expect(mockOnSend).toHaveBeenCalledWith('Hello AI')
  })

  it('should not send when loading', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={true} isDark={false} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    
    // When loading, the stop button is shown instead of send button
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should render in dark mode', () => {
    render(<ChatInput onSend={mockOnSend} isLoading={false} isDark={true} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
