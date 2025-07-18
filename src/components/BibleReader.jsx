import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

// The ID for the New King James Version on API.Bible
const BIBLE_ID = 'de4e12af7f28f599-01';
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY;

function BibleReader() {
  const { passageId } = useParams(); // Get the passage from the URL

  // State for our component
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [content, setContent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to fetch the list of books when the component mounts
  useEffect(() => {
    if (!API_KEY) {
      setError('API Key is missing. Please add it to your .env.local file.');
      return;
    }
    
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books`, {
          headers: { 'api-key': API_KEY }
        });
        if (!response.ok) throw new Error('Failed to fetch books. Please check your API key.');
        const data = await response.json();
        setBooks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Effect to handle deep linking from the URL
  useEffect(() => {
    // Only run if we have a passageId from the URL and the list of books has loaded
    if (passageId && books.length > 0) {
      // Decode and parse the passageId, e.g., "Genesis 1"
      const decodedPassage = decodeURIComponent(passageId);
      const parts = decodedPassage.match(/^(.+?)\s+(\d+)$/);

      if (!parts) {
        setError(`Invalid passage format: "${decodedPassage}"`);
        return;
      }

      const bookName = parts[1];
      const chapterNumber = parts[2];

      // Find the book by name (case-insensitive)
      const book = books.find(b => b.name.toLowerCase() === bookName.toLowerCase());

      if (book) {
        // Set the selected book and chapter, which will trigger the other effects
        setSelectedBook(book.id);
        setSelectedChapter(`${book.id}.${chapterNumber}`);
      } else {
        setError(`Book not found: "${bookName}"`);
      }
    }
  }, [passageId, books]); // Reruns when passageId or books array changes

  // Effect to fetch chapters when a book is selected
  useEffect(() => {
    if (!selectedBook) return;

    const fetchChapters = async () => {
      setIsLoading(true);
      setError(null);
      setContent('');
      setChapters([]);
      try {
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books/${selectedBook}/chapters`, {
          headers: { 'api-key': API_KEY }
        });
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data = await response.json();
        setChapters(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, [selectedBook]);

  // Effect to fetch chapter content when a chapter is selected
  useEffect(() => {
    if (!selectedChapter) return;

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${selectedChapter}?content-type=html`, {
          headers: { 'api-key': API_KEY }
        });
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data.data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [selectedChapter]);

  return (
    <div className="bible-reader">
      <div className="bible-controls">
        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} disabled={books.length === 0}>
          <option value="">Select a Book</option>
          {books.map(book => <option key={book.id} value={book.id}>{book.name}</option>)}
        </select>
        <select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} disabled={chapters.length === 0}>
          <option value="">Select a Chapter</option>
          {chapters.map(chapter => <option key={chapter.id} value={chapter.id}>{chapter.number}</option>)}
        </select>
      </div>

      <div className="bible-content">
        {isLoading && <p>Loading...</p>}
        {error && <p className="status-message error">{error}</p>}
        {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
    </div>
  );
}

export default BibleReader