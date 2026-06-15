import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const gesturePerMinuteData = [
  { time: '0:00', count: 4 },
  { time: '2:00', count: 7 },
  { time: '4:00', count: 3 },
  { time: '6:00', count: 8 },
  { time: '8:00', count: 5 },
  { time: '10:00', count: 9 },
  { time: '12:00', count: 6 },
];

const mostUsedGesturesData = [
  { gesture: 'Swipe R', count: 28, icon: '👉' },
  { gesture: 'Swipe L', count: 22, icon: '👈' },
  { gesture: 'Thumbs Up', count: 18, icon: '👍' },
  { gesture: 'Palm', count: 12, icon: '✋' },
  { gesture: 'Pinch', count: 8, icon: '🤏' },
];

export const GestureChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Gestures per Minute */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold mb-4">Gestures per Minute</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gesturePerMinuteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Most Used Gestures */}
      <div className="glass-card p-6">
        <h3 className="font-heading font-semibold mb-4">Most Used Gestures</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mostUsedGesturesData} layout="vertical">
              <XAxis 
                type="number"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                type="category"
                dataKey="gesture"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                width={70}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--secondary))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
