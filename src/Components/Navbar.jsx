import React from 'react';
import { Link } from 'react-router-dom';
import '../navbar.css';

const NavBar = () => {
  return (
    <div className='nav-container'>
      <nav>
        <ul className="nav-list">
          <li>
            <img 
              src='https://drive.google.com/thumbnail?id=1yBnZp5-vm7AkUwViDF_giCXFmmNtQ1OG' 
              alt='Logo' 
              className='logo-img'      
            />
          </li>
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/genre" className="nav-link">
              Genre
            </Link>
          </li>
          <li>
            <Link to="/Novel" className="nav-link">
              Daftar Novel
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;

//'https://drive.google.com/thumbnail?id=1f8LzHYyrwJTM9qbPSukEolrrewjoS4Js'