'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useInterval } from '@/hooks/useInterval';
import { motion } from 'framer-motion';

interface CharProps {
  char: string;
  isTyped: boolean;
  isCorrect: boolean;
  isCurrent: boolean;
  highlightStyle: 'character' | 'word' | 'caret';
}

const Char: React.FC<CharProps> = ({ char, isTyped, isCorrect, isCurrent, highlightStyle }) => {
  const getCharClass = () => {
    if (!isTyped) return 'text-muted-foreground/50';
    if (isCorrect) return 'text-green-500';
    return 'text-red-500 bg-red-500/20';
  };

  return (
    <span className={`${getCharClass()} ${isCurrent ? 'bg-blue-500/20' : ''}`}>
      {char}
    </span>
  );
};

interface WordProps {
  word: string;
  typed: string;
  isCurrent: boolean;
  isCompleted: boolean;
  highlightStyle: 'character' | 'word' | 'caret';
  onWordClick: () => void;
}

const Word: React.FC<WordProps> = React.memo(({ 
  word, 
  typed, 
  isCurrent, 
  isCompleted, 
  highlightStyle, 
  onWordClick 
}) => {
  const getWordClass = () => {
    if (highlightStyle === 'word') {
      if (isCompleted) {
        return typed === word ? 'bg-green-500/20' : 'bg-red-500/20';
      }
      if (isCurrent) return 'bg-blue-500/20';
    }
    return '';
  };

  return (
    <span 
      className={`mr-2 ${getWordClass()} cursor-pointer hover:bg-muted/50 rounded px-1`}
      onClick={onWordClick}
    >
      {word.split('').map((char, charIndex) => (
        <Char
          key={charIndex}
          char={char}
          isTyped={typed.length > charIndex}
          isCorrect={typed[charIndex] === char}
          isCurrent={isCurrent && charIndex === typed.length}
          highlightStyle={highlightStyle}
        />
      ))}
    </span>
  );
});

Word.displayName = 'Word';

export function TypingPanel() {
  const {
    passage,
    typed,
    cursor,
    isRunning,
    isFinished,
    highlightStyle,
    handleKey,
    tick,
    loadPassage,
    wordList,
    mode,
    duration,
    wordsTarget,
  } = useTypingStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load passage on mount
  useEffect(() => {
    if (passage.length === 0) {
      const count = mode === 'time' ? 100 : wordsTarget;
      loadPassage(wordList, count);
    }
  }, [passage.length, loadPassage, mode, wordsTarget, wordList]);

  // Tick every 100ms
  useInterval(() => {
    if (isRunning) {
      tick(100);
    }
  }, isRunning ? 100 : null);

  // Handle key events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault();
    
    if (e.key === 'Backspace') {
      handleKey('Backspace');
    } else if (e.key.length === 1) {
      handleKey(e.key);
    }
  }, [handleKey]);

  // Focus input when clicking on panel
  const handlePanelClick = () => {
    inputRef.current?.focus();
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (passage.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading passage...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Typing panel */}
      <motion.div
        ref={panelRef}
        className="relative bg-card border rounded-lg p-6 min-h-[200px] cursor-text select-none"
        onClick={handlePanelClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-lg leading-relaxed font-mono">
          {passage.map((word, wordIndex) => (
            <Word
              key={wordIndex}
              word={word}
              typed={typed[wordIndex] || ''}
              isCurrent={wordIndex === cursor.word}
              isCompleted={wordIndex < cursor.word}
              highlightStyle={highlightStyle}
              onWordClick={() => inputRef.current?.focus()}
            />
          ))}
        </div>

        {/* Caret indicator for caret mode */}
        {highlightStyle === 'caret' && (
          <div 
            className="absolute w-0.5 h-6 bg-blue-500 animate-pulse"
            style={{
              left: `${cursor.word * 50 + cursor.char * 8 + 24}px`,
              top: '24px',
            }}
          />
        )}
      </motion.div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        {!isRunning && !isFinished && 'Click on the text above and start typing to begin'}
        {isRunning && 'Test in progress...'}
        {isFinished && 'Test completed! Check your results below.'}
      </div>
    </div>
  );
}
