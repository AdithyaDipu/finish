import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send('service_ujxnd0o', 'template_w5lo0es', formData, 'qNawo2WvYCuXCAm0q')
      .then(() => {
        alert('Message sent successfully!');
        onClose();
      }, (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-green-600">Contact Us</h2>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Your Name" 
          className="w-full p-2 mb-3 border rounded text-black" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Your Email" 
          className="w-full p-2 mb-3 border rounded text-black" 
          required 
        />
        <textarea 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          placeholder="Message" 
          className="w-full p-2 mb-3 border rounded text-black" 
          rows="4" 
          required
        ></textarea>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Send Message</button>
        <button onClick={onClose} type="button" className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Close</button>
      </form>
    </div>
  );
};

export default ContactPopup;
