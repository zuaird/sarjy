from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from external_api import random_fact, number_fact, date_fact
from llm import ask_llm, translate
from memory import load_memory, save_memory, apply_updates
import json

app = FastAPI()

# allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    lang: str


@app.post("/chat")
def chat(req: ChatRequest):

    memory = load_memory()

    response = ask_llm(req.message, memory)

    data = json.loads(response)

    if "tool" in data:
        tool = data["tool"]
        value = data.get("value", "")

        if tool == "number_fact":
            result = number_fact(int(value))

        elif tool == "date_fact":
            result = date_fact()

        elif tool == "random_fact":
            result = random_fact()

        if req.lang.startswith("ar"):
            result = translate(result)

        return {"response": result}

    reply = data["reply"]
    updates = data.get("memory_updates", {})

    memory = apply_updates(memory, updates)
    save_memory(memory)

    return {"response": reply}

