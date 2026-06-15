# server.py — FINAL CLEAN VERSION

import asyncio
import json
import threading
from typing import List, Optional
from pathlib import Path
from datetime import datetime
import subprocess
import webbrowser
import pyautogui
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from gesture_controller_module import GestureController
import event_broadcaster

# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# WEBSOCKET MANAGER
# --------------------------------------------------
class ConnectionManager:

    def __init__(self):

        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):

        await ws.accept()

        self.active.append(ws)

    def disconnect(self, ws: WebSocket):

        if ws in self.active:

            self.active.remove(ws)

    async def broadcast(self, data: dict):

        msg = json.dumps(data)

        for ws in list(self.active):

            try:

                await ws.send_text(msg)

            except:

                self.disconnect(ws)

manager = ConnectionManager()

# --------------------------------------------------
# GLOBALS
# --------------------------------------------------
gc: Optional[GestureController] = None

gc_thread: Optional[threading.Thread] = None

loop: Optional[asyncio.AbstractEventLoop] = None

# --------------------------------------------------
# MODES
# --------------------------------------------------
CURRENT_MODE = "desktop"

AVAILABLE_MODES = [
    "desktop",
    "presentation",
    "media"
]

# --------------------------------------------------
# GESTURE COOLDOWN
# --------------------------------------------------
GESTURE_COOLDOWN = {}

COOLDOWN_SECONDS = 5

# --------------------------------------------------
# ACTIVITY LOGS
# --------------------------------------------------
ACTIVITY_LOGS: List[dict] = []

def add_log(message: str):

    log = {

        "time":
        datetime.now().strftime("%H:%M:%S"),

        "message":
        message
    }

    ACTIVITY_LOGS.append(log)

    asyncio.run_coroutine_threadsafe(

        manager.broadcast({

            "type": "log",

            "data": log
        }),

        loop
    )

# --------------------------------------------------
# GESTURE MAPPINGS
# --------------------------------------------------
MAPPINGS_FILE = Path(__file__).with_name(
    "gesture_mappings.json"
)

GESTURE_MAPPINGS = {}

def load_mappings():

    global GESTURE_MAPPINGS

    if MAPPINGS_FILE.exists():

        GESTURE_MAPPINGS = json.loads(

            MAPPINGS_FILE.read_text()
        )

    else:

        GESTURE_MAPPINGS = {}

def save_mappings():

    MAPPINGS_FILE.write_text(

        json.dumps(
            GESTURE_MAPPINGS,
            indent=2
        )
    )

# --------------------------------------------------
# STARTUP
# --------------------------------------------------
@app.on_event("startup")
async def startup():

    global loop

    loop = asyncio.get_running_loop()

    load_mappings()

    def broadcast_from_gesture_thread(
        event: dict
    ):

        asyncio.run_coroutine_threadsafe(

            manager.broadcast(event),

            loop
        )

        handle_mapped_action(event)

    event_broadcaster.set_broadcast_callback(

        broadcast_from_gesture_thread
    )

# --------------------------------------------------
# BACKEND CONTROL
# --------------------------------------------------
@app.post("/start")
async def start_backend():

    global gc, gc_thread

    if gc is None:

        gc = GestureController()

        gc_thread = threading.Thread(

            target=gc.start,

            daemon=True
        )

        gc_thread.start()

        add_log(
            "Gesture engine started"
        )

        return {
            "status": "started"
        }

    return {
        "status": "already_running"
    }

@app.post("/stop")
async def stop_backend():

    global gc

    if gc:

        GestureController.gc_mode = 0

        gc = None

        add_log(
            "Gesture engine stopped"
        )

        return {
            "status": "stopped"
        }

    return {
        "status": "not_running"
    }

@app.get("/status")
async def status():

    return {

        "running":
        GestureController.gc_mode == 1
    }

# --------------------------------------------------
# MODE APIs
# --------------------------------------------------
class ModeRequest(BaseModel):

    mode: str

@app.get("/mode")
async def get_mode():

    return {

        "mode": CURRENT_MODE
    }

@app.post("/set-mode")
async def set_mode(data: ModeRequest):

    global CURRENT_MODE

    if data.mode not in AVAILABLE_MODES:

        return {

            "status": "invalid_mode"
        }

    CURRENT_MODE = data.mode

    add_log(

        f"Mode changed → {CURRENT_MODE}"
    )

    await manager.broadcast({

        "type": "mode",

        "mode": CURRENT_MODE
    })

    return {

        "status": "success",

        "mode": CURRENT_MODE
    }

# --------------------------------------------------
# LOGS API
# --------------------------------------------------
@app.get("/logs")
async def get_logs():

    return ACTIVITY_LOGS

# --------------------------------------------------
# WEBSOCKET
# --------------------------------------------------
@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):

    await manager.connect(ws)

    try:

        while True:

            await asyncio.sleep(1)

    except WebSocketDisconnect:

        manager.disconnect(ws)

# --------------------------------------------------
# VOICE COMMANDS
# --------------------------------------------------
class VoiceCommand(BaseModel):

    text: str

