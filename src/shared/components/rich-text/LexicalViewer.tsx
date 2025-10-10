import './lexical.css'

import { $generateNodesFromDOM } from '@lexical/html'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import DOMPurify from 'isomorphic-dompurify'
import { $getRoot, $insertNodes } from 'lexical'
import { useEffect } from 'react'

import { createEditorConfig } from '@/shared/lib/lexical/initial-config'

function ContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!html) return

    editor.update(() => {
      const parser = new DOMParser()
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li',
          'a', 'blockquote',
          'img', 'video', 'source',
        ],
        ALLOWED_ATTR: ['href', 'rel', 'target', 'src', 'alt', 'width', 'height', 'controls', 'preload'],
        ALLOW_DATA_ATTR: false,
        ADD_URI_SAFE_ATTR: ['src'],
      })
      const dom = parser.parseFromString(sanitizedHtml, 'text/html')
      const nodes = $generateNodesFromDOM(editor, dom)
      const root = $getRoot()
      root.clear()
      root.select()
      $insertNodes(nodes)
    })
  }, [editor, html])

  return null
}

type LexicalViewerProps = {
  content: string
}

export function LexicalViewer({ content }: LexicalViewerProps) {
  const initialConfig = {
    ...createEditorConfig('article-viewer', false),
    editorState: null,
  }

  if (!content) {
    return <p className="text-muted-foreground">No content.</p>
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="lexical-viewer prose prose-neutral dark:prose-invert max-w-none">
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ContentPlugin html={content} />
      </div>
    </LexicalComposer>
  )
}
