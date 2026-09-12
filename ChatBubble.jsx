export default function ChatBubble({ side, text, onPlaySign, onSpeak }) {
  const isSign = side === 'sign'

  return (
    <div className={`chat-bubble-row ${isSign ? 'from-sign' : 'from-text'}`}>
      <span className="chat-bubble-label">{isSign ? 'Sign User' : 'Text User'}</span>
      <div className="chat-bubble">
        <p className="mt-0" style={{ marginBottom: 0 }}>{text}</p>
        <div className="btn-row" style={{ marginTop: 'var(--space-2)' }}>
          {isSign && onSpeak && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onSpeak}>Speak</button>
          )}
          {!isSign && onPlaySign && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onPlaySign}>Play Sign</button>
          )}
        </div>
      </div>
    </div>
  )
}
