import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { authAPI } from '@/lib/api';

import { APIError } from '@/lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
      // We don't clear email because we'll pass it to reset page
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.data?.message || 'Failed to send OTP. Please try again.');
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
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a 6-digit OTP to set your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    OTP sent! Check your email for the 6-digit code.
                  </AlertDescription>
                </Alert>
                <Button 
                  className="w-full group" 
                  onClick={() => navigate('/reset-password', { state: { email } })}
                >
                  Enter OTP to Reset
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                    placeholder="name@institute.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>

                <div className="text-center text-sm pt-2">
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Back to Login
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
