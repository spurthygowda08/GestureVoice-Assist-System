import { useSettings, AppContext } from '@/contexts/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings2, Monitor } from 'lucide-react';

const appContexts: AppContext[] = ['Presentation', 'Browser', 'Media Player', 'Custom'];

export const ContextToggle = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-lg">Quick Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Content-Aware Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="content-aware" className="font-medium">
              Content-Aware Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically adjust gestures based on active app
            </p>
          </div>
          <Switch
            id="content-aware"
            checked={settings.contentAwareMode}
            onCheckedChange={(checked) => updateSettings({ contentAwareMode: checked })}
          />
        </div>

        {/* App Context Selector */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Active Context
          </Label>
          <Select
            value={settings.appContext}
            onValueChange={(value: AppContext) => updateSettings({ appContext: value })}
          >
            <SelectTrigger className="bg-muted/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/30">
              {appContexts.map((context) => (
                <SelectItem key={context} value={context}>
                  {context}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
