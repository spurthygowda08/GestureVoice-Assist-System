import { useState } from "react";

import {
  SettingsPanel
} from "@/components/settings/SettingsPanel";

const MODES = [
  "desktop",
  "presentation",
  "media"
];

const Settings = () => {

  // --------------------------------------------------
  // SETTINGS STATES
  // --------------------------------------------------
  const [gestureSensitivity, setGestureSensitivity] =
    useState(70);

  const [gestureCooldown, setGestureCooldown] =
    useState(5);

  const [cursorSpeed, setCursorSpeed] =
    useState(70);

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const [soundEffects, setSoundEffects] =
    useState(true);

  const [activeMode, setActiveMode] =
    useState("desktop");

  return (

    <div className="
      space-y-6
      animate-fade-in
      max-w-5xl
    ">

      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}
      <div>

        <h1 className="
          font-heading
          text-3xl
          font-bold
          gradient-text
          mb-2
        ">

          Settings

        </h1>

        <p className="
          text-muted-foreground
        ">

          Configure gesture recognition,
          voice settings,
          and intelligent mode behavior.

        </p>

      </div>

      {/* ---------------------------------- */}
      {/* MODE SETTINGS */}
      {/* ---------------------------------- */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-4
        ">

          Active System Mode

        </h2>

        <p className="
          text-muted-foreground
          mb-4
        ">

          Select the default operating mode
          for gesture and voice automation.

        </p>

        <select
          className="input w-full"

          value={activeMode}

          onChange={(e) =>
            setActiveMode(
              e.target.value
            )
          }
        >

          {MODES.map((mode) => (

            <option
              key={mode}
              value={mode}
            >

              {mode.charAt(0)
                .toUpperCase()
                + mode.slice(1)
              } Mode

            </option>

          ))}

        </select>

      </div>

      {/* ---------------------------------- */}
      {/* GESTURE SETTINGS */}
      {/* ---------------------------------- */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-5
        ">

          Gesture Settings

        </h2>

        {/* SENSITIVITY */}
        <div className="mb-6">

          <div className="
            flex
            justify-between
            mb-2
          ">

            <label className="
              font-medium
            ">

              Gesture Sensitivity

            </label>

            <span className="
              text-primary
              font-semibold
            ">

              {gestureSensitivity}%

            </span>

          </div>

          <input
            type="range"
            min="1"
            max="100"

            value={gestureSensitivity}

            onChange={(e) =>
              setGestureSensitivity(
                Number(e.target.value)
              )
            }

            className="w-full"
          />

        </div>

        {/* COOLDOWN */}
        <div className="mb-6">

          <div className="
            flex
            justify-between
            mb-2
          ">

            <label className="
              font-medium
            ">

              Gesture Cooldown

            </label>

            <span className="
              text-primary
              font-semibold
            ">

              {gestureCooldown}s

            </span>

          </div>

          <input
            type="range"
            min="1"
            max="20"

            value={gestureCooldown}

            onChange={(e) =>
              setGestureCooldown(
                Number(e.target.value)
              )
            }

            className="w-full"
          />

        </div>

        {/* CURSOR SPEED */}
        <div>

          <div className="
            flex
            justify-between
            mb-2
          ">

            <label className="
              font-medium
            ">

              Cursor Speed

            </label>

            <span className="
              text-primary
              font-semibold
            ">

              {cursorSpeed}%

            </span>

          </div>

          <input
            type="range"
            min="1"
            max="100"

            value={cursorSpeed}

            onChange={(e) =>
              setCursorSpeed(
                Number(e.target.value)
              )
            }

            className="w-full"
          />

        </div>

      </div>

      {/* ---------------------------------- */}
      {/* VOICE SETTINGS */}
      {/* ---------------------------------- */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-5
        ">

          Voice Settings

        </h2>

        {/* VOICE ENABLE */}
        <div className="
          flex
          items-center
          justify-between
          mb-5
        ">

          <div>

            <h3 className="
              font-medium
            ">

              Enable Voice Commands

            </h3>

            <p className="
              text-sm
              text-muted-foreground
            ">

              Allow voice-controlled
              automation and mode switching.

            </p>

          </div>

          <button
            onClick={() =>
              setVoiceEnabled(
                !voiceEnabled
              )
            }

            className={`
              px-4 py-2 rounded-xl
              transition
              ${
                voiceEnabled
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }
            `}
          >

            {voiceEnabled
              ? "Enabled"
              : "Disabled"}

          </button>

        </div>

        {/* SOUND EFFECTS */}
        <div className="
          flex
          items-center
          justify-between
        ">

          <div>

            <h3 className="
              font-medium
            ">

              Sound Effects

            </h3>

            <p className="
              text-sm
              text-muted-foreground
            ">

              Play sounds for gestures,
              clicks, and voice actions.

            </p>

          </div>

          <button
            onClick={() =>
              setSoundEffects(
                !soundEffects
              )
            }

            className={`
              px-4 py-2 rounded-xl
              transition
              ${
                soundEffects
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }
            `}
          >

            {soundEffects
              ? "Enabled"
              : "Disabled"}

          </button>

        </div>

      </div>

      {/* ---------------------------------- */}
      {/* SYSTEM INFO */}
      {/* ---------------------------------- */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-4
        ">

          System Behavior

        </h2>

        <ul className="
          list-disc
          pl-5
          space-y-3
          text-muted-foreground
        ">

          <li>
            Cursor controls work
            globally across all modes.
          </li>

          <li>
            Voice commands can switch
            operating modes hands-free.
          </li>

          <li>
            Gesture cooldown helps avoid
            accidental repeated actions.
          </li>

          <li>
            Different modes provide
            context-aware gesture actions.
          </li>

        </ul>

      </div>

      {/* ---------------------------------- */}
      {/* EXISTING SETTINGS PANEL */}
      {/* ---------------------------------- */}
      <SettingsPanel />

    </div>
  );
};

export default Settings;