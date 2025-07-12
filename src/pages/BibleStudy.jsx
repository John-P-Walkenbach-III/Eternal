import React from 'react';
import { Link } from 'react-router-dom';

function BibleStudy() {
  return (
    <div className="bible-study-page">
      <h2>Bible Study: The Armor of God</h2>
      <p>
        Welcome to our first Bible study session! Today, we will be exploring the concept of the Armor of God as described in Ephesians.
      </p>

      <div className="study-step">
        <h3>Step 1: Read the Scripture</h3>
        <p>
          Please read <strong>Ephesians 6:10-18</strong>. You can use our integrated Bible reader to find the passage.
        </p>
        <Link to="/features" className="cta-button">Open Bible Reader</Link>
      </div>

      <hr className="section-divider" />

      <div className="study-step">
        <h3>Step 2: Take the Quiz</h3>
        <p>
          After reading the scripture, click the button below to open the quiz in a new tab.
        </p>
        <div className="quiz-container">
          <a
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAZMnDZ5UM0owMlc3WDJGVzlORU0xQU1WSjJZN0laUC4u&embed=true"
            className="cta-button"
            target="_blank"
            rel="noopener noreferrer">
            Take the Quiz
          </a>
        </div>
      </div>
    </div>
  );
}




export default BibleStudy;