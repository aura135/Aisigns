export default function HowItWorks() {
  return (
    <div className="shell page">
      <div className="page-header">
        <h1>How SignBridge AI works</h1>
        <p>SignBridge AI connects two directions of communication through one shared interface.
          Here's what happens on each side.</p>
      </div>

      <div className="two-column">
        <div className="sign-column">
          <div className="column-heading"><span className="swatch" />ISL → Text → Voice</div>
          <ol className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Step n={1} title="Camera">The sign user's real device camera captures their gestures, frame by frame.</Step>
            <Step n={2} title="Gesture detection">Each frame is sent to the ISL recognition model, which looks for a matching sign.</Step>
            <Step n={3} title="ISL recognition model">When a match is confident enough, the model returns the recognized sign.</Step>
            <Step n={4} title="English text">The recognized sign is mapped to its English word and added to a sentence.</Step>
            <Step n={5} title="Voice">The sentence can be read aloud with the browser's text-to-speech, for the person on the other side.</Step>
          </ol>
        </div>

        <div className="text-column">
          <div className="column-heading"><span className="swatch" />Text → ISL</div>
          <ol className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <Step n={1} title="Text or voice">The text user types a message, or speaks it using the browser's speech recognition.</Step>
            <Step n={2} title="Language processing">The message is sent to a text-to-ISL service that breaks it into signable units.</Step>
            <Step n={3} title="ISL sign sequence">The service returns an ordered sequence of signs, e.g. HELLO → HOW → YOU.</Step>
            <Step n={4} title="Animated signer">A boy or girl avatar is chosen to perform the sequence.</Step>
            <Step n={5} title="Gesture animation">The avatar performs each sign in order, with play, pause, and speed controls.</Step>
          </ol>
        </div>
      </div>

      <div className="bridge-rule" aria-hidden="true" />

      <div className="card">
        <h3 className="mt-0">What's real, and what's connected later</h3>
        <p>The camera, browser speech recognition, and browser text-to-speech in SignBridge AI are
          all real and working right now. The ISL recognition model, the text-to-ISL service, and
          the validated ISL motion data for the avatar are the parts a trained model and dataset
          plug into — the interface is built and ready for them, and clearly says so whenever
          they're not connected, instead of faking a result.</p>
      </div>
    </div>
  )
}

function Step({ n, title, children }) {
  return (
    <li className="step-card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
      <div className="step-number" style={{ marginBottom: 0, flexShrink: 0 }}>{n}</div>
      <div>
        <h4 style={{ marginBottom: 4 }}>{title}</h4>
        <p style={{ marginBottom: 0 }}>{children}</p>
      </div>
    </li>
  )
}
