const API_URL = "https://sarjy.onrender.com";
//const API_URL = "http://127.0.0.1:8000"
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

    const res = await fetch(API_URL + '/chat', {
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

document.body.addEventListener("click", () => {
    speechSynthesis.getVoices();
}, { once: true });

window.onload = () => {
    setLanguage("en-US", document.querySelector("#lang-switch button"));
};

function setLanguage(lang, btn = null) {
    currentLang = lang;
    recognition.lang = lang;

    document.querySelectorAll("#lang-switch button").forEach(b => {
        b.classList.remove("active");
    });

    if (btn) {
        btn.classList.add("active");
    }
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
async function speak(text) {
    const res = await fetch(API_URL + "/tts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: text, lang:currentLang })
    });

    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
}