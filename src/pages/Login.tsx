import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Eye, EyeOff, Loader } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <GraduationCap className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CRM System</span>
          </div>
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to your CRM account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email Address</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold">Password</label>
                <Link to="/forgot-password" title="Forgot password?" className="text-sm text-blue-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all"
            >
              {loading ? (
                <><Loader className="mr-2 h-5 w-5 animate-spin" /> Signing In...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-xs text-center text-gray-400 border-t pt-6">
            <p>Admin Login Only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
