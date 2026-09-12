import { useEffect, useMemo, useState } from 'react'
import { getVocabulary } from '../services/api.js'
import { SAMPLE_VOCABULARY, VOCAB_CATEGORIES } from '../data/signSchema.js'
import { useApp } from '../context/AppContext.jsx'
import SignAvatar from '../components/SignAvatar.jsx'

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

export default function Vocabulary() {
  const { signerGender } = useApp()
  const [vocabulary, setVocabulary] = useState(SAMPLE_VOCABULARY)
  const [source, setSource] = useState('sample') // sample | api | loading
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [letter, setLetter] = useState(null)
  const [previewId, setPreviewId] = useState(null)
  const [previewPlaying, setPreviewPlaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    setSource('loading')
    getVocabulary()
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : data?.signs
        if (Array.isArray(list) && list.length > 0) {
          setVocabulary(list)
          setSource('api')
        } else {
          setVocabulary(SAMPLE_VOCABULARY)
          setSource('sample')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVocabulary(SAMPLE_VOCABULARY)
          setSource('sample')
        }
      })
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    return vocabulary.filter((sign) => {
      if (category !== 'All' && sign.category !== category) return false
      if (letter && !sign.englishWord.toUpperCase().startsWith(letter)) return false
      if (query && !sign.englishWord.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [vocabulary, category, letter, query])

  const previewSign = vocabulary.find((s) => s.id === previewId) || null

  return (
    <div className="shell page">
      <div className="page-header">
        <h1>ISL Vocabulary</h1>
        <p>Browse the sign vocabulary SignBridge AI is built around. Listing a word here doesn't
          mean the camera can recognize it yet — live recognition always comes from the connected
          ISL model.</p>
        <span className={`status-pill ${source === 'api' ? 'status-connected' : source === 'loading' ? 'status-connecting' : 'status-offline'}`}>
          <span className="dot" />
          {source === 'api' ? 'Vocabulary API Connected' : source === 'loading' ? 'Loading vocabulary…' : `Showing ${vocabulary.length} sample signs (vocabulary API not connected)`}
        </span>
      </div>

      <div className="vocab-toolbar">
        <div className="field vocab-search" style={{ marginBottom: 0 }}>
          <label htmlFor="vocabSearch" className="sr-only">Search vocabulary</label>
          <input
            id="vocabSearch"
            type="search"
            placeholder="Search a word…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="vocab-filters" style={{ marginBottom: 'var(--space-3)' }}>
        <button type="button" className={`filter-chip ${category === 'All' ? 'active' : ''}`} onClick={() => setCategory('All')}>All</button>
        {VOCAB_CATEGORIES.map((cat) => (
          <button key={cat} type="button" className={`filter-chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="vocab-filters" style={{ marginBottom: 'var(--space-5)' }}>
        <button type="button" className={`filter-chip ${!letter ? 'active' : ''}`} onClick={() => setLetter(null)}>A-Z</button>
        {ALPHABET.map((l) => (
          <button key={l} type="button" className={`filter-chip ${letter === l ? 'active' : ''}`} onClick={() => setLetter(l)}>{l}</button>
        ))}
      </div>

      {previewSign && (
        <div className="card" style={{ maxWidth: 320, margin: '0 auto var(--space-6)' }}>
          <div className="row-between" style={{ marginBottom: 'var(--space-2)' }}>
            <strong>{previewSign.englishWord}</strong>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPreviewId(null)}>Close</button>
          </div>
          <SignAvatar
            gender={signerGender}
            currentSign={{ sign: previewSign.islLabel, motion_id: previewSign.motionId }}
            isPlaying={previewPlaying}
          />
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 'var(--space-3)' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setPreviewPlaying((p) => !p)}>
              {previewPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
          <p className="muted" style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>{previewSign.description}</p>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="muted">No signs match your search.</p>
      ) : (
        <div className="vocab-grid">
          {filtered.map((sign) => (
            <div key={sign.id} className="vocab-card">
              <div className="vocab-card-top">
                <div>
                  <div className="vocab-card-word">{sign.englishWord}</div>
                  <div className="vocab-card-label">{sign.islLabel}</div>
                </div>
                <span className="tag">{sign.category}</span>
              </div>
              <p className="muted" style={{ margin: 0 }}>{sign.description}</p>
              <div className="btn-row">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => { setPreviewId(sign.id); setPreviewPlaying(true) }}>
                  Play Animation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
