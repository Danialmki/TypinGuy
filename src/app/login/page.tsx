'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login data:', formData);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-60">
          <img
            src="/color-lines.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-gray-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <img
                src="/file.svg"
                alt="TypinGuy Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            Sign in to your TypinGuy account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-[#2196F3] rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-[#2196F3] rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-white border-gray-300 rounded focus:ring-white bg-white checked:bg-white checked:text-white"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-[#2196F3] hover:text-[#2196F3]/80 transition-colors"
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#2196F3] hover:bg-[#2196F3]/80 text-white font-semibold rounded-lg transition-all duration-300"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-[#2196F3] hover:text-[#2196F3]/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
