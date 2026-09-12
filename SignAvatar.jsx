import { useEffect, useRef, useState } from 'react'

/**
 * Animated ISL signer avatar.
 *
 * IMPORTANT — this is a placeholder motion engine, not a validated ISL
 * animation library. Real ISL is precise about handshape, orientation,
 * location and movement; a general-purpose procedural wave is not a
 * substitute for that and must never be presented as if it were.
 *
 * The component is written so a real motion source can be swapped in
 * without touching any page that renders <SignAvatar />: replace
 * `getMotionPose(motionId, t)` below with a lookup into validated
 * keyframe/pose data (keyed by the same `motionId` already present on
 * every vocabulary entry in src/data/signSchema.js), and everything
 * else — gender styling, controls, sequencing — keeps working.
 */

function hashSeed(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) % 1000
  }
  return h / 1000
}

// Placeholder pose generator. Produces smooth, bounded arm angles that
// change per motionId so different signs look visibly distinct, without
// claiming to reproduce any real ISL handshape or movement.
function getMotionPose(motionId, t) {
  const seed = hashSeed(motionId)
  const speedA = 1.6 + seed * 0.6
  const speedB = 1.1 + seed * 0.4

  return {
    leftShoulder: -18 + Math.sin(t * speedA + seed * 6.28) * 26,
    leftElbow: 18 + Math.sin(t * speedB + seed * 3.1) * 20,
    rightShoulder: 18 + Math.sin(t * speedA + seed * 6.28 + Math.PI) * 26,
    rightElbow: -18 + Math.sin(t * speedB + seed * 3.1 + Math.PI) * 20,
  }
}

const IDLE_POSE = { leftShoulder: -6, leftElbow: 8, rightShoulder: 6, rightElbow: -8 }

export default function SignAvatar({ gender = 'girl', currentSign, isPlaying, speed = 1 }) {
  const [pose, setPose] = useState(IDLE_POSE)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (!isPlaying || !currentSign) {
      setPose(IDLE_POSE)
      return undefined
    }

    startRef.current = null

    const tick = (timestamp) => {
      if (startRef.current == null) startRef.current = timestamp
      const elapsedSec = ((timestamp - startRef.current) / 1000) * speed
      setPose(getMotionPose(currentSign.motion_id || currentSign.sign, elapsedSec))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, currentSign, speed])

  const skin = '#E7B896'
  const isGirl = gender === 'girl'
  const outfit = isGirl ? '#2B4C7E' : '#1D3558'
  const hair = isGirl ? '#3B2A22' : '#241A15'

  return (
    <div className="sign-avatar">
      <svg viewBox="0 0 220 280" role="img" aria-label={`${isGirl ? 'Girl' : 'Boy'} ISL signer avatar${currentSign ? `, currently signing ${currentSign.sign}` : ''}`}>
        {/* Torso */}
        <rect x="70" y="140" width="80" height="90" rx="26" fill={outfit} />
        {isGirl && <path d="M70 230 L60 270 H160 L150 230 Z" fill={outfit} opacity="0.9" />}

        {/* Neck */}
        <rect x="100" y="110" width="20" height="26" rx="8" fill={skin} />

        {/* Left arm (viewer's left) */}
        <g transform={`rotate(${pose.leftShoulder} 78 148)`}>
          <rect x="70" y="148" width="16" height="55" rx="8" fill={outfit} />
          <g transform={`rotate(${pose.leftElbow} 78 200)`}>
            <rect x="70" y="200" width="14" height="50" rx="7" fill={skin} />
            <circle cx="77" cy="256" r="11" fill={skin} />
          </g>
        </g>

        {/* Right arm (viewer's right) */}
        <g transform={`rotate(${pose.rightShoulder} 142 148)`}>
          <rect x="134" y="148" width="16" height="55" rx="8" fill={outfit} />
          <g transform={`rotate(${pose.rightElbow} 142 200)`}>
            <rect x="136" y="200" width="14" height="50" rx="7" fill={skin} />
            <circle cx="143" cy="256" r="11" fill={skin} />
          </g>
        </g>

        {/* Head */}
        <circle cx="110" cy="80" r="42" fill={skin} />
        {/* Hair */}
        {isGirl ? (
          <path d="M66 78 A44 44 0 0 1 154 78 Q158 60 140 44 Q126 32 110 32 Q94 32 80 44 Q62 60 66 78 Z" fill={hair} />
        ) : (
          <path d="M68 70 A42 42 0 0 1 152 70 Q150 50 132 40 Q120 34 110 34 Q100 34 88 40 Q70 50 68 70 Z" fill={hair} />
        )}
        {isGirl && <path d="M150 78 Q168 90 158 118 Q150 108 150 90 Z" fill={hair} />}

        {/* Face */}
        <circle cx="96" cy="82" r="4" fill="#2A2018" />
        <circle cx="124" cy="82" r="4" fill="#2A2018" />
        <path d="M92 100 Q110 112 128 100" stroke="#8A5A3B" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      <div className="sign-avatar-caption">
        <span className="sign-avatar-word">{currentSign ? currentSign.sign : 'Idle'}</span>
        <span className="muted sign-avatar-note">Placeholder animation — connect validated ISL motion data for accurate signing.</span>
      </div>
    </div>
  )
}
