import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3001; // You can change this port if needed

// Middleware
app.use(cors()); // Allow requests from your React app
app.use(express.json()); // Allow the server to read JSON from the request body

// Initialize the Google AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the API route
app.post('/ask-ai', async (req, res) => {
  try {
    const { text, question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'A question must be provided.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    const prompt = `You are an insightful and respectful Bible study assistant.
      Your purpose is to help users understand scripture more deeply.
      Based on the provided biblical text and the user's question, provide a clear, helpful, and theologically sound answer.
      If the question is unrelated to the text or faith, politely decline to answer.

      Biblical Text Context:
      ---
      ${text}
      ---

      User's Question: "${question}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();

    res.json({ response: aiResponseText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'An error occurred while contacting the AI study assistant.' });
  }
});

app.listen(port, () => {
  console.log(`
  ================================================
  AI Study Assistant server running on http://localhost:${port}
  ================================================
  `);
});