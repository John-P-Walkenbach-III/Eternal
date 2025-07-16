import React, { useState, useEffect } from 'react';
import { useAnnotations } from '../hooks/useAnnotations';
import Annotation from '../components/Annotation';
import './LivingWord.css';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../utils/helpers';

// Mock data until we build the useAnnotations hook
const passage = {
  reference: "Ephesians 2:8-10",
  text: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, lest anyone should boast. For we are His workmanship, created in Christ Jesus for good works, which God prepared beforehand that we should walk in them."
};

const mockAnnotations = [
  {
    id: 'anno1',
    userDisplayName: 'Sarah',
    selectedText: 'it is the gift of God',
    comment: 'This is such a powerful reminder that we can\'t earn our salvation. It truly is a free gift!',
    upvotes: 12,
  },
  {
    id: 'anno2',
    userDisplayName: 'Mark',
    selectedText: 'we are His workmanship',
    comment: 'The Greek word here is "poiema", from which we get our word "poem". We are God\'s poetry!',
    upvotes: 25,
  },
  {
    id: 'anno3',
    userDisplayName: 'Admin',
    selectedText: 'created in Christ Jesus for good works',
    comment: 'Notice the order: we are saved *for* good works, not *by* them. Our works are the result of our salvation, not the cause.',
    upvotes: 30,
    isFeatured: true,
  }
];
// End mock data


function LivingWord() {
  const { currentUser } = useAuth();
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);  
  const { annotations, loading, addAnnotation } = useAnnotations(passage.reference);

  const handleTextHighlight = (text) => {
    // When selecting a text for annotation, hide any existing annotations
    // for other highlighted texts. This avoids scenarios where a user selects
    // the first highlight and then the second highlight and they now have
    // annotations for both.  Instead, if they click a highlight they are about
    // to annotate they'll get to see the annotation for that highlight once
    // they've submitted.
    setSelectedAnnotation(null);
    // This function would be triggered when a user clicks highlighted text.
    // For this concept, we'll find the matching mock annotation.
    const annotation = annotations.find(a => a.selectedText === text);
    if (annotation) {
      setSelectedAnnotation(annotation);
      // Also set the selected text and hide the form when viewing an existing annotation
      setSelectedText(annotation.selectedText);
      setShowAnnotationForm(false);
    }
  };

  // A function to apply highlights to the text based on annotations
  const getHighlightedText = () => {
    let text = passage.text;
    annotations.forEach(anno => {
      // Find and replace all occurrences of the annotation's selected text
        // with the highlighted version
        const regex = new RegExp(escapeRegExp(anno.selectedText), 'g'); // 'g' for global replacement
        text = text.replace(
            regex,
            `<mark class="highlighted-text" data-text="${anno.selectedText}">${anno.selectedText}</mark>`
        );
    });
    return { __html: text };
  };

  // Helper function to escape special characters in the selected text for regex
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
  }


  const handleClick = (e) => {
    if (e.target.tagName === 'MARK' && e.target.dataset.text) {
        handleTextHighlight(e.target.dataset.text);
    }
  };

  // This function captures any new text the user highlights with their mouse
  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    // Only update if the user has selected new, non-empty text.
    // This prevents clearing the selection when just clicking.
    if (text && text !== selectedText) {
      setSelectedText(text);
      // When a user makes a new selection, clear any previously viewed annotation
      setSelectedAnnotation(null);
    }
  };

  const handleAddAnnotationClick = () => {
    if (selectedText) {
      setShowAnnotationForm(true);
    } else {
      alert('Please select some text to annotate.');
    }
  };

  const handleAnnotationSubmit = (comment) => {
    setShowAnnotationForm(false);
    addAnnotation(selectedText, comment);
  };



  return (
    <div className="living-word-page">
      <div className="living-word-intro">
        <h1>The Living Word</h1>
        <p>This is a shared space for reflection. This week's passage is <strong>{passage.reference}</strong>. Highlight text to add your own thoughts, or click a highlighted section to see what others are saying.</p>
      </div>

      <div className="living-word-container">
        <div className="passage-container">
          <h3>{passage.reference}</h3>
          <div className="passage-text" onClick={handleClick} onMouseUp={handleSelection} dangerouslySetInnerHTML={getHighlightedText()}></div>
          <div className="add-annotation-prompt">
            <p>Have a thought to share? Select any part of the text above to add your annotation.</p>
            {showAnnotationForm ? (
              <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAnnotationSubmit(e.target.comment.value);
                }}>
                <textarea name="comment" placeholder="Your thoughts" required />
                <button type="submit" className="cta-button">Submit</button>
              </form>
            ) : (<button className="cta-button" onClick={handleAddAnnotationClick}>Add Annotation</button>)}
          </div>
        </div>

        <div className="annotations-sidebar">
          <h3>Community Reflections</h3>
          {loading && <p>Loading reflections...</p>}
          {!loading && !selectedAnnotation && (<div className="no-selection"><p>Click on a highlighted passage to see the reflection here.</p></div>)}
          {selectedAnnotation && (<Annotation key={selectedAnnotation.id} annotation={selectedAnnotation} isFeatured={selectedAnnotation.isFeatured} />)}
        </div>
      </div>
    </div>
  )
}

export default LivingWord;