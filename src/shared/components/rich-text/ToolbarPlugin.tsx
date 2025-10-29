import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type TextFormatType,
  UNDO_COMMAND,
} from 'lexical'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
  Video as VideoIcon,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { INSERT_IMAGE_COMMAND, INSERT_VIDEO_COMMAND } from './ImagesPlugin'
import { MarkdownHelpTooltip } from './MarkdownHelpTooltip'

const LowPriority = 1

function Divider() {
  return <div className="bg-border mx-1 h-6 w-px" />
}

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'quote'

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [blockType, setBlockType] = useState<BlockType>('paragraph')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isLink, setIsLink] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))

      const node = selection.anchor.getNode()
      const parent = node.getParent()
      setIsLink($isLinkNode(parent) || $isLinkNode(node))

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
          const type = parentList ? parentList.getListType() : element.getListType()
          setBlockType(type === 'bullet' ? 'bullet' : 'number')
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
          if (type === 'h1' || type === 'h2' || type === 'h3') {
            setBlockType(type)
          } else if (type === 'quote') {
            setBlockType('quote')
          } else {
            setBlockType('paragraph')
          }
        }
      }
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, updateToolbar])

  const formatText = useCallback(
    (format: TextFormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
    },
    [editor],
  )

  const formatHeading = useCallback(
    (headingSize: 'h1' | 'h2' | 'h3') => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(headingSize))
          }
        })
      }
    },
    [blockType, editor],
  )

  const formatQuote = useCallback(() => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }, [blockType, editor])

  const formatBulletList = useCallback(() => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }, [blockType, editor])

  const formatNumberedList = useCallback(() => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }, [blockType, editor])

  const insertLink = useCallback(() => {
    if (!isLink) {
      const url = prompt('Enter URL:')
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const insertImage = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const { fileToDataURL, getImageDimensions, isValidImageFile, isValidFileSize } =
          await import('@/shared/lib/media-upload')

        if (!isValidImageFile(file)) {
          alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
          return
        }

        if (!isValidFileSize(file, 'image')) {
          alert('Image file size must be less than 10MB')
          return
        }

        // Convert file to data URL and get dimensions
        const [dataURL, dimensions] = await Promise.all([
          fileToDataURL(file),
          getImageDimensions(file).catch(() => ({ width: undefined, height: undefined })),
        ])

        // Insert image with data URL
        const altText = file.name.replace(/\.[^/.]+$/, '') // Remove extension
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: dataURL,
          altText,
          width: dimensions.width,
          height: dimensions.height,
        })
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to insert image')
        console.error('Image insertion error:', error)
      }
    }
    input.click()
  }, [editor])

  const insertVideo = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/mp4,video/webm,video/ogg'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const { fileToDataURL, getVideoDimensions, isValidVideoFile, isValidFileSize } =
          await import('@/shared/lib/media-upload')

        if (!isValidVideoFile(file)) {
          alert('Please select a valid video file (MP4, WebM, or OGG)')
          return
        }

        if (!isValidFileSize(file, 'video')) {
          alert('Video file size must be less than 50MB')
          return
        }

        // Convert file to data URL and get dimensions
        const [dataURL, dimensions] = await Promise.all([
          fileToDataURL(file),
          getVideoDimensions(file).catch(() => ({ width: undefined, height: undefined })),
        ])

        // Insert video with data URL
        editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
          src: dataURL,
          width: dimensions.width,
          height: dimensions.height,
        })
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to insert video')
        console.error('Video insertion error:', error)
      }
    }
    input.click()
  }, [editor])

  return (
    <div className="border-border bg-muted/30 flex flex-wrap items-center gap-1 border-b p-2">
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        className="hover:bg-muted rounded p-2 disabled:opacity-30"
        aria-label="Undo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined)
        }}
        className="hover:bg-muted rounded p-2 disabled:opacity-30"
        aria-label="Redo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
        </svg>
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => formatText('bold')}
        className={`hover:bg-muted rounded p-2 ${isBold ? 'bg-muted' : ''}`}
        aria-label="Format Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => formatText('italic')}
        className={`hover:bg-muted rounded p-2 ${isItalic ? 'bg-muted' : ''}`}
        aria-label="Format Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => formatText('underline')}
        className={`hover:bg-muted rounded p-2 ${isUnderline ? 'bg-muted' : ''}`}
        aria-label="Format Underline"
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => formatText('strikethrough')}
        className={`hover:bg-muted rounded p-2 ${isStrikethrough ? 'bg-muted' : ''}`}
        aria-label="Format Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => formatText('code')}
        className={`hover:bg-muted rounded p-2 ${isCode ? 'bg-muted' : ''}`}
        aria-label="Format Code"
      >
        <Code className="h-4 w-4" />
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => formatHeading('h1')}
        className={`hover:bg-muted rounded p-2 ${blockType === 'h1' ? 'bg-muted' : ''}`}
        aria-label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => formatHeading('h2')}
        className={`hover:bg-muted rounded p-2 ${blockType === 'h2' ? 'bg-muted' : ''}`}
        aria-label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => formatHeading('h3')}
        className={`hover:bg-muted rounded p-2 ${blockType === 'h3' ? 'bg-muted' : ''}`}
        aria-label="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <Divider />

      <button
        type="button"
        onClick={formatBulletList}
        className={`hover:bg-muted rounded p-2 ${blockType === 'bullet' ? 'bg-muted' : ''}`}
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={formatNumberedList}
        className={`hover:bg-muted rounded p-2 ${blockType === 'number' ? 'bg-muted' : ''}`}
        aria-label="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={formatQuote}
        className={`hover:bg-muted rounded p-2 ${blockType === 'quote' ? 'bg-muted' : ''}`}
        aria-label="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>

      <Divider />

      <button
        type="button"
        onClick={insertLink}
        className={`hover:bg-muted rounded p-2 ${isLink ? 'bg-muted' : ''}`}
        aria-label={isLink ? 'Remove Link' : 'Insert Link'}
      >
        <LinkIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={insertImage}
        className="hover:bg-muted rounded p-2"
        aria-label="Insert Image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={insertVideo}
        className="hover:bg-muted rounded p-2"
        aria-label="Insert Video"
      >
        <VideoIcon className="h-4 w-4" />
      </button>

      <Divider />

      <MarkdownHelpTooltip />
    </div>
  )
}
