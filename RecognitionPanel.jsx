export default function RecognitionPanel({ recognition, cameraLive, onSpeak, isSpeaking }) {
  const { apiConnected, isProcessing, lastResult, lastError, history, sentence, clearSentence } = recognition

  const confidencePct = lastResult?.confidence != null
    ? Math.round(lastResult.confidence * 100)
    : null

  return (
    <div className="stack">
      <div className="card">
        <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
          <h3 className="mt-0">Recognition Status</h3>
          {apiConnected === false ? (
            <span className="status-pill status-offline"><span className="dot" />Recognition Model Not Connected</span>
          ) : apiConnected === true ? (
            <span className="status-pill status-connected"><span className="dot" />Recognition API Connected</span>
          ) : (
            <span className="status-pill status-connecting"><span className="dot" />Waiting for camera</span>
          )}
        </div>

        {!cameraLive && (
          <p className="muted">Start the camera to begin sending frames for recognition.</p>
        )}

        {cameraLive && apiConnected === false && (
          <div className="banner banner-warning" role="status">
            <div>
              <p className="banner-title">Recognition model is not connected</p>
              <p>Set VITE_API_BASE_URL to a live recognition backend to enable real ISL detection. No results are being simulated.</p>
            </div>
          </div>
        )}

        {cameraLive && apiConnected && (
          <div className="recognition-live">
            <div className="recognition-row">
              <span className="muted">Recognized sign</span>
              <strong>{isProcessing ? <span className="spinner" /> : (lastResult?.sign || '—')}</strong>
            </div>
            <div className="recognition-row">
              <span className="muted">English text</span>
              <strong>{lastResult?.englishText || '—'}</strong>
            </div>
            <div className="recognition-row">
              <span className="muted">Confidence</span>
              <strong>{confidencePct != null ? `${confidencePct}%` : '—'}</strong>
            </div>
            {lastError && (
              <p className="field-error" role="alert">{lastError.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
          <h3 className="mt-0">Sentence</h3>
          <div className="btn-row">
            <button type="button" className="btn btn-outline btn-sm" onClick={clearSentence} disabled={!sentence}>
              Clear Result
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onSpeak(sentence)}
              disabled={!sentence || isSpeaking}
            >
              {isSpeaking ? 'Speaking…' : 'Speak'}
            </button>
          </div>
        </div>
        <p className="sentence-box">{sentence || 'Recognized words will build a sentence here.'}</p>
      </div>

      <div className="card">
        <h3 className="mt-0">Recognition History</h3>
        {history.length === 0 ? (
          <p className="muted">No signs recognized yet in this session.</p>
        ) : (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.timestamp}>
                <span className="tag">{item.sign}</span>
                <span>{item.englishText}</span>
                <span className="muted">{item.confidence != null ? `${Math.round(item.confidence * 100)}%` : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
