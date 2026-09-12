export default function SignSequence({ sequence, activeIndex }) {
  if (!sequence || sequence.length === 0) {
    return <p className="muted">No sign sequence yet. Enter text and press Convert to ISL.</p>
  }

  return (
    <ol className="sign-sequence" aria-label="ISL sign sequence">
      {sequence.map((item, index) => (
        <li key={`${item.sign}-${index}`} className={index === activeIndex ? 'is-active' : ''}>
          <span className="sign-sequence-index">{index + 1}</span>
          <span className="sign-sequence-word">{item.sign}</span>
        </li>
      ))}
    </ol>
  )
}
