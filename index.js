import OpenAI from 'openai';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const openai = new OpenAI({
    baseURL: 'https://api.fireworks.ai/inference/v1',
    apiKey: process.env['FIREWORKS_API_KEY']
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "accounts/fireworks/models/llama-v3p3-70b-instruct",
        });
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error getting answer:", error);
        res.status(500).json({ error: 'Failed to get a response from the AI.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log("Open your browser to interact with the AI.");
});
