import os
import json
MEMORY_FILE = 'memory.json'

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {"name": None, "favorite_color": None, "todos": []}

    with open(MEMORY_FILE, "r") as f:
        return json.load(f)
    
def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)

def apply_updates(memory, updates):
    for k, v in updates.items():

        if k == "todos":
            memory.setdefault("todos", [])
            memory["todos"].extend(v)

        else:
            memory[k] = v

    return memory