import { create } from 'zustand';
import { generatePassage, calculateWpm, calculateAccuracy, calculateRawWpm, calculateNetWpm } from '@/lib/typingEngine';
import type { WordList, WpmDataPoint } from '@/lib/typingEngine';

export type TestMode = 'time' | 'words';
export type HighlightStyle = 'character' | 'word' | 'caret';

export interface TypingState {
  // Configuration
  mode: TestMode;
  duration: number; // seconds
  wordsTarget: number;
  wordList: WordList;
  highlightStyle: HighlightStyle;
  highlightInputOnError: boolean;
  
  // Test state
  passage: string[];
  typed: string[];
  cursor: { word: number; char: number };
  startedAt: number | null;
  elapsedMs: number;
  isRunning: boolean;
  isFinished: boolean;
  
  // Statistics
  stats: {
    correct: number;
    incorrect: number;
    typed: number;
  };
  
  // WPM tracking over time
  wpmSeries: WpmDataPoint[];
  
  // Actions
  loadPassage: (wordList: WordList, count: number) => void;
  start: () => void;
  stop: () => void;
  reset: (config?: Partial<Pick<TypingState, 'mode' | 'duration' | 'wordsTarget' | 'wordList' | 'highlightStyle' | 'highlightInputOnError'>>) => void;
  handleKey: (char: string) => void;
  tick: (ms: number) => void;
  setConfig: (config: Partial<Pick<TypingState, 'mode' | 'duration' | 'wordsTarget' | 'wordList' | 'highlightStyle' | 'highlightInputOnError'>>) => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  // Initial state
  mode: 'time',
  duration: 60,
  wordsTarget: 25,
  wordList: 'simple',
  highlightStyle: 'character',
  highlightInputOnError: true,
  
  passage: [],
  typed: [],
  cursor: { word: 0, char: 0 },
  startedAt: null,
  elapsedMs: 0,
  isRunning: false,
  isFinished: false,
  
  stats: {
    correct: 0,
    incorrect: 0,
    typed: 0,
  },
  
  wpmSeries: [],
  
  // Actions
  loadPassage: (wordList: WordList, count: number) => {
    const passage = generatePassage(wordList, count);
    set({
      passage,
      typed: new Array(passage.length).fill(''),
      cursor: { word: 0, char: 0 },
      stats: { correct: 0, incorrect: 0, typed: 0 },
      wpmSeries: [],
    });
  },
  
  start: () => {
    const { passage } = get();
    if (passage.length === 0) return;
    
    set({
      startedAt: Date.now(),
      isRunning: true,
      isFinished: false,
      elapsedMs: 0,
    });
  },
  
  stop: () => {
    set({
      isRunning: false,
      isFinished: true,
    });
  },
  
  reset: (config = {}) => {
    const { mode, duration, wordsTarget, wordList, highlightStyle, highlightInputOnError } = get();
    const newConfig = { mode, duration, wordsTarget, wordList, highlightStyle, highlightInputOnError, ...config };
    
    set({
      ...newConfig,
      passage: [],
      typed: [],
      cursor: { word: 0, char: 0 },
      startedAt: null,
      elapsedMs: 0,
      isRunning: false,
      isFinished: false,
      stats: { correct: 0, incorrect: 0, typed: 0 },
      wpmSeries: [],
    });
    
    // Load new passage if config changed
    if (config.wordList || config.mode || config.duration || config.wordsTarget) {
      const count = newConfig.mode === 'time' ? 100 : newConfig.wordsTarget;
      get().loadPassage(newConfig.wordList, count);
    }
  },
  
  handleKey: (char: string) => {
    const { passage, typed, cursor, isRunning, isFinished, mode, duration, wordsTarget } = get();
    
    if (isFinished) return;
    
    // Start timer on first keypress
    if (!isRunning && !isFinished) {
      get().start();
    }
    
    // Handle backspace
    if (char === 'Backspace') {
      if (cursor.char > 0) {
        // Move back one character in current word
        const newTyped = [...typed];
        const currentWord = newTyped[cursor.word];
        newTyped[cursor.word] = currentWord.slice(0, -1);
        
        set({
          typed: newTyped,
          cursor: { ...cursor, char: cursor.char - 1 },
        });
      } else if (cursor.word > 0) {
        // Move to previous word
        const newTyped = [...typed];
        const prevWord = newTyped[cursor.word - 1];
        const newCharIndex = prevWord.length;
        
        set({
          cursor: { word: cursor.word - 1, char: newCharIndex },
        });
      }
      return;
    }
    
    // Handle regular characters
    if (char.length === 1 && char.charCodeAt(0) >= 32) {
      const newTyped = [...typed];
      const currentWord = newTyped[cursor.word] || '';
      newTyped[cursor.word] = currentWord + char;
      
      const newCursor = { ...cursor, char: cursor.char + 1 };
      
      // Check if word is complete
      if (newCursor.char >= passage[cursor.word].length) {
        if (newCursor.word < passage.length - 1) {
          newCursor.word++;
          newCursor.char = 0;
        } else {
          // Test completed
          get().stop();
        }
      }
      
      // Update stats
      const expectedChar = passage[cursor.word][cursor.char];
      const isCorrect = char === expectedChar;
      
      set((state) => ({
        typed: newTyped,
        cursor: newCursor,
        stats: {
          correct: state.stats.correct + (isCorrect ? 1 : 0),
          incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
          typed: state.stats.typed + 1,
        },
      }));
    }
  },
  
  tick: (ms: number) => {
    const { isRunning, startedAt, mode, duration, wordsTarget, passage, typed, cursor } = get();
    
    if (!isRunning || !startedAt) return;
    
    const newElapsedMs = Date.now() - startedAt;
    
    // Check if time-based test should end
    if (mode === 'time' && newElapsedMs >= duration * 1000) {
      get().stop();
      return;
    }
    
    // Check if word-based test should end
    if (mode === 'words' && cursor.word >= wordsTarget) {
      get().stop();
      return;
    }
    
    set({ elapsedMs: newElapsedMs });
    
    // Update WPM series every second
    if (Math.floor(newElapsedMs / 1000) > Math.floor(get().elapsedMs / 1000)) {
      const currentWpm = calculateWpm(get().stats.correct, newElapsedMs);
      set((state) => ({
        wpmSeries: [...state.wpmSeries, { t: Math.floor(newElapsedMs / 1000), wpm: currentWpm }],
      }));
    }
  },
  
  setConfig: (config) => {
    set(config);
  },
}));



