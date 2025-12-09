const state = {
    apiKey: localStorage.getItem('gemini_api_key') || '',
    model: 'gemini-2.0-flash-exp',
    isProcessing: false
};

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const toggleKeyBtn = document.getElementById('toggleKey');
const modelSelect = document.getElementById('modelSelect');
const refreshModelsBtn = document.getElementById('refreshModels');
const chatHistory = document.getElementById('chatHistory');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const currentModelDisplay = document.getElementById('currentModelDisplay');

// Initialize
function init() {
    if (state.apiKey) {
        apiKeyInput.value = state.apiKey;
        sendBtn.disabled = false;
        fetchModels();
    }

    // Auto-resize textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim().length > 0 && state.apiKey) {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    });

    // Enter to send
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
    });
}

// API Key Logic
apiKeyInput.addEventListener('input', (e) => {
    state.apiKey = e.target.value.trim();
    localStorage.setItem('gemini_api_key', state.apiKey);
    sendBtn.disabled = !state.apiKey || messageInput.value.trim() === '';
});

toggleKeyBtn.addEventListener('click', () => {
    const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    apiKeyInput.setAttribute('type', type);
    toggleKeyBtn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
});

// Model Logic
modelSelect.addEventListener('change', (e) => {
    state.model = e.target.value;
    currentModelDisplay.textContent = state.model;
});

refreshModelsBtn.addEventListener('click', async () => {
    if (!state.apiKey) {
        alert('Please enter an API Key first');
        return;
    }

    refreshModelsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
    try {
        const response = await fetch('/api/models', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: state.apiKey })
        });

        if (!response.ok) throw new Error('Failed to fetch models');

        const data = await response.json();

        // Preserve current selection if possible
        const currentSelection = modelSelect.value;
        modelSelect.innerHTML = '';

        data.models.forEach(model => {
            // Clean up model name
            const modelName = model.replace('models/', '');
            const option = document.createElement('option');
            option.value = modelName;
            option.textContent = modelName;
            modelSelect.appendChild(option);
        });

        if (data.models.map(m => m.replace('models/', '')).includes(currentSelection)) {
            modelSelect.value = currentSelection;
        } else if (data.models.length > 0) {
            modelSelect.value = data.models[0].replace('models/', '');
            state.model = modelSelect.value;
            currentModelDisplay.textContent = state.model;
        }

        refreshModelsBtn.innerHTML = '<i class="fa-solid fa-check"></i> Updated';
        setTimeout(() => {
            refreshModelsBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Refresh Models';
        }, 2000);

    } catch (error) {
        alert('Error fetching models: ' + error.message);
        refreshModelsBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Refresh Models';
    }
});

// Chat Logic
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.isProcessing || !state.apiKey) return;

    const message = messageInput.value.trim();
    if (!message) return;

    // UI Updates
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    state.isProcessing = true;

    const loadingId = addLoadingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                apiKey: state.apiKey,
                model: state.model
            })
        });

        const data = await response.json();
        removeLoadingIndicator(loadingId);

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to send message');
        }

        addMessage(data.response, 'bot');

    } catch (error) {
        removeLoadingIndicator(loadingId);
        addMessage(`Error: ${error.message}`, 'error');
    } finally {
        state.isProcessing = false;
        if (messageInput.value.trim()) {
            sendBtn.disabled = false;
        }
    }
});

function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Very basic markdown parsing
    if (type === 'bot') {
        contentDiv.innerHTML = parseMarkdown(text);
    } else {
        contentDiv.textContent = text;
    }

    msgDiv.appendChild(contentDiv);
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addLoadingIndicator() {
    const id = 'loading-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.id = id;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Thinking...';

    msgDiv.appendChild(contentDiv);
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return id;
}

function removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Basic Markdown Parser (simplified for this demo)
function parseMarkdown(text) {
    if (!text) return '';

    // Code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Newlines to <br>
    text = text.replace(/\n/g, '<br>');

    return text;
}

init();
