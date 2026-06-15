import { useState, useEffect } from 'react';
import { gestureService, Gesture } from '@/services/gestureService';
import { Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const ActivityTimeline = () => {
  const [activities, setActivities] = useState<Gesture[]>([]);

  useEffect(() => {
    // Initialize with recent gestures
    setActivities(gestureService.getRecentGestures());

    // Listen for new gestures
    const unsubscribe = gestureService.onGesture((gesture) => {
      setActivities(prev => [gesture, ...prev].slice(0, 10));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-semibold text-lg">Recent Activity</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 transition-smooth hover:bg-muted/50',
                index === 0 && 'border-primary/30 bg-primary/5'
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-xl border border-border/30">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{activity.name}</span>
                  <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.action}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
