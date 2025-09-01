import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Zap, Target, BarChart3, Code, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About TypeTest</h1>
          <p className="text-lg text-muted-foreground">
            A modern, feature-rich typing speed test application built with cutting-edge web technologies.
          </p>
        </div>

        {/* Mission Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
                             TypeTest is designed to help users improve their typing speed and accuracy through 
               comprehensive testing, detailed analytics, and an intuitive user experience. Whether 
               you&apos;re a beginner looking to learn touch typing or an experienced typist wanting to 
               measure your performance, our platform provides the tools you need to succeed.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Key Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Multiple Test Modes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Time-based tests (15s to 5 minutes)</li>
                  <li>• Word-count tests (10 to 100 words)</li>
                  <li>• Flexible configuration options</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Advanced Analytics</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time WPM tracking</li>
                  <li>• Accuracy percentage</li>
                  <li>• Progress visualization</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Smart Highlighting</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Character-level feedback</li>
                  <li>• Word-level highlighting</li>
                  <li>• Caret positioning mode</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Word Lists</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Simple vocabulary</li>
                  <li>• Advanced terminology</li>
                  <li>• Random selection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-500" />
              <span>Technology Stack</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Badge variant="secondary" className="justify-center">Next.js 15</Badge>
              <Badge variant="secondary" className="justify-center">TypeScript</Badge>
              <Badge variant="secondary" className="justify-center">Tailwind CSS</Badge>
              <Badge variant="secondary" className="justify-center">shadcn/ui</Badge>
              <Badge variant="secondary" className="justify-center">Zustand</Badge>
              <Badge variant="secondary" className="justify-center">Framer Motion</Badge>
              <Badge variant="secondary" className="justify-center">Recharts</Badge>
              <Badge variant="secondary" className="justify-center">Lucide Icons</Badge>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <span>How It Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Choose Your Test</h4>
                  <p className="text-sm text-muted-foreground">
                    Select between time-based or word-count tests, choose your preferred duration, 
                    and pick from simple or advanced word lists.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Start Typing</h4>
                  <p className="text-sm text-muted-foreground">
                                         Begin typing the displayed passage. The timer starts on your first keystroke, 
                     and you&apos;ll see real-time feedback on your performance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Review Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Get detailed statistics including WPM, accuracy, and character analysis. 
                    Your results are automatically saved for future reference.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your improvement over time with comprehensive result history 
                    and progress charts.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WPM Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span>Understanding WPM</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                                 Words Per Minute (WPM) is the standard measure of typing speed. Here&apos;s how it&apos;s calculated:
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">WPM Formula:</h4>
                <p className="font-mono text-sm">
                  WPM = (Correct Characters ÷ 5) ÷ (Time in Minutes)
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: We use 5 characters as the average word length, which is the industry standard.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">40-60</div>
                  <div className="text-sm text-muted-foreground">Beginner</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">60-80</div>
                  <div className="text-sm text-muted-foreground">Intermediate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">80+</div>
                  <div className="text-sm text-muted-foreground">Advanced</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact/Support */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Ready to test your typing speed? Head over to the test page and start improving your skills today!
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/test" 
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Keyboard className="h-4 w-4" />
                <span>Start Typing Test</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
