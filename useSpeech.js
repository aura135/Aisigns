import { useCallback, useEffect, useRef, useState } from 'react'

const SpeechRecognitionImpl =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

/**
 * Wraps the browser's native Web Speech API. Nothing here is simulated:
 * if a browser doesn't support SpeechRecognition or speechSynthesis, the
 * relevant feature is reported as unsupported rather than faked.
 */
export function useSpeech() {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognitionError, setRecognitionError] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speechRecognitionSupported = Boolean(SpeechRecognitionImpl)
  const speechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!speechRecognitionSupported) return undefined

    const recognition = new SpeechRecognitionImpl()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    recognition.onresult = (event) => {
      let text = ''
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }

    recognition.onerror = (event) => {
      setRecognitionError(event.error || 'unknown_error')
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    return () => recognition.stop()
  }, [speechRecognitionSupported])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setRecognitionError(null)
    setTranscript('')
    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch {
      // start() throws if already started — ignore.
    }
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const speak = useCallback((text) => {
    if (!speechSynthesisSupported || !text) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [speechSynthesisSupported])

  const stopSpeaking = useCallback(() => {
    if (!speechSynthesisSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [speechSynthesisSupported])

  return {
    speechRecognitionSupported,
    speechSynthesisSupported,
    isListening,
    transcript,
    recognitionError,
    startListening,
    stopListening,
    isSpeaking,
    speak,
    stopSpeaking,
    setTranscript,
  }
}
