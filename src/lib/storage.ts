export interface TypingResult {
  id: string;
  timestamp: number;
  mode: 'time' | 'words';
  duration?: number;
  wordsTarget?: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  netWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  completedWords: number;
  wordList: 'simple' | 'advanced';
  highlightStyle: 'character' | 'word' | 'caret';
}

const STORAGE_KEY = 'typing-results';

export function saveTypingResult(result: Omit<TypingResult, 'id' | 'timestamp'>): void {
  try {
    const existingResults = getTypingResults();
    const newResult: TypingResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    const updatedResults = [newResult, ...existingResults].slice(0, 100); // Keep last 100 results
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Failed to save typing result:', error);
  }
}

export function getTypingResults(): TypingResult[] {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get typing results:', error);
    return [];
  }
}

export function deleteTypingResult(id: string): void {
  try {
    const existingResults = getTypingResults();
    const updatedResults = existingResults.filter(result => result.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Failed to delete typing result:', error);
  }
}

export function clearAllTypingResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear typing results:', error);
  }
}

export function getTypingResultsByMode(mode: 'time' | 'words'): TypingResult[] {
  return getTypingResults().filter(result => result.mode === mode);
}

export function getTypingResultsByWordList(wordList: 'simple' | 'advanced'): TypingResult[] {
  return getTypingResults().filter(result => result.wordList === wordList);
}

export function getAverageWpm(results: TypingResult[]): number {
  if (results.length === 0) return 0;
  const totalWpm = results.reduce((sum, result) => sum + result.wpm, 0);
  return totalWpm / results.length;
}

export function getBestWpm(results: TypingResult[]): number {
  if (results.length === 0) return 0;
  return Math.max(...results.map(result => result.wpm));
}

export function getAverageAccuracy(results: TypingResult[]): number {
  if (results.length === 0) return 0;
  const totalAccuracy = results.reduce((sum, result) => sum + result.accuracy, 0);
  return totalAccuracy / results.length;
}
