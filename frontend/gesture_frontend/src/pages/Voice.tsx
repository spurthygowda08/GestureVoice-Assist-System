import { VoicePanel } from '@/components/voice/VoicePanel';
import { RecognizedCommands } from '@/components/voice/RecognizedCommands';

const Voice = () => {

  return (

    <div className="
      space-y-6
      animate-fade-in
    ">

      {/* HEADER */}
      <div>

        <h1 className="
          font-heading
          text-3xl
          font-bold
          gradient-text
          mb-2
        ">

          Voice Commands

        </h1>

        <p className="
          text-muted-foreground
        ">

          Control your system using
          intelligent voice commands
          and dynamic mode switching.

        </p>

      </div>

      {/* MODE COMMANDS */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-2xl
          font-semibold
          mb-4
        ">

          Voice Mode Switching

        </h2>

        <p className="
          text-muted-foreground
          mb-4
        ">

          Switch system behavior
          completely hands-free.

        </p>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        ">

          {/* DESKTOP */}
          <div className="
            border
            border-border/20
            rounded-2xl
            p-4
          ">

            <h3 className="
              text-lg
              font-semibold
              mb-2
            ">

              🖥️ Desktop Mode

            </h3>

            <p className="
              text-sm
              text-muted-foreground
            ">

              Say:
              <span className="
                text-primary
                font-medium
              ">

                {" "}“desktop mode”

              </span>

            </p>

          </div>

          {/* PRESENTATION */}
          <div className="
            border
            border-border/20
            rounded-2xl
            p-4
          ">

            <h3 className="
              text-lg
              font-semibold
              mb-2
            ">

              📽️ Presentation Mode

            </h3>

            <p className="
              text-sm
              text-muted-foreground
            ">

              Say:
              <span className="
                text-primary
                font-medium
              ">

                {" "}“presentation mode”

              </span>

            </p>

          </div>

          {/* MEDIA */}
          <div className="
            border
            border-border/20
            rounded-2xl
            p-4
          ">

            <h3 className="
              text-lg
              font-semibold
              mb-2
            ">

              🎵 Media Mode

            </h3>

            <p className="
              text-sm
              text-muted-foreground
            ">

              Say:
              <span className="
                text-primary
                font-medium
              ">

                {" "}“media mode”

              </span>

            </p>

          </div>

        </div>

      </div>

      {/* VOICE PANELS */}
      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">

        <VoicePanel />

        <RecognizedCommands />

      </div>

      {/* HELP */}
      <div className="
        glass-card
        p-6
      ">

        <h2 className="
          text-xl
          font-semibold
          mb-3
        ">

          Available Voice Features

        </h2>

        <ul className="
          list-disc
          pl-5
          space-y-2
          text-muted-foreground
        ">

          <li>
            Open applications using voice.
          </li>

          <li>
            Switch modes dynamically.
          </li>

          <li>
            Combine gestures and voice together.
          </li>

          <li>
            Use different gesture mappings
            for different modes.
          </li>

          <li>
            Create hands-free workflows.
          </li>

        </ul>

      </div>

    </div>
  );
};

export default Voice;