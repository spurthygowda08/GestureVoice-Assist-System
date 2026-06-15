import { useState } from 'react';
import { GestureMapping } from '@/services/gestureService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (mapping: Omit<GestureMapping, 'id'>) => void;
}

const gestureOptions = [
  { value: 'Thumbs Up', icon: '👍' },
  { value: 'Thumbs Down', icon: '👎' },
  { value: 'Swipe Left', icon: '👈' },
  { value: 'Swipe Right', icon: '👉' },
  { value: 'Palm', icon: '✋' },
  { value: 'Fist', icon: '✊' },
  { value: 'Pinch In', icon: '🤏' },
  { value: 'Pinch Out', icon: '🖐️' },
  { value: 'Point', icon: '👆' },
  { value: 'Peace', icon: '✌️' },
];

const actionOptions = [
  { value: 'next_slide', label: 'Next Slide' },
  { value: 'previous_slide', label: 'Previous Slide' },
  { value: 'confirm', label: 'Confirm Action' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'pause', label: 'Pause' },
  { value: 'play', label: 'Play' },
  { value: 'zoom_in', label: 'Zoom In' },
  { value: 'zoom_out', label: 'Zoom Out' },
  { value: 'minimize', label: 'Minimize' },
  { value: 'maximize', label: 'Maximize' },
  { value: 'open_app', label: 'Open App' },
  { value: 'custom', label: 'Custom Command' },
];

const appOptions = ['System', 'Presentation', 'Browser', 'Media Player', 'Custom'];

export const CreateMappingDialog = ({ open, onOpenChange, onSubmit }: CreateMappingDialogProps) => {
  const [selectedGesture, setSelectedGesture] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [targetApp, setTargetApp] = useState('');
  const [customCommand, setCustomCommand] = useState('');

  const handleSubmit = () => {
    if (!selectedGesture || !selectedAction || !targetApp) return;

    const gestureData = gestureOptions.find(g => g.value === selectedGesture);
    
    onSubmit({
      gesture: selectedGesture,
      icon: gestureData?.icon || '🤚',
      action: selectedAction,
      targetApp,
      customCommand: selectedAction === 'custom' ? customCommand : undefined,
    });

    // Reset form
    setSelectedGesture('');
    setSelectedAction('');
    setTargetApp('');
    setCustomCommand('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Create New Gesture Mapping</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Gesture Selector */}
          <div className="space-y-2">
            <Label>Gesture</Label>
            <Select value={selectedGesture} onValueChange={setSelectedGesture}>
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue placeholder="Select a gesture" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                {gestureOptions.map((gesture) => (
                  <SelectItem key={gesture.value} value={gesture.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{gesture.icon}</span>
                      {gesture.value}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Selector */}
          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                {actionOptions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target App */}
          <div className="space-y-2">
            <Label>Target Application</Label>
            <Select value={targetApp} onValueChange={setTargetApp}>
              <SelectTrigger className="bg-muted/30 border-border/50">
                <SelectValue placeholder="Select target app" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/30">
                {appOptions.map((app) => (
                  <SelectItem key={app} value={app}>
                    {app}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Command (conditional) */}
          {selectedAction === 'custom' && (
            <div className="space-y-2 animate-fade-in">
              <Label>Custom Command / Shell Script</Label>
              <Input
                placeholder="e.g., /usr/bin/open -a Safari"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
              <p className="text-xs text-muted-foreground">
                Enter a hotkey combination or shell command
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedGesture || !selectedAction || !targetApp}
          >
            Save Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
