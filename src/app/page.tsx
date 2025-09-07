'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Keyboard, BarChart3, RefreshCw, ChevronRight, Settings, Minus, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("60");
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [incorrectWords, setIncorrectWords] = useState<Set<number>>(new Set());
  const [typingHistory, setTypingHistory] = useState<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentLetterRef = useRef<HTMLSpanElement>(null);
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLParagraphElement>(null);

  // Sample words for the demo (40+ words)
  const demoWords = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "while", "typing",
    "quickly", "and", "accurately", "with", "proper", "technique", "this", "sentence", "contains", "many",
    "different", "words", "to", "practice", "your", "typing", "speed", "improve", "skills", "daily",
    "practice", "makes", "perfect", "keep", "going", "forward", "never", "give", "up", "success",
    "comes", "through", "dedication", "and", "hard", "work", "every", "day", "counts", "towards",
    "your", "goals", "dreams", "achievement", "excellence", "mastery", "skill", "development"
  ];

  useEffect(() => {
    if (isTyping && startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
        
        // Calculate WPM
        if (elapsed > 0) {
          const minutes = elapsed / 60000;
          const newWpm = Math.round((correctChars / 5) / minutes);
          setWpm(newWpm);
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTyping, startTime, correctChars]);

  // Request notification permission on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      // Show a subtle notification permission request
      const requestPermission = () => {
        Notification.requestPermission();
      };
      
      // Request permission after a short delay to not be intrusive
      const timer = setTimeout(requestPermission, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // GSAP blinking animation for current letter only
  useEffect(() => {
    // Kill all existing GSAP animations first
    gsap.killTweensOf("*");
      
    // Only create blinking effect for the current character in the current word
    if (currentLetterRef.current && isTyping) {
      gsap.to(currentLetterRef.current, {
        opacity: 0.3,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  }, [currentCharIndex, currentWordIndex, isTyping]);

  // GSAP typing animation for hero text
  useEffect(() => {
    if (heroTextRef.current) {
      const text = heroTextRef.current.textContent || '';
      heroTextRef.current.textContent = '';
      
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          heroTextRef.current!.textContent = text.slice(0, currentIndex + 1) + '|';
          currentIndex++;
        } else {
          // Remove the cursor when typing is complete
          heroTextRef.current!.textContent = text;
          clearInterval(typeInterval);
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    }
  }, []);

  // Countdown effect
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    
    if (isCountdownActive && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsCountdownActive(false);
            setIsTyping(false);
            setShowCompletion(true);
            
            // Show completion notification with results
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (Notification.permission === 'granted') {
                new Notification('Typing Test Complete!', {
                  body: `Time: ${parseInt(selectedTime)}s | WPM: ${wpm} | Accuracy: ${accuracy}%`,
                  icon: '/favicon.ico',
                  badge: '/favicon.ico'
                });
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification('Typing Test Complete!', {
                      body: `Time: ${parseInt(selectedTime)}s | WPM: ${wpm} | Accuracy: ${accuracy}%`,
                      icon: '/favicon.ico',
                      badge: '/favicon.ico'
                    });
                  }
                });
              }
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [isCountdownActive, countdown, selectedTime, wpm, accuracy]);

  // Auto-scroll to current character when typing
  useEffect(() => {
    if (isTyping && currentCharIndex > 0) {
      setTimeout(() => scrollToCurrentWord(), 50);
    }
  }, [currentCharIndex, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentWord = demoWords[currentWordIndex];
    const maxLength = currentWord.length;
    
    // Limit input to the exact word length + 1 (to allow spacebar)
    if (value.length > maxLength + 1) {
      return; // Don't allow typing beyond word length + space
    }
    
    if (!isTyping) {
      setIsTyping(true);
      setStartTime(Date.now());
      setIsCountdownActive(true);
      setCountdown(parseInt(selectedTime));
    }

    // Check if word is completed (when user types exact character count AND presses spacebar)
    if (value.endsWith(' ') && value.trim().length === demoWords[currentWordIndex].length) {
      const word = value.trim();
      const expectedWord = demoWords[currentWordIndex];
      
      // Word completion is based on character count, not spelling correctness
      const wordLength = expectedWord.length;
      
      // Count correct characters for this word
      let correctCharsInWord = 0;
      for (let i = 0; i < Math.min(word.length, expectedWord.length); i++) {
        if (word[i] === expectedWord[i]) {
          correctCharsInWord++;
        }
      }
      
      // Update character counts
      setTotalChars(prev => prev + wordLength);
      setCorrectChars(prev => prev + correctCharsInWord);
      setTypedWords(prev => [...prev, word]);
      setCurrentWordIndex(prev => prev + 1);
      setCurrentInput('');
      setCurrentCharIndex(0);
      setErrors(new Set()); // Clear errors for next word
      
      // Update canGoBack state
      setCanGoBack(true);
      
      // Scroll to the new word
      setTimeout(() => scrollToCurrentWord(), 100);
      
      // Calculate accuracy based on character count, not spelling correctness
      const newAccuracy = ((correctChars + correctCharsInWord) / (totalChars + wordLength)) * 100;
      setAccuracy(Math.round(newAccuracy));
      
      // Ensure input is focused and ready for next word
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Force the input to be empty and ready
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        }
      }, 50);
      
      return; // Exit early after word completion
    }
    
    // Clean the input value (remove any trailing spaces that might interfere)
    const cleanValue = value.replace(/\s+$/, '');
    setCurrentInput(cleanValue);
    
    // Update current character index for visual feedback
    setCurrentCharIndex(cleanValue.length);
    
     // Check character accuracy for current word
     if (cleanValue.length > 0) {
       const currentChar = cleanValue[cleanValue.length - 1];
       const expectedChar = currentWord[cleanValue.length - 1];
       
       if (currentChar === expectedChar) {
         // Remove from errors if it was previously marked as error
         setErrors(prev => {
           const newErrors = new Set(prev);
           newErrors.delete(cleanValue.length - 1);
           return newErrors;
         });
         // Increment correct characters
         setCorrectChars(prev => prev + 1);
       } else {
         // Mark as error (including spaces)
         setErrors(prev => new Set([...prev, cleanValue.length - 1]));
       }
     }
    

    

  };

  const handleReset = () => {
    setCurrentWordIndex(0);
    setTypedWords([]);
    setCurrentInput('');
    setIsTyping(false);
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setCurrentCharIndex(0);
    setErrors(new Set());
    setIncorrectWords(new Set());
    setTypingHistory([]);
    setCanGoBack(false);
    setIsCountdownActive(false);
    setCountdown(parseInt(selectedTime));
    setShowCompletion(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setCountdown(parseInt(time));
    setIsDrawerOpen(false);
    handleReset();
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      // Position cursor at the beginning of the current word
      setCurrentCharIndex(0);
      // Ensure input is ready for typing
      setCurrentInput('');
    }
  };

  const handleWordClick = (wordIndex: number) => {
    if (inputRef.current) {
      inputRef.current.focus();
      
      if (wordIndex === currentWordIndex) {
        // Clicked on current word - position cursor at beginning
        setCurrentCharIndex(0);
        setCurrentInput('');
      } else if (wordIndex < currentWordIndex) {
        // Clicked on completed word - go back to that word
        goBackToPreviousWord();
      } else {
        // Clicked on upcoming word - stay on current word but reset input
        setCurrentCharIndex(0);
        setCurrentInput('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go back to previous word
    if (e.key === 'Backspace' && currentInput === '' && currentWordIndex > 0) {
      e.preventDefault();
      goBackToPreviousWord();
    }
  };

  const goBackToPreviousWord = () => {
    if (currentWordIndex > 0) {
      const newWordIndex = currentWordIndex - 1;
      const previousWord = typedWords[newWordIndex] || '';
      
      setCurrentWordIndex(newWordIndex);
      setCurrentInput(previousWord);
      setCurrentCharIndex(previousWord.length);
      
      // Remove the last word from typed words
      setTypedWords(prev => prev.slice(0, -1));
      
       // Update accuracy and character counts
       const wordLength = demoWords[newWordIndex].length;
       
       // Count correct characters in the word we're going back to
       let correctCharsInWord = 0;
       for (let i = 0; i < Math.min(previousWord.length, demoWords[newWordIndex].length); i++) {
         if (previousWord[i] === demoWords[newWordIndex][i]) {
           correctCharsInWord++;
         }
       }
       
       // Subtract the character counts for the word we're going back to
       setCorrectChars(prev => Math.max(0, prev - correctCharsInWord));
       setTotalChars(prev => Math.max(0, prev - wordLength));
      
      // Remove from incorrect words if it was there
      setIncorrectWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(newWordIndex);
        return newSet;
      });
      
      // Recalculate accuracy
      if (totalChars > 0) {
        const newAccuracy = (correctChars / totalChars) * 100;
        setAccuracy(Math.round(newAccuracy));
      }
      
      setCanGoBack(newWordIndex > 0);
      
      // Scroll to the word we went back to
      setTimeout(() => scrollToCurrentWord(), 100);
    }
  };

  const scrollToCurrentWord = () => {
    if (typingAreaRef.current && currentLetterRef.current) {
      currentLetterRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SVG Background Element - Designated for future use */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* This div is designated for SVG background elements */}
        <div className="absolute inset-0 opacity-60">
          <Image
            src="/color-lines.png"
            alt="Typing illustration background"
            width={1800}
            height={1200}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-200 bg-white backdrop-blur-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
        <Image
                src="/file.svg"
                alt="TypinGuy Logo"
                width={64}
                height={64}
                className="h-12 md:h-16 w-auto"
              />
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-700 hover:text-[#2196F3] transition-colors font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-[#2196F3] transition-colors font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#2196F3] transition-colors font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                About
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#2196F3] transition-colors font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                Blog
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#2196F3] transition-colors font-medium" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button className="bg-white text-gray-700 hover:bg-[#22c55e] hover:text-white px-6 py-3 text-lg font-semibold rounded-none border-2 border-gray-700 hover:border-[#22c55e] transition-all duration-300" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#2196F3] hover:bg-[#22c55e] text-white px-6 py-3 text-lg font-semibold rounded-none border-2 border-[#2196F3] hover:border-[#22c55e] transition-all duration-300" style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
                  Join up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - 100vh */}
      <section className="relative h-screen flex items-center justify-start px-8 bg-transparent z-10">
        <div className="max-w-4xl ml-16">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: '"Delius", cursive' }}>
            Test Your Typing Speed!
          </h1>
          <p ref={heroTextRef} className="text-xl md:text-2xl text-gray-700 max-w-3xl leading-relaxed mb-8" style={{ fontFamily: '"Delius", cursive' }}>
            Test your speed and accuracy using our free typing test. Use your results to see how far a proper typing method could take you.
          </p>
          <Button 
            onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#2196F3] hover:bg-gray-100 px-12 py-6 text-2xl font-semibold rounded-none border-2 border-[#2196F3] hover:border-[#2196F3]/80 transition-all duration-300 group mt-12" 
            style={{ fontFamily: '"Delius", cursive' }}
          >
            Try it out
            <ChevronRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </div>
      </section>

                    {/* Typing Test Section */}
              <section className="py-20 px-8" style={{ backgroundColor: '#2196F3' }}>
                        <div className="w-full mx-auto max-w-7xl">
                            <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider" style={{ fontFamily: '"Luckiest Guy", cursive', fontWeight: 300 }}>
                      Experience the Test
                    </h2>
                    <p className="text-xl text-white max-w-2xl mx-auto tracking-wide" style={{ fontFamily: '"Luckiest Guy", cursive', fontWeight: 300 }}>
                      See how our typing test works with this interactive demo. Click on the typing area and start typing!
                    </p>
                  </div>

                            {/* Typing Test Demo */}
                  <div className="bg-gray-50 rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl border border-white/20">
            {/* Typing Area - Responsive height */}
            <div className="mb-8 h-[60vh] md:h-[90vh] flex flex-col">


              {/* Progress Bar */}
              <div className="mb-6">
                {/* Elapsed Time Progress Bar */}
                {isTyping && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Elapsed Time</span>
                      <span className="text-sm text-gray-500">
                        {Math.round(elapsedTime / 1000)}s elapsed
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((elapsedTime / 1000) / parseInt(selectedTime) * 100, 100)} 
                      className="h-3 bg-orange-200"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0s</span>
                      <span>{parseInt(selectedTime)}s</span>
                    </div>
                  </div>
                )}
              </div>


              {/* Hidden input for typing */}
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 pointer-events-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              
                                    {/* Typing display area */}
                      <div
                        ref={typingAreaRef}
                        className="bg-white/80 backdrop-blur-sm flex-1 p-4 md:p-8 lg:p-12 flex items-start cursor-text overflow-y-auto rounded-2xl border border-gray-200/50 shadow-inner"
                        role="textbox"
                        aria-label="Typing test area"
                        tabIndex={0}
                        onClick={handleFocus}
                      >
                <div className="flex flex-wrap gap-3 items-start max-w-full">
                                     {demoWords.map((word, index) => {
                                           let wordClass = "px-1 md:px-3 py-1 md:py-3 text-gray-500 text-sm md:text-3xl lg:text-4xl font-medium transition-all duration-300 tracking-widest flex items-center justify-center text-center";
                      
                      if (index < currentWordIndex) {
                        // Completed words
                        wordClass = "px-1 md:px-2 py-1 md:py-3 text-gray-500 text-sm md:text-3xl lg:text-4xl font-bold transition-all duration-300 tracking-widest flex items-center justify-center text-center";
                      } else if (index === currentWordIndex) {
                        // Current word
                        wordClass = "px-1 md:px-2 py-1 md:py-3 text-black text-sm md:text-3xl lg:text-4xl font-medium transition-all duration-300 tracking-widest relative flex items-center justify-center text-center";
                      }
                     
                     return (
                       <span 
                         key={index}
                         className={`${wordClass} font-['var(--font-josefin)',sans-serif] cursor-pointer`}
                                style={{ fontWeight: 100 }}
                         aria-label={`${index < currentWordIndex ? 'Completed' : index === currentWordIndex ? 'Current' : 'Upcoming'} word: ${word}`}
                         aria-live={index === currentWordIndex ? "polite" : "off"}
                         onClick={() => handleWordClick(index)}
                       >
                         {index === currentWordIndex ? (
                           // Current word with character-by-character highlighting
                           // Show typed characters (including spaces) and expected characters
                           Array.from({ length: Math.max(currentInput.length, word.length) }, (_, charIndex) => {
                             const typedChar = currentInput[charIndex];
                             const expectedChar = word[charIndex];
                             const isTyped = charIndex < currentInput.length;
                             const isCurrent = charIndex === currentInput.length;
                             
                                                            if (isTyped) {
                                 // Show typed character (including spaces) - NO TRANSITIONS
                                 const isCorrect = typedChar === expectedChar;
                                 return (
                             <span
                               key={charIndex}
                                                                className={`${
                                       isCorrect 
                                         ? 'text-white bg-green-500' 
                                         : 'text-white bg-red-500'
                                     } px-1 md:px-2 py-1 md:py-3 text-sm md:text-3xl lg:text-4xl flex items-center justify-center text-center`}
                                     style={{ letterSpacing: '0.1em', fontWeight: 100 }}
                                   >
                                     {typedChar === ' ' ? '␣' : typedChar}
                                   </span>
                                 );
                               } else if (isCurrent) {
                                 // Show current cursor position - NO TRANSITIONS
                                 return (
                                   <span
                                     key={charIndex}
                                     className="text-white bg-[#2196F3] px-1 md:px-2 py-1 md:py-3 text-sm md:text-3xl lg:text-4xl flex items-center justify-center text-center"
                                     style={{ letterSpacing: '0.1em', fontWeight: 100 }}
                                     ref={currentLetterRef}
                                   >
                                     {expectedChar}
                                   </span>
                                 );
                               } else {
                                 // Show upcoming characters - NO TRANSITIONS
                                 return (
                                                                    <span
                                   key={charIndex}
                                   className="text-gray-500 bg-gray-100 px-1 md:px-2 py-1 md:py-3 text-sm md:text-4xl flex items-center justify-center text-center"
                                 style={{ letterSpacing: '0.1em', fontWeight: 100 }}
                             >
                                   {expectedChar}
                             </span>
                                 );
                               }
                           })
                         ) : (
                           // Other words as complete words with grey background
                           index < currentWordIndex ? (
                             // Completed words - show individual characters with red for wrong ones (NO ANIMATIONS)
                             word.split('').map((char, charIndex) => {
                               const typedWord = typedWords[index] || '';
                               const isWrongChar = typedWord[charIndex] && typedWord[charIndex] !== char;
                               
                               return (
                                 <span
                                   key={charIndex}
                                   className={`px-1 md:px-2 py-1 md:py-3 text-sm md:text-3xl lg:text-4xl font-bold tracking-widest flex items-center justify-center text-center ${
                                     isWrongChar ? 'text-white bg-red-500' : 'text-gray-500 bg-gray-100'
                                   }`}
                                   style={{ letterSpacing: '0.1em', fontWeight: 100 }}
                                 >
                                   {char}
                                 </span>
                               );
                             })
                           ) : (
                             // Upcoming words (NO ANIMATIONS)
                             <span className="px-1 md:px-2 py-1 md:py-3 bg-gray-100 text-sm md:text-3xl lg:text-4xl font-medium border-gray-200 flex items-center justify-center text-center text-black"
                                 style={{ letterSpacing: '0.5em', fontWeight: 100 }}>
                             {word}
                           </span>
                           )
                         )}
                                                         
                       </span>
                     );
                   })}
                </div>
              </div>
            </div>

            {/* Settings Button */}
            <div className="text-center mb-8">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    className="bg-white text-black px-10 py-6 text-xl font-bold rounded-2xl transition-all duration-300 group hover:scale-105 border-0 hover:bg-black hover:text-white shadow-none focus:shadow-none focus:ring-0"
                    aria-label="Change typing duration"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                  >
                    <Settings className="h-7 w-7 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                    Change Duration
                  </Button>
                </DrawerTrigger>
                                <DrawerContent className="bg-[#2196F3] [&>div:first-child]:bg-white">
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle className="text-white">Set Test Duration</DrawerTitle>
                      <DrawerDescription className="text-white/80">
                        Choose how long you want your typing test to last.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full bg-white border-white text-[#2196F3] hover:bg-gray-100"
                          onClick={() => {
                            const current = parseInt(selectedTime);
                            const newTime = Math.max(30, Math.min(600, current - 30));
                            setSelectedTime(newTime.toString());
                          }}
                          disabled={parseInt(selectedTime) <= 30}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease</span>
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-7xl font-bold tracking-tighter text-white">
                            {selectedTime}
                          </div>
                          <div className="text-white/80 text-[0.70rem] uppercase">
                            seconds
                          </div>
        </div>
              <Button 
                variant="outline" 
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full bg-white border-white text-[#2196F3] hover:bg-gray-100"
                          onClick={() => {
                            const current = parseInt(selectedTime);
                            const newTime = Math.max(30, Math.min(600, current + 30));
                            setSelectedTime(newTime.toString());
                          }}
                          disabled={parseInt(selectedTime) >= 600}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase</span>
                        </Button>
                      </div>
                                              <div className="mt-6 text-center">
                          <div className="text-sm text-white/80 mb-2">Available Durations:</div>
                          <div className="flex flex-wrap justify-center gap-2">
                            {[
                              { value: 30, label: "30s" },
                              { value: 60, label: "60s" },
                              { value: 120, label: "2min" },
                              { value: 300, label: "5min" }
                            ].map((time) => (
                              <Button
                                key={time.value}
                                size="sm"
                                className={`text-xs ${
                                  selectedTime === time.value.toString() 
                                    ? "bg-white text-[#2196F3] border-white hover:bg-gray-100" 
                                    : "bg-transparent text-white border-white hover:bg-white hover:text-[#2196F3]"
                                }`}
                                onClick={() => setSelectedTime(time.value.toString())}
                              >
                                {time.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                    </div>
                    <DrawerFooter>
                      <Button 
                        className="bg-white text-[#2196F3] hover:bg-gray-100 border-white"
                        onClick={() => {
                          handleTimeChange(selectedTime);
                          document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Start Test
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#2196F3]">
                          Cancel
              </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

                                {/* Enhanced Stats Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{wpm}</div>
                        <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Words Per Minute</div>
                        <div className="mt-2 text-xs text-gray-500" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Current Speed</div>
                      </div>
                      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{accuracy}%</div>
                        <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Accuracy</div>
                        <div className="mt-2 text-xs text-gray-500" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Typing Precision</div>
                      </div>
                      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                          {isCountdownActive ? countdown : parseInt(selectedTime)}
                        </div>
                        <div className="text-sm text-gray-700 font-semibold uppercase tracking-wide" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                          {isCountdownActive ? 'Time Remaining' : 'Test Duration'}
                        </div>
                        <div className="mt-2 text-xs text-gray-500" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                          {isCountdownActive ? 'Countdown Active' : 'Ready to Start'}
                        </div>
                      </div>
                    </div>
                            </div>

                  {/* FAQ Cards Section */}
                  <section className="h-screen py-20 px-8">
                    <div className="h-full flex flex-col justify-center">
                                              <div className="text-center mb-16">
                          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                            Frequently Asked Questions
                          </h2>
                          <p className="text-xl text-white max-w-2xl mx-auto" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                            Everything you need to know about improving your typing speed and accuracy.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                          {/* Card 1 */}
                          <div className="p-8 transition-all duration-300 border-b-2 border-white/30">
                            <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              What is the average typing speed?
                            </h3>
                            <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              The average typing speed is around 40 words per minute (wpm). If you want to be very productive, you should aim for a typing speed of 65 to 70 words per minute. It's easy with the right technique!
                            </p>
                          </div>

                          {/* Card 2 */}
                          <div className="p-8 transition-all duration-300 border-b-2 border-white/30">
                            <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              How do you type faster?
                            </h3>
                            <p className="text-base text-white/80 leading-relaxed" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              To type faster, you need to learn how to position yourself correctly, use all your fingers, hit the right keys without looking and avoid making mistakes. If you haven't mastered any one of these things, you will benefit from a typing training program.
                            </p>
                          </div>

                          {/* Card 3 */}
                          <div className="p-8 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              What is the best application for learning to type?
                            </h3>
                            <p className="text-base text-white/80 leading-relaxed" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              Typing Pal's training program covers every aspect of proper typing technique, offering a complete and customized program with hundreds of activities that are suitable for beginners and veterans alike. Our method has helped millions of users achieve their goals.
                            </p>
                          </div>

                          {/* Card 4 */}
                          <div className="p-8 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              How long will learning to type take?
                            </h3>
                            <p className="text-base text-white/80 leading-relaxed" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                              You will see improvement in a few weeks if you practice often, concentrate on accuracy over speed and adopt the proper technique. The hardest part is forgetting your bad habits, even if it means typing more slowly at first.
                            </p>
                          </div>
                        </div>
                    </div>
                  </section>

                  {/* CTA Section */}
                  <div id="cta-section" className="flex items-center justify-center mt-8 md:mt-16 p-8 md:p-16 py-12 md:py-20 rounded-2xl md:rounded-3xl max-w-4xl mx-auto shadow-2xl min-h-[300px] md:min-h-[400px]" style={{ backgroundColor: '#62b46f' }}>
                                        <div className="flex flex-col items-center justify-center gap-6 md:gap-16 max-w-xl w-full px-4">
                      <div className="text-center">
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                          Want to Improve?
            </h3>
                        <p className="text-base md:text-lg text-white/90 max-w-xl">
                          Try Typing Guy for free
                        </p>
                      </div>
                      <Button 
                        onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-green-700 hover:bg-white-100 px-6 md:px-12 py-3 md:py-6 text-base md:text-xl rounded-2xl font-semibold transition-all duration-200 group hover:shadow-xl w-full sm:w-auto"
                      >
                        <span className="mx-1 md:mx-2 my-2 md:my-5">Start Free Test</span>
                        <ChevronRight className="h-4 w-4 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
          </div>

                            {/* Floating Stats */}
                  <div className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2196F3]">{wpm}</div>
              <div className="text-xs text-gray-600 font-medium">Current WPM</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
