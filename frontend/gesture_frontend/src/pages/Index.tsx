import { useEffect, useState } from "react";

const API = "http://localhost:8000";

const MODES = [
  "desktop",
  "presentation",
  "media",
];

export default function Dashboard() {

  const [running, setRunning] =
    useState(false);

  const [currentGesture, setCurrentGesture] =
    useState("Waiting...");

  const [lastAction, setLastAction] =
    useState("None");

  const [animate, setAnimate] =
    useState(false);

  const [currentMode, setCurrentMode] =
    useState<string>("desktop");

  // --------------------------------------------------
  // FORMAT GESTURE NAMES
  // --------------------------------------------------
  const formatGesture = (
    gesture: string
  ) => {

    const gestureMap: {
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

    return (
      gestureMap[gesture]
      || gesture
    );
  };

  // --------------------------------------------------
  // SAFE FORMAT MODE
  // --------------------------------------------------
  const formatMode = (
    mode?: string
  ) => {

    if (!mode) {

      return "Desktop";
    }

    return (
      mode.charAt(0).toUpperCase()
      + mode.slice(1)
    );
  };

  // --------------------------------------------------
  // LOAD STATUS + MODE
  // --------------------------------------------------
  useEffect(() => {

    // BACKEND STATUS
    fetch(`${API}/status`)
      .then(res => res.json())
      .then(data => {

        setRunning(
          data.running
        );

      })
      .catch(() => {});

    // CURRENT MODE
    fetch(`${API}/mode`)
      .then(res => res.json())
      .then(data => {

        if (data?.mode) {

          setCurrentMode(
            data.mode
          );
        }

      })
      .catch(() => {

        setCurrentMode(
          "desktop"
        );

      });

  }, []);

  // --------------------------------------------------
  // WEBSOCKET EVENTS
  // --------------------------------------------------
  useEffect(() => {

    const ws = new WebSocket(
      "ws://localhost:8000/ws"
    );

    ws.onmessage = (e) => {

      const msg = JSON.parse(
        e.data
      );

      // -----------------------------------------
      // GESTURE EVENT
      // -----------------------------------------
      if (
        msg.type === "gesture"
      ) {

        setCurrentGesture(

          formatGesture(
            msg.name
          )
        );

        setLastAction(

          msg.action
          || "Gesture detected"
        );

        setAnimate(true);

        setTimeout(() =>

          setAnimate(false),

          500
        );
      }

      // -----------------------------------------
      // MODE EVENT
      // -----------------------------------------
      if (
        msg.type === "mode"
      ) {

        if (msg.mode) {

          setCurrentMode(
            msg.mode
          );
        }
      }
    };

    ws.onerror = () => {

      console.warn(
        "WebSocket connection failed"
      );
    };

    return () => ws.close();

  }, []);

  // --------------------------------------------------
  // START BACKEND
  // --------------------------------------------------
  const startBackend = async () => {

    await fetch(
      `${API}/start`,
      {
        method: "POST"
      }
    );

    setRunning(true);
  };

  // --------------------------------------------------
  // STOP BACKEND
  // --------------------------------------------------
  const stopBackend = async () => {

    await fetch(
      `${API}/stop`,
      {
        method: "POST"
      }
    );

    setRunning(false);

    setCurrentGesture(
      "Stopped"
    );

    setLastAction(
      "None"
    );
  };

  // --------------------------------------------------
  // CHANGE MODE
  // --------------------------------------------------
  const changeMode = async (
    mode: string
  ) => {

    setCurrentMode(mode);

    try {

      await fetch(
        `${API}/set-mode`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            mode
          })
        }
      );

    } catch {

      console.warn(
        "Failed to change mode"
      );
    }
  };

  return (

    <div className="
      space-y-6
      animate-fade-in
    ">

      {/* ----------------------------------------- */}
      {/* HEADER */}
      {/* ----------------------------------------- */}
      <div className="
        flex
        items-center
        justify-between
      ">

        <div className="
          flex
          items-center
          gap-2
          relative
          group
        ">

          <h1 className="
            text-3xl
            font-bold
            gradient-text
          ">

            Gesture Control Dashboard

          </h1>

          {/* INFO ICON */}
          <span className="
            text-blue-400
            font-bold
            cursor-pointer
          ">

            ℹ️

          </span>

          {/* TOOLTIP */}
          <div
            className="
              fixed
              top-24
              left-1/2
              -translate-x-1/2
              w-[400px]
              bg-black
              text-white
              text-sm
              p-5
              rounded-2xl
              shadow-2xl
              z-[9999]
              opacity-0
              scale-95
              group-hover:opacity-100
              group-hover:scale-100
              transition-all
              duration-200
            "
          >

            {/* TITLE */}
            <p className="
              font-semibold
              mb-3
              text-blue-400
              text-base
            ">

              Gesture Controls

            </p>

            {/* BASIC CONTROLS */}
            <div className="mb-4">

              <p className="
                font-semibold
                text-green-400
                mb-2
              ">

                Basic Controls

              </p>

              <ul className="
                space-y-2
                list-disc
                pl-5
              ">

                <li>
                  ✌️ Index + Middle →
                  Move Cursor
                </li>

                <li>
                  👍 Thumb + Index + Middle →
                  Stop Cursor
                </li>

                <li>
                  👆 Thumb + Middle →
                  Left Click
                </li>

                <li>
                  👉 Thumb + Index →
                  Right Click
                </li>

              </ul>

            </div>

            {/* CUSTOM GESTURES */}
            <div>

              <p className="
                font-semibold
                text-purple-400
                mb-2
              ">

                Custom Gestures

              </p>

              <ul className="
                space-y-2
                list-disc
                pl-5
              ">

                <li>
                  🤙 Thumb + Pinky →
                  Shaka Sign
                </li>

                <li>
                  👍 Thumbs Up →
                  Custom Action
                </li>

                <li>
                  🤘 Rock Sign →
                  Custom Action
                </li>

                <li>
                  ✊ Fist →
                  Custom Action
                </li>

                <li>
                  ✋ Palm →
                  Custom Action
                </li>

              </ul>

            </div>

          </div>

        </div>

      </div>

      {/* ----------------------------------------- */}
      {/* SUBTITLE */}
      {/* ----------------------------------------- */}
      <p className="text-muted-foreground">

        Control your system using
        gestures, voice commands,
        and intelligent multi-mode
        automation.

      </p>

      {/* ----------------------------------------- */}
      {/* BACKEND CONTROL */}
      {/* ----------------------------------------- */}
      <div className="
        glass-card
        p-6
        flex
        justify-between
        items-center
      ">

        <div>

          <h2 className="
            text-xl
            font-semibold
          ">

            Gesture Backend

          </h2>

          <p
            className={
              running
                ? "text-green-400"
                : "text-red-400"
            }
          >

            {running
              ? "Running"
              : "Stopped"}

          </p>

        </div>

        <div className="
          flex
          gap-3
        ">

          <button
            className="btn"
            onClick={startBackend}
          >

            Start

          </button>

          <button
            className="btn-ghost"
            onClick={stopBackend}
          >

            Stop

          </button>

        </div>

      </div>

      {/* ----------------------------------------- */}
      {/* CURRENT MODE */}
      {/* ----------------------------------------- */}
      <div className="
        glass-card
        p-6
      ">

        <div className="
          flex
          items-center
          justify-between
          flex-wrap
          gap-4
        ">

          <div>

            <h2 className="
              text-xl
              font-semibold
              mb-2
            ">

              Current Mode

            </h2>

            <p className="
              text-3xl
              font-bold
              text-primary
              capitalize
            ">

              {formatMode(
                currentMode
              )} Mode

            </p>

          </div>

          {/* MODE SELECTOR */}
          <select
            className="input w-64"

            value={currentMode}

            onChange={(e) =>
              changeMode(
                e.target.value
              )
            }
          >

            {MODES.map((mode) => (

              <option
                key={mode}
                value={mode}
              >

                {formatMode(mode)} Mode

              </option>

            ))}

          </select>

        </div>

      </div>

      {/* ----------------------------------------- */}
      {/* LIVE GESTURE */}
      {/* ----------------------------------------- */}
      <div
        className={`
          glass-card
          p-6
          transition-all
          duration-300
          ${
            animate
              ? "ring-2 ring-primary scale-[1.02]"
              : ""
          }
        `}
      >

        <h2 className="
          text-xl
          font-semibold
          mb-2
        ">

          Last Detected Gesture

        </h2>

        <p className="
          text-3xl
          font-bold
          text-primary
        ">

          {currentGesture}

        </p>

      </div>

      {/* ----------------------------------------- */}
      {/* LAST ACTION */}
      {/* ----------------------------------------- */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-xl
          font-semibold
          mb-2
        ">

          Last Executed Action

        </h2>

        <p className="
          text-muted-foreground
        ">

          {lastAction}

        </p>

      </div>

    </div>
  );
}