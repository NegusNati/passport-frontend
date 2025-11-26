import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

const MARKDOWN_SHORTCUTS = [
  { syntax: '# ', description: 'Heading 1' },
  { syntax: '## ', description: 'Heading 2' },
  { syntax: '### ', description: 'Heading 3' },
  { syntax: '**bold**', description: 'Bold text' },
  { syntax: '*italic*', description: 'Italic text' },
  { syntax: '`code`', description: 'Inline code' },
  { syntax: '~~strikethrough~~', description: 'Strikethrough text' },
  { syntax: '- ', description: 'Bullet list' },
  { syntax: '1. ', description: 'Numbered list' },
  { syntax: '> ', description: 'Blockquote' },
  { syntax: '[text](url)', description: 'Link' },
  { syntax: '![alt](url)', description: 'Image' },
  { syntax: '[video](url)', description: 'Video (custom syntax)' },
]

export function MarkdownHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="hover:bg-muted rounded p-2"
        aria-label="Markdown shortcuts help"
        aria-expanded={isOpen}
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="bg-popover text-popover-foreground absolute top-full right-0 z-50 mt-1 w-72 rounded-md border p-4 shadow-lg"
          role="tooltip"
        >
          <h3 className="mb-3 text-sm font-semibold">Markdown Shortcuts</h3>
          <div className="space-y-2 text-xs">
            {MARKDOWN_SHORTCUTS.map((item, index) => (
              <div key={index} className="flex items-start justify-between gap-3">
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono">{item.syntax}</code>
                <span className="text-muted-foreground flex-1 text-right">{item.description}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 border-t pt-2 text-xs">
            Type these shortcuts while editing to format text instantly.
          </p>
        </div>
      )}
    </div>
  )
}
