import React from 'react'

function About() {
  return (
    <div className="about-page">
      <h2>About Me</h2>
      <div className="about-page-content">
        <img src="/images/JW3.jpg" alt="John Walkenbach III" className="my-about-image" />
        <div className="about-text">
          <p>
            Good day to all my brothers and sisters in Christ Jesus! May God continue to bless you and all those in your life with His everlasting peace, joy, and eternal love!
          </p>
          <p>
            My name is John P. Walkenbach III. I am the owner and developer of Eternal Life Ministry. My goal is to provide you with many scripture readings, links to Christian-based videos, and much more. I hope that your visit here will prove to be frequented, informative, and trustworthy. As I continue to improve upon this site, you may notice some changes from day to day as I am developing it and hosting it online simultaneously.
          </p>
          <p>
            I am creating this site to share with you all the peace, love, joy, and happiness our Lord and Savior Jesus Christ has blessed me with. Remember this always:
          </p>
          <p className="quote">
            <strong>"Jesus died, so we could live!"</strong>
          </p>
          <p className="signature">
            With Love,<br/>
            John Phillip Walkenbach III
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
