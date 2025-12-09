# Gemini Chat Test

Uma aplicação de chat moderna e premium para testar e interagir com os modelos Gemini do Google. Construída com FastAPI e JavaScript Vanilla.

[English Version](README.md)

## 🌟 Funcionalidades

- **Interface Premium**: Modo escuro, design glassmorphism e layout responsivo.
- **Segurança**: Sua chave de API é armazenada localmente no seu navegador (LocalStorage) e nunca é salva em nossos servidores.
- **Seleção de Modelos**: Suporte para vários modelos Gemini (ex: `gemini-2.0-flash-exp`, `gemini-1.5-pro`).
- **Interação em Tempo Real**: Interface de chat rápida e responsiva.

## 🛠️ Tecnologias Utilizadas

- **Backend**: Python, FastAPI, Google Generative AI SDK
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript
- **Gerenciador**: `uv` (Gerenciador de Pacotes Python Universal)

## 🚀 Como Começar

### Pré-requisitos

- Python 3.12+
- `uv` (Universal Python Package Manager)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/GeorgeMyller/gemini-chat-test.git
    cd gemini_chat_test
    ```

2.  Instale as dependências:
    ```bash
    uv sync
    ```

### Executando o App

Inicie o servidor usando o `uv`:

```bash
uv run uvicorn server:app --reload
```

Abra seu navegador e acesse `http://localhost:8000`.

## 📖 Como Usar

1.  **Insira sua Chave de API**: Cole sua chave de API do Google Gemini no campo lateral.
2.  **Selecione o Modelo**: Escolha um modelo no menu suspenso (padrão: `gemini-2.0-flash-exp`).
3.  **Converse**: Digite sua mensagem e pressione Enter.

## 🛡️ Nota sobre Segurança

Sua chave de API é enviada apenas para:
1.  Seu backend local (`server.py`).
2.  Servidores de IA Generativa do Google (através do proxy do backend).

Ela **não** é armazenada em banco de dados nem enviada para outros serviços de terceiros.
