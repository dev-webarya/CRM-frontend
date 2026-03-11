import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Unauthorized</h1>
          <p className="text-muted-foreground text-lg">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/login">
            <Button className="w-full sm:w-auto">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
