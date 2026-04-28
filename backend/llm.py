from google import genai
from dotenv import load_dotenv
from memory import load_memory, save_memory, apply_updates
import json
import os

load_dotenv()


client = genai.Client()

sys_prompt = """You are Sarjy, a helpful voice-controlled personal assistant.

                Your job is to:
                1. Assist the user conversationally.
                2. Maintain and update structured memory about the user.
                3. Extract any useful persistent information from user messages.

                You MUST always return a valid JSON object with two fields:

                {
                "reply": "what you say to the user",
                "memory_updates": {
                    // only include fields that should be stored or updated
                }
                }

                ---

                ## Memory schema (if relevant):
                - name: string
                - favorite_color: string
                - todos: list of strings
                - you may add other relevant information about the user eg. location, favourite game, etc
                ---

                ## Rules:
                - Only include memory_updates when new or changed information is found.
                - If nothing to store, return memory_updates as an empty object {}.
                - Do NOT hallucinate or guess missing values.
                - Keep reply natural, short, and conversational.
                - If user asks about stored info, use memory context implicitly.
                - If user gives multiple updates, capture all of them.
                - If the user request is ambiguous, ask a clarifying question in reply.
                - do not mention your persistent memory
                ---

                ## Examples:

                User: "My name is Ali and I like blue"
                Response:
                {
                "reply": "Nice to meet you Ali! I’ll remember that you like blue.",
                "memory_updates": {
                    "name": "Ali",
                    "favorite_color": "blue"
                }
                }

                User: "Add gym at 7pm to my todo"
                Response:
                {
                "reply": "Got it — I’ve added gym at 7pm to your todos.",
                "memory_updates": {
                    "todos": ["gym at 7pm"]
                }
                }

                User: "what's my name?"
                Response:
                {
                "reply": "You told me your name is Ali.",
                "memory_updates": {}
                }"""

memory = load_memory()

def ask_llm(user_input):
    prompt = f"""
                User memory:
                {memory}

                User message:
                {user_input}
                """
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[
            sys_prompt,
            prompt
        ]
    )
    return response.text

response = ask_llm('my name is fatima i wanna go out with my freinds tomorrow and i like blue and pizza')
data = json.loads(response)

reply = data["reply"]
updates = data.get("memory_updates", {})
memory = apply_updates(memory, updates)
save_memory(memory)

print(reply)
print(memory)

response = ask_llm('whats in my to do list?')
data = json.loads(response)

reply = data["reply"]
updates = data.get("memory_updates", {})
memory = apply_updates(memory, updates)
save_memory(memory)

print(reply)
print(memory)