import { simpleWords } from './words/simple';
import { advancedWords } from './words/advanced';

export type WordList = 'simple' | 'advanced';

export interface TypingStats {
  correctChars: number;
  incorrectChars: number;
  typedChars: number;
  completedWords: number;
  currentWordIndex: number;
  currentCharIndex: number;
  elapsedMs: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  netWpm: number;
}

export interface WpmDataPoint {
  t: number;
  wpm: number;
}

export function generatePassage(wordList: WordList, count: number): string[] {
  const words = wordList === 'simple' ? simpleWords : advancedWords;
  const passage: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    passage.push(words[randomIndex]);
  }
  
  return passage;
}

export function calculateWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs === 0) return 0;
  // WPM = (correct characters / 5) / (elapsed time in minutes)
  return (correctChars / 5) / (elapsedMs / 60000);
}

export function calculateAccuracy(correctChars: number, typedChars: number): number {
  if (typedChars === 0) return 100;
  return (correctChars / typedChars) * 100;
}

export function calculateRawWpm(typedChars: number, elapsedMs: number): number {
  if (elapsedMs === 0) return 0;
  return (typedChars / 5) / (elapsedMs / 60000);
}

export function calculateNetWpm(correctChars: number, incorrectChars: number, elapsedMs: number): number {
  if (elapsedMs === 0) return 0;
  const netChars = Math.max(0, correctChars - incorrectChars);
  return (netChars / 5) / (elapsedMs / 60000);
}

export function getWordList(wordList: WordList): string[] {
  return wordList === 'simple' ? simpleWords : advancedWords;
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

export function formatWpm(wpm: number): string {
  return Math.floor(wpm).toString();
}

export function formatAccuracy(accuracy: number): string {
  return accuracy.toFixed(1);
}
