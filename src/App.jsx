import { Routes, Route } from 'react-router-dom';
import Nav from './block/Nav';
import Home from './block/Home';
import About from './block/About';
import Contact from './block/Contact';
import Login from './block/Login';
import Signup from './block/Signup';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
