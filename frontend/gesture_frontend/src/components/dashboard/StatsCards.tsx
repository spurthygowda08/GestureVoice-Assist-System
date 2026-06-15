import { useState, useEffect } from 'react';
import { logsService } from '@/services/logsService';
import { Activity, CheckCircle, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  accentColor?: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatCard = ({ icon, label, value, subtext, accentColor = 'primary' }: StatCardProps) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/30',
    accent: 'from-accent/20 to-accent/5 border-accent/30',
    success: 'from-success/20 to-success/5 border-success/30',
  };

  return (
    <div className={cn(
      'glass-card p-5 bg-gradient-to-br border',
      colorClasses[accentColor]
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="font-heading font-bold text-2xl mb-1">{value}</p>
      {subtext && (
        <p className="text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
};

export const StatsCards = () => {
  const [stats, setStats] = useState({
    total: 0,
    gestures: 0,
    successRate: 0,
    sessionDuration: '0:00',
  });

  useEffect(() => {
    const logStats = logsService.getStats();
    setStats({
      total: logStats.total,
      gestures: logStats.gestures,
      successRate: Math.round(logStats.successRate),
      sessionDuration: '12:34', // Mock session duration
    });
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<Activity className="w-4 h-4 text-primary" />}
        label="Total Gestures"
        value={stats.total}
        subtext="This session"
        accentColor="primary"
      />
      <StatCard
        icon={<CheckCircle className="w-4 h-4 text-success" />}
        label="Success Rate"
        value={`${stats.successRate}%`}
        subtext="Actions executed"
        accentColor="success"
      />
      <StatCard
        icon={<Zap className="w-4 h-4 text-accent" />}
        label="Last Command"
        value="Next Slide"
        subtext="2 seconds ago"
        accentColor="accent"
      />
      <StatCard
        icon={<Clock className="w-4 h-4 text-secondary" />}
        label="Session Duration"
        value={stats.sessionDuration}
        subtext="Active time"
        accentColor="secondary"
      />
    </div>
  );
};
