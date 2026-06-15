// src/services/voiceService.ts
// Voice service: Web Speech API wrapper + backend integration
// Exposes:
//  - startListening() / stopListening()
//  - setWakeMode(enabled)
//  - onStatusChange(cb) -> unsubscribe
//  - onTranscript(cb) -> unsubscribe
//  - onResponse(cb) -> unsubscribe   <-- ADDED (fixes your error)
//  - getRecognizedCommands()

import { sendVoiceCommand } from "@/services/api";

export type VoiceStatus = "idle" | "listening" | "processing" | "executed" | "error";

type StatusCb = (s: VoiceStatus) => void;
type TranscriptCb = (t: string) => void;
type ResponseCb = (r: any) => void;

interface RecognizedCmd {
  phrase: string;
  command: string;
  action: string;
}

const recognizedCommands: RecognizedCmd[] = [
  { phrase: "open google", command: "Open Google", action: "open_google" },
  { phrase: "open youtube", command: "Open YouTube", action: "open_youtube" },
  { phrase: "next slide", command: "Next Slide", action: "next_slide" },
  { phrase: "previous slide", command: "Previous Slide", action: "previous_slide" },
  { phrase: "scroll down", command: "Scroll Down", action: "scroll_down" },
  { phrase: "scroll up", command: "Scroll Up", action: "scroll_up" },
  { phrase: "volume up", command: "Volume Up", action: "volume_up" },
  { phrase: "volume down", command: "Volume Down", action: "volume_down" },
  { phrase: "open calculator", command: "Open Calculator", action: "open_calc" },
  { phrase: "open notepad", command: "Open Notepad", action: "open_notepad" },
];

// browser SpeechRecognition (standard or webkit)
const WebSpeechAPI: any =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

if (!WebSpeechAPI) {
  console.warn("SpeechRecognition API not available in this browser.");
}

let wakeMode = false;
const WAKE_PHRASE = "hey assistant";

export class VoiceServiceClass {
  private recognition: any = null;
  private status: VoiceStatus = "idle";

  private statusSubs = new Set<StatusCb>();
  private transcriptSubs = new Set<TranscriptCb>();
  private responseSubs = new Set<ResponseCb>();

  constructor() {
    if (!WebSpeechAPI) return;
    this.recognition = new WebSpeechAPI();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.setStatus("listening");
    };

    this.recognition.onend = () => {
      // if wake mode re-start automatically (some browsers stop), else set idle
      if (wakeMode) {
        try {
          this.recognition.start();
        } catch {}
      } else {
        if (this.status !== "executed") this.setStatus("idle");
      }
    };

    this.recognition.onerror = (e: any) => {
      console.error("SpeechRecognition error", e);
      this.setStatus("error");
    };

    this.recognition.onresult = async (ev: any) => {
      // collect interim and final
      let interim = "";
      let final = "";

      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const result = ev.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }

      interim = interim.trim();
      final = final.trim();

      if (interim) {
        this.emitTranscript(interim);
      }

      if (final) {
        this.emitTranscript(final);

        // Decide whether to send: wakeMode requires phrase to start with WAKE_PHRASE
        const lower = final.toLowerCase().trim();
        if (wakeMode) {
          if (!lower.startsWith(WAKE_PHRASE)) {
            // ignore non-wake phrase
            console.log("Ignored final chunk (no wake):", final);
            return;
          }
          // strip wake phrase
          const cmdText = final.substring(WAKE_PHRASE.length).trim();
          if (cmdText.length === 0) return;
          await this.sendCommand(cmdText);
        } else {
          // push-to-talk: send final chunk
          await this.sendCommand(final);
        }
      }
    };
  }

  // ---------- public API ----------

  startListening() {
    if (!this.recognition) {
      console.warn("Recognition not available");
      return;
    }
    try {
      if (this.status === "listening") return;
      this.recognition.start();
      // status will be set on onstart
    } catch (e) {
      console.warn("startListening error", e);
      // try to set listening anyway
      this.setStatus("listening");
    }
  }

  stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (e) {
      /* ignore */
    }
    this.setStatus("idle");
  }

  setWakeMode(enabled: boolean) {
    wakeMode = Boolean(enabled);
    if (wakeMode) {
      // ensure recognition is running
      this.startListening();
    } else {
      // stop continuous listening unless user explicitly starts
      try {
        this.stopListening();
      } catch {}
    }
  }

  onStatusChange(cb: StatusCb) {
    this.statusSubs.add(cb);
    try { cb(this.status); } catch {}
    return () => this.statusSubs.delete(cb);
  }

  onTranscript(cb: TranscriptCb) {
    this.transcriptSubs.add(cb);
    return () => this.transcriptSubs.delete(cb);
  }

  // <-- NEW: onResponse to subscribe to backend responses
  onResponse(cb: ResponseCb) {
    this.responseSubs.add(cb);
    return () => this.responseSubs.delete(cb);
  }

  getRecognizedCommands() {
    return recognizedCommands;
  }

  getStatus() {
    return this.status;
  }

  // ---------- internal helpers ----------

  private setStatus(s: VoiceStatus) {
    this.status = s;
    for (const cb of this.statusSubs) {
      try { cb(s); } catch {}
    }
  }

  private emitTranscript(t: string) {
    for (const cb of this.transcriptSubs) {
      try { cb(t); } catch {}
    }
  }

  private emitResponse(r: any) {
    for (const cb of this.responseSubs) {
      try { cb(r); } catch {}
    }
  }

  private async sendCommand(text: string) {
    this.setStatus("processing");
    try {
      const res = await sendVoiceCommand(text);
      // emit server response to subscribers
      this.emitResponse(res);
      this.setStatus("executed");
      // after small delay return to idle
      setTimeout(() => {
        if (this.status !== "error") this.setStatus("idle");
      }, 300);
    } catch (err) {
      console.error("sendCommand error", err);
      this.emitResponse({ error: String(err) });
      this.setStatus("error");
    }
  }
}

export const voiceService = new VoiceServiceClass();
export type { RecognizedCmd };
