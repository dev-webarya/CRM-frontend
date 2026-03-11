import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, AlertCircle, CheckCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { authAPI } from '@/lib/api';

import { APIError } from '@/lib/api';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = (location.state as any)?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.resetPassword({ 
        email, 
        otp, 
        newPassword, 
        confirmPassword 
      });
      
      // Auto-login user if token is returned
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || 'Invalid OTP or email. Please try again.');
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
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Set New Password</CardTitle>
            <CardDescription>
              Enter the OTP sent to your email and choose a secure password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Password updated successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-destructive">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institute.com"
                    disabled={loading || !!initialEmail}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">6-Digit OTP</label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    disabled={loading}
                    className="h-11 rounded-xl text-center text-lg tracking-[0.5em] font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">New Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      disabled={loading}
                      className="h-11 rounded-xl pr-10"
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

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    disabled={loading}
                    className="h-11 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl"
                  disabled={loading}
                >
                  {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </Button>

                <div className="text-center text-sm">
                  <Link to="/forgot-password" title="Didn't get the code? Resend" className="text-muted-foreground hover:text-primary hover:underline">
                    Didn't get the code? Resend
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}