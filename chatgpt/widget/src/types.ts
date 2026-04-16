export type PassportSummary = {
  id: string
  requestNumber: string
  fullName: string
  firstName: string
  middleName?: string
  lastName: string
  location: string
  publishedDate: string
  detailUrl: string
  surname: string
  givenName: string
  receiveAfterLabel: string
  pickupDays: string[]
  pickupDaysLabel: string
  pickupTimeLabel: string
  readyHeadline: string
  pickupNotice: string
  sourceLabel: string
}

export type PassportWidgetPayload = {
  kind: 'passport-widget'
  searchSummary: string
  results: PassportSummary[]
  selectedPassportId?: string
  selectedDetail?: PassportSummary
}

export type PassportDetailPayload = {
  kind: 'passport-detail'
  detail: PassportSummary
}

export type ToolPayload = PassportWidgetPayload | PassportDetailPayload

export type ToolResultEnvelope = {
  structuredContent?: ToolPayload
  _meta?: Record<string, unknown>
}

export type WidgetState = {
  selectedPassportId?: string
}

declare global {
  interface Window {
    openai?: {
      locale?: string
      toolOutput?: ToolPayload
      toolResponseMetadata?: Record<string, unknown>
      widgetState?: WidgetState
      setWidgetState?: (state: WidgetState) => void
      openExternal?: (options: { href: string; redirectUrl?: string | false }) => Promise<void>
    }
  }
}

export {}
