import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './StudyAssistant.css';

function StudyAssistant({ contextText }) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const serverResponse = await fetch('http://localhost:3001/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: contextText, question: question }),
      });

      if (!serverResponse.ok) {
        const errorData = await serverResponse.json();
        throw new Error(errorData.error || `Server responded with ${serverResponse.status}`);
      }

      const data = await serverResponse.json();
      setResponse(data.response);

    } catch (err) {
      console.error('Error calling study assistant:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="study-assistant">
      <h3>AI Study Assistant</h3>
      <p className="context-info">
        Ask a question about the current passage.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="For example: What is the historical context of this verse?"
          rows="3"
          disabled={isLoading}
        />
        <button type="submit" className="cta-button" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Ask Question'}
        </button>
      </form>

      {error && <p className="status-message error">{error}</p>}

      {response && (
        <div className="ai-response">
          <h4>Assistant's Response:</h4>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default StudyAssistant;