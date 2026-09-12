import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <span>© {new Date().getFullYear()} SignBridge AI. Built for accessible, two-way communication.</span>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/vocabulary">Vocabulary</Link>
          <Link to="/login">Sign In</Link>
        </nav>
      </div>
    </footer>
  )
}
