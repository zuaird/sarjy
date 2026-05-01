from fastapi import Response
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVEN_API_KEY"),
)

def tts_eleven(text):

    audio = elevenlabs.text_to_speech.convert(
    text=text,
    voice_id="JBFqnCBsd6RMkjVDRZzb",  # "George" - browse voices at elevenlabs.io/app/voice-library
    model_id="eleven_v3",
    output_format="mp3_44100_128",
    )
    audio_bytes = b"".join(audio)

    return audio_bytes