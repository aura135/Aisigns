import { useCamera } from '../hooks/useCamera.js'
import { useRecognition } from '../hooks/useRecognition.js'
import { useSpeech } from '../hooks/useSpeech.js'
import CameraPanel from '../components/CameraPanel.jsx'
import RecognitionPanel from '../components/RecognitionPanel.jsx'

export default function SignToText() {
  const camera = useCamera()
  const recognition = useRecognition({ captureFrame: camera.captureFrame, active: camera.status === 'live' })
  const { speak, stopSpeaking, isSpeaking, speechSynthesisSupported } = useSpeech()

  return (
    <div className="shell page">
      <div className="page-header">
        <p className="page-eyebrow">Sign User</p>
        <h1>Sign to Text</h1>
        <p>Turn your camera on and sign naturally. Recognized signs appear as English text below,
          and you can have that text read aloud.</p>
      </div>

      <div className="split-layout">
        <CameraPanel camera={camera} />
        <RecognitionPanel
          recognition={recognition}
          cameraLive={camera.status === 'live'}
          onSpeak={speak}
          isSpeaking={isSpeaking}
        />
      </div>

      {isSpeaking && (
        <div className="btn-row" style={{ marginTop: 'var(--space-4)' }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={stopSpeaking}>Stop Speaking</button>
        </div>
      )}

      {!speechSynthesisSupported && (
        <p className="muted" style={{ marginTop: 'var(--space-4)' }}>
          Text-to-speech is not supported in this browser, so recognized text will be shown but not spoken aloud.
        </p>
      )}
    </div>
  )
}
