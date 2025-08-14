export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Textracty</h1>
      <p className="about-text">
        Welcome to <strong>Textracty</strong> — an platform designed to
        extract, process, and translate text from scanned PDFs, images, and handwritten
        documents with remarkable accuracy.
      </p>
      <p className="about-text">
        Using advanced <strong>OCR (Optical Character Recognition)</strong> technology
        powered by <em>Tesseract.js</em> and <strong>PDF.js</strong>, Textracty ensures
        reliable extraction of both printed and handwritten text across multiple
        languages.
      </p>
      <h2 className="about-subtitle">Key Features</h2>
      <ul className="about-list">
        <li>Multi-language text extraction</li>
        <li>Printed document support</li>
        <li> Integrated translation for extracted text</li>
        <li> Quick and intuitive interface</li>
      </ul>
      <p className="about-text">
        Our mission is to make information more accessible by bridging the gap between
        physical documents and the digital world.
      </p>
    </div>
  );
}
