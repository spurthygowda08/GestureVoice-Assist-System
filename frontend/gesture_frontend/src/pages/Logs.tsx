import {
  useEffect,
  useRef,
  useState
} from "react";

const API =
  "http://localhost:8000";

const WS_URL =
  "ws://localhost:8000/ws";

type LogItem = {
  time: string;
  message: string;
};

export default function Logs() {

  const [logs, setLogs] =
    useState<LogItem[]>([]);

  const logsRef =
    useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // FORMAT GESTURE NAMES
  // --------------------------------------------------
  const formatGesture = (
    text: string
  ) => {

    const replacements: {
      [key: string]: string
    } = {

      move:
        "🖱️ Cursor Moving",

      stop:
        "⏸️ Cursor Stopped",

      left_click:
        "👆 Left Click",

      right_click:
        "👉 Right Click",

      palm:
        "✋ Palm Gesture",

      fist:
        "✊ Fist Gesture",

      thumbs_up:
        "👍 Thumbs Up Gesture",

      rock_sign:
        "🤘 Rock Sign Gesture",

      shaka_sign:
        "🤙 Shaka Sign Gesture"

    };

    let formatted = text;

    Object.keys(replacements)
      .forEach((key) => {

        // FIXED replaceAll ISSUE
        formatted =
          formatted.replace(

            new RegExp(
              key,
              "g"
            ),

            replacements[key]
          );
      });

    return formatted;
  };

  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------
  useEffect(() => {

    if (logsRef.current) {

      logsRef.current.scrollTop =
        0;
    }

  }, [logs]);

  // --------------------------------------------------
  // LOAD EXISTING LOGS
  // --------------------------------------------------
  useEffect(() => {

    fetch(`${API}/logs`)
      .then(res => {

        if (!res.ok) {

          throw new Error(
            "Logs API failed"
          );
        }

        return res.json();
      })

      .then(data => {

        if (Array.isArray(data)) {

          const formattedLogs =
            data.map((log) => ({

              ...log,

              message:
                formatGesture(
                  log.message
                )

            }));

          setLogs(
            formattedLogs.reverse()
          );

        } else {

          setLogs([]);
        }
      })

      .catch(() =>
        setLogs([])
      );

  }, []);

  // --------------------------------------------------
  // LIVE WEBSOCKET LOGS
  // --------------------------------------------------
  useEffect(() => {

    const ws =
      new WebSocket(WS_URL);

    ws.onopen = () => {

      console.log(
        "WebSocket Connected"
      );
    };

    ws.onmessage = (e) => {

      try {

        const msg =
          JSON.parse(e.data);

        // -----------------------------------------
        // GESTURE EVENTS
        // -----------------------------------------
        if (
          msg.type === "gesture"
        ) {

          const newLog: LogItem = {

            time:
              new Date()
                .toLocaleTimeString(),

            message:
              formatGesture(
                `Gesture Detected → ${msg.name}`
              )
          };

          setLogs(prev => [

            newLog,

            ...prev

          ]);
        }

        // -----------------------------------------
        // MODE EVENTS
        // -----------------------------------------
        else if (
          msg.type === "mode"
        ) {

          const newLog: LogItem = {

            time:
              new Date()
                .toLocaleTimeString(),

            message:
              `🧠 Mode Changed → ${msg.mode}`
          };

          setLogs(prev => [

            newLog,

            ...prev

          ]);
        }

        // -----------------------------------------
        // BACKEND LOG EVENTS
        // -----------------------------------------
        else if (
          msg.type === "log"
        ) {

          setLogs(prev => [

            {

              ...msg.data,

              message:
                formatGesture(
                  msg.data.message
                )

            },

            ...prev

          ]);
        }

      } catch {

        console.error(
          "WebSocket parse error"
        );
      }
    };

    ws.onerror = () => {

      console.warn(
        "WebSocket Error"
      );
    };

    ws.onclose = () => {

      console.warn(
        "WebSocket Closed"
      );
    };

    return () => ws.close();

  }, []);

  // --------------------------------------------------
  // CLEAR LOGS
  // --------------------------------------------------
  const clearLogs = () => {

    setLogs([]);
  };

  // --------------------------------------------------
  // LOG TYPE STYLING
  // --------------------------------------------------
  const getLogStyle = (
    message: string
  ) => {

    const lower =
      message.toLowerCase();

    // MODE
    if (
      lower.includes("mode")
    ) {

      return `
        border-blue-500/20
        bg-blue-500/5
      `;
    }

    // VOICE
    if (
      lower.includes("voice")
    ) {

      return `
        border-purple-500/20
        bg-purple-500/5
      `;
    }

    // GESTURE
    if (
      lower.includes("gesture")
      ||
      lower.includes("palm")
      ||
      lower.includes("fist")
      ||
      lower.includes("thumb")
      ||
      lower.includes("rock")
      ||
      lower.includes("shaka")
    ) {

      return `
        border-green-500/20
        bg-green-500/5
      `;
    }

    // DEFAULT
    return `
      border-border/10
    `;
  };

  return (

    <div className="
      glass-card
      p-6
      animate-fade-in
    ">

      {/* ------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------- */}
      <div className="
        flex
        items-center
        justify-between
        mb-4
        flex-wrap
        gap-3
      ">

        <div>

          <h1 className="
            text-2xl
            font-bold
            gradient-text
          ">

            Activity Logs

          </h1>

          <p className="
            text-muted-foreground
            text-sm
            mt-1
          ">

            Live gesture, voice,
            and mode activity tracking.

          </p>

        </div>

        <button
          className="btn-ghost"
          onClick={clearLogs}
        >

          Clear Logs

        </button>

      </div>

      {/* ------------------------------------- */}
      {/* EMPTY STATE */}
      {/* ------------------------------------- */}
      {logs.length === 0 ? (

        <div className="
          py-16
          text-center
        ">

          <p className="
            text-muted-foreground
          ">

            No activity detected yet.

          </p>

        </div>

      ) : (

        <div
          ref={logsRef}
          className="
            max-h-[600px]
            overflow-y-auto
            rounded-2xl
            space-y-3
            pr-2
          "
        >

          {logs.map((log, i) => (

            <div
              key={i}
              className={`
                border
                rounded-2xl
                p-4
                transition
                hover:bg-white/5
                ${getLogStyle(
                  log.message
                )}
              `}
            >

              {/* TIME */}
              <div className="
                text-xs
                text-muted-foreground
                mb-2
              ">

                {log.time}

              </div>

              {/* MESSAGE */}
              <div className="
                font-medium
                break-words
              ">

                {log.message}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}