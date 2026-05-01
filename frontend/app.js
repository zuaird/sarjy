const API_URL = "https://sarjy.onrender.com";
//const API_URL = "http://127.0.0.1:8000"
// ---------------- UI ----------------

let typingDiv = null;

function showTyping() {
    typingDiv = document.createElement("div");
    typingDiv.className = "msg";
    typingDiv.innerHTML = `<span class="sarjy">sarjy:</span> ...`;
    document.getElementById("chat").appendChild(typingDiv);
}

function removeTyping() {
    if (typingDiv) typingDiv.remove();
    typingDiv = null;
}

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "msg";

    if (sender === "sarjy") {
        div.classList.add("sarjy-msg");
    }

    div.innerHTML = `<span class="${sender}">${sender}:</span> ${text}`;
    document.getElementById("chat").appendChild(div);

    return div;
}

// ---------------- SEND ----------------
async function sendMessage(textOverride = null) {
    const input = document.getElementById("input");
    const text = textOverride || input.value;

    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    showTyping();

    const res = await fetch(API_URL + '/chat', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ message: text, lang: currentLang })
    });

    const data = await res.json();

    removeTyping();

    const botMsg = addMessage(data.response, "sarjy");


    speak(data.response, botMsg);
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
let audio = null;
async function speak(text, el) {
    try {
        el.classList.add("speaking");

        const res = await fetch(API_URL + "/tts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message: text, lang: currentLang })
        });

        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));

        audio.onended = () => {
            el.classList.remove("speaking");
        };

        audio.onerror = () => {
            el.classList.remove("speaking");
        };

        await audio.play();

    } catch (err) {
        console.error(err);
        el.classList.remove("speaking");
    }
}