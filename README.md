# SignBridge AI — Frontend

A two-way communication frontend between Indian Sign Language (ISL) users and
text/voice users, built with React + Vite.

```
SIGN USER: Real Camera → ISL Recognition API → English Text → Voice
TEXT USER: Text/Voice → Text-to-ISL API → ISL Sign Sequence → Animated Signer
```

This repository is the **frontend only**. It is fully functional on its own
(real camera, real browser speech, a complete UI for every flow) and is
built so a real backend can be plugged in later without any UI rewrites.

## Getting started

```bash
npm install
cp .env.example .env      # optional — see "Connecting a backend" below
npm run dev
```

Open the printed local URL. For camera/microphone access on a phone on your
network, use `npm run dev -- --host` and open the network URL over HTTPS or
`localhost` (most mobile browsers block camera access on plain HTTP over a
LAN IP — use a tunnel like ngrok, or test on desktop `localhost`, if needed).

## What works with no backend connected

- Real camera access (`navigator.mediaDevices.getUserMedia`) with full
  permission / no-camera / unsupported-browser handling.
- Real browser speech recognition (voice input) and speech synthesis
  (text-to-speech), where the browser supports them.
- Every page, route, and control in the app.
- A 150+ entry sample ISL vocabulary for the Vocabulary page.
- An animated boy/girl signer with a placeholder motion engine (clearly
  labeled as a placeholder — see "Connecting real ISL motion data" below).

With no backend configured, recognition and text-to-sign screens **honestly
report "not connected"** instead of inventing results. This is intentional.

## Connecting a backend

Set `VITE_API_BASE_URL` in `.env` to your backend's base URL. Every network
call lives in `src/services/api.js` and expects these endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Health check, drives the API status indicator |
| `/sign-to-text` | POST `{ image }` | One camera frame → `{ sign, englishText, confidence }` |
| `/text-to-sign` | POST `{ text }` | English text → `{ text, sign_sequence: [{ sign, motion_id }] }` |
| `/vocabulary` | GET | Full ISL vocabulary dataset (same shape as `src/data/signSchema.js`) |
| `/communication` | POST | Optional: log/relay a two-way conversation turn |
| `/auth/login` | POST `{ email, password }` | Returns `{ user }` |
| `/auth/signup` | POST `{ fullName, email, password }` | Returns `{ user }` |

If a provider you call from your backend needs a secret API key, keep that
key on your backend/proxy — never in this frontend or in `.env` committed to
git.

## Connecting real ISL motion data

`src/components/SignAvatar.jsx` currently generates a placeholder arm motion
per `motion_id` so different signs are visibly distinct in a demo. To use
real, validated ISL motion/pose data:

1. Replace `getMotionPose(motionId, t)` in `SignAvatar.jsx` with a lookup
   into your validated keyframe/pose library, keyed by the same `motionId`
   already present on every vocabulary entry and every `sign_sequence` item.
2. Everything else — controls, sequencing, boy/girl styling, the
   Communication and Vocabulary pages — keeps working unchanged.

## Project structure

```
src/
├── components/     Navbar, Footer, CameraPanel, RecognitionPanel,
│                   SignSequence, SignAvatar, ChatBubble, StatusIndicator
├── pages/          Landing, Login, Signup, RoleSelection, Profile,
│                   SignToText, TextToSign, Communication, Vocabulary,
│                   HowItWorks
├── services/api.js Centralized API layer (the only place fetch() is called)
├── hooks/          useCamera, useSpeech, useRecognition
├── data/           signSchema.js — vocabulary shape + sample dataset
├── context/        AppContext — session, role, signer, live API status
└── index.css       Design tokens + all component/page styles
```

## Notes on "no fake AI"

- No random recognition results, confidence scores, or gestures.
- No fake authentication — login/signup call a real API; when no backend is
  configured, the UI says so and offers an explicit, clearly-labeled demo
  mode rather than pretending an account was created.
- The animated signer is explicitly labeled as a placeholder until real
  motion data is connected.
