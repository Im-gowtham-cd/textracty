import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaRegCopy } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';

export default function Home() {
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

    const language = [
    {n: 'Arabic', v: 'ar'},
    {n: 'Bulgarian', v: 'bg'},
    {n: 'Chinese', v: 'zh'},
    {n: 'Croatian', v: 'hr'},
    {n: 'Czech', v: 'cs'},
    {n: 'Danish', v: 'da'},
    {n: 'English', v: 'en'},
    {n: 'Finnish', v: 'fi'},
    {n: 'French', v: 'fr'},
    {n: 'German', v: 'de'},
    {n: 'Greek', v: 'el'},
    {n: 'Hebrew', v: 'he'},
    {n: 'Hindi', v: 'hi'},
    {n: 'Hungarian', v: 'hu'},
    {n: 'Italian', v: 'it'},
    {n: 'Japanese', v: 'ja'},
    {n: 'Korean', v: 'ko'},
    {n: 'Latvian', v: 'lv'},
    {n: 'Lithuanian', v: 'lt'},
    {n: 'Macedonian', v: 'mk'},
    {n: 'Norwegian', v: 'no'},
    {n: 'Persian', v: 'fa'},
    {n: 'Polish', v: 'pl'},
    {n: 'Portuguese', v: 'pt'},
    {n: 'Romanian', v: 'ro'},
    {n: 'Russian', v: 'ru'},
    {n: 'Slovak', v: 'sk'},
    {n: 'Slovenian', v: 'sl'},
    {n: 'Spanish', v: 'es'},
    {n: 'Swedish', v: 'sv'},
    {n: 'Tamil', v: 'ta'},
    {n: 'Turkish', v: 'tr'},
    {n: 'Vietnamese', v: 'vi'}
];

  const message = [
    'Extracts text from images and documents',
    'Uses advanced OCR for high accuracy',
    'Supports multiple languages and file types',
    'Ideal for students, professionals, businesses'
  ];
  const social = [
    { i: <FaTwitter size={20} />, l: 'https://twitter.com' },
    { i: <FaFacebookF size={20} />, l: 'https://facebook.com' },
    { i: <FaInstagram size={20} />, l: 'https://instagram.com' },
    { i: <FaLinkedinIn size={20} />, l: 'https://linkedin.com' },
    { i: <FaGithub size={20} />, l: 'https://github.com' },
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid file type (JPG, JPEG, PNG, PDF)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    setSelectedFile(file);
    setIsProcessing(true);
    setExtractedText('Processing...');
    setTranslatedText('');

    try {
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(file);
      await worker.terminate();
      setExtractedText(data.text);
    } catch (error) {
      setExtractedText('Error extracting text: ' + error.message);
      console.error('OCR Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const translateText = async (text) => {
    if (!text) return;

    setIsTranslating(true);
    setTranslatedText('Translating...');

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`
      );

      if (!response.ok) {
        throw new Error('Translation failed: Network response was not ok.');
      }

      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        throw new Error('No translated text found in response.');
      }
    } catch (error) {
      setTranslatedText('Error translating text: ' + error.message);
      console.error('Translation Error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle language dropdown change
  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  // Run translation whenever language OR extracted text changes
  useEffect(() => {
    if (
      extractedText &&
      extractedText !== 'Processing...' &&
      extractedText.length > 0
    ) {
      translateText(extractedText);
    }
  }, [targetLanguage, extractedText]);

  // Cleanup URL object
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  function Copy(d) {
    const t = document.getElementById(d).textContent;
    const temp = document.createElement('textarea');
    temp.value = t;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    // alert("Copied the text: " + t.value);

  }

  return (
    <div className='home'>
      <div className="left">
        <p className="left-title">Textracty</p>
        <ul className="left-desc">
          {message.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
        <div className="left-btn">
          <Link to={'/login'} className="btn">Login</Link>
          <Link to={'/signup'} className="btn">Signup</Link>
        </div>
        <span className='left-social'>
          {social.map((d, i) => (
            <a href={d.l} key={i}> {d.i} </a>
          ))}
        </span>
      </div>

      <div className="right">
        <p className='right-title'>Upload your image</p>
        <label htmlFor="file-upload" className="fileupload">
          <input id="file-upload" type="file" onChange={handleFileUpload} hidden />
          <span className='right-desc'>
            <p>Supported file types: JPG, JPEG, PNG</p>
            <p>Max file size: 10MB</p>
          </span>
          <i className="fas fa-cloud-upload-alt"></i>
          <p className='right-upload'>{isProcessing ? 'Processing...' : 'Upload File'}</p>
        </label>

        {imageUrl && (
          <div className="image-preview-container">
            <p className='right-title'>Image Preview</p>
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
            </div>
          </div>
        )}

        <p className='right-title'>Extracted Text</p>
        <div className='extracted-text' id='exetext'>
          {extractedText}
          <button className='copy-btn' onClick={() => Copy('exetext')}><FaRegCopy />Copy</button>
        </div>

        <div className="translation-section">
          <div className="translation-header">
            <p className='right-title'>Translated Text</p>
            <select
              value={targetLanguage}
              onChange={handleLanguageChange}
              className="language-selector"
              disabled={isTranslating || !extractedText || extractedText === 'Processing...'}
            >
              {language.map((d, i) => (
                <option key={i} value={d.v}>{d.n}</option>
              ))}
            </select>
          </div>

          <div className='extracted-text' id="translatetext">
            {isTranslating ? 'Translating...' : translatedText}
            <button className='copy-btn' onClick={() => Copy('translatetext')}><FaRegCopy />Copy</button>
          </div>

        </div>
      </div>
    </div>
  );
}