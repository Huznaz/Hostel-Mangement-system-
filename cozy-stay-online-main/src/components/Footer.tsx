
import { Link } from 'react-router-dom';
import { Instagram, MessageSquare, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-hotel-dark-brown text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-hotel-gold mb-4">ZamZam</h3>
            <p className="text-sm text-gray-300 mb-4">
              Experience community and comfort at our backpacker-friendly hostel. Perfect for budget travelers and adventurers.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/mohazsalah90" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-hotel-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/254769505440" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-hotel-gold transition-colors">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-semibold text-hotel-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-hotel-gold transition-colors">Home</Link></li>
              <li><Link to="/rooms" className="text-gray-300 hover:text-hotel-gold transition-colors">Rooms</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-hotel-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-hotel-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-semibold text-hotel-gold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-hotel-gold" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-hotel-gold" />
                <span className="text-gray-300">+254 769 505 440</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-hotel-gold" />
                <span className="text-gray-300">info@zamzam.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-semibold text-hotel-gold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-2">Subscribe for special offers and travel tips</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-3 py-2 text-sm bg-white/10 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-hotel-gold focus:border-hotel-gold text-white"
              />
              <button 
                type="submit" 
                className="w-full bg-hotel-gold hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} ZamZam Hostel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
