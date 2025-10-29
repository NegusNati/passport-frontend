import './lexical.css'

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import DOMPurify from 'isomorphic-dompurify'
import {
  $getRoot,
  $insertNodes,
  type EditorState,
  type LexicalEditor as LexicalEditorType,
} from 'lexical'
import { useEffect } from 'react'

import { createEditorConfig } from '@/shared/lib/lexical/initial-config'
import { PASSPORT_TRANSFORMERS } from '@/shared/lib/lexical/markdown-transformers'

import { ImagesPlugin } from './ImagesPlugin'
import { TabIndentationPlugin } from './TabIndentationPlugin'
import { ToolbarPlugin } from './ToolbarPlugin'

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
    }
  },
]

function InitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!html) return

    editor.update(() => {
      const parser = new DOMParser()
      const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'code',
          'pre',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'a',
          'blockquote',
          'img',
          'video',
          'source',
        ],
        ALLOWED_ATTR: [
          'href',
          'rel',
          'target',
          'src',
          'alt',
          'width',
          'height',
          'controls',
          'preload',
        ],
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

type LexicalEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function LexicalEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
}: LexicalEditorProps) {
  const initialConfig = {
    ...createEditorConfig('article-editor', true),
    editorState: null,
  }

  const handleChange = (editorState: EditorState, editor: LexicalEditorType) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor)
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          'p',
          'br',
          'strong',
          'em',
          'u',
          's',
          'code',
          'pre',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'ul',
          'ol',
          'li',
          'a',
          'blockquote',
          'img',
          'video',
          'source',
        ],
        ALLOWED_ATTR: [
          'href',
          'rel',
          'target',
          'src',
          'alt',
          'width',
          'height',
          'controls',
          'preload',
        ],
        ALLOW_DATA_ATTR: false,
        ADD_URI_SAFE_ATTR: ['src'],
      })
      onChange(sanitized)
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border-input bg-background relative rounded-md border">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="lexical-editor min-h-[240px] resize-none overflow-auto px-4 py-3 text-sm outline-none" />
            }
            placeholder={
              <div className="text-muted-foreground pointer-events-none absolute top-3 left-4 text-sm">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <MarkdownShortcutPlugin transformers={PASSPORT_TRANSFORMERS} />
          <ImagesPlugin />
          <TabIndentationPlugin />
          <OnChangePlugin onChange={handleChange} />
          <InitialContentPlugin html={value} />
        </div>
      </div>
    </LexicalComposer>
  )
}
