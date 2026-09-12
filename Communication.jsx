import { useEffect, useState } from 'react'
import { useCamera } from '../hooks/useCamera.js'
import { useRecognition } from '../hooks/useRecognition.js'
import { useSpeech } from '../hooks/useSpeech.js'
import { textToSign } from '../services/api.js'
import { useApp } from '../context/AppContext.jsx'
import CameraPanel from '../components/CameraPanel.jsx'
import ChatBubble from '../components/ChatBubble.jsx'
import SignAvatar from '../components/SignAvatar.jsx'

export default function Communication() {
  const { signerGender } = useApp()
  const camera = useCamera()
  const recognition = useRecognition({ captureFrame: camera.captureFrame, active: camera.status === 'live' })
  const { speak, speechRecognitionSupported, isListening, transcript, startListening, stopListening, setTranscript } = useSpeech()

  const [messages, setMessages] = useState([])
  const [textInput, setTextInput] = useState('')
  const [textStatus, setTextStatus] = useState('idle')
  const [playback, setPlayback] = useState({ sequence: [], index: 0, isPlaying: false })

  const effectiveText = transcript || textInput

  const sendSignMessage = () => {
    if (!recognition.sentence) return
    setMessages((prev) => [...prev, { id: Date.now(), side: 'sign', text: recognition.sentence }])
    recognition.clearSentence()
  }

  const sendTextMessage = async () => {
    const value = effectiveText.trim()
    if (!value) return

    setTextStatus('loading')
    try {
      const result = await textToSign(value)
      setMessages((prev) => [...prev, {
        id: Date.now(),
        side: 'text',
        text: value,
        sequence: result?.sign_sequence || [],
      }])
      setTextStatus('idle')
    } catch {
      // Still show the message so the conversation reads naturally, but
      // without a sign sequence to play back if the backend is offline.
      setMessages((prev) => [...prev, { id: Date.now(), side: 'text', text: value, sequence: [] }])
      setTextStatus('offline')
    }
    setTextInput('')
    setTranscript('')
  }

  useEffect(() => {
    if (!playback.isPlaying || playback.sequence.length === 0) return undefined
    const timer = setTimeout(() => {
      setPlayback((prev) => {
        if (prev.index + 1 >= prev.sequence.length) return { ...prev, isPlaying: false }
        return { ...prev, index: prev.index + 1 }
      })
    }, 1400)
    return () => clearTimeout(timer)
  }, [playback])

  const playSequence = (sequence) => {
    if (!sequence || sequence.length === 0) return
    setPlayback({ sequence, index: 0, isPlaying: true })
  }

  const clearConversation = () => {
    setMessages([])
    recognition.clearSentence()
  }

  return (
    <div className="shell page">
      <div className="page-header">
        <h1>Communication</h1>
        <p>Both sides of a SignBridge AI conversation, in one place: a sign user's camera on the
          left, a text or voice user's input on the right.</p>
      </div>

      <div className="two-column">
        <div className="sign-column">
          <div className="column-heading"><span className="swatch" />Sign User</div>
          <CameraPanel camera={camera} />
          <div className="card" style={{ marginTop: 'var(--space-4)' }}>
            <p className="sentence-box">{recognition.sentence || 'Recognized signs will appear here.'}</p>
            <div className="btn-row" style={{ marginTop: 'var(--space-3)' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={sendSignMessage} disabled={!recognition.sentence}>Send</button>
            </div>
          </div>
        </div>

        <div className="text-column">
          <div className="column-heading"><span className="swatch" />Text User</div>
          <div className="card">
            <div className="field">
              <label htmlFor="commsText">Type a message</label>
              <textarea
                id="commsText"
                value={effectiveText}
                onChange={(e) => { setTextInput(e.target.value); setTranscript('') }}
                placeholder="e.g. Hello! How are you?"
              />
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn-primary btn-sm" onClick={sendTextMessage} disabled={!effectiveText.trim() || textStatus === 'loading'}>
                {textStatus === 'loading' ? 'Sending…' : 'Send'}
              </button>
              {speechRecognitionSupported && (
                <button
                  type="button"
                  className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-outline'}`}
                  onClick={() => (isListening ? stopListening() : startListening())}
                >
                  {isListening ? 'Stop Recording' : 'Speak'}
                </button>
              )}
            </div>
            {textStatus === 'offline' && (
              <p className="muted" style={{ marginTop: 'var(--space-3)' }}>
                Text-to-sign service is unavailable — the message was added without a sign sequence.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bridge-rule" aria-hidden="true" />

      <div className="row-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 className="mt-0">Conversation</h3>
        <button type="button" className="btn btn-outline btn-sm" onClick={clearConversation} disabled={messages.length === 0}>Clear</button>
      </div>

      <div className="chat-thread" style={{ marginBottom: 'var(--space-6)' }}>
        {messages.length === 0 && <p className="muted">Your conversation will appear here.</p>}
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            side={message.side}
            text={message.text}
            onSpeak={message.side === 'sign' ? () => speak(message.text) : undefined}
            onPlaySign={message.side === 'text' ? () => playSequence(message.sequence) : undefined}
          />
        ))}
      </div>

      {playback.sequence.length > 0 && (
        <div className="card" style={{ maxWidth: 320, margin: '0 auto' }}>
          <SignAvatar
            gender={signerGender}
            currentSign={playback.sequence[playback.index]}
            isPlaying={playback.isPlaying}
          />
        </div>
      )}
    </div>
  )
}
