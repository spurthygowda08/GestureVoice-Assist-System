import { useState, useEffect } from "react";
import { voiceService, VoiceStatus } from "@/services/voiceService";
import { Mic, MicOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const VoicePanel: React.FC = () => {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [serverResponse, setServerResponse] = useState<any | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [wakeOn, setWakeOn] = useState(false);

  useEffect(() => {
    const unsubscribeStatus = voiceService.onStatusChange(setStatus);
    const unsubscribeTranscript = voiceService.onTranscript((text) => {
      setTranscript(text);
    });
    const unsubscribeResponse = voiceService.onResponse((r) => {
      setServerResponse(r);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTranscript();
      unsubscribeResponse();
    };
  }, []);

  const handleMicPress = () => {
    if (status === "idle") {
      voiceService.startListening();
      setTranscript("");
      setServerResponse(null);
    } else if (status === "listening") {
      voiceService.stopListening();
    } else {
      // if processing/executed/error, pressing mic toggles listening similarly
      if (status !== "listening") {
        voiceService.startListening();
      }
    }
  };

  const toggleWake = () => {
    const newWake = !wakeOn;
    setWakeOn(newWake);
    // voiceService exposes setWakeMode(enabled)
    if (voiceService.setWakeMode) {
      voiceService.setWakeMode(newWake);
    }
    // if disabling wake mode, also clear server response & transcript optionally
    if (!newWake) {
      // do not auto-stop listening here; voiceService handles starting/stopping
    }
  };

  const clearAll = () => {
    setTranscript("");
    setServerResponse(null);
  };

  const getStatusInfo = () => {
    switch (status) {
      case "listening":
        return { text: "Listening...", icon: <Mic className="w-8 h-8" />, color: "primary" };
      case "processing":
        return { text: "Processing...", icon: <Loader2 className="w-8 h-8 animate-spin" />, color: "secondary" };
      case "executed":
        return { text: "Command Executed!", icon: <CheckCircle className="w-8 h-8" />, color: "success" };
      case "error":
        return { text: "Error Occurred", icon: <AlertCircle className="w-8 h-8" />, color: "destructive" };
      default:
        return { text: "Tap to Speak", icon: <Mic className="w-8 h-8" />, color: "muted" };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="glass-card p-8 flex flex-col items-center">
      {/* Microphone Button */}
      <div className="relative mb-6">
        {/* Pulsing rings when listening */}
        {status === "listening" && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            <div
              className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}

        <button
          onClick={handleMicPress}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
            "focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
            status === "listening" && "bg-primary text-primary-foreground glow-primary",
            status === "processing" && "bg-secondary text-secondary-foreground glow-secondary",
            status === "executed" && "bg-success text-success-foreground",
            status === "error" && "bg-destructive text-destructive-foreground",
            status === "idle" && "bg-muted text-muted-foreground hover:bg-muted/80",
            isPressed && "scale-95"
          )}
          aria-label={status === "listening" ? "Stop listening" : "Start voice command"}
          aria-pressed={status === "listening"}
        >
          {statusInfo.icon}
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={toggleWake}
          className={cn(
            "px-3 py-1 rounded-md text-sm font-medium transition",
            wakeOn ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted-foreground"
          )}
          aria-pressed={wakeOn}
        >
          {wakeOn ? "Wake-word: ON" : "Wake-word: OFF"}
        </button>

        <button
          onClick={clearAll}
          className="px-3 py-1 rounded-md text-sm font-medium bg-ghost btn-ghost"
          aria-label="Clear transcript and response"
        >
          Clear
        </button>
      </div>

      {/* Status Text */}
      <p
        className={cn(
          "text-lg font-heading font-semibold mb-4",
          status === "listening" && "text-primary",
          status === "processing" && "text-secondary",
          status === "executed" && "text-success",
          status === "error" && "text-destructive"
        )}
      >
        {statusInfo.text}
      </p>

      {/* Transcript Area */}
      <div className="w-full max-w-md">
        <div
          className="min-h-[100px] p-4 rounded-xl bg-muted/30 border border-border/30 text-center"
          role="log"
          aria-live="polite"
          aria-label="Voice transcript"
        >
          {transcript ? (
            <p className="text-lg font-medium">"{transcript}"</p>
          ) : (
            <p className="text-muted-foreground italic">Your speech will appear here...</p>
          )}
        </div>

        {/* Server Response */}
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">Server response</div>
          <div className="min-h-[60px] p-3 rounded-lg bg-gray-50 border border-border/20 text-xs">
            {serverResponse ? (
              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(serverResponse, null, 2)}</pre>
            ) : (
              <div className="text-muted-foreground italic">No response yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePanel;
