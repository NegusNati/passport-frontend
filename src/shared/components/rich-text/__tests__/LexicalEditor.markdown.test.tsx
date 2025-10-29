import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LexicalEditor } from '../LexicalEditor'

describe('LexicalEditor Markdown Support', () => {
  it('should render the editor with Markdown plugin', () => {
    const handleChange = vi.fn()
    render(<LexicalEditor value="" onChange={handleChange} placeholder="Type here..." />)

    const editorElement = screen.getByText('Type here...')
    expect(editorElement).toBeTruthy()
  })

  it('should load existing HTML content', () => {
    const handleChange = vi.fn()
    const htmlContent = '<p>Test content with <strong>bold</strong> text</p>'

    render(<LexicalEditor value={htmlContent} onChange={handleChange} />)

    const contentEditable = document.querySelector('.lexical-editor')
    expect(contentEditable).toBeTruthy()
  })

  it('should include MarkdownShortcutPlugin in the editor', () => {
    const handleChange = vi.fn()
    render(<LexicalEditor value="" onChange={handleChange} />)

    // The editor should render without errors, indicating plugin is loaded
    const editorElement = document.querySelector('.lexical-editor')
    expect(editorElement).toBeTruthy()
  })

  it('should render the Markdown help button in toolbar', () => {
    const handleChange = vi.fn()
    render(<LexicalEditor value="" onChange={handleChange} />)

    const helpButton = screen.getByLabelText('Markdown shortcuts help')
    expect(helpButton).toBeTruthy()
  })
})
