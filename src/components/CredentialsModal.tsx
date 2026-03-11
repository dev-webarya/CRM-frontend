import { AlertCircle, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CredentialsModalProps {
  open: boolean;
  onClose: () => void;
  role: 'teacher' | 'student';
  email: string;
  id: string;
  name: string;
}

export function CredentialsModal({
  open,
  onClose,
  role,
  email,
  id,
  name,
}: CredentialsModalProps) {
  const roleLabel = role === 'teacher' ? 'Teacher' : 'Student';
  const idPrefix = role === 'teacher' ? 'TCH' : 'STD';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCredentials = () => {
    const text = `${roleLabel} Credentials\n\nName: ${name}\nEmail: ${email}\nPassword/ID: ${id}\n\n⚠️ Share these credentials securely with the ${roleLabel.toLowerCase()}.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-credentials.txt`;
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>✅ {roleLabel} Added Successfully!</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-green-500/50 bg-green-500/10">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              New {roleLabel.toLowerCase()} account has been created. Share these credentials securely.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {roleLabel} Name
              </label>
              <div className="flex items-center justify-between mt-1">
                <p className="font-mono text-sm">{name}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(name)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Email Address
              </label>
              <div className="flex items-center justify-between mt-1">
                <p className="font-mono text-sm break-all">{email}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(email)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Password / {roleLabel} ID
              </label>
              <div className="flex items-center justify-between mt-1">
                <p className="font-mono text-sm font-bold text-primary">{id}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(id)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <Alert className="border-blue-500/50 bg-blue-500/10">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
              The {roleLabel.toLowerCase()} must use their email + this ID to login on the {roleLabel.toLowerCase()} login page.
            </AlertDescription>
          </Alert>

          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">Login Instructions:</p>
            <ol className="space-y-1 list-decimal pl-5">
              <li>Go to the {roleLabel.toLowerCase()} Login page</li>
              <li>Enter email: <span className="font-mono">{email}</span></li>
              <li>Enter password: <span className="font-mono">{id}</span></li>
              <li>Click "Sign In"</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={downloadCredentials}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={onClose} className="flex-1">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
