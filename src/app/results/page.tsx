'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Trash2, Share2, BarChart3, Clock, Target } from 'lucide-react';
import { getTypingResults, deleteTypingResult, clearAllTypingResults, getAverageWpm, getBestWpm, getAverageAccuracy, TypingResult } from '@/lib/storage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ResultsPage() {
  const [results, setResults] = useState(getTypingResults());
  const [filterMode, setFilterMode] = useState<'all' | 'time' | 'words'>('all');
  const [filterWordList, setFilterWordList] = useState<'all' | 'simple' | 'advanced'>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredResults = results.filter(result => {
    if (filterMode !== 'all' && result.mode !== filterMode) return false;
    if (filterWordList !== 'all' && result.wordList !== filterWordList) return false;
    return true;
  });

  const averageWpm = getAverageWpm(filteredResults);
  const bestWpm = getBestWpm(filteredResults);
  const averageAccuracy = getAverageAccuracy(filteredResults);

  const handleDeleteResult = (id: string) => {
    deleteTypingResult(id);
    setResults(getTypingResults());
    toast.success('Result deleted successfully');
  };

  const handleClearAll = () => {
    clearAllTypingResults();
    setResults([]);
    setShowDeleteDialog(false);
    toast.success('All results cleared');
  };

  const handleShare = async (result: TypingResult) => {
    const summary = `TypeTest Result:
WPM: ${Math.floor(result.wpm)}
Accuracy: ${result.accuracy.toFixed(1)}%
Mode: ${result.mode === 'time' ? `${result.duration}s` : `${result.wordsTarget} words`}
Word List: ${result.wordList}
Date: ${new Date(result.timestamp).toLocaleDateString()}`;

    try {
      await navigator.clipboard.writeText(summary);
      toast.success('Result copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h1 className="text-4xl font-bold">Your Results</h1>
          <p className="text-lg text-muted-foreground">
            Track your typing progress and view detailed statistics
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Average WPM</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{Math.floor(averageWpm)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Target className="h-6 w-6 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Best WPM</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{Math.floor(bestWpm)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-6 w-6 text-purple-500" />
                <span className="text-sm font-medium text-muted-foreground">Avg Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">{averageAccuracy.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle>Test Results</CardTitle>
              <div className="flex items-center space-x-4">
                <Select value={filterMode} onValueChange={(value: 'all' | 'time' | 'words') => setFilterMode(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterWordList} onValueChange={(value: 'all' | 'simple' | 'advanced') => setFilterWordList(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Lists</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Clear All Results</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete all your typing test results? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleClearAll}>
                        Clear All
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found. Complete a typing test to see your results here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Results Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>WPM</TableHead>
                        <TableHead>Accuracy</TableHead>
                        <TableHead>Word List</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>{formatDate(result.timestamp)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {result.mode === 'time' ? `${result.duration}s` : `${result.wordsTarget} words`}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{Math.floor(result.wpm)}</TableCell>
                          <TableCell>{result.accuracy.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {result.wordList}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(result)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteResult(result.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* WPM Progress Chart */}
                {filteredResults.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>WPM Progress Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={filteredResults.slice().reverse().map((result, index) => ({
                          test: index + 1,
                          wpm: Math.floor(result.wpm),
                          accuracy: result.accuracy,
                        }))}>
                          <XAxis dataKey="test" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="wpm"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
