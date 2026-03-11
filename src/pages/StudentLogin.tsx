import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, AlertCircle, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { APIError } from '@/lib/api';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ 
    email: '', 
    phone: '',
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use email if provided, otherwise use phone
      const loginIdentifier = formData.email || formData.phone;
      if (!loginIdentifier) {
        throw new Error('Please provide email or phone number');
      }

      // Use AuthContext login to populate user state properly
      if (formData.email) {
        await login(formData.email, formData.password);
      } else {
        await login(undefined, formData.password, formData.phone);
      }
      
      navigate('/student');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || 'Invalid credentials. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/30">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>
              Access your learning dashboard and course materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="text-sm font-medium">Email Address or Phone Number</label>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value, phone: '' })}
                    disabled={loading}
                  />
                  <div className="text-center text-xs text-gray-500">OR</div>
                  <Input
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, email: '' })}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter either your email address or phone number</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Password / Student ID</label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="e.g., STD-789456"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="font-semibold text-green-900 dark:text-green-100 mb-2">Internal CRM Access</p>
                <p className="text-green-800 dark:text-green-200 text-xs">
                  Students are added by the Admin. If you haven't received your credentials, please contact the administrator.
                </p>
              </div>

              <div className="flex justify-between gap-2">
                <Link to="/admin-login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Admin
                  </Button>
                </Link>
                <Link to="/teacher-login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Teacher Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
