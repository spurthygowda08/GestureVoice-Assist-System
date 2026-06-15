import cv2
import mediapipe as mp
import time
import util
import event_broadcaster

from pynput.mouse import Button, Controller
from screeninfo import get_monitors

# --------------------------------------------------
# MOUSE CONTROLLER
# --------------------------------------------------
mouse = Controller()

# --------------------------------------------------
# SCREEN SIZE
# --------------------------------------------------
monitor = get_monitors()[0]

screen_width = monitor.width
screen_height = monitor.height

print(f"Screen Size: {screen_width} x {screen_height}")

# --------------------------------------------------
# MEDIAPIPE SETUP
# --------------------------------------------------
mpHands = mp.solutions.hands

hands = mpHands.Hands(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7,
    max_num_hands=1
)

# --------------------------------------------------
# GESTURE CONTROLLER
# --------------------------------------------------
class GestureController:

    gc_mode = 0

    def __init__(self):

        # Cursor smoothing
        self.prev_x = None
        self.prev_y = None

        # Smaller = smoother
        self.alpha = 0.25

        # -----------------------------------------
        # GESTURE HOLD SYSTEM
        # -----------------------------------------
        self.current_gesture = None
        self.gesture_start_time = 0

        # Hold duration before execution
        self.hold_time_required = 0.7

        # -----------------------------------------
        # PER-GESTURE COOLDOWNS
        # -----------------------------------------
        self.gesture_cooldowns = {
            "fist": 8,
            "palm": 8,
            "thumbs_up": 5,
            "rock_sign": 5,
            "shaka_sign": 3
        }

        self.last_trigger_times = {}

    # --------------------------------------------------
    # EVENT EMITTER
    # --------------------------------------------------
    def emit(self, name):

        event_broadcaster.broadcast({
            "type": "gesture",
            "name": name
        })

        print(f"EXECUTED: {name}")

    # --------------------------------------------------
    # CHECK COOLDOWN
    # --------------------------------------------------
    def cooldown_ready(self, gesture):

        now = time.time()

        cooldown = self.gesture_cooldowns.get(
            gesture,
            0
        )

        last_time = self.last_trigger_times.get(
            gesture,
            0
        )

        return (now - last_time) > cooldown

    # --------------------------------------------------
    # HANDLE CUSTOM GESTURE
    # --------------------------------------------------
    def handle_custom_gesture(self, gesture_name):

        now = time.time()

        # New gesture detected
        if self.current_gesture != gesture_name:

            self.current_gesture = gesture_name

            self.gesture_start_time = now

            return

        # Hold gesture
        hold_duration = now - self.gesture_start_time

        if hold_duration >= self.hold_time_required:

            if self.cooldown_ready(gesture_name):

                self.emit(gesture_name)

                self.last_trigger_times[
                    gesture_name
                ] = now

                # Prevent repeated triggering
                self.gesture_start_time = now + 999

    # --------------------------------------------------
    # RESET GESTURE TRACKER
    # --------------------------------------------------
    def reset_gesture_state(self):

        self.current_gesture = None

        self.gesture_start_time = 0

    # --------------------------------------------------
    # GET INDEX TIP
    # --------------------------------------------------
    def find_index_tip(self, processed):

        return processed.multi_hand_landmarks[0].landmark[
            mpHands.HandLandmark.INDEX_FINGER_TIP
        ]

    # --------------------------------------------------
    # MOVE CURSOR
    # INDEX + MIDDLE OPEN
    # OTHERS CLOSED
    # --------------------------------------------------
    def is_move_gesture(self, lm):

        index_open = lm[8].y < lm[6].y

        middle_open = lm[12].y < lm[10].y

        ring_closed = lm[16].y > lm[14].y

        pinky_closed = lm[20].y > lm[18].y

        thumb_closed = lm[4].x > lm[3].x

        return (
            index_open and
            middle_open and
            ring_closed and
            pinky_closed and
            thumb_closed
        )

    # --------------------------------------------------
    # STOP CURSOR
    # THUMB + INDEX + MIDDLE OPEN
    # --------------------------------------------------
    def is_stop_gesture(self, lm):

        thumb_open = lm[4].x < lm[3].x

        index_open = lm[8].y < lm[6].y

        middle_open = lm[12].y < lm[10].y

        ring_closed = lm[16].y > lm[14].y

        pinky_closed = lm[20].y > lm[18].y

        return (
            thumb_open and
            index_open and
            middle_open and
            ring_closed and
            pinky_closed
        )

    # --------------------------------------------------
    # LEFT CLICK
    # THUMB + MIDDLE OPEN
    # --------------------------------------------------
    def is_left_click(self, lm):

        thumb_open = lm[4].x < lm[3].x

        middle_open = lm[12].y < lm[10].y

        index_closed = lm[8].y > lm[6].y

        ring_closed = lm[16].y > lm[14].y

        pinky_closed = lm[20].y > lm[18].y

        return (
            thumb_open and
            middle_open and
            index_closed and
            ring_closed and
            pinky_closed
        )

    # --------------------------------------------------
    # RIGHT CLICK
    # THUMB + INDEX OPEN
    # --------------------------------------------------
    def is_right_click(self, lm):

        thumb_open = lm[4].x < lm[3].x

        index_open = lm[8].y < lm[6].y

        middle_closed = lm[12].y > lm[10].y

        ring_closed = lm[16].y > lm[14].y

        pinky_closed = lm[20].y > lm[18].y

        return (
            thumb_open and
            index_open and
            middle_closed and
            ring_closed and
            pinky_closed
        )

    # --------------------------------------------------
    # SHAKA SIGN
    # THUMB + PINKY OPEN
    # --------------------------------------------------
    def is_shaka_sign(self, lm):

        thumb_open = lm[4].x < lm[3].x

        pinky_open = lm[20].y < lm[18].y

        index_closed = lm[8].y > lm[6].y

        middle_closed = lm[12].y > lm[10].y

        ring_closed = lm[16].y > lm[14].y

        return (
            thumb_open and
            pinky_open and
            index_closed and
            middle_closed and
            ring_closed
        )

    # --------------------------------------------------
    # CURSOR MOVEMENT
    # --------------------------------------------------
    def move_mouse(self, index_tip):

        if not index_tip:
            return

        # Hand → Screen mapping
        x = int(index_tip.x * screen_width)

        y = int(index_tip.y * screen_height)

        # Smooth cursor
        if self.prev_x is None:

            self.prev_x = x
            self.prev_y = y

        self.prev_x = int(
            self.prev_x +
            (x - self.prev_x) * self.alpha
        )

        self.prev_y = int(
            self.prev_y +
            (y - self.prev_y) * self.alpha
        )

        # Move cursor
        mouse.position = (
            self.prev_x,
            self.prev_y
        )

    # --------------------------------------------------
    # SCROLL FUNCTION
    # --------------------------------------------------
    def scroll_vertical(self, index_tip):

        if not index_tip:
            return

        y = index_tip.y

        # Scroll UP
        if y < 0.4:

            mouse.scroll(0, 2)

            print("SCROLL UP")

        # Scroll DOWN
        elif y > 0.6:

            mouse.scroll(0, -2)

            print("SCROLL DOWN")

    # --------------------------------------------------
    # CUSTOM GESTURES
    # --------------------------------------------------
    def is_fist(self, lm):

        return (
            lm[8].y > lm[6].y and
            lm[12].y > lm[10].y and
            lm[16].y > lm[14].y and
            lm[20].y > lm[18].y
        )

    def is_palm(self, lm):

        return (
            lm[8].y < lm[6].y and
            lm[12].y < lm[10].y and
            lm[16].y < lm[14].y and
            lm[20].y < lm[18].y
        )

    def is_thumbs_up(self, lm):

        return (
            lm[4].y < lm[3].y and
            lm[8].y > lm[6].y and
            lm[12].y > lm[10].y and
            lm[16].y > lm[14].y and
            lm[20].y > lm[18].y
        )

    def is_rock_sign(self, lm):

        return (
            lm[8].y < lm[6].y and
            lm[20].y < lm[18].y and
            lm[12].y > lm[10].y and
            lm[16].y > lm[14].y
        )

    # --------------------------------------------------
    # MAIN LOOP
    # --------------------------------------------------
    def start(self):

        GestureController.gc_mode = 1

        cap = cv2.VideoCapture(0)

        cap.set(3, 1280)
        cap.set(4, 720)

        draw = mp.solutions.drawing_utils

        while GestureController.gc_mode and cap.isOpened():

            ret, frame = cap.read()

            if not ret:
                break

            frame = cv2.flip(frame, 1)

            rgb = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )

            processed = hands.process(rgb)

            gesture_detected = False

            if processed.multi_hand_landmarks:

                hand = processed.multi_hand_landmarks[0]

                draw.draw_landmarks(
                    frame,
                    hand,
                    mpHands.HAND_CONNECTIONS
                )

                lm = hand.landmark

                index_tip = self.find_index_tip(processed)

                # -----------------------------------------
                # LEFT CLICK
                # -----------------------------------------
                if self.is_left_click(lm):

                    gesture_detected = True

                    print("LEFT CLICK")

                    mouse.press(Button.left)
                    mouse.release(Button.left)

                    time.sleep(0.3)

                # -----------------------------------------
                # RIGHT CLICK
                # -----------------------------------------
                elif self.is_right_click(lm):

                    gesture_detected = True

                    print("RIGHT CLICK")

                    mouse.press(Button.right)
                    mouse.release(Button.right)

                    time.sleep(0.3)

                # -----------------------------------------
                # STOP CURSOR
                # -----------------------------------------
                elif self.is_stop_gesture(lm):

                    gesture_detected = True

                    print("STOP")

                # -----------------------------------------
                # SHAKA SIGN
                # -----------------------------------------
                elif self.is_shaka_sign(lm):

                    gesture_detected = True

                    print("SHAKA SIGN")

                    self.scroll_vertical(index_tip)

                    self.handle_custom_gesture(
                        "shaka_sign"
                    )

                # -----------------------------------------
                # CURSOR MOVE
                # -----------------------------------------
                elif self.is_move_gesture(lm):

                    gesture_detected = True

                    self.move_mouse(index_tip)

                # -----------------------------------------
                # CUSTOM GESTURES
                # -----------------------------------------
                elif self.is_thumbs_up(lm):

                    gesture_detected = True

                    print("THUMBS UP")

                    self.handle_custom_gesture(
                        "thumbs_up"
                    )

                elif self.is_rock_sign(lm):

                    gesture_detected = True

                    print("ROCK SIGN")

                    self.handle_custom_gesture(
                        "rock_sign"
                    )

                elif self.is_fist(lm):

                    gesture_detected = True

                    print("FIST")

                    self.handle_custom_gesture(
                        "fist"
                    )

                elif self.is_palm(lm):

                    gesture_detected = True

                    print("PALM")

                    self.handle_custom_gesture(
                        "palm"
                    )

            # Reset when no gesture
            if not gesture_detected:

                self.reset_gesture_state()

            cv2.imshow(
                "Gesture Controller",
                frame
            )

            if cv2.waitKey(1) & 0xFF == ord("q"):

                break

        cap.release()

        cv2.destroyAllWindows()