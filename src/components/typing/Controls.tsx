'use client';

import { useTypingStore } from '@/store/useTypingStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RefreshCcw, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export function Controls() {
  const {
    mode,
    duration,
    wordsTarget,
    wordList,
    highlightStyle,
    highlightInputOnError,
    isRunning,
    isFinished,
    setConfig,
    reset,
    loadPassage,
  } = useTypingStore();

  const handleModeChange = (value: string) => {
    if (value === 'time' || value === 'words') {
      setConfig({ mode: value });
      const count = value === 'time' ? 100 : wordsTarget;
      loadPassage(wordList, count);
    }
  };

  const handleDurationChange = (value: string) => {
    const newDuration = parseInt(value);
    if (!isNaN(newDuration)) {
      setConfig({ duration: newDuration });
      loadPassage(wordList, 100);
    }
  };

  const handleWordsTargetChange = (value: string) => {
    const newTarget = parseInt(value);
    if (!isNaN(newTarget)) {
      setConfig({ wordsTarget: newTarget });
      loadPassage(wordList, newTarget);
    }
  };

  const handleWordListChange = (value: string) => {
    if (value === 'simple' || value === 'advanced') {
      setConfig({ wordList: value });
      const count = mode === 'time' ? 100 : wordsTarget;
      loadPassage(value, count);
    }
  };

  const handleHighlightStyleChange = (value: string) => {
    if (value === 'character' || value === 'word' || value === 'caret') {
      setConfig({ highlightStyle: value });
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleTestAgain = () => {
    reset();
    const count = mode === 'time' ? 100 : wordsTarget;
    loadPassage(wordList, count);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Test Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Test Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Test Mode</label>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={handleModeChange}
            disabled={isRunning}
            className="w-full"
          >
            <ToggleGroupItem value="time" className="flex-1">
              Time
            </ToggleGroupItem>
            <ToggleGroupItem value="words" className="flex-1">
              Words
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Duration/Word Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {mode === 'time' ? 'Duration' : 'Word Count'}
          </label>
          <Select
            value={mode === 'time' ? duration.toString() : wordsTarget.toString()}
            onValueChange={mode === 'time' ? handleDurationChange : handleWordsTargetChange}
            disabled={isRunning}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mode === 'time' ? (
                <>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="10">10 words</SelectItem>
                  <SelectItem value="25">25 words</SelectItem>
                  <SelectItem value="50">50 words</SelectItem>
                  <SelectItem value="100">100 words</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Word List */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Word List</label>
          <Select value={wordList} onValueChange={handleWordListChange} disabled={isRunning}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Highlight Style */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Highlight Style</label>
          <Select value={highlightStyle} onValueChange={handleHighlightStyleChange} disabled={isRunning}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="character">Character</SelectItem>
              <SelectItem value="word">Word</SelectItem>
              <SelectItem value="caret">Caret</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {!isRunning && !isFinished && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={isRunning}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        )}

        {isFinished && (
          <Button
            onClick={handleTestAgain}
            className="flex items-center space-x-2"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Test Again</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
