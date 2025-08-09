import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
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
            <p>Supported file types: JPG, JPEG, PNG, PDF</p>
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
        <div className='extracted-text'>{extractedText}</div>

        <div className="translation-section">
          <div className="translation-header">
            <p className='right-title'>Translated Text</p>
            <select
              value={targetLanguage}
              onChange={handleLanguageChange}
              className="language-selector"
              disabled={isTranslating || !extractedText || extractedText === 'Processing...'}
            >
              <option value="af">Afrikaans</option>
              <option value="am">Amharic</option>
              <option value="ar">Arabic</option>
              <option value="bn">Bengali</option>
              <option value="bg">Bulgarian</option>
              <option value="my">Burmese</option>
              <option value="zh">Chinese</option>
              <option value="hr">Croatian</option>
              <option value="cs">Czech</option>
              <option value="da">Danish</option>
              <option value="nl">Dutch</option>
              <option value="en">English</option>
              <option value="et">Estonian</option>
              <option value="fi">Finnish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="el">Greek</option>
              <option value="he">Hebrew</option>
              <option value="hi">Hindi</option>
              <option value="hu">Hungarian</option>
              <option value="is">Icelandic</option>
              <option value="id">Indonesian</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="lo">Lao</option>
              <option value="lv">Latvian</option>
              <option value="lt">Lithuanian</option>
              <option value="ms">Malay</option>
              <option value="mt">Maltese</option>
              <option value="mr">Marathi</option>
              <option value="ne">Nepali</option>
              <option value="no">Norwegian</option>
              <option value="pa">Punjabi</option>
              <option value="fa">Persian</option>
              <option value="pl">Polish</option>
              <option value="pt">Portuguese</option>
              <option value="ro">Romanian</option>
              <option value="ru">Russian</option>
              <option value="sr">Serbian</option>
              <option value="si">Sinhala</option>
              <option value="sk">Slovak</option>
              <option value="sl">Slovenian</option>
              <option value="es">Spanish</option>
              <option value="sw">Swahili</option>
              <option value="sv">Swedish</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="th">Thai</option>
              <option value="tr">Turkish</option>
              <option value="uk">Ukrainian</option>
              <option value="ur">Urdu</option>
              <option value="vi">Vietnamese</option>
              <option value="xh">Xhosa</option>
              <option value="yo">Yoruba</option>
              <option value="zu">Zulu</option>
              <option value="km">Khmer</option>
              <option value="ga">Irish</option>
              <option value="km">Khmer</option>
              <option value="km">Khmer</option>
            </select>
          </div>
          <div className='extracted-text'>
            {isTranslating ? 'Translating...' : translatedText}
          </div>
        </div>
      </div>
    </div>
  );
}
