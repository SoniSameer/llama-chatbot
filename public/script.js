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
 */
function typeMessage(text, messageElement) {
    const p = messageElement.querySelector('p');
    messageElement.classList.add('typing'); // Add typing class
    let i = 0;
    const speed = 10; // typing speed in milliseconds

    function type() {
        if (i < text.length) {
            p.textContent += text.charAt(i);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(type, speed);
        } else {
            messageElement.classList.remove('typing'); // Remove typing class when done
        }
    }

    type();
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
        const aiMessageEl = createMessageElement('ai');
        chatBox.insertBefore(aiMessageEl, typingIndicator);
        typeMessage(data.reply, aiMessageEl);


    } catch (error) {
        console.error('Error:', error);
        const errorMessageEl = createMessageElement('ai');
        chatBox.insertBefore(errorMessageEl, typingIndicator);
        typeMessage('Sorry, something went wrong. Please try again.', errorMessageEl);
    } finally {
        // Always hide the typing indicator
        typingIndicator.style.display = 'none';
    }
});