@app.post("/voice-command")
async def voice_command(cmd: VoiceCommand):

    global CURRENT_MODE

    text = cmd.text.lower()

    # -----------------------------------------
    # MODE SWITCHING
    # -----------------------------------------
    if "desktop mode" in text:

        CURRENT_MODE = "desktop"

        add_log(
            "Voice: Desktop Mode"
        )

        await manager.broadcast({

            "type": "mode",

            "mode": CURRENT_MODE
        })

        return {

            "action":
            "Desktop mode enabled"
        }

    if "presentation mode" in text:

        CURRENT_MODE = "presentation"

        add_log(
            "Voice: Presentation Mode"
        )

        await manager.broadcast({

            "type": "mode",

            "mode": CURRENT_MODE
        })

        return {

            "action":
            "Presentation mode enabled"
        }

    if "media mode" in text:

        CURRENT_MODE = "media"

        add_log(
            "Voice: Media Mode"
        )

        await manager.broadcast({

            "type": "mode",

            "mode": CURRENT_MODE
        })

        return {

            "action":
            "Media mode enabled"
        }

    # -----------------------------------------
    # OPEN WEBSITES
    # -----------------------------------------
    if "open google" in text:

        webbrowser.open(
            "https://google.com"
        )

        add_log(
            "Voice: Opened Google"
        )

        return {

            "action":
            "Opened Google"
        }

    if "open youtube" in text:

        webbrowser.open(
            "https://youtube.com"
        )

        add_log(
            "Voice: Opened YouTube"
        )

        return {

            "action":
            "Opened YouTube"
        }

    # -----------------------------------------
    # OPEN APPLICATIONS
    # -----------------------------------------
    if text.startswith("open "):

        appname = text.replace(
            "open ",
            ""
        )

        subprocess.Popen(

            ["start", appname],

            shell=True
        )

        add_log(
            f"Voice: Opened {appname}"
        )

        return {

            "action":
            f"Opened {appname}"
        }

    add_log(
        "Voice: Command not recognized"
    )

    return {

        "action":
        "Command not recognized"
    }

# --------------------------------------------------
# GESTURE MAPPING APIs
# --------------------------------------------------
@app.get("/gesture-mappings")
async def get_mappings():

    return GESTURE_MAPPINGS

@app.post("/gesture-mappings")
async def update_mapping(data: dict):

    mode = data["mode"]

    gesture = data["gesture"]

    action = data["action"]

    if mode not in GESTURE_MAPPINGS:

        GESTURE_MAPPINGS[mode] = {}

    GESTURE_MAPPINGS[mode][gesture] = action

    save_mappings()

    add_log(

        f"[{mode.upper()}] "

        f"{gesture} → {action}"
    )

    return {

        "status": "saved"
    }

# --------------------------------------------------
# EXECUTE GESTURE ACTIONS
# --------------------------------------------------
def handle_mapped_action(event: dict):

    global CURRENT_MODE

    if event.get("type") != "gesture":

        return

    gesture = event.get("name")

    # -----------------------------------------
    # GET CURRENT MODE MAPPINGS
    # -----------------------------------------
    mode_mappings = GESTURE_MAPPINGS.get(

        CURRENT_MODE,

        {}
    )

    action = mode_mappings.get(gesture)

    if not action:

        return

    now = time.time()

    # -----------------------------------------
    # COOLDOWN
    # -----------------------------------------
    last_time = GESTURE_COOLDOWN.get(

        gesture,

        0
    )

    if now - last_time < COOLDOWN_SECONDS:

        return

    GESTURE_COOLDOWN[gesture] = now

    add_log(

        f"[{CURRENT_MODE.upper()}] "

        f"{gesture} → {action}"
    )

    # -----------------------------------------
    # SYSTEM ACTIONS
    # -----------------------------------------
    if action == "minimize":

        pyautogui.hotkey(
            "win",
            "down"
        )

    elif action == "maximize":

        pyautogui.hotkey(
            "win",
            "up"
        )

    elif action == "screenshot":

        pyautogui.screenshot(
            "gesture_screenshot.png"
        )

    elif action == "pause":

        pyautogui.press("space")

    # -----------------------------------------
    # DESKTOP MODE ACTIONS
    # -----------------------------------------
    elif action == "open_chrome":

        subprocess.Popen(
            ["start", "chrome"],
            shell=True
        )

    elif action == "open_notepad":

        subprocess.Popen(
            ["start", "notepad"],
            shell=True
        )

    elif action == "open_calculator":

        subprocess.Popen(
            ["start", "calc"],
            shell=True
        )

    elif action == "open_word":

        subprocess.Popen(
            ["start", "winword"],
            shell=True
        )

    elif action == "open_excel":

        subprocess.Popen(
            ["start", "excel"],
            shell=True
        )

    elif action == "open_powerpoint":

        subprocess.Popen(
            ["start", "powerpnt"],
            shell=True
        )

    # -----------------------------------------
    # PRESENTATION MODE ACTIONS
    # -----------------------------------------
    elif action == "next_slide":

        pyautogui.press("right")

    elif action == "previous_slide":

        pyautogui.press("left")

    elif action == "start_slideshow":

        pyautogui.press("f5")

    elif action == "end_slideshow":

        pyautogui.press("esc")

    elif action == "black_screen":

        pyautogui.press("b")

    # -----------------------------------------
    # MEDIA MODE ACTIONS
    # -----------------------------------------
    elif action == "play_pause":

        pyautogui.press("playpause")

    elif action == "next_track":

        pyautogui.press("nexttrack")

    elif action == "previous_track":

        pyautogui.press("prevtrack")

    elif action == "mute":

        pyautogui.press("volumemute")

    elif action == "forward_10_sec":

        pyautogui.press("right")

    elif action == "rewind_10_sec":

        pyautogui.press("left")