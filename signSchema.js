/**
 * ISL vocabulary architecture.
 *
 * This file defines the SHAPE every sign entry must have, plus a static
 * sample dataset large enough (150-200+ entries) to exercise the UI:
 * search, category filters, alphabetical filtering, and sign cards.
 *
 * This is NOT a recognition dataset. Listing a word here does not mean
 * the camera can recognize it — recognition only ever comes from the
 * connected ISL model/API (see services/api.js -> signToText). When a
 * real vocabulary API is connected, getVocabulary() in services/api.js
 * should return entries in this same shape and can fully replace or
 * extend SAMPLE_VOCABULARY below without any component changes.
 *
 * Sign entry shape:
 * {
 *   id: string                 // stable unique id, e.g. "GRE-001"
 *   englishWord: string        // "Hello"
 *   islLabel: string           // short ISL gloss label, e.g. "HELLO"
 *   category: string           // one of VOCAB_CATEGORIES
 *   description: string        // one line describing how/when it's used
 *   motionId: string           // key into a future motion/animation library
 *   animationRef: string|null  // reference to validated motion data, once connected
 *   recognitionClass: string   // class label the recognition model would output
 *   recognitionConfidenceThreshold: number // 0-1, minimum model confidence to accept a match
 * }
 */

export const VOCAB_CATEGORIES = [
  'Greetings',
  'Common Words',
  'Family',
  'Food',
  'Education',
  'Emotions',
  'Actions',
  'Questions',
  'Places',
  'Time',
  'Numbers',
  'Emergency',
  'Daily Conversation',
]

const WORDS_BY_CATEGORY = {
  Greetings: [
    'Hello', 'Good Morning', 'Good Afternoon', 'Good Evening', 'Good Night',
    'How Are You', 'Nice To Meet You', 'Welcome', 'Goodbye', 'See You Later',
    'Thank You', 'Please', 'Sorry', 'Excuse Me',
  ],
  'Common Words': [
    'Yes', 'No', 'Okay', 'Maybe', 'Again', 'Wait', 'Stop', 'Come', 'Go',
    'Help', 'Name', 'Understand', 'Know', 'Forget',
  ],
  Family: [
    'Mother', 'Father', 'Sister', 'Brother', 'Grandmother', 'Grandfather',
    'Son', 'Daughter', 'Husband', 'Wife', 'Friend', 'Uncle', 'Aunt', 'Baby',
  ],
  Food: [
    'Water', 'Food', 'Rice', 'Bread', 'Milk', 'Tea', 'Coffee', 'Fruit',
    'Vegetable', 'Sweet', 'Spicy', 'Hungry', 'Thirsty', 'Eat',
  ],
  Education: [
    'School', 'Teacher', 'Student', 'Book', 'Study', 'Write', 'Read',
    'Exam', 'Question', 'Answer', 'Class', 'Homework', 'Learn', 'College',
  ],
  Emotions: [
    'Happy', 'Sad', 'Angry', 'Afraid', 'Surprised', 'Tired', 'Excited',
    'Worried', 'Proud', 'Bored', 'Confused', 'Calm', 'Nervous', 'Grateful',
  ],
  Actions: [
    'Walk', 'Run', 'Sit', 'Stand', 'Sleep', 'Work', 'Play', 'Drive',
    'Cook', 'Clean', 'Open', 'Close', 'Give', 'Take',
  ],
  Questions: [
    'What', 'When', 'Where', 'Who', 'Why', 'How', 'Which', 'How Much',
    'How Many', 'Whose', 'Can You', 'Is It',
  ],
  Places: [
    'Home', 'Hospital', 'Market', 'Station', 'Airport', 'Office', 'Bank',
    'Temple', 'Park', 'Restaurant', 'Bus Stop', 'City', 'Village', 'Road',
  ],
  Time: [
    'Today', 'Tomorrow', 'Yesterday', 'Morning', 'Afternoon', 'Evening',
    'Night', 'Week', 'Month', 'Year', 'Hour', 'Minute', 'Now', 'Later',
  ],
  Numbers: [
    'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Hundred', 'Thousand', 'First', 'Second',
  ],
  Emergency: [
    'Emergency', 'Help Me', 'Doctor', 'Ambulance', 'Police', 'Fire',
    'Accident', 'Danger', 'Medicine', 'Pain', 'Injured', 'Safe',
  ],
  'Daily Conversation': [
    'I Am Fine', 'What Is Your Name', 'Where Are You Going', 'I Am Sorry',
    'I Love You', 'Congratulations', 'Happy Birthday', 'Take Care',
    'See You Tomorrow', 'I Am Busy', 'Call Me', 'Wait For Me',
    'Let Us Go', 'I Do Not Know',
  ],
}

const CATEGORY_CODE = {
  Greetings: 'GRE',
  'Common Words': 'COM',
  Family: 'FAM',
  Food: 'FOO',
  Education: 'EDU',
  Emotions: 'EMO',
  Actions: 'ACT',
  Questions: 'QUE',
  Places: 'PLA',
  Time: 'TIM',
  Numbers: 'NUM',
  Emergency: 'EMG',
  'Daily Conversation': 'DLY',
}

function toMotionId(word) {
  return word.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function buildVocabulary() {
  const entries = []

  Object.entries(WORDS_BY_CATEGORY).forEach(([category, words]) => {
    words.forEach((word, index) => {
      const code = CATEGORY_CODE[category]
      const id = `${code}-${String(index + 1).padStart(3, '0')}`
      const motionId = toMotionId(word)
      entries.push({
        id,
        englishWord: word,
        islLabel: motionId,
        category,
        description: `Used in everyday ${category.toLowerCase()} contexts.`,
        motionId,
        animationRef: null,
        recognitionClass: motionId,
        recognitionConfidenceThreshold: 0.75,
      })
    })
  })

  return entries
}

/** Static sample vocabulary (150-200+ entries) used until a real API is connected. */
export const SAMPLE_VOCABULARY = buildVocabulary()

export const VOCAB_TOTAL_COUNT = SAMPLE_VOCABULARY.length
