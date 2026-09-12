const CONFIG = {
  connected: { label: 'API Connected', className: 'status-connected' },
  checking: { label: 'Connecting…', className: 'status-connecting' },
  offline: { label: 'API Offline', className: 'status-offline' },
}

/**
 * Small pill showing real backend connectivity. `status` must be one of
 * 'connected' | 'checking' | 'offline' — this component never displays
 * "Connected" unless the caller has verified the API actually responded.
 */
export default function StatusIndicator({ status = 'offline', label, compact = false }) {
  const config = CONFIG[status] || CONFIG.offline
  const text = label || config.label

  return (
    <span className={`status-pill ${config.className}`} role="status" title={text}>
      <span className="dot" aria-hidden="true" />
      {!compact && text}
      {compact && <span className="sr-only">{text}</span>}
    </span>
  )
}
