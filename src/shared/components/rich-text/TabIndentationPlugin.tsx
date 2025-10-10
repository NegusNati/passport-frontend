import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, INDENT_CONTENT_COMMAND, KEY_TAB_COMMAND, OUTDENT_CONTENT_COMMAND } from 'lexical'
import { useEffect } from 'react'

export function TabIndentationPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        event.preventDefault()

        if (event.shiftKey) {
          // Shift+Tab = outdent
          return editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
        } else {
          // Tab = indent
          return editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
        }
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}
