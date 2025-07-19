const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');

/**
 * Creates a new message element.
 * @param {string} text The message content.
 * @param {string} sender The sender ('user' or 'ai').
 * @returns {HTMLElement} The message element.
 */
function createMessageElement(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);

    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);
    return messageDiv;
}

/**
 * Appends a new message to the chat box and scrolls to the bottom.
 * @param {string} text The message content.
 * @param {string} sender The sender ('user' or 'ai').
 */
function appendMessage(text, sender) {
    const messageEl = createMessageElement(text, sender);
    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (!message) return;

    appendMessage(message, 'user');
    userInput.value = '';

    // Move the indicator to the end, so it appears after the user's message
    chatBox.appendChild(typingIndicator);

    // Show the typing indicator and scroll to it
    typingIndicator.classList.remove('hidden');
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ message }), });
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const data = await response.json();
        const aiMessageEl = createMessageElement(data.reply, 'ai');
        chatBox.insertBefore(aiMessageEl, typingIndicator);
    } catch (error) {
        console.error('Error:', error);
        const errorMessageEl = createMessageElement('Sorry, something went wrong. Please try again.', 'ai');
        chatBox.insertBefore(errorMessageEl, typingIndicator);
    } finally {
        // Always hide the typing indicator and scroll down
        typingIndicator.classList.add('hidden');
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});