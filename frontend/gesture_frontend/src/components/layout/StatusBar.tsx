import { Wifi, WifiOff, Mic, MicOff, User, Monitor } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StatusBarProps {
  isGestureConnected?: boolean;
  isMicActive?: boolean;
}

export const StatusBar = ({ 
  isGestureConnected = true, 
  isMicActive = false 
}: StatusBarProps) => {
  const { settings } = useSettings();

  return (
    <header 
      className="glass-card h-16 px-6 flex items-center justify-between border-b border-border/30 rounded-none"
      role="banner"
    >
      {/* Current App Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border/30">
          <Monitor className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{settings.appContext}</span>
        </div>
        
        {settings.contentAwareMode && (
          <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-lg border border-primary/30">
            Content-Aware Mode
          </span>
        )}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Gesture Engine Status */}
        <div 
          className="flex items-center gap-2"
          role="status"
          aria-label={`Gesture engine ${isGestureConnected ? 'connected' : 'disconnected'}`}
        >
          {isGestureConnected ? (
            <>
              <Wifi className="w-4 h-4 text-success" />
              <span className="status-dot status-dot-success" />
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-destructive" />
              <span className="status-dot status-dot-error" />
            </>
          )}
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Gesture Engine
          </span>
        </div>

        {/* Microphone Status */}
        <div 
          className="flex items-center gap-2"
          role="status"
          aria-label={`Microphone ${isMicActive ? 'active' : 'inactive'}`}
        >
          {isMicActive ? (
            <>
              <Mic className="w-4 h-4 text-primary animate-pulse" />
              <span className="status-dot status-dot-success" />
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4 text-muted-foreground" />
              <span className="status-dot" style={{ backgroundColor: 'hsl(var(--muted-foreground))' }} />
            </>
          )}
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Mic
          </span>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/30"
              aria-label="User menu"
            >
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border-border/30">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuItem>About</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
