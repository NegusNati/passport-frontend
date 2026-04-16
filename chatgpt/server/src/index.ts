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
  CHATGPT_PASSPORT_RECORD_SCHEMA,
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

function formatPassportResultText(result: PassportSummary) {
  return [
    `Name: ${result.fullName}`,
    `Request number: ${result.requestNumber}`,
    `You Can Receive After: ${result.receiveAfterLabel}`,
    `Collection days: ${result.pickupDaysLabel}`,
    `Exact time: ${result.pickupTimeLabel}`,
    `Branch: ${result.location}`,
    `Verified using www.passport.et`,
    `Record: ${result.detailUrl}`,
  ].join('\n')
}

function createSearchContent(searchSummary: string, results: PassportSummary[]) {
  if (results.length === 0) {
    return `No passport results were found for ${searchSummary}.`
  }

  const blocks = results.map((result, index) => `${index + 1}.\n${formatPassportResultText(result)}`)
  return [`Passport publication results for ${searchSummary}:`, ...blocks].join('\n\n')
}

function createPassportServer() {
  const server = new McpServer({
    name: 'passport-chatgpt-app',
    version: '0.1.0',
  })

  registerAppResource(
    server,
    'Passport.ET Status Card',
    TEMPLATE_URI,
    {
      title: 'Passport.ET Status Card',
      description: 'Interactive Ethiopian passport pickup and publication status card.',
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
                'Shows Passport.ET status results and a branded pickup detail card for the selected passport.',
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
      title: 'Check Passport.ET status',
      description:
        'Use this when the user wants to check Ethiopian passport publication or pickup status on Passport.ET by request number, passport holder name, free-text query, or branch location. After a successful match, prefer showing the Passport.ET result card instead of restating all fields in prose.',
      inputSchema: CHATGPT_SEARCH_INPUT_SCHEMA,
      annotations: TOOL_ANNOTATIONS,
      _meta: {
        ui: {
          resourceUri: TEMPLATE_URI,
          visibility: ['model', 'app'],
        },
        'openai/outputTemplate': TEMPLATE_URI,
        'openai/toolInvocation/invoking': 'Checking Passport.ET…',
        'openai/toolInvocation/invoked': 'Passport.ET result ready.',
      },
    },
    async (input) => {
      const result = await searchPassports(input)
      const searchSummary = summarizeSearch(input)
      const selectedDetail = result.results[0]

      return {
        structuredContent: {
          kind: 'passport-widget',
          searchSummary,
          results: result.results,
          selectedPassportId: selectedDetail?.id,
          selectedDetail,
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
                ? 'Passport.ET result card ready below. Verified using www.passport.et.'
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
      title: 'Load Passport.ET details',
      description:
        'Use this when the user or widget needs the detailed Passport.ET pickup card for one passport result.',
      inputSchema: z.object({
        passportId: z
          .string()
          .min(1)
          .describe('Passport.ET result id for the record that should be opened.'),
      }),
      annotations: TOOL_ANNOTATIONS,
      _meta: {
        ui: {
          resourceUri: TEMPLATE_URI,
          visibility: ['model', 'app'],
        },
        'openai/toolInvocation/invoking': 'Loading Passport.ET detail…',
        'openai/toolInvocation/invoked': 'Passport.ET detail ready.',
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
            text: `Passport detail from passport.et\n\n${formatPassportResultText(detail)}`,
          },
        ],
      }
    },
  )

  registerAppTool(
    server,
    'render_passport_results',
    {
      title: 'Show Passport.ET result card',
      description:
        'Use this when you want to show the branded Passport.ET status card inside ChatGPT. Call check Passport.ET status first and pass its results array unchanged. Prefer this card over repeating the same status details in plain text.',
      inputSchema: z.object({
        searchSummary: z
          .string()
          .min(1)
          .describe('Human-readable summary of the search, such as a request number or passenger name.'),
        results: z
          .array(CHATGPT_PASSPORT_RECORD_SCHEMA)
          .min(1)
          .max(10)
          .describe('Passport.ET search results to display in the widget.'),
        selectedPassportId: z
          .string()
          .optional()
          .describe('Optional Passport.ET result id to preselect in the widget.'),
      }),
      annotations: TOOL_ANNOTATIONS,
      _meta: {
        ui: {
          resourceUri: TEMPLATE_URI,
          visibility: ['model', 'app'],
        },
        'openai/outputTemplate': TEMPLATE_URI,
        'openai/toolInvocation/invoking': 'Opening Passport.ET card…',
        'openai/toolInvocation/invoked': 'Passport.ET card ready.',
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
            text: createSearchContent(searchSummary, selectedDetail ? [selectedDetail] : results),
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
