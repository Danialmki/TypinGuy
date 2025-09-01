'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock leaderboard data
const mockLeaderboardData: LeaderboardEntry[] = [
  { id: 1, name: 'SpeedDemon', wpm: 127, accuracy: 98.5, mode: 'time', duration: 60, wordList: 'advanced', date: '2024-01-15' },
  { id: 2, name: 'TypeMaster', wpm: 115, accuracy: 99.2, mode: 'time', duration: 60, wordList: 'simple', date: '2024-01-14' },
  { id: 3, name: 'FastFingers', wpm: 108, accuracy: 97.8, mode: 'words', wordsTarget: 100, wordList: 'advanced', date: '2024-01-13' },
  { id: 4, name: 'KeyboardKing', wpm: 102, accuracy: 98.9, mode: 'time', duration: 120, wordList: 'simple', date: '2024-01-12' },
  { id: 5, name: 'SwiftTyper', wpm: 98, accuracy: 99.1, mode: 'words', wordsTarget: 50, wordList: 'simple', date: '2024-01-11' },
  { id: 6, name: 'PrecisionPro', wpm: 95, accuracy: 99.8, mode: 'time', duration: 300, wordList: 'advanced', date: '2024-01-10' },
  { id: 7, name: 'RapidWriter', wpm: 92, accuracy: 97.5, mode: 'words', wordsTarget: 25, wordList: 'simple', date: '2024-01-09' },
  { id: 8, name: 'AccurateAce', wpm: 89, accuracy: 99.9, mode: 'time', duration: 60, wordList: 'advanced', date: '2024-01-08' },
  { id: 9, name: 'Speedster', wpm: 87, accuracy: 98.2, mode: 'words', wordsTarget: 100, wordList: 'simple', date: '2024-01-07' },
  { id: 10, name: 'TypingPro', wpm: 85, accuracy: 98.7, mode: 'time', duration: 120, wordList: 'advanced', date: '2024-01-06' },
];

interface LeaderboardEntry {
  id: number;
  name: string;
  wpm: number;
  accuracy: number;
  mode: 'time' | 'words';
  duration?: number;
  wordsTarget?: number;
  wordList: 'simple' | 'advanced';
  date: string;
}

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<'wpm' | 'accuracy' | 'date'>('wpm');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...mockLeaderboardData].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'wpm') {
      comparison = a.wpm - b.wpm;
    } else if (sortBy === 'accuracy') {
      comparison = a.accuracy - b.accuracy;
    } else if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'wpm' | 'accuracy' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

  const formatMode = (entry: LeaderboardEntry) => {
    if (entry.mode === 'time') {
      return `${entry.duration}s`;
    }
    return `${entry.wordsTarget} words`;
  };

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
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            Top typing speeds from around the world
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedData.slice(0, 3).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`text-center ${index === 0 ? 'ring-2 ring-yellow-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    {getRankIcon(index + 1)}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{entry.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{entry.wpm} WPM</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {entry.accuracy.toFixed(1)}% accuracy
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatMode(entry)} • {entry.wordList}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Full Leaderboard</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Showing top {sortedData.length} results
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('wpm')}
                    >
                      WPM {sortBy === 'wpm' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('accuracy')}
                    >
                      Accuracy {sortBy === 'accuracy' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Word List</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('date')}
                    >
                      Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-bold">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(index + 1)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell className="font-mono text-lg">{entry.wpm}</TableCell>
                      <TableCell>{entry.accuracy.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatMode(entry)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {entry.wordList}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This is a mock leaderboard for demonstration purposes. 
              In a real application, this would show actual user results from the database.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
