import { X } from 'lucide-react'
import { useMemo } from 'react'

import { Label } from '@/shared/ui/label'

type MediaUploadPreviewProps = {
  label: string
  file: File | null
  existingUrl?: string | null
  onFileChange: (file: File | null) => void
  onRemoveExisting?: () => void
  accept?: string
  id: string
}

export function MediaUploadPreview({
  label,
  file,
  existingUrl,
  onFileChange,
  onRemoveExisting,
  accept = 'image/*',
  id,
}: MediaUploadPreviewProps) {
  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    return existingUrl || null
  }, [file, existingUrl])

  const hasMedia = Boolean(previewUrl)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      {hasMedia && (
        <div className="relative mb-2 inline-block">
          <img
            src={previewUrl!}
            alt="Preview"
            className="h-32 w-auto rounded-lg border object-cover"
          />
          <button
            type="button"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
            onClick={() => {
              if (file) {
                onFileChange(null)
              } else if (onRemoveExisting) {
                onRemoveExisting()
              }
            }}
            title="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        type="file"
        id={id}
        accept={accept}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] || null
          onFileChange(selectedFile)
        }}
        className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
      />
      <p className="text-muted-foreground text-xs">PNG, JPG, GIF, WebP up to 5MB</p>
    </div>
  )
}
