import requests
import os
from dotenv import load_dotenv

load_dotenv()

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")

def tts_azure(text, lang):
    headers = {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
    }
    if lang == 'en-US':
        name = 'en-US-JessaNeural'
    else: 
        name = 'ar-SA-ZariyahNeural'

    ssml = f"""
    <speak version='1.0' xml:lang='{lang}'>
        <voice name='{name}'>
            {text}
        </voice>
    </speak>
    """


    response = requests.post(AZURE_ENDPOINT, headers=headers, data=ssml)

    if response.status_code != 200:
        raise Exception(f"{response.status_code} | {response.text}")

    return response.content