// TODO: Connect to FastAPI for log retrieval
// API endpoint: GET /api/logs

export type LogType = 'gesture' | 'voice';
export type LogStatus = 'success' | 'fail';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: LogType;
  input: string;
  action: string;
  status: LogStatus;
  context: string;
}

// Generate mock logs
const generateMockLogs = (): LogEntry[] => {
  const gestures = ['Swipe Right', 'Swipe Left', 'Thumbs Up', 'Palm', 'Pinch'];
  const voiceCommands = ['Open Chrome', 'Next Slide', 'Close Window', 'Scroll Down', 'Play'];
  const contexts = ['Presentation', 'Browser', 'Media Player', 'System'];
  const actions = ['next_slide', 'previous_slide', 'confirm', 'pause', 'zoom_in', 'open_app'];

  const logs: LogEntry[] = [];
  
  for (let i = 0; i < 50; i++) {
    const isGesture = Math.random() > 0.4;
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    logs.push({
      id: crypto.randomUUID(),
      timestamp,
      type: isGesture ? 'gesture' : 'voice',
      input: isGesture 
        ? gestures[Math.floor(Math.random() * gestures.length)]
        : voiceCommands[Math.floor(Math.random() * voiceCommands.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      status: Math.random() > 0.15 ? 'success' : 'fail',
      context: contexts[Math.floor(Math.random() * contexts.length)],
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

let mockLogs = generateMockLogs();

export class LogsService {
  // TODO: Replace with API call
  async getLogs(filters?: {
    type?: LogType;
    startDate?: Date;
    endDate?: Date;
    context?: string;
  }): Promise<LogEntry[]> {
    let filtered = [...mockLogs];

    if (filters?.type) {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    if (filters?.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
    }

    if (filters?.context) {
      filtered = filtered.filter(log => log.context === filters.context);
    }

    return filtered;
  }

  // TODO: Replace with API call
  async clearLogs(): Promise<void> {
    mockLogs = [];
  }

  getStats() {
    const total = mockLogs.length;
    const gestures = mockLogs.filter(l => l.type === 'gesture').length;
    const voice = mockLogs.filter(l => l.type === 'voice').length;
    const success = mockLogs.filter(l => l.status === 'success').length;
    
    return {
      total,
      gestures,
      voice,
      successRate: total > 0 ? (success / total) * 100 : 0,
    };
  }
}

export const logsService = new LogsService();
