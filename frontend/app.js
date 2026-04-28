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
        body: JSON.stringify({ message: text, lang:currentLang })
    });

    const data = await res.json();

    addMessage(data.response, "sarjy");
    speak(data.response);
}

// ---------------- VOICE INPUT ----------------
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
let currentLang = "en-US";

function setLanguage(lang) {
    currentLang = lang;
    recognition.lang = lang;

    document.querySelectorAll("#lang-switch button").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");
}

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    sendMessage(text);
};

function startVoice() {
    recognition.lang = currentLang;
    recognition.start();
}

// ---------------- VOICE OUTPUT ----------------
function speak(text) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    let voice =
        voices.find(v =>
            v.lang.startsWith(currentLang.split("-")[0]) &&
            (v.name.includes("Google") || v.name.includes("Microsoft"))
        ) ||
        voices.find(v => v.lang.startsWith(currentLang.split("-")[0])) ||
        voices[0];

    utterance.voice = voice;
    utterance.lang = currentLang;
    utterance.rate = 1;
    utterance.pitch = 1.05;

    speechSynthesis.speak(utterance);
}