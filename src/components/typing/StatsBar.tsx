'use client';

import { useTypingStore } from '@/store/useTypingStore';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Target, Zap, CheckCircle, XCircle } from 'lucide-react';
import { calculateWpm, calculateAccuracy, calculateRawWpm, calculateNetWpm, formatTime, formatWpm, formatAccuracy } from '@/lib/typingEngine';
import { motion } from 'framer-motion';

export function StatsBar() {
  const {
    mode,
    duration,
    wordsTarget,
    elapsedMs,
    isRunning,
    isFinished,
    stats,
    wpmSeries,
  } = useTypingStore();

  // Calculate current stats
  const currentWpm = calculateWpm(stats.correct, elapsedMs);
  const currentAccuracy = calculateAccuracy(stats.correct, stats.typed);
  const currentRawWpm = calculateRawWpm(stats.typed, elapsedMs);
  const currentNetWpm = calculateNetWpm(stats.correct, stats.incorrect, elapsedMs);

  // Get the latest WPM from series for display
  const latestWpm = wpmSeries.length > 0 ? wpmSeries[wpmSeries.length - 1].wpm : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* WPM */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-muted-foreground">WPM</span>
          </div>
          <motion.div
            key={Math.floor(currentWpm)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-foreground"
          >
            {formatWpm(currentWpm)}
          </motion.div>
          <div className="text-xs text-muted-foreground mt-1">
            Net: {formatWpm(currentNetWpm)}
          </div>
        </CardContent>
      </Card>

      {/* Timer */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Timer className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">
              {mode === 'time' ? 'Time Left' : 'Elapsed'}
            </span>
          </div>
          <motion.div
            key={Math.floor(elapsedMs / 1000)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-foreground"
          >
            {mode === 'time' 
              ? formatTime(Math.max(0, duration * 1000 - elapsedMs))
              : formatTime(elapsedMs)
            }
          </motion.div>
          <div className="text-xs text-muted-foreground mt-1">
            {mode === 'time' ? `${duration}s test` : `${wordsTarget} words`}
          </div>
        </CardContent>
      </Card>

      {/* Accuracy */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
          </div>
          <motion.div
            key={Math.floor(currentAccuracy)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-foreground"
          >
            {formatAccuracy(currentAccuracy)}%
          </motion.div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.typed} chars typed
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {mode === 'time' 
              ? Math.min(100, Math.round((elapsedMs / (duration * 1000)) * 100))
              : Math.min(100, Math.round((stats.typed / (wordsTarget * 5)) * 100))
            }%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.correct} correct, {stats.incorrect} errors
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
