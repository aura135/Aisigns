import { useCallback, useEffect, useRef, useState } from 'react'
import { signToText } from '../services/api'

const INTERVAL_MS = Number(import.meta.env.VITE_RECOGNITION_INTERVAL_MS) || 1200

/**
 * Drives the sign-to-text loop: while `active`, repeatedly captures a
 * frame (via the supplied captureFrame function from useCamera) and sends
 * it to the real recognition API through services/api.js.
 *
 * This hook NEVER invents a recognized sign, a confidence score, or
 * appended sentence text. If the API is not configured or unreachable,
 * `apiConnected` becomes false and `lastError` explains why — the UI is
 * expected to show "Recognition model is not connected" in that case.
 */
export function useRecognition({ captureFrame, active }) {
  const [apiConnected, setApiConnected] = useState(null) // null = unknown yet
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastResult, setLastResult] = useState(null) // { sign, englishText, confidence }
  const [lastError, setLastError] = useState(null)
  const [history, setHistory] = useState([])
  const [sentence, setSentence] = useState('')

  const timerRef = useRef(null)

  const runOnce = useCallback(async () => {
    const frame = captureFrame()
    if (!frame) return

    setIsProcessing(true)
    try {
      const result = await signToText(frame)
      setApiConnected(true)
      setLastError(null)

      if (result && result.sign) {
        setLastResult(result)
        setHistory((prev) => [
          { ...result, timestamp: Date.now() },
          ...prev,
        ].slice(0, 25))
        if (result.englishText) {
          setSentence((prev) => (prev ? `${prev} ${result.englishText}` : result.englishText))
        }
      } else {
        setLastResult(null)
        setLastError({ code: 'NO_SIGN', message: 'No sign was detected.' })
      }
    } catch (err) {
      setLastResult(null)
      if (err.offline) {
        setApiConnected(false)
        setLastError({ code: 'OFFLINE', message: 'Recognition service is unavailable.' })
      } else {
        setApiConnected(true)
        setLastError({ code: 'API_ERROR', message: err.message || 'Recognition request failed.' })
      }
    } finally {
      setIsProcessing(false)
    }
  }, [captureFrame])

  useEffect(() => {
    if (!active) {
      clearInterval(timerRef.current)
      return undefined
    }
    runOnce()
    timerRef.current = setInterval(runOnce, INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [active, runOnce])

  const clearSentence = useCallback(() => setSentence(''), [])
  const clearHistory = useCallback(() => setHistory([]), [])

  return {
    apiConnected,
    isProcessing,
    lastResult,
    lastError,
    history,
    sentence,
    clearSentence,
    clearHistory,
  }
}
