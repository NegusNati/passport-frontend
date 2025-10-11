import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, type LexicalCommand } from 'lexical'
import { useEffect } from 'react'

import { $createImageNode, type ImagePayload } from '@/shared/lib/lexical/ImageNode'
import { $createVideoNode, type VideoPayload } from '@/shared/lib/lexical/VideoNode'

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND')
export const INSERT_VIDEO_COMMAND: LexicalCommand<VideoPayload> =
  createCommand('INSERT_VIDEO_COMMAND')

export function ImagesPlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (
      !editor.hasNodes([
        // ImageNode and VideoNode are already registered in the editor config
      ])
    ) {
      throw new Error('ImagesPlugin: ImageNode or VideoNode not registered on editor')
    }

    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload)
        $insertNodes([imageNode])
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand<VideoPayload>(
      INSERT_VIDEO_COMMAND,
      (payload) => {
        const videoNode = $createVideoNode(payload)
        $insertNodes([videoNode])
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}
