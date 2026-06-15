# event_broadcaster.py

_callback = None

def set_broadcast_callback(cb):
    global _callback
    _callback = cb

def broadcast(event: dict):
    if _callback:
        try:
            _callback(event)
        except Exception as e:
            print("Broadcast error:", e)
