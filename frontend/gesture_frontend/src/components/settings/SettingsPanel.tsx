import { useSettings, FontSize } from '@/contexts/SettingsContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Hand, 
  Mic, 
  Accessibility, 
  Sun, 
  Moon,
  Volume2,
  Vibrate,
  Type,
  Eye,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SettingsPanel = () => {
  const { settings, updateSettings, resetSettings } = useSettings();

  const languages = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'hi-IN', label: 'Hindi' },
    { value: 'zh-CN', label: 'Chinese' },
  ];

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' },
  ];

  return (
    <div className="space-y-6">
      {/* Gesture Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Hand className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg">Gesture Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Gesture Sensitivity</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {settings.gestureSensitivity}%
              </span>
            </div>
            <Slider
              value={[settings.gestureSensitivity]}
              onValueChange={([value]) => updateSettings({ gestureSensitivity: value })}
              min={10}
              max={100}
              step={5}
              className="w-full"
              aria-label="Gesture sensitivity"
            />
            <p className="text-xs text-muted-foreground">
              Higher sensitivity detects more subtle movements
            </p>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mic className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg">Voice Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Language / Accent</Label>
            <Select
              value={settings.microphoneLanguage}
              onValueChange={(value) => updateSettings({ microphoneLanguage: value })}
            >
              <SelectTrigger className="bg-muted/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="voice-feedback">Voice Feedback</Label>
            </div>
            <Switch
              id="voice-feedback"
              checked={settings.voiceFeedback}
              onCheckedChange={(checked) => updateSettings({ voiceFeedback: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="sound-cues">Sound Cues</Label>
            </div>
            <Switch
              id="sound-cues"
              checked={settings.soundCues}
              onCheckedChange={(checked) => updateSettings({ soundCues: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="haptic-cues">Haptic Cues</Label>
            </div>
            <Switch
              id="haptic-cues"
              checked={settings.hapticCues}
              onCheckedChange={(checked) => updateSettings({ hapticCues: checked })}
            />
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Accessibility className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg">Accessibility</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              <Label>Font Size</Label>
            </div>
            <Select
              value={settings.fontSize}
              onValueChange={(value: FontSize) => updateSettings({ fontSize: value })}
            >
              <SelectTrigger className="bg-muted/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label htmlFor="theme-toggle">Theme</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="gap-2"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Toggle
            </Button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Increases contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrastMode}
              onCheckedChange={(checked) => updateSettings({ highContrastMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="colorblind">Color-Blind Friendly</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Uses patterns in addition to colors
              </p>
            </div>
            <Switch
              id="colorblind"
              checked={settings.colorBlindMode}
              onCheckedChange={(checked) => updateSettings({ colorBlindMode: checked })}
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetSettings}>
          Reset All Settings
        </Button>
      </div>
    </div>
  );
};
