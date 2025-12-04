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

import { $createImageNode, $isImageNode, ImageNode } from './ImageNode'
import { $createVideoNode, $isVideoNode, VideoNode } from './VideoNode'

// Custom transformer for ImageNode: ![alt text](url)
export const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
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
  dependencies: [VideoNode],
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
// Note: we intentionally curate the transformer list instead of using
// the exported TRANSFORMERS constant so we avoid transformers that rely
// on nodes we don’t register (e.g., HorizontalRuleNode).
const BASE_TRANSFORMERS: Array<Transformer> = [
  HEADING,
  QUOTE,
  CODE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECK_LIST,
  LINK,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]

export const PASSPORT_TRANSFORMERS: Array<Transformer> = [...BASE_TRANSFORMERS, IMAGE, VIDEO]
