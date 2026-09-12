import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Real browser camera access via navigator.mediaDevices.getUserMedia.
 * No fake video, no simulated frames — if there is no camera or
 * permission is refused, this hook surfaces that honestly.
 */
export function useCamera({ facingMode = 'user' } = {}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [status, setStatus] = useState('idle') // idle | starting | live | stopped | error
  const [error, setError] = useState(null)

  const isSupported = typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStatus('stopped')
  }, [])

  const start = useCallback(async () => {
    setError(null)

    if (!isSupported) {
      setStatus('error')
      setError({
        code: 'UNSUPPORTED',
        message: 'Your browser does not support camera access.',
      })
      return
    }

    setStatus('starting')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }

      setStatus('live')
    } catch (err) {
      setStatus('error')

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError({ code: 'PERMISSION_DENIED', message: 'Camera permission was denied.' })
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError({ code: 'NO_CAMERA', message: 'No camera detected on this device.' })
      } else if (err.name === 'NotReadableError') {
        setError({ code: 'CAMERA_IN_USE', message: 'The camera is already in use by another app.' })
      } else {
        setError({ code: 'UNKNOWN', message: 'Could not start the camera. Please try again.' })
      }
    }
  }, [facingMode, isSupported])

  // Always release the camera when the component unmounts.
  useEffect(() => () => stop(), [stop])

  /** Grabs the current video frame as a base64 JPEG data URL, or null if not live. */
  const captureFrame = useCallback(({ quality = 0.8 } = {}) => {
    const video = videoRef.current
    if (!video || status !== 'live' || !video.videoWidth) return null

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', quality)
  }, [status])

  return { videoRef, status, error, isSupported, start, stop, captureFrame }
}
