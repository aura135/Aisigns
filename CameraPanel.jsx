const STATUS_LABEL = {
  idle: 'Camera not started',
  starting: 'Requesting camera access…',
  live: 'Camera live',
  stopped: 'Camera stopped',
  error: 'Camera error',
}

/**
 * Renders the real live camera feed from a useCamera() instance.
 * This component never shows stock or pre-recorded footage — if
 * `camera.status` is not 'live', the video area shows a status card
 * instead of any placeholder video.
 */
export default function CameraPanel({ camera }) {
  const { videoRef, status, error, isSupported, start, stop } = camera

  return (
    <div className="card camera-panel">
      <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
        <h3 className="mt-0">Live Camera</h3>
        <span className={`status-pill ${status === 'live' ? 'status-connected' : status === 'starting' ? 'status-connecting' : 'status-offline'}`}>
          <span className="dot" aria-hidden="true" />
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="camera-frame">
        <video
          ref={videoRef}
          className="camera-video"
          playsInline
          muted
          aria-label="Live camera preview for ISL recognition"
          style={{ display: status === 'live' ? 'block' : 'none' }}
        />

        {status !== 'live' && (
          <div className="camera-placeholder">
            {status === 'starting' && (
              <>
                <span className="spinner" aria-hidden="true" />
                <p>Requesting camera access…</p>
              </>
            )}
            {(status === 'idle' || status === 'stopped') && (
              <>
                <CameraGlyph />
                <p>{isSupported ? 'Press "Start Camera" to begin.' : 'Camera access is not supported in this browser.'}</p>
              </>
            )}
            {status === 'error' && (
              <div className="banner banner-danger" role="alert">
                <div>
                  <p className="banner-title">{errorTitle(error?.code)}</p>
                  <p>{error?.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="btn-row" style={{ marginTop: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={start}
          disabled={status === 'live' || status === 'starting' || !isSupported}
        >
          Start Camera
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={stop}
          disabled={status !== 'live'}
        >
          Stop Camera
        </button>
      </div>
    </div>
  )
}

function errorTitle(code) {
  switch (code) {
    case 'PERMISSION_DENIED': return 'Camera permission was denied.'
    case 'NO_CAMERA': return 'No camera detected.'
    case 'CAMERA_IN_USE': return 'Camera is in use elsewhere.'
    case 'UNSUPPORTED': return 'Camera is not supported.'
    default: return 'Something went wrong with the camera.'
  }
}

function CameraGlyph() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7l1.5-2.5h5L16 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}
