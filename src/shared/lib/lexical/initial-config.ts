import type { InitialConfigType } from '@lexical/react/LexicalComposer'

import { editorNodes } from './nodes'
import { lexicalTheme } from './theme'

export function createEditorConfig(
  namespace: string,
  editable = true,
): Omit<InitialConfigType, 'editorState'> {
  return {
    namespace,
    theme: lexicalTheme,
    nodes: editorNodes,
    editable,
    onError: (error: Error) => {
      console.error('Lexical error:', error)
    },
  }
}
