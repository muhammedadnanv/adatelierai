import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Heart, Clock, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DonationSettings = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    initialDelay: 45, // seconds
    repeatInterval: 10, // minutes
    maxDismissals: 2,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('donation-popup-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading donation settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('donation-popup-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Donation popup preferences have been updated.",
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      enabled: true,
      initialDelay: 45,
      repeatInterval: 10,
      maxDismissals: 2,
    };
    setSettings(defaultSettings);
    localStorage.removeItem('donation-popup-settings');
    
    // Also reset popup state
    localStorage.removeItem('donation-popup-last-dismissed');
    localStorage.removeItem('donation-popup-dismiss-count');
    localStorage.removeItem('donation-popup-session-start');
    
    toast({
      title: "Settings Reset",
      description: "All donation popup settings have been reset to defaults.",
    });
  };

  const getPopupStatus = () => {
    const dismissCount = parseInt(localStorage.getItem('donation-popup-dismiss-count') || '0');
    const lastDismissed = localStorage.getItem('donation-popup-last-dismissed');
    
    if (!settings.enabled) return { status: 'disabled', color: 'secondary' };
    if (dismissCount >= settings.maxDismissals) return { status: 'max reached', color: 'destructive' };
    if (lastDismissed) return { status: 'active', color: 'success' };
    return { status: 'ready', color: 'primary' };
  };

  const status = getPopupStatus();

  return (
    <Card className="shadow-elegant max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Donation Popup Settings
        </CardTitle>
        <CardDescription>
          Configure when and how often the donation popup appears
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="font-medium">Popup Status:</span>
          </div>
          <Badge variant={status.color === 'success' ? 'default' : status.color === 'destructive' ? 'destructive' : 'secondary'}>
            {status.status}
          </Badge>
        </div>

        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="enabled">Enable Donation Popup</Label>
            <p className="text-sm text-muted-foreground">
              Show donation popup across the platform
            </p>
          </div>
          <Switch
            id="enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Initial Delay */}
            <div className="space-y-2">
              <Label htmlFor="initial-delay">Initial Delay (seconds)</Label>
              <Input
                id="initial-delay"
                type="number"
                min="10"
                max="300"
                value={settings.initialDelay}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  initialDelay: Math.max(10, parseInt(e.target.value) || 45)
                }))}
              />
              <p className="text-xs text-muted-foreground">
                How long to wait before showing the first popup (10-300 seconds)
              </p>
            </div>

            {/* Repeat Interval */}
            <div className="space-y-2">
              <Label htmlFor="repeat-interval">Repeat Interval (minutes)</Label>
              <Input
                id="repeat-interval"
                type="number"
                min="5"
                max="60"
                value={settings.repeatInterval}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  repeatInterval: Math.max(5, parseInt(e.target.value) || 10)
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Time between popup appearances (5-60 minutes)
              </p>
            </div>

            {/* Max Dismissals */}
            <div className="space-y-2">
              <Label htmlFor="max-dismissals">Maximum Dismissals</Label>
              <Input
                id="max-dismissals"
                type="number"
                min="1"
                max="10"
                value={settings.maxDismissals}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  maxDismissals: Math.max(1, parseInt(e.target.value) || 2)
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of times user can dismiss before popup stops (1-10)
              </p>
            </div>
          </>
        )}

        {/* Preview */}
        <Alert>
          <Clock className="w-4 h-4" />
          <AlertDescription>
            {settings.enabled 
              ? `Popup will appear after ${settings.initialDelay} seconds, then every ${settings.repeatInterval} minutes (max ${settings.maxDismissals} dismissals)`
              : 'Donation popup is disabled'
            }
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={saveSettings} className="flex-1">
            Save Settings
          </Button>
          <Button onClick={resetSettings} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Settings are saved locally in your browser
        </p>
      </CardContent>
    </Card>
  );
};

export default DonationSettings;