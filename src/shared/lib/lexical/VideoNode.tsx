import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'
import type { ReactNode } from 'react'

export interface VideoPayload {
  src: string
  width?: number
  height?: number
  key?: NodeKey
}

export type SerializedVideoNode = Spread<
  {
    src: string
    width?: number
    height?: number
  },
  SerializedLexicalNode
>

function convertVideoElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLVideoElement) {
    const { src, width, height } = domNode
    const node = $createVideoNode({ src, width, height })
    return { node }
  }
  return null
}

export class VideoNode extends DecoratorNode<ReactNode> {
  __src: string
  __width?: number
  __height?: number

  static getType(): string {
    return 'video'
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__width, node.__height, node.__key)
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { src, width, height } = serializedNode
    return $createVideoNode({ src, width, height })
  }

  exportJSON(): SerializedVideoNode {
    return {
      src: this.getSrc(),
      width: this.__width,
      height: this.__height,
      type: 'video',
      version: 1,
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: () => ({
        conversion: convertVideoElement,
        priority: 0,
      }),
    }
  }

  constructor(src: string, width?: number, height?: number, key?: NodeKey) {
    super(key)
    this.__src = src
    this.__width = width
    this.__height = height
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('video')
    element.setAttribute('src', this.__src)
    element.setAttribute('controls', 'true')
    if (this.__width) {
      element.setAttribute('width', String(this.__width))
    }
    if (this.__height) {
      element.setAttribute('height', String(this.__height))
    }
    return { element }
  }

  getSrc(): string {
    return this.__src
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.video
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(): ReactNode {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={this.__src}
        controls
        width={this.__width}
        height={this.__height}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    )
  }
}

export function $createVideoNode({ src, width, height, key }: VideoPayload): VideoNode {
  return $applyNodeReplacement(new VideoNode(src, width, height, key))
}

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
  return node instanceof VideoNode
}
