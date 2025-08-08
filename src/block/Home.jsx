import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

export default function Home() {
  return (
    <>
      <div className="left">
        <p className="left-title">Textracty</p>
        <ul className="left-desc">
          <li>Extracts text from images and documents</li>
          <li>Uses advanced OCR for high accuracy</li>
          <li>Supports multiple languages and file types</li>
          <li>Ideal for students, professionals, businesses</li>
        </ul>
        <div className="left-btn">
          <Link to={'/login'} className="btn">Login</Link>
          <Link to={'/signup'} className="btn">Signup</Link>
        </div>
        <span className='left-social'>
          <FaTwitter size={20} />
          <FaFacebookF size={20} />
          <FaInstagram size={20} />
          <FaLinkedinIn size={20} />
          <FaGithub size={20} />
        </span>

      </div>
      <div className="right">

      </div>
    </>
  );
}