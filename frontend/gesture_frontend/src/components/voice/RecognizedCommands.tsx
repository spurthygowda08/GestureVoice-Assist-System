// src/components/voice/RecognizedCommands.tsx
import React, { useState } from "react";
import { voiceService } from "@/services/voiceService";
import { sendVoiceCommand } from "@/services/api";
import { MessageSquare, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const RecognizedCommands: React.FC = () => {
  const commands = voiceService.getRecognizedCommands();
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);
  const [lastResponse, setLastResponse] = useState<{ index: number; res: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExecute(cmdPhrase: string, idx: number) {
    setError(null);
    setLastResponse(null);
    setExecutingIndex(idx);

    try {
      const res = await sendVoiceCommand(cmdPhrase);
      setLastResponse({ index: idx, res });
    } catch (e: any) {
      console.error("Error sending command:", e);
      setError(String(e?.message ?? e));
    } finally {
      setExecutingIndex(null);
    }
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-lg">Recognized Commands</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Try saying any of these commands — or click to run immediately:
      </p>

      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {commands.map((cmd: any, index: number) => {
            const isExecuting = executingIndex === index;
            const isLastForThis = lastResponse?.index === index;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-smooth"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>

                <div className="flex-1">
                  <p className="font-medium">"{cmd.phrase}"</p>
                  {cmd.command && (
                    <p className="text-xs text-muted-foreground">Action: {cmd.command}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleExecute(cmd.phrase, index)}
                    className="btn btn-ghost"
                    disabled={isExecuting}
                    aria-label={`Execute ${cmd.phrase}`}
                  >
                    {isExecuting ? "Running..." : "Run"}
                  </button>

                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* inline small response icon or tick */}
                {isLastForThis && (
                  <div className="ml-2 text-xs text-muted-foreground">
                    {lastResponse?.res ? "✅" : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Response / error area */}
      <div className="mt-4">
        {error && (
          <div className="text-sm text-destructive mb-2">
            Error: {error}
          </div>
        )}

        {lastResponse && (
          <div className="text-sm">
            <div className="text-xs text-muted-foreground mb-1">
              Last response for "{commands[lastResponse.index]?.phrase}":
            </div>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(lastResponse.res, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecognizedCommands;
