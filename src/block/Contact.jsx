export default function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-text">
        Have questions, feedback, or need assistance? We’re here to help!
      </p>

      <form className="contact-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea rows="5" placeholder="Write your message" required></textarea>
        </div>
        <button type="submit" className="contact-btn">Send Message</button>
      </form>

      <div className="contact-info">
        <h3>Location</h3>
        <p>Kongu Engineering College, Perundurai, Tamil Nadu</p>
        <h3>Email</h3>
        <p>support@textracty.com</p>
        <h3>Phone</h3>
        <p>+91 90035 38951</p>
      </div>
    </div>
  );
}
