import { useEffect, useMemo, useState } from 'react'
import Barcode from 'react-barcode'

import starSeal from '../../../src/assets/landingImages/star.svg'
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

function ResultCard({
  item,
  isSelected,
  onSelect,
}: {
  item: PassportSummary
  isSelected: boolean
  onSelect: (passportId: string) => void
}) {
  return (
    <button
      key={item.id}
      type="button"
      className={`passport-result-card${isSelected ? ' is-selected' : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <div className="passport-result-head">
        <span className="passport-result-label">Request number</span>
        <strong className="passport-result-number">{item.requestNumber}</strong>
      </div>
      <strong className="passport-result-name">{item.fullName}</strong>
      <span className="passport-result-branch">{item.location}</span>
      <dl className="passport-result-summary">
        <div>
          <dt>You Can Receive After</dt>
          <dd>{item.receiveAfterLabel}</dd>
        </div>
        <div>
          <dt>Collection days</dt>
          <dd>{item.pickupDaysLabel}</dd>
        </div>
      </dl>
    </button>
  )
}

function DetailCard({
  passport,
  status,
  onOpenExternal,
}: {
  passport?: PassportSummary
  status: ViewState['status']
  onOpenExternal: (href: string) => Promise<void>
}) {
  if (!passport) {
    return (
      <section className="passport-detail-card passport-detail-placeholder" aria-live="polite">
        <p className="passport-kicker">Passport.ET Detail</p>
        <h2>{status === 'loading-detail' ? 'Loading passport details…' : 'Select a passport'}</h2>
        <p>
          Pick one result to see the same pickup guidance shown on the live Passport.ET detail
          page.
        </p>
      </section>
    )
  }

  return (
    <section className="passport-detail-card" aria-live="polite">
      <header className="passport-card-header">
        <p className="passport-kicker">Federal Democratic Republic of Ethiopia</p>
        <div className="passport-seal" aria-hidden="true">
          <img src={starSeal} alt="" />
        </div>
        <h2>Passport publication result</h2>
        <p className="passport-card-brand">Passport.ET</p>
      </header>

      <div className="passport-ready-banner">
        <p className="passport-ready-eyebrow">{passport.readyHeadline}</p>
        <p>{passport.pickupNotice}</p>
      </div>

      <div className="passport-person-grid">
        <div>
          <span className="passport-field-label">Surname</span>
          <strong>{passport.surname}</strong>
        </div>
        <div>
          <span className="passport-field-label">Given Name</span>
          <strong>{passport.givenName}</strong>
        </div>
        <div>
          <span className="passport-field-label">Branch</span>
          <strong>{passport.location}</strong>
        </div>
      </div>

      <dl className="passport-info-grid">
        <div>
          <dt>Request number</dt>
          <dd>{passport.requestNumber}</dd>
        </div>
        <div>
          <dt>You Can Receive After</dt>
          <dd>{passport.receiveAfterLabel}</dd>
        </div>
        <div>
          <dt>Day of The Week</dt>
          <dd>{passport.pickupDaysLabel}</dd>
        </div>
        <div>
          <dt>Exact Time</dt>
          <dd>{passport.pickupTimeLabel}</dd>
        </div>
      </dl>

      <div className="passport-card-footer">
        <div>
          <p className="passport-source-label">{passport.sourceLabel}</p>
          <a
            className="passport-source-link"
            href={passport.detailUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.preventDefault()
              void onOpenExternal(passport.detailUrl)
            }}
          >
            View verified record on passport.et
          </a>
        </div>

        <button
          type="button"
          className="passport-primary-action"
          onClick={() => void onOpenExternal(passport.detailUrl)}
        >
          Open on passport.et
        </button>
      </div>

      <div className="passport-barcode-wrap" aria-label={`Request number ${passport.requestNumber}`}>
        <div className="passport-barcode-card">
          <Barcode
            value={passport.requestNumber}
            width={1.6}
            height={56}
            fontSize={11}
            margin={0}
            background="transparent"
            lineColor="#14110f"
          />
        </div>
        <p className="passport-site-mark">www.passport.et</p>
      </div>
    </section>
  )
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
      const initialPayload = initial.structuredContent
      setState((current) => mergePayload(current, initialPayload))
    }

    return bridge.subscribe((payload) => {
      if (!payload.structuredContent || cancelled) return
      const nextPayload = payload.structuredContent
      setState((current) => mergePayload(current, nextPayload))
    })
  }, [])

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

    if (state.detailsById[passportId]) return

    try {
      const result = (await bridge.callTool<ToolResultEnvelope>('get_passport_details', {
        passportId,
      })) as ToolResultEnvelope

      if (result.structuredContent) {
        const detailPayload = result.structuredContent
        setState((current) => mergePayload(current, detailPayload))
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
          <p className="passport-kicker">Passport.ET</p>
          <h1>Waiting for passport results</h1>
          <p>Search for a passport in ChatGPT and the structured Passport.ET result card will appear here.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="passport-shell">
      <section className="passport-frame">
        <header className="passport-header">
          <div>
            <p className="passport-kicker">Passport.ET</p>
            <h1>{state.payload.searchSummary}</h1>
            <p className="passport-subtitle">
              Live publication results from passport.et for {state.payload.results.length} match
              {state.payload.results.length === 1 ? '' : 'es'}
            </p>
          </div>
          <div className="passport-badge">Official source</div>
        </header>

        <div className="passport-grid">
          <section className="passport-results" aria-label="Passport search results">
            {state.payload.results.map((item) => (
              <ResultCard
                key={item.id}
                item={item}
                isSelected={item.id === state.selectedPassportId}
                onSelect={handleSelect}
              />
            ))}
          </section>

          <DetailCard
            passport={selectedDetail}
            status={state.status}
            onOpenExternal={handleOpenExternal}
          />
        </div>
      </section>
    </main>
  )
}
