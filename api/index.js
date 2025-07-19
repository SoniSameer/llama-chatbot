import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://api.fireworks.ai/inference/v1',
    apiKey: process.env.FIREWORKS_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "accounts/fireworks/models/llama-v3p3-70b-instruct",
        });

        res.status(200).json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error getting answer:", error);
        res.status(500).json({ message: 'Error getting answer' });
    }
}
