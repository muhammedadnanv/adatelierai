import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Loader2 } from 'lucide-react';

interface AccessCodeVerificationProps {
  onVerified: () => void;
}

const AccessCodeVerification = ({ onVerified }: AccessCodeVerificationProps) => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const verifyAccessCode = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Access code required",
        description: "Please enter your access code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Query the payments table to verify access code
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('access_code', accessCode.toUpperCase().trim())
        .eq('status', 'completed')
        .single();

      if (error || !data) {
        toast({
          title: "Invalid access code",
          description: "The access code you entered is invalid or hasn't been activated yet.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store access code in localStorage
      localStorage.setItem('access_code', accessCode.toUpperCase().trim());
      
      toast({
        title: "Access granted!",
        description: "Welcome to Ad Atelier AI. Enjoy all premium features!",
      });

      onVerified();
    } catch (error) {
      console.error('Access code verification error:', error);
      toast({
        title: "Verification failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="shadow-elegant max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Code Required
          </CardTitle>
          <CardDescription>
            Enter your access code to unlock the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-code">Access Code</Label>
            <Input
              id="access-code"
              type="text"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              maxLength={19}
              className="font-mono text-center text-lg tracking-wider"
            />
          </div>

          <Button 
            onClick={verifyAccessCode}
            disabled={loading || !accessCode}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Verify Access Code
              </>
            )}
          </Button>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-center">
              Don't have an access code?<br />
              <span className="font-medium">Pay ₹399 to get instant access</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessCodeVerification;
