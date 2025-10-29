import {
  CHECK_LIST,
  CODE,
  HEADING,
  LINK,
  ORDERED_LIST,
  QUOTE,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type TextMatchTransformer,
  type Transformer,
  UNORDERED_LIST,
} from '@lexical/markdown'
import type { LexicalNode, TextNode } from 'lexical'

import { $createImageNode, $isImageNode, type ImageNode } from './ImageNode'
import { $createVideoNode, $isVideoNode, type VideoNode } from './VideoNode'

// Custom transformer for ImageNode: ![alt text](url)
export const IMAGE: TextMatchTransformer = {
  dependencies: [],
  export: (node: LexicalNode) => {
    if (!$isImageNode(node)) {
      return null
    }
    const imageNode = node as ImageNode
    const altText = imageNode.getAltText()
    const src = imageNode.getSrc()
    return `![${altText}](${src})`
  },
  importRegExp: /!\[([^\]]*)\]\(([^)]+)\)/,
  regExp: /!\[([^\]]*)\]\(([^)]+)\)$/,
  replace: (textNode: TextNode, match: RegExpMatchArray) => {
    const [, altText, src] = match
    const imageNode = $createImageNode({
      altText: altText || '',
      src: src || '',
    })
    textNode.replace(imageNode)
  },
  trigger: ')',
  type: 'text-match',
}

// Custom transformer for VideoNode: [video](url)
// Non-standard syntax since Markdown has no native video support
export const VIDEO: TextMatchTransformer = {
  dependencies: [],
  export: (node: LexicalNode) => {
    if (!$isVideoNode(node)) {
      return null
    }
    const videoNode = node as VideoNode
    const src = videoNode.getSrc()
    return `[video](${src})`
  },
  importRegExp: /\[video\]\(([^)]+)\)/,
  regExp: /\[video\]\(([^)]+)\)$/,
  replace: (textNode: TextNode, match: RegExpMatchArray) => {
    const [, src] = match
    const videoNode = $createVideoNode({
      src: src || '',
    })
    textNode.replace(videoNode)
  },
  trigger: ')',
  type: 'text-match',
}

// Export combined transformers including defaults and custom ones
export const PASSPORT_TRANSFORMERS: Array<Transformer> = [
  // Block-level transformers
  HEADING,
  QUOTE,
  CODE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECK_LIST,
  // Link transformer
  LINK,
  // Text format transformers (bold, italic, inline code, strikethrough)
  ...TEXT_FORMAT_TRANSFORMERS,
  // Text match transformers
  ...TEXT_MATCH_TRANSFORMERS,
  // Custom media transformers
  IMAGE,
  VIDEO,
]
