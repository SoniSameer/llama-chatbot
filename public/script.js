const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const typingIndicator = document.getElementById('typing-indicator');

// Hide the typing indicator by default
typingIndicator.style.display = 'none';

/**
 * Creates a new message element.
 * @param {string} sender The sender ('user' or 'ai').
 * @returns {HTMLElement} The message element.
 */
function createMessageElement(sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    const p = document.createElement('p');
    messageDiv.appendChild(p);
    return messageDiv;
}

/**
 * Types out a message character by character.
 * @param {string} text The message content.
 * @param {HTMLElement} messageElement The message element to type into.
 * @returns {Promise<void>}
 */
function typeMessage(text, messageElement) {
    return new Promise(resolve => {
        const p = messageElement.querySelector('p');
        messageElement.classList.add('typing');
        let i = 0;
        const speed = 10; // typing speed in milliseconds

        function type() {
            if (i < text.length) {
                p.textContent += text.charAt(i);
                i++;
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(type, speed);
            } else {
                messageElement.classList.remove('typing');
                resolve();
            }
        }
        type();
    });
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();

    if (!message) return;

    const userMessageEl = createMessageElement('user');
    userMessageEl.querySelector('p').textContent = message;
    chatBox.insertBefore(userMessageEl, typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = '';

    typingIndicator.style.display = 'block';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        typingIndicator.style.display = 'none'; // Hide loader after fetch is complete

        const markdownText = data.reply;

        const finalMessageEl = createMessageElement('ai');
        finalMessageEl.querySelector('p').innerHTML = marked.parse(markdownText);
        finalMessageEl.style.display = 'none';
        chatBox.insertBefore(finalMessageEl, typingIndicator);

        const typewriterEl = createMessageElement('ai');
        chatBox.insertBefore(typewriterEl, typingIndicator);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = marked.parse(markdownText);
        const plainText = tempDiv.textContent || "";

        await typeMessage(plainText, typewriterEl);

        chatBox.removeChild(typewriterEl);
        finalMessageEl.style.display = 'block';
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        typingIndicator.style.display = 'none'; // Also hide loader on error
        console.error('Error:', error);
        const errorMessageEl = createMessageElement('ai');
        chatBox.insertBefore(errorMessageEl, typingIndicator);
        await typeMessage('Sorry, something went wrong. Please try again.', errorMessageEl);
    }
});
