# Gemini Chat Test

A premium, modern chat application to test and interact with Google's Gemini models. Built with FastAPI and Vanilla JavaScript.

## 🌟 Features

- **Premium UI**: Dark mode, glassmorphism design, and responsive layout.
- **Secure**: API Key is stored locally in your browser (LocalStorage) and never saved to our servers.
- **Model Selection**: Support for various Gemini models (e.g., `gemini-2.0-flash-exp`, `gemini-1.5-pro`).
- **Real-time Interaction**: Fast and responsive chat interface.

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Google Generative AI SDK
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript
- **Manager**: `uv` (for dependency management)

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- `uv` (Universal Python Package Manager)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd gemini_chat_test
    ```

2.  Install dependencies:
    ```bash
    uv sync
    ```

### Running the App

Start the server using `uv`:

```bash
uv run uvicorn server:app --reload
```

Open your browser and navigate to `http://localhost:8000`.

## 📖 Usage

1.  **Enter API Key**: Paste your Google Gemini API Key in the sidebar input.
2.  **Select Model**: Choose a model from the dropdown (default: `gemini-2.0-flash-exp`).
3.  **Chat**: Type your message and press Enter.

## 🛡️ Security Note

Your API Key is sent only to:
1.  Your local backend (`server.py`).
2.  Google's Generative AI servers (via the backend proxy).

It is **not** stored in any database or sent to any other third-party services.
