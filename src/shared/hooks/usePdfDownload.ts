import type { RefObject } from 'react'
import { useCallback, useState } from 'react'

import { addColorFallbackStyles, normalizeOklchColors } from '../lib/color-utils'

export interface PdfDownloadOptions {
  /** Element reference to capture */
  elementRef: RefObject<HTMLElement | null>
  /** Filename without extension */
  filename: string
  /** Quality scale multiplier (default: 3) */
  scale?: number
  /** Show error alerts (default: true) */
  showAlerts?: boolean
}

export interface PdfDownloadResult {
  /** Trigger the PDF download */
  download: () => Promise<void>
  /** Whether download is in progress */
  isDownloading: boolean
  /** Last error if any */
  error: Error | null
}

/**
 * Hook for generating high-quality PDF downloads from DOM elements
 * Handles OKLCH color conversion and optimizes canvas rendering
 */
export function usePdfDownload({
  elementRef,
  filename,
  scale = 3,
  showAlerts = true,
}: PdfDownloadOptions): PdfDownloadResult {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const download = useCallback(async () => {
    const element = elementRef.current
    if (!element || isDownloading) return

    setIsDownloading(true)
    setError(null)

    let cleanup: (() => void) | null = null

    try {
      // Dynamic imports for code splitting
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      // Pre-process colors before capture
      cleanup = normalizeOklchColors(element)

      // Capture element with high quality settings
      const canvas = await html2canvas(element, {
        scale,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        foreignObjectRendering: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        ignoreElements: (el) =>
          el instanceof Element &&
          (el.hasAttribute('data-pdf-ignore') || el.closest('[data-pdf-ignore]') !== null),
        onclone: (clonedDoc) => {
          // Add fallback styles to cloned document
          addColorFallbackStyles(clonedDoc)

          // Ensure fonts are loaded
          const fontLinks = document.querySelectorAll('link[rel="stylesheet"]')
          fontLinks.forEach((link) => {
            const clonedLink = link.cloneNode(true)
            clonedDoc.head.appendChild(clonedLink)
          })
        },
      })

      // Generate PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png', 1.0)
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Calculate PDF dimensions (convert to mm for better quality)
      const pdfWidth = imgWidth * 0.264583 // px to mm conversion
      const pdfHeight = imgHeight * 0.264583

      const orientation = imgWidth >= imgHeight ? 'landscape' : 'portrait'

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
        compress: true,
      })

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')

      // Sanitize filename
      const sanitizedFilename = filename
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')

      pdf.save(`${sanitizedFilename || 'download'}.pdf`)
    } catch (err) {
      const downloadError = err instanceof Error ? err : new Error('Failed to generate PDF')
      setError(downloadError)
      console.error('PDF download failed:', downloadError)

      if (showAlerts) {
        alert('Failed to generate PDF. Please try again or contact support if the issue persists.')
      }
    } finally {
      // Restore original styles
      cleanup?.()
      setIsDownloading(false)
    }
  }, [elementRef, filename, scale, showAlerts, isDownloading])

  return {
    download,
    isDownloading,
    error,
  }
}
