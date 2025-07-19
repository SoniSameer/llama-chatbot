const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');

// Hide the typing indicator by default
typingIndicator.style.display = 'none';

/**
 * Appends a new message to the chat box before the typing indicator.
 * @param {string} text The message content.
 * @param {string} sender The sender ('user' or 'ai').
 */
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);

    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);

    // Insert the new message before the typing indicator
    chatBox.insertBefore(messageDiv, typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (!message) return;

    appendMessage(message, 'user');
    userInput.value = '';

    // Show the typing indicator
    typingIndicator.style.display = 'block';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        appendMessage(data.reply, 'ai');

    } catch (error) {
        console.error('Error:', error);
        appendMessage('Sorry, something went wrong. Please try again.', 'ai');
    } finally {
        // Always hide the typing indicator
        typingIndicator.style.display = 'none';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
