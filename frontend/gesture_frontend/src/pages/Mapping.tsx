import { useEffect, useState } from "react";

const API_BASE =
  "http://localhost:8000";

/* ------------------------------------------ */
/* CUSTOM GESTURES */
/* ------------------------------------------ */
const CUSTOM_GESTURES = [
  "palm",
  "fist",
  "thumbs_up",
  "shaka_sign",
  "rock_sign"
];

/* ------------------------------------------ */
/* MODE-SPECIFIC ACTIONS */
/* ------------------------------------------ */
const MODE_ACTIONS: {
  [key: string]: string[]
} = {

  // ----------------------------------------
  // DESKTOP MODE
  // ----------------------------------------
  desktop: [

    "open_chrome",

    "open_notepad",

    "open_calculator",

    "open_word",

    "open_powerpoint",

    "open_excel",

    "minimize",

    "maximize",

    "screenshot"
  ],

  // ----------------------------------------
  // PRESENTATION MODE
  // ----------------------------------------
  presentation: [

    "next_slide",

    "previous_slide",

    "start_slideshow",

    "end_slideshow",

    "black_screen",

    "screenshot"
  ],

  // ----------------------------------------
  // MEDIA MODE
  // ----------------------------------------
  media: [

    "play_pause",

    "forward_10_sec",

    "rewind_10_sec",

    "next_track",

    "previous_track",

    "mute"
  ]
};

/* ------------------------------------------ */
/* AVAILABLE MODES */
/* ------------------------------------------ */
const MODES = [
  "desktop",
  "presentation",
  "media"
];

export default function Mapping() {

  const [mappings, setMappings] =
    useState<any>({});

  const [currentMode, setCurrentMode] =
    useState("desktop");

  /* -------------------------------------- */
  /* LOAD MAPPINGS */
  /* -------------------------------------- */
  useEffect(() => {

    fetch(`${API_BASE}/gesture-mappings`)
      .then(res => res.json())
      .then(data => {

        setMappings(data || {});

      })
      .catch(() => {

        setMappings({});

      });

  }, []);

  /* -------------------------------------- */
  /* UPDATE LOCAL */
  /* -------------------------------------- */
  const updateLocal = (
    gesture: string,
    action: string
  ) => {

    setMappings((prev: any) => ({

      ...prev,

      [currentMode]: {

        ...(prev[currentMode] || {}),

        [gesture]: action

      }

    }));
  };

  /* -------------------------------------- */
  /* SAVE */
  /* -------------------------------------- */
  const saveMapping = async (
    gesture: string
  ) => {

    const action =
      mappings[currentMode]?.[
        gesture
      ] || "";

    await fetch(
      `${API_BASE}/gesture-mappings`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          mode: currentMode,

          gesture,

          action

        })
      }
    );

    alert(

      `${gesture.replace("_", " ")} `
      + `saved for `
      + `${currentMode} mode`
    );
  };

  /* -------------------------------------- */
  /* DELETE */
  /* -------------------------------------- */
  const deleteMapping = async (
    gesture: string
  ) => {

    updateLocal(gesture, "");

    await fetch(
      `${API_BASE}/gesture-mappings`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          mode: currentMode,

          gesture,

          action: ""

        })
      }
    );
  };

  /* -------------------------------------- */
  /* FORMAT MODE */
  /* -------------------------------------- */
  const formatMode = (
    mode: string
  ) => {

    return (
      mode.charAt(0).toUpperCase()
      + mode.slice(1)
    );
  };

  /* -------------------------------------- */
  /* FORMAT ACTION */
  /* -------------------------------------- */
  const formatAction = (
    action: string
  ) => {

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, c =>
        c.toUpperCase()
      );
  };

  return (

    <div className="
      space-y-6
      animate-fade-in
    ">

      {/* HEADER */}
      <div>

        <h1 className="
          text-3xl
          font-bold
          gradient-text
        ">

          Gesture Mapping

        </h1>

        <p className="
          text-muted-foreground
          mt-2
        ">

          Configure gestures
          differently for each mode.

        </p>

      </div>

      {/* MODE SELECTOR */}
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
            ">

              Active Mapping Mode

            </h2>

            <p className="
              text-muted-foreground
              text-sm
            ">

              Each mode contains
              context-specific actions.

            </p>

          </div>

          <select
            className="input w-64"

            value={currentMode}

            onChange={(e) =>
              setCurrentMode(
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

      {/* CURRENT MODE */}
      <div className="
        glass-card
        p-5
      ">

        <p className="
          text-muted-foreground
        ">

          Currently Editing

        </p>

        <h2 className="
          text-2xl
          font-bold
          text-primary
          capitalize
        ">

          {currentMode} Mode

        </h2>

      </div>

      {/* TABLE */}
      <div className="
        glass-card
        p-6
        overflow-x-auto
      ">

        <table className="w-full">

          <thead>

            <tr className="
              text-left
              text-muted-foreground
              border-b
              border-border/20
            ">

              <th className="pb-3">
                Gesture
              </th>

              <th className="pb-3">
                Action
              </th>

              <th className="pb-3">
                Controls
              </th>

            </tr>

          </thead>

          <tbody>

            {CUSTOM_GESTURES.map(
              (gesture) => (

                <tr
                  key={gesture}
                  className="
                    border-b
                    border-border/10
                  "
                >

                  {/* GESTURE */}
                  <td className="
                    py-4
                    capitalize
                    font-medium
                  ">

                    {gesture.replace(
                      "_",
                      " "
                    )}

                  </td>

                  {/* ACTION */}
                  <td className="py-4">

                    <select
                      className="input w-full"

                      value={
                        mappings[currentMode]
                          ?.[gesture] || ""
                      }

                      onChange={(e) =>
                        updateLocal(
                          gesture,
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Select Action
                      </option>

                      {MODE_ACTIONS[
                        currentMode
                      ]?.map(
                        (action) => (

                          <option
                            key={action}
                            value={action}
                          >

                            {formatAction(
                              action
                            )}

                          </option>

                        )
                      )}

                    </select>

                  </td>

                  {/* BUTTONS */}
                  <td className="
                    py-4
                    space-x-2
                  ">

                    <button
                      className="btn"

                      onClick={() =>
                        saveMapping(
                          gesture
                        )
                      }
                    >

                      Save

                    </button>

                    <button
                      className="btn-ghost"

                      onClick={() =>
                        deleteMapping(
                          gesture
                        )
                      }
                    >

                      Delete

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* INFO */}
      <div className="
        glass-card
        p-5
      ">

        <h2 className="
          text-lg
          font-semibold
          mb-3
        ">

          Mode-Based Interaction

        </h2>

        <ul className="
          list-disc
          pl-5
          space-y-2
          text-muted-foreground
        ">

          <li>
            Desktop Mode controls
            applications and windows.
          </li>

          <li>
            Presentation Mode controls
            slideshow navigation.
          </li>

          <li>
            Media Mode controls
            playback interaction.
          </li>

          <li>
            Same gesture can perform
            different actions in
            different modes.
          </li>

        </ul>

      </div>

    </div>
  );
}