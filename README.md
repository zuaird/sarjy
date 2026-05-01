# 🤖 Sarjy — Voice-Controlled AI Assistant

## 📌 Overview

Sarjy is a voice-controlled AI assistant that acts as a lightweight personal agent. It allows users to interact naturally through voice or text while maintaining memory, using external tools, and supporting multilingual interaction.

The system is designed as a simple but extensible AI agent built for real-world deployment constraints.

For the best experience use chrome on PC

---

## 🔗 Live Demo

- Demo: https://sarjy-9gm1.vercel.app/
- GitHub: https://github.com/zuaird/sarjy

## Examples
<table>
  <tr>
    <td><img src="https://github.com/zuaird/sarjy/blob/main/images/image.png" width="300"/></td>
    <td><img src="https://github.com/zuaird/sarjy/blob/main/images/image2.png" width="300"/></td>
  </tr>
</table>

## 🏃 How to run locally

Backend:
- install dependencies
- run FastAPI server

Frontend:
- open index.html or serve static files
- configure API endpoint

## ⚙️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: FastAPI
- LLM: SambaNova
- Memory: JSON-based persistence
- Deployment: Render (backend), Vercel (frontend)
- External API: Numbers API

---


## 🧠 Key Features

### 🎤 Voice Interaction
- Browser-based speech recognition
- Text-to-speech responses
- Real-time conversational experience

---

### 🧠 Persistent Memory
Sarjy remembers user-specific information across sessions, including:

- Name
- Preferences (e.g. favorite color)
- To-do items
- Custom extracted attributes

Memory is automatically updated based on structured outputs from the LLM.

---

### 🔌 External Tool Usage
Sarjy can call external APIs when needed.

Examples:
- Number facts
- Date facts
- Random trivia

The LLM decides when to trigger tools, and the backend executes them before responding.

---

### 🌍 Multilingual Support
- English and Arabic supported
- Language switching in UI
- Speech recognition and synthesis adapt to selected language

---

### 💬 Chat Interface
- Clean chat UI
- User vs assistant message separation
- Voice and text input support

---

## 🧩 System Design

Sarjy follows a structured agent pipeline:

User Input → Frontend → Backend → LLM → Memory / Tools → Response

The LLM acts as a controller that:
- Generates responses
- Extracts memory updates
- Requests tool execution when needed

---

## 🧠 Design Decisions

### Structured LLM Output
The system enforces structured responses to ensure:

- Reliable memory updates
- Safe tool execution
- Predictable backend behavior

---

### Lightweight Memory System
A JSON-based storage approach was used for simplicity and fast prototyping.

Tradeoff:
- Not suitable for multi-user production scale without modification

---

### Frontend Voice Handling
All voice processing is handled in the browser to reduce backend complexity and latency.

---

## 🚀 Deployment

### Backend
Hosted on Render

FastAPI backend exposing a `/chat` endpoint.

### Frontend
Hosted on Vercel

Static web app handling UI, voice input, and API communication.

---

## 📈 Scalability Considerations

- Current design supports single-instance usage
- For larger scale:
  - Replace JSON memory with a database (SQLite / Redis)
  - Introduce user session management
  - Separate services into microservices

---

## ⚠️ Limitations

- Memory is not distributed across multiple backend instances
- Speech recognition depends on browser support
- Voice output quality varies across devices
- External APIs may be rate-limited

---

## 🔮 Future Improvements

### Intelligence
- Long-term memory summarization
- Improved context retention

### Voice
- Server-side speech-to-text

### Integrations
- Google Calendar
- Slack
- File storage systems
- Travel and booking APIs

### Multimodal
- Image input support
  
### Better UI
- Avatar-based assistant interface
