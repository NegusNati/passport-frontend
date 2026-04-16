import { z } from 'zod'

const PASSPORT_SUMMARY_SCHEMA = z.object({
  id: z.number().int(),
  request_number: z.string(),
  first_name: z.string(),
  middle_name: z.string().nullable().optional(),
  last_name: z.string(),
  full_name: z.string(),
  location: z.string(),
  date_of_publish: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
})

const PASSPORT_LIST_RESPONSE_SCHEMA = z.object({
  data: z.array(PASSPORT_SUMMARY_SCHEMA),
  meta: z.object({
    current_page: z.number().int().min(1),
    total: z.number().int().nonnegative(),
    last_page: z.number().int().min(1),
    has_more: z.boolean(),
  }),
})

const PASSPORT_DETAIL_RESPONSE_SCHEMA = z.object({
  data: PASSPORT_SUMMARY_SCHEMA,
})

const SEARCH_INPUT_SCHEMA = z
  .object({
    query: z.string().trim().optional(),
    requestNumber: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    location: z.string().trim().optional(),
    page: z.number().int().min(1).max(10).default(1),
    pageSize: z.number().int().min(1).max(10).default(5),
  })
  .superRefine((value, ctx) => {
    const hasName =
      Boolean(value.firstName && value.firstName.length >= 2) ||
      Boolean(value.middleName && value.middleName.length >= 2) ||
      Boolean(value.lastName && value.lastName.length >= 2)

    if (!value.query && !value.requestNumber && !hasName && !value.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide a request number, name, query, or location.',
      })
    }
  })

export const CHATGPT_SEARCH_INPUT_SCHEMA = SEARCH_INPUT_SCHEMA

export type ChatGptSearchInput = z.infer<typeof SEARCH_INPUT_SCHEMA>

export type PassportSummary = {
  id: string
  requestNumber: string
  fullName: string
  firstName: string
  lastName: string
  middleName?: string
  location: string
  publishedDate: string
  detailUrl: string
}

export type PassportDetail = PassportSummary

const API_BASE_URL = (process.env.PASSPORT_API_BASE_URL || 'https://api.passport.et').replace(
  /\/$/,
  '',
)
const SITE_BASE_URL = (process.env.PASSPORT_SITE_URL || 'https://passport.et').replace(/\/$/, '')

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL)

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === '') continue
    url.searchParams.set(key, String(value))
  }

  return url
}

async function getJson(url: URL) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'passport-chatgpt-app/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Passport API request failed with HTTP ${response.status}`)
  }

  return response.json()
}

function normalizeRequestNumber(value?: string) {
  return value?.replace(/[^0-9A-Za-z]/g, '').toUpperCase().trim()
}

function toSummary(item: z.infer<typeof PASSPORT_SUMMARY_SCHEMA>): PassportSummary {
  return {
    id: String(item.id),
    requestNumber: item.request_number,
    fullName: item.full_name,
    firstName: item.first_name,
    middleName: item.middle_name ?? undefined,
    lastName: item.last_name,
    location: item.location,
    publishedDate: item.date_of_publish,
    detailUrl: `${SITE_BASE_URL}/passports/${item.id}`,
  }
}

export async function searchPassports(input: ChatGptSearchInput) {
  const parsed = SEARCH_INPUT_SCHEMA.parse(input)
  const backendPageSize = 10

  const query = buildUrl('/api/v1/passports', {
    query: parsed.query || undefined,
    request_number: normalizeRequestNumber(parsed.requestNumber),
    first_name: parsed.firstName || undefined,
    middle_name: parsed.middleName || undefined,
    last_name: parsed.lastName || undefined,
    location: parsed.location || undefined,
    page: parsed.page,
    page_size: backendPageSize,
    sort: 'dateOfPublish',
    sort_dir: 'desc',
  })

  const response = PASSPORT_LIST_RESPONSE_SCHEMA.parse(await getJson(query))

  return {
    page: response.meta.current_page,
    pageSize: parsed.pageSize,
    total: response.meta.total,
    hasMore: response.meta.has_more,
    results: response.data.map(toSummary).slice(0, parsed.pageSize),
  }
}

export async function getPassportDetail(passportId: string) {
  const query = buildUrl(`/api/v1/passports/${encodeURIComponent(passportId)}`)
  const response = PASSPORT_DETAIL_RESPONSE_SCHEMA.parse(await getJson(query))
  return toSummary(response.data)
}

export function getSiteBaseUrl() {
  return SITE_BASE_URL
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
