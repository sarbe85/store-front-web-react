import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';

export default function Confirm() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-12 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent a verification link to
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium break-all">{email}</p>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>Please check your inbox and click the verification link to activate your account.</p>
            <p>The link will expire in 24 hours.</p>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/auth/login">
                Go to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <Link to="/auth/register" className="text-primary hover:underline">
                try again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
