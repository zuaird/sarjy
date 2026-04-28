const API_URL = "http://localhost:8000/chat";

// ---------------- UI ----------------
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<span class="${sender}">${sender}:</span> ${text}`;
    document.getElementById("chat").appendChild(div);
}

// ---------------- SEND ----------------
async function sendMessage(textOverride = null) {
    const input = document.getElementById("input");
    const text = textOverride || input.value;

    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    addMessage(data.response, "sarjy");
    speak(data.response);
}

function detectLanguage(text) {
    const arabicRegex = /[\u0600-\u06FF]/;

    if (arabicRegex.test(text)) {
        return "ar-SA";
    }

    return "en-US";
}

// ---------------- VOICE INPUT ----------------
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;

    const detectedLang = detectLanguage(text);
    currentLang = detectedLang;
    recognition.lang = detectedLang;

    sendMessage(text);
};

function startVoice() {
    recognition.start();
}

// ---------------- VOICE OUTPUT ----------------
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    let voice = voices.find(v => v.lang === currentLang);

    if (!voice) {
        voice = voices.find(v => v.name.includes("Google")) || voices[0];
    }

    utterance.voice = voice;
    utterance.lang = currentLang;

    speechSynthesis.speak(utterance);
}