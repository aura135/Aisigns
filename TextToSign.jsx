import { useEffect, useRef, useState } from 'react'
import { textToSign } from '../services/api.js'
import { useSpeech } from '../hooks/useSpeech.js'
import { useApp } from '../context/AppContext.jsx'
import SignSequence from '../components/SignSequence.jsx'
import SignAvatar from '../components/SignAvatar.jsx'

const SPEEDS = [0.5, 1, 1.5, 2]

export default function TextToSign() {
  const { signerGender, setSignerGender } = useApp()
  const {
    speechRecognitionSupported, isListening, transcript, startListening, stopListening, setTranscript,
  } = useSpeech()

  const [text, setText] = useState('')
  const [sequence, setSequence] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [callStatus, setCallStatus] = useState('idle') // idle | loading | offline | error
  const [errorMessage, setErrorMessage] = useState(null)

  const timerRef = useRef(null)

  useEffect(() => {
    if (transcript) setText(transcript)
  }, [transcript])

  useEffect(() => {
    if (!isPlaying || sequence.length === 0) {
      clearTimeout(timerRef.current)
      return undefined
    }

    const durationMs = 1400 / speed
    timerRef.current = setTimeout(() => {
      setActiveIndex((index) => {
        if (index + 1 >= sequence.length) {
          setIsPlaying(false)
          return index
        }
        return index + 1
      })
    }, durationMs)

    return () => clearTimeout(timerRef.current)
  }, [isPlaying, activeIndex, sequence, speed])

  const handleConvert = async (event) => {
    event.preventDefault()
    if (!text.trim()) return

    setCallStatus('loading')
    setErrorMessage(null)
    try {
      const result = await textToSign(text.trim())
      const seq = result?.sign_sequence || []
      if (seq.length === 0) {
        setCallStatus('error')
        setErrorMessage('No matching ISL sign was returned.')
        setSequence([])
        return
      }
      setSequence(seq)
      setActiveIndex(0)
      setIsPlaying(true)
      setCallStatus('idle')
    } catch (err) {
      setSequence([])
      if (err.offline) {
        setCallStatus('offline')
      } else {
        setCallStatus('error')
        setErrorMessage(err.message || 'Text-to-sign service is unavailable.')
      }
    }
  }

  const currentSign = sequence[activeIndex] || null
  const progressPct = sequence.length ? ((activeIndex + 1) / sequence.length) * 100 : 0

  const handleMic = () => {
    if (isListening) {
      stopListening()
    } else {
      setTranscript('')
      startListening()
    }
  }

  return (
    <div className="shell page">
      <div className="page-header">
        <p className="page-eyebrow">Text User</p>
        <h1>Text to Sign</h1>
        <p>Type or speak a message. It's converted into an ISL sign sequence and performed by
          your chosen animated signer.</p>
      </div>

      <div className="split-layout">
        <div className="stack">
          <form className="card" onSubmit={handleConvert}>
            <div className="field">
              <label htmlFor="textInput">Your message</label>
              <textarea
                id="textInput"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Hello, how are you?"
              />
            </div>

            <div className="btn-row">
              <button type="submit" className="btn btn-primary" disabled={callStatus === 'loading' || !text.trim()}>
                {callStatus === 'loading' ? 'Converting…' : 'Convert to ISL'}
              </button>

              {speechRecognitionSupported ? (
                <button type="button" className={`btn ${isListening ? 'btn-danger' : 'btn-outline'}`} onClick={handleMic}>
                  {isListening ? 'Stop Recording' : 'Speak Instead'}
                </button>
              ) : (
                <span className="muted">Voice input is not supported in this browser.</span>
              )}
            </div>

            {isListening && (
              <p className="muted" style={{ marginTop: 'var(--space-3)' }}>
                <span className="status-pill status-connecting"><span className="dot" />Listening…</span>
              </p>
            )}

            {callStatus === 'offline' && (
              <div className="banner banner-warning" role="alert" style={{ marginTop: 'var(--space-4)' }}>
                <div>
                  <p className="banner-title">Text-to-sign service is unavailable</p>
                  <p>Connect VITE_API_BASE_URL to a live backend to convert real text into an ISL
                    sequence. No sequence is being invented in the meantime.</p>
                </div>
              </div>
            )}

            {callStatus === 'error' && errorMessage && (
              <p className="field-error" role="alert" style={{ marginTop: 'var(--space-3)' }}>{errorMessage}</p>
            )}
          </form>

          <div className="card">
            <h3 className="mt-0">Sign Sequence</h3>
            <SignSequence sequence={sequence} activeIndex={activeIndex} />
          </div>
        </div>

        <div className="card">
          <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 className="mt-0">Animated Signer</h3>
            <div className="gender-toggle">
              <button type="button" className={signerGender === 'boy' ? 'active' : ''} onClick={() => setSignerGender('boy')}>Boy</button>
              <button type="button" className={signerGender === 'girl' ? 'active' : ''} onClick={() => setSignerGender('girl')}>Girl</button>
            </div>
          </div>

          <SignAvatar gender={signerGender} currentSign={currentSign} isPlaying={isPlaying} speed={speed} />

          <div className="avatar-progress" role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
            <div className="avatar-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="avatar-controls">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setActiveIndex((i) => Math.max(0, i - 1))} disabled={sequence.length === 0}>
              Previous
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsPlaying((p) => !p)}
              disabled={sequence.length === 0}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { setIsPlaying(false); setActiveIndex(0) }} disabled={sequence.length === 0}>
              Stop
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { setActiveIndex(0); setIsPlaying(true) }} disabled={sequence.length === 0}>
              Restart
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setActiveIndex((i) => Math.min(sequence.length - 1, i + 1))} disabled={sequence.length === 0}>
              Next
            </button>
          </div>

          <div className="row" style={{ justifyContent: 'center', marginTop: 'var(--space-3)' }}>
            <span className="muted">Speed</span>
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                className={`filter-chip ${speed === s ? 'active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
