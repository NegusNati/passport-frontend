export const adminKeys = {
  all: ['admin'] as const,
  users: {
    all: () => [...adminKeys.all, 'users'] as const,
    list: (paramsHash = '{}') => [...adminKeys.users.all(), 'list', paramsHash] as const,
    detail: (id: string | number) => [...adminKeys.users.all(), 'detail', String(id)] as const,
  },
  passports: {
    all: () => [...adminKeys.all, 'passports'] as const,
    list: (paramsHash = '{}') => [...adminKeys.passports.all(), 'list', paramsHash] as const,
    detail: (id: string | number) => [...adminKeys.passports.all(), 'detail', String(id)] as const,
  },
  articles: {
    all: () => [...adminKeys.all, 'articles'] as const,
    list: (paramsHash = '{}') => [...adminKeys.articles.all(), 'list', paramsHash] as const,
    detail: (slug: string) => [...adminKeys.articles.all(), 'detail', slug] as const,
  },
}

export function hashParams(value: Record<string, unknown> | undefined | null) {
  if (!value) return '{}'
  const normalizedEntries = Object.entries(value)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([key, v]) => [key, typeof v === 'object' ? JSON.stringify(v) : String(v)])
    .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
  return JSON.stringify(normalizedEntries)
}
