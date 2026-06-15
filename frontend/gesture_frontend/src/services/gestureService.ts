// TODO: Connect to FastAPI WebSocket for real gesture stream
// WebSocket endpoint: ws://your-backend/gestures/stream

export interface Gesture {
  id: string;
  name: string;
  confidence: number;
  action: string;
  timestamp: Date;
  icon: string;
}

export interface GestureMapping {
  id: string;
  gesture: string;
  icon: string;
  action: string;
  targetApp: string;
  customCommand?: string;
}

// Mock gesture data
const mockGestures: Gesture[] = [
  { id: '1', name: 'Swipe Right', confidence: 0.95, action: 'Next Slide', timestamp: new Date(Date.now() - 5000), icon: '👉' },
  { id: '2', name: 'Thumbs Up', confidence: 0.89, action: 'Confirm Action', timestamp: new Date(Date.now() - 15000), icon: '👍' },
  { id: '3', name: 'Palm', confidence: 0.92, action: 'Pause', timestamp: new Date(Date.now() - 30000), icon: '✋' },
  { id: '4', name: 'Swipe Left', confidence: 0.88, action: 'Previous Slide', timestamp: new Date(Date.now() - 60000), icon: '👈' },
  { id: '5', name: 'Pinch', confidence: 0.91, action: 'Zoom In', timestamp: new Date(Date.now() - 120000), icon: '🤏' },
];

const defaultMappings: GestureMapping[] = [
  { id: '1', gesture: 'Thumbs Up', icon: '👍', action: 'confirm', targetApp: 'System' },
  { id: '2', gesture: 'Thumbs Down', icon: '👎', action: 'cancel', targetApp: 'System' },
  { id: '3', gesture: 'Swipe Left', icon: '👈', action: 'previous_slide', targetApp: 'Presentation' },
  { id: '4', gesture: 'Swipe Right', icon: '👉', action: 'next_slide', targetApp: 'Presentation' },
  { id: '5', gesture: 'Palm', icon: '✋', action: 'pause', targetApp: 'Media Player' },
  { id: '6', gesture: 'Pinch In', icon: '🤏', action: 'zoom_out', targetApp: 'Browser' },
  { id: '7', gesture: 'Pinch Out', icon: '🖐️', action: 'zoom_in', targetApp: 'Browser' },
  { id: '8', gesture: 'Fist', icon: '✊', action: 'minimize', targetApp: 'System' },
];

export class GestureService {
  private listeners: ((gesture: Gesture) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  // TODO: Replace with WebSocket connection
  startStream() {
    // Simulate random gestures every 3-8 seconds
    const emitRandomGesture = () => {
      const randomGesture = mockGestures[Math.floor(Math.random() * mockGestures.length)];
      const newGesture = {
        ...randomGesture,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        confidence: 0.8 + Math.random() * 0.2,
      };
      this.listeners.forEach(cb => cb(newGesture));
    };

    this.intervalId = setInterval(emitRandomGesture, 3000 + Math.random() * 5000);
  }

  stopStream() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onGesture(callback: (gesture: Gesture) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  getRecentGestures(): Gesture[] {
    return mockGestures;
  }

  getMappings(): GestureMapping[] {
    return defaultMappings;
  }

  // TODO: API call to save mapping
  saveMapping(mapping: GestureMapping): Promise<GestureMapping> {
    return Promise.resolve(mapping);
  }

  // TODO: API call to delete mapping
  deleteMapping(id: string): Promise<void> {
    return Promise.resolve();
  }
}

export const gestureService = new GestureService();
