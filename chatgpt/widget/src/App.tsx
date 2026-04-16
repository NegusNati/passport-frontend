import { useEffect, useMemo, useState } from 'react'

import { bridge } from './bridge'
import type {
  PassportSummary,
  PassportWidgetPayload,
  ToolPayload,
  ToolResultEnvelope,
  WidgetState,
} from './types'

type ViewState = {
  payload: PassportWidgetPayload | null
  detailsById: Record<string, PassportSummary>
  selectedPassportId?: string
  status: 'idle' | 'loading-detail'
}

function formatDate(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(date)
}

function mergePayload(current: ViewState, nextPayload: ToolPayload): ViewState {
  if (nextPayload.kind === 'passport-detail') {
    const detail = nextPayload.detail
    return {
      ...current,
      detailsById: {
        ...current.detailsById,
        [detail.id]: detail,
      },
      selectedPassportId: detail.id,
      status: 'idle',
    }
  }

  const selectedPassportId =
    window.openai?.widgetState?.selectedPassportId ||
    nextPayload.selectedPassportId ||
    nextPayload.results[0]?.id

  return {
    payload: nextPayload,
    detailsById: nextPayload.selectedDetail
      ? {
          ...current.detailsById,
          [nextPayload.selectedDetail.id]: nextPayload.selectedDetail,
        }
      : current.detailsById,
    selectedPassportId,
    status: 'idle',
  }
}

export function App() {
  const [state, setState] = useState<ViewState>(() => ({
    payload: null,
    detailsById: {},
    selectedPassportId: window.openai?.widgetState?.selectedPassportId,
    status: 'idle',
  }))

  useEffect(() => {
    let cancelled = false

    void bridge.initialize().catch((error) => {
      console.error('[passport-widget] Failed to initialize bridge', error)
    })

    const initial = bridge.getInitialPayload()
    if (initial?.structuredContent && !cancelled) {
      setState((current) => mergePayload(current, initial.structuredContent!))
    }

    return bridge.subscribe((payload) => {
      if (!payload.structuredContent || cancelled) return
      setState((current) => mergePayload(current, payload.structuredContent!))
    })
  }, [])

  const locale = window.openai?.locale || document.documentElement.lang || 'en-US'

  const selectedDetail = useMemo(() => {
    if (!state.selectedPassportId) return undefined
    return state.detailsById[state.selectedPassportId]
  }, [state.detailsById, state.selectedPassportId])

  const handleSelect = async (passportId: string) => {
    setState((current) => ({
      ...current,
      selectedPassportId: passportId,
      status: current.detailsById[passportId] ? 'idle' : 'loading-detail',
    }))

    const nextWidgetState: WidgetState = { selectedPassportId: passportId }
    window.openai?.setWidgetState?.(nextWidgetState)

    if (state.detailsById[passportId]) {
      return
    }

    try {
      const result = (await bridge.callTool<ToolResultEnvelope>('get_passport_details', {
        passportId,
      })) as ToolResultEnvelope

      if (result.structuredContent) {
        setState((current) => mergePayload(current, result.structuredContent!))
      } else {
        setState((current) => ({ ...current, status: 'idle' }))
      }
    } catch (error) {
      console.error('[passport-widget] Failed to load detail', error)
      setState((current) => ({ ...current, status: 'idle' }))
    }
  }

  const handleOpenExternal = async (href: string) => {
    if (window.openai?.openExternal) {
      await window.openai.openExternal({ href })
      return
    }

    window.open(href, '_blank', 'noopener,noreferrer')
  }

  if (!state.payload) {
    return (
      <main className="passport-shell">
        <section className="passport-empty">
          <p className="passport-eyebrow">Passport</p>
          <h1>Waiting for results</h1>
          <p>
            This widget appears after ChatGPT calls the passport search tools and passes a result
            set into the iframe.
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="passport-shell">
      <section className="passport-frame">
        <header className="passport-header">
          <div>
            <p className="passport-eyebrow">Passport lookup</p>
            <h1>{state.payload.searchSummary}</h1>
            <p className="passport-subtitle">
              {state.payload.results.length} visible result
              {state.payload.results.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="passport-badge">passport.et</div>
        </header>

        <div className="passport-grid">
          <section className="passport-results" aria-label="Passport search results">
            {state.payload.results.map((item) => {
              const isSelected = item.id === state.selectedPassportId

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`passport-result-card${isSelected ? ' is-selected' : ''}`}
                  onClick={() => void handleSelect(item.id)}
                >
                  <div className="passport-result-topline">
                    <span className="passport-result-number">{item.requestNumber}</span>
                    <span className="passport-result-date">
                      {formatDate(item.publishedDate, locale)}
                    </span>
                  </div>
                  <strong>{item.fullName}</strong>
                  <span>{item.location}</span>
                </button>
              )
            })}
          </section>

          <aside className="passport-detail" aria-live="polite">
            {selectedDetail ? (
              <>
                <div className="passport-detail-header">
                  <p className="passport-eyebrow">Selected passport</p>
                  <h2>{selectedDetail.fullName}</h2>
                  <p>{selectedDetail.location}</p>
                </div>

                <dl className="passport-meta">
                  <div>
                    <dt>Request number</dt>
                    <dd>{selectedDetail.requestNumber}</dd>
                  </div>
                  <div>
                    <dt>Published date</dt>
                    <dd>{formatDate(selectedDetail.publishedDate, locale)}</dd>
                  </div>
                  <div>
                    <dt>First name</dt>
                    <dd>{selectedDetail.firstName}</dd>
                  </div>
                  <div>
                    <dt>Last name</dt>
                    <dd>{selectedDetail.lastName}</dd>
                  </div>
                </dl>

                <div className="passport-actions">
                  <button
                    type="button"
                    className="passport-primary-action"
                    onClick={() => void handleOpenExternal(selectedDetail.detailUrl)}
                  >
                    Open on passport.et
                  </button>
                </div>
              </>
            ) : (
              <div className="passport-placeholder">
                <p className="passport-eyebrow">Passport detail</p>
                <h2>
                  {state.status === 'loading-detail' ? 'Loading passport details…' : 'Pick a result'}
                </h2>
                <p>
                  Select a passport result on the left to load the detailed record inside this
                  widget.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}
