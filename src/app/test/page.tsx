'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTypingStore } from '@/store/useTypingStore';
import { TypingPanel } from '@/components/typing/TypingPanel';
import { StatsBar } from '@/components/typing/StatsBar';
import { Controls } from '@/components/typing/Controls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { saveTypingResult } from '@/lib/storage';

function TestPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setConfig, loadPassage, wordList, mode, duration, wordsTarget } = useTypingStore();

  // Handle URL parameters for quick test start
  useEffect(() => {
    const durationParam = searchParams.get('duration');
    if (durationParam) {
      const durationValue = parseInt(durationParam);
      if (!isNaN(durationValue)) {
        setConfig({ mode: 'time', duration: durationValue });
        loadPassage(wordList, 100);
      }
    }
  }, [searchParams, setConfig, loadPassage, wordList]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Typing Test</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure your test settings below, then start typing to begin. 
            Your progress will be tracked in real-time.
          </p>
        </div>

        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Test Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controls />
          </CardContent>
        </Card>

        {/* Live Statistics */}
        <StatsBar />

        {/* Typing Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Type the passage below</CardTitle>
          </CardHeader>
          <CardContent>
            <TypingPanel />
          </CardContent>
        </Card>

        {/* Results Summary (shown when test is finished) */}
        <TestResults />
      </motion.div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestPageContent />
    </Suspense>
  );
}

function TestResults() {
  const { isFinished, stats, elapsedMs, mode, duration, wordsTarget, wordList, highlightStyle } = useTypingStore();

  useEffect(() => {
    if (isFinished && stats.typed > 0) {
      // Calculate final stats
      const finalWpm = (stats.correct / 5) / (elapsedMs / 60000);
      const finalAccuracy = (stats.correct / stats.typed) * 100;
      const finalRawWpm = (stats.typed / 5) / (elapsedMs / 60000);
      const finalNetWpm = Math.max(0, (stats.correct - stats.incorrect) / 5) / (elapsedMs / 60000);

      // Save result
      saveTypingResult({
        mode,
        duration: mode === 'time' ? duration : undefined,
        wordsTarget: mode === 'words' ? wordsTarget : undefined,
        wpm: finalWpm,
        accuracy: finalAccuracy,
        rawWpm: finalRawWpm,
        netWpm: finalNetWpm,
        correctChars: stats.correct,
        incorrectChars: stats.incorrect,
        totalChars: stats.typed,
        completedWords: Math.floor(stats.typed / 5),
        wordList,
        highlightStyle,
      });
    }
  }, [isFinished, stats, elapsedMs, mode, duration, wordsTarget, wordList, highlightStyle]);

  if (!isFinished) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">Test Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.floor((stats.correct / 5) / (elapsedMs / 60000))}
              </div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {((stats.correct / stats.typed) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(elapsedMs / 1000)}s
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your result has been saved. View all results in the{' '}
              <a href="/results" className="text-blue-600 dark:text-blue-400 hover:underline">
                Results page
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
