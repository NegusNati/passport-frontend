import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown'
import type { LexicalEditor } from 'lexical'

import { PASSPORT_TRANSFORMERS } from './markdown-transformers'

/**
 * Exports the current editor state as a Markdown string.
 * Uses custom transformers to handle ImageNode and VideoNode.
 *
 * @param editor - The Lexical editor instance
 * @returns Markdown representation of the editor content
 */
export function exportEditorStateAsMarkdown(editor: LexicalEditor): string {
  let markdown = ''
  editor.getEditorState().read(() => {
    markdown = $convertToMarkdownString(PASSPORT_TRANSFORMERS)
  })
  return markdown
}

/**
 * Imports Markdown content into the editor, replacing current content.
 * Uses custom transformers to handle image and video syntax.
 *
 * @param editor - The Lexical editor instance
 * @param markdown - The Markdown string to import
 */
export function importMarkdownToEditorState(editor: LexicalEditor, markdown: string): void {
  editor.update(() => {
    $convertFromMarkdownString(markdown, PASSPORT_TRANSFORMERS)
  })
}
