import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

export default function Home() {
  const message = ['Extracts text from images and documents', 'Uses advanced OCR for high accuracy', 'Supports multiple languages and file types', 'Ideal for students, professionals, businesses'];
  const social = [
    { i: <FaTwitter size={20} />, l: 'https://twitter.com' },
    { i: <FaFacebookF size={20} />, l: 'https://facebook.com' },
    { i: <FaInstagram size={20} />, l: 'https://instagram.com' },
    { i: <FaLinkedinIn size={20} />, l: 'https://linkedin.com' },
    { i: <FaGithub size={20} />, l: 'https://github.com' },
  ]
  return (
    <div className='home'>
      <div className="left">
        <p className="left-title">Textracty</p>
        <ul className="left-desc">
          {
            message.map((d, i) => (
              <li key={i}>{d}</li>
            ))
          }
        </ul>
        <div className="left-btn">
          <Link to={'/login'} className="btn">Login</Link>
          <Link to={'/signup'} className="btn">Signup</Link>
        </div>
        <span className='left-social'>
          {
            social.map((d, i) => (
              <a href={d.l} key={i}> {d.i} </a>
            ))
          }
        </span>
      </div>
      <div className="right">
        <p className='right-title'>Upload your image</p>
        <label htmlFor="file-upload" className="fileupload">
          <input id="file-upload" type="file" hidden />
          <span className='right-desc'>
            <p>Supported file types: JPG, JPEG, PNG, PDF</p>
            <p>Max file size: 10MB</p>
          </span>
          <i className="fas fa-cloud-upload-alt"></i>
          <p className='right-upload'>Upload File</p>
        </label>
        <p className='right-title'>Extracted Text</p>
        <p className='extracted-text'></p>
        <p className='right-title'>Translated Text</p>
        <p className='extracted-text'></p>
      </div>
    </div>
  );
}