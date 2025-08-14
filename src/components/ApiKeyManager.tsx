import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ExternalLink, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyManagerProps {
  onApiKeyChange: (hasKey: boolean) => void;
}

const ApiKeyManager = ({ onApiKeyChange }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingApiKey();
  }, []);

  const checkExistingApiKey = async () => {
    try {
      const storedKey = localStorage.getItem('gemini-api-key');
      if (storedKey) {
        setHasStoredKey(true);
        onApiKeyChange(true);
      } else {
        setHasStoredKey(false);
        onApiKeyChange(false);
      }
    } catch (error) {
      setHasStoredKey(false);
      onApiKeyChange(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API key",
        description: "Please enter a valid Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    try {
      localStorage.setItem('gemini-api-key', apiKey);
      setHasStoredKey(true);
      setApiKey(''); // Clear input for security
      onApiKeyChange(true);
      
      toast({
        title: "API Key saved",
        description: "Your Gemini API key has been saved locally.",
      });
    } catch (error) {
      toast({
        title: "Error saving API key",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const removeApiKey = async () => {
    try {
      localStorage.removeItem('gemini-api-key');
      setHasStoredKey(false);
      onApiKeyChange(false);
      
      toast({
        title: "API Key removed",
        description: "Your API key has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error removing API key",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Google Gemini API Key
          </CardTitle>
          <CardDescription>
            Enter your Google Gemini API key to enable AI caption generation. Your key is stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasStoredKey ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your Gemini API key (AIza...)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={saveApiKey}
                disabled={!apiKey.trim()}
                className="w-full"
              >
                Save API Key
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Your Gemini API key is configured and ready to use.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-success border-success">
                  ✓ API Key configured
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={removeApiKey}
                >
                  Remove Key
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="shadow-elegant max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg">How to get your API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Visit Google AI Studio</li>
            <li>Sign in with your Google account</li>
            <li>Click "Get API key" in the menu</li>
            <li>Create a new API key for your project</li>
            <li>Copy the key and paste it above</li>
          </ol>
          
          <Button variant="outline" className="w-full" asChild>
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Google AI Studio
            </a>
          </Button>

          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your API key is stored locally in your browser and never sent to our servers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;