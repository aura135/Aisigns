import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="shell page">
      <section className="hero">
        <div className="hero-grid">
          <div>
            <h1>SignBridge AI</h1>
            <p className="hero-tagline">Breaking communication barriers with AI and Indian Sign Language.</p>
            <p>
              SignBridge AI enables two-way communication between ISL users and text or voice
              users. A sign user's gestures are captured on camera and turned into English text
              and speech; a text or voice user's words are turned into an ISL sign sequence and
              performed by an animated signer.
            </p>
            <div className="btn-row">
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
              <Link to="/how-it-works" className="btn btn-ghost">Learn How It Works</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-flow">
              <div className="hero-flow-side">
                <div className="hero-flow-icon sign" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <strong>Sign User</strong>
                <p className="muted" style={{ marginBottom: 0 }}>Camera → ISL recognition → Text → Voice</p>
              </div>

              <div className="hero-flow-connector" aria-hidden="true"><span className="pulse" /></div>

              <div className="hero-flow-side">
                <div className="hero-flow-icon text" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="#fff" strokeWidth="2" /><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <strong>Text User</strong>
                <p className="muted" style={{ marginBottom: 0 }}>Text/voice → ISL sequence → Animated signer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bridge-rule" aria-hidden="true" />

      <section>
        <h2>One interface, two directions</h2>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Sign to text</h4>
            <p>The sign user's camera feed is sent to an ISL recognition model, which returns
              English text — spoken aloud for the person on the other side.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Text to sign</h4>
            <p>The text or voice user's message is converted into an ISL sign sequence and
              performed by a boy or girl animated signer.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Real conversation</h4>
            <p>Both flows meet on one Communication screen, so a full back-and-forth
              conversation is possible from a single device.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
