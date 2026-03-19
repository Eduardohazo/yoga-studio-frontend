import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-serif text-white text-lg font-bold mb-3">Yoga Studio</h3>
        <p className="text-sm leading-relaxed">Find your inner peace and strength with us.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm">Classes</h4>
        <ul className="space-y-2 text-sm">
          {[['/classes','All Classes'],['/schedule','Schedule'],['/instructors','Instructors']].map(([to, l]) => (
            <li key={to}><Link to={to} className="hover:text-white transition-colors">{l}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm">Studio</h4>
        <ul className="space-y-2 text-sm">
          {[['/about','About'],['/blog','Blog'],['/contact','Contact']].map(([to, l]) => (
            <li key={to}><Link to={to} className="hover:text-white transition-colors">{l}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
        <ul className="space-y-2 text-sm">
          {[['/login','Login'],['/register','Register'],['/pricing','Memberships']].map(([to, l]) => (
            <li key={to}><Link to={to} className="hover:text-white transition-colors">{l}</Link></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center text-xs">
      &copy; {new Date().getFullYear()} Yoga Studio. All rights reserved.
    </div>
  </footer>
);

export default Footer;
