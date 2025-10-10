export type MediaUploadType = 'image' | 'video'

/**
 * Convert a file to a data URL (base64 encoded)
 * @param file - The file to convert
 * @returns A promise that resolves to the data URL
 */
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to data URL'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Get image dimensions from a file
 * @param file - The image file
 * @returns A promise that resolves to width and height
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Get video dimensions from a file
 * @param file - The video file
 * @returns A promise that resolves to width and height
 */
export async function getVideoDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight })
      URL.revokeObjectURL(video.src)
    }
    video.onerror = () => {
      reject(new Error('Failed to load video'))
      URL.revokeObjectURL(video.src)
    }
    video.src = URL.createObjectURL(file)
  })
}

/**
 * Validate file type for images
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Validate file type for videos
 */
export function isValidVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
  return validTypes.includes(file.type)
}

/**
 * Validate file size (max 10MB for images, 50MB for videos)
 */
export function isValidFileSize(file: File, type: MediaUploadType): boolean {
  const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024
  return file.size <= maxSize
}
