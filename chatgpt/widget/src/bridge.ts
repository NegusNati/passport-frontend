import type { ToolPayload, ToolResultEnvelope } from './types'

type JsonRpcMessage = {
  id?: number
  jsonrpc: '2.0'
  method?: string
  params?: unknown
  result?: unknown
  error?: unknown
}

type ToolResultListener = (payload: ToolResultEnvelope) => void

export class McpBridge {
  private requestId = 0
  private readonly pending = new Map<number, { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }>()
  private readonly listeners = new Set<ToolResultListener>()

  constructor() {
    window.addEventListener('message', this.handleMessage, { passive: true })
  }

  async initialize() {
    await this.request('ui/initialize', {
      appInfo: { name: 'passport-widget', version: '0.1.0' },
      appCapabilities: {},
      protocolVersion: '2026-01-26',
    })

    this.notify('ui/notifications/initialized', {})
  }

  getInitialPayload(): ToolResultEnvelope | null {
    if (!window.openai?.toolOutput) return null

    return {
      structuredContent: window.openai.toolOutput as ToolPayload,
      _meta: window.openai.toolResponseMetadata,
    }
  }

  subscribe(listener: ToolResultListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  async callTool<TResult>(name: string, args: Record<string, unknown>) {
    return this.request<TResult>('tools/call', {
      name,
      arguments: args,
    })
  }

  dispose() {
    window.removeEventListener('message', this.handleMessage)
    this.pending.clear()
    this.listeners.clear()
  }

  private notify(method: string, params: unknown) {
    window.parent.postMessage({ jsonrpc: '2.0', method, params }, '*')
  }

  private request<TResult>(method: string, params: unknown) {
    const id = ++this.requestId

    return new Promise<TResult>((resolve, reject) => {
      this.pending.set(id, {
        resolve: (value) => resolve(value as TResult),
        reject,
      })
      window.parent.postMessage(
        {
          id,
          jsonrpc: '2.0',
          method,
          params,
        },
        '*',
      )
    })
  }

  private handleMessage = (event: MessageEvent<JsonRpcMessage>) => {
    if (event.source !== window.parent) return

    const message = event.data
    if (!message || message.jsonrpc !== '2.0') return

    if (typeof message.id === 'number') {
      const pending = this.pending.get(message.id)
      if (!pending) return

      this.pending.delete(message.id)

      if (message.error) {
        pending.reject(message.error)
        return
      }

      pending.resolve(message.result)
      return
    }

    if (message.method !== 'ui/notifications/tool-result') return

    const payload = (message.params || {}) as ToolResultEnvelope
    for (const listener of this.listeners) {
      listener(payload)
    }
  }
}

export const bridge = new McpBridge()
