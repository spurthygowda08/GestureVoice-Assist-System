import { Video, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const GestureFeed = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-semibold text-lg">Live Gesture Feed</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume feed' : 'Pause feed'}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>
      </div>

      {/* Webcam placeholder */}
      <div 
        className="flex-1 min-h-[240px] rounded-xl border-2 border-dashed border-border/50 bg-muted/30 flex flex-col items-center justify-center gap-4"
        role="img"
        aria-label="Webcam preview area"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse-glow">
          <Video className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            {isPaused ? 'Feed Paused' : 'Webcam Preview'}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {/* TODO: Connect to actual webcam stream */}
            Camera feed will appear here
          </p>
        </div>
      </div>

      {/* Hint */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-accent/10 border border-accent/30">
        <p className="text-sm text-accent flex items-center gap-2">
          <span className="text-lg">✋</span>
          <span>Raise palm to pause • Make a fist to confirm</span>
        </p>
      </div>
    </div>
  );
};
