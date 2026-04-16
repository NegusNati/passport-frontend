import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from '@modelcontextprotocol/ext-apps/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'

import {
  type PassportSummary,
  CHATGPT_SEARCH_INPUT_SCHEMA,
  getApiBaseUrl,
  getPassportDetail,
  getSiteBaseUrl,
  searchPassports,
} from './passport-api.js'
import { createWidgetHtml } from './widget-template.js'

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: false,
  idempotentHint: true,
} as const

const TEMPLATE_URI = 'ui://passport/results-v1.html'
const PORT = Number(process.env.PORT || 8787)
const MCP_PATH = process.env.MCP_PATH || '/mcp'
const CHATGPT_WIDGET_DOMAIN = process.env.CHATGPT_WIDGET_DOMAIN?.trim() || undefined

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const widgetDistDir = resolve(__dirname, '../../dist/widget')

function loadWidgetAssets() {
  const script = readFileSync(resolve(widgetDistDir, 'passport-widget.js'), 'utf8')
  const css = readFileSync(resolve(widgetDistDir, 'passport-widget.css'), 'utf8')
  return { script, css }
}

function summarizeSearch(input: z.infer<typeof CHATGPT_SEARCH_INPUT_SCHEMA>) {
  if (input.requestNumber) {
    return `request number ${input.requestNumber}`
  }

  const names = [input.firstName, input.middleName, input.lastName].filter(Boolean)
  if (names.length > 0) {
    return names.join(' ')
  }

  if (input.query) {
    return input.query
  }

  if (input.location) {
    return `location ${input.location}`
  }

  return 'passport search'
}

function createPassportServer() {
  const server = new McpServer({
    name: 'passport-chatgpt-app',
    version: '0.1.0',
  })

  registerAppResource(
    server,
    'Passport Results Widget',
    TEMPLATE_URI,
    {
      title: 'Passport Results Widget',
      description: 'Interactive Ethiopian passport lookup results.',
    },
    async () => {
      const { script, css } = loadWidgetAssets()

      return {
        contents: [
          {
            uri: TEMPLATE_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: createWidgetHtml({ script, css }),
            _meta: {
              ui: {
                prefersBorder: true,
                ...(CHATGPT_WIDGET_DOMAIN ? { domain: CHATGPT_WIDGET_DOMAIN } : {}),
                csp: {
                  connectDomains: Array.from(
                    new Set([new URL(getApiBaseUrl()).origin, new URL(getSiteBaseUrl()).origin]),
                  ),
                  resourceDomains: [],
                },
              },
              'openai/widgetDescription':
                'Shows passport search results and a drill-down detail card for a selected passport.',
            },
          },
        ],
      }
    },
  )

  registerAppTool(
    server,
    'search_passports',
    {
      title: 'Search passports',
      description:
        'Use this when the user wants to look up Ethiopian passport publication results by request number, name, free-text query, or location.',
      inputSchema: CHATGPT_SEARCH_INPUT_SCHEMA,
      annotations: TOOL_ANNOTATIONS,
      _meta: {
        'openai/toolInvocation/invoking': 'Searching passports…',
        'openai/toolInvocation/invoked': 'Passport results ready.',
      },
    },
    async (input) => {
      const result = await searchPassports(input)
      const searchSummary = summarizeSearch(input)

      return {
        structuredContent: {
          kind: 'passport-search-results',
          searchSummary,
          results: result.results,
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          hasMore: result.hasMore,
        },
        content: [
          {
            type: 'text',
            text:
              result.results.length > 0
                ? `Found ${result.results.length} passport result(s) for ${searchSummary}.`
                : `No passport results were found for ${searchSummary}.`,
          },
        ],
      }
    },
  )

  registerAppTool(
    server,
    'get_passport_details',
    {
      title: 'Get passport details',
      description:
        'Use this when the user or widget needs the full details for one passport result by id.',
      inputSchema: z.object({
        passportId: z.string().min(1),
      }),
      annotations: TOOL_ANNOTATIONS,
      _meta: {
        ui: {
          resourceUri: TEMPLATE_URI,
          visibility: ['model', 'app'],
        },
        'openai/toolInvocation/invoking': 'Loading passport…',
        'openai/toolInvocation/invoked': 'Passport detail ready.',
      },
    },
    async ({ passportId }) => {
      const detail = await getPassportDetail(passportId)

      return {
        structuredContent: {
          kind: 'passport-detail',
          detail,
        },
        content: [
          {
            type: 'text',
            text: `Loaded passport details for ${detail.fullName}.`,
          },
        ],
      }
    },
  )

  registerAppTool(
    server,
    'render_passport_results',
    {
      title: 'Render passport results',
      description:
        'Use this when you want to show an interactive passport results widget. Call search_passports first and pass its results array unchanged.',
      inputSchema: z.object({
        searchSummary: z.string().min(1),
        results: z
          .array(
            z.object({
              id: z.string(),
              requestNumber: z.string(),
              fullName: z.string(),
              firstName: z.string(),
              middleName: z.string().optional(),
              lastName: z.string(),
              location: z.string(),
              publishedDate: z.string(),
              detailUrl: z.string().url(),
            }),
          )
          .min(1)
          .max(10),
        selectedPassportId: z.string().optional(),
      }),
      annotations: TOOL_ANNOTATIONS,
      _meta: {
        ui: {
          resourceUri: TEMPLATE_URI,
          visibility: ['model', 'app'],
        },
        'openai/outputTemplate': TEMPLATE_URI,
        'openai/toolInvocation/invoking': 'Rendering widget…',
        'openai/toolInvocation/invoked': 'Widget ready.',
      },
    },
    async ({ searchSummary, results, selectedPassportId }) => {
      let selectedDetail: PassportSummary | undefined

      if (selectedPassportId) {
        try {
          selectedDetail = await getPassportDetail(selectedPassportId)
        } catch {
          selectedDetail = undefined
        }
      }

      return {
        structuredContent: {
          kind: 'passport-widget',
          searchSummary,
          results,
          selectedPassportId: selectedPassportId ?? results[0]?.id,
          selectedDetail,
        },
        content: [
          {
            type: 'text',
            text: `Showing ${results.length} passport result(s) for ${searchSummary}.`,
          },
        ],
        _meta: {
          siteBaseUrl: getSiteBaseUrl(),
        },
      }
    },
  )

  return server
}

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end('Missing URL')
    return
  }

  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`)

  if (req.method === 'OPTIONS' && url.pathname.startsWith(MCP_PATH)) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type, mcp-session-id',
      'Access-Control-Expose-Headers': 'Mcp-Session-Id',
    })
    res.end()
    return
  }

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end(`Passport ChatGPT app listening on http://localhost:${PORT}${MCP_PATH}`)
    return
  }

  if (req.method === 'GET' && url.pathname === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('healthy')
    return
  }

  if (url.pathname === MCP_PATH && req.method && new Set(['GET', 'POST', 'DELETE']).has(req.method)) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id')

    const server = createPassportServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    })

    res.on('close', () => {
      void transport.close()
      void server.close()
    })

    try {
      await server.connect(transport)
      await transport.handleRequest(req, res)
    } catch (error) {
      console.error('[chatgpt] MCP request failed', error)
      if (!res.headersSent) {
        res.writeHead(500).end('Internal server error')
      }
    }
    return
  }

  res.writeHead(404).end('Not Found')
})

httpServer.listen(PORT, () => {
  console.log(`[chatgpt] server ready at http://localhost:${PORT}${MCP_PATH}`)
})
