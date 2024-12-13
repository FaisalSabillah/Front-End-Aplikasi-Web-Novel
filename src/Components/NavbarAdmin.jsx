import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../navbarAdmin.css';
import ValidationToken from './validationToken';

const NavBar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const token = localStorage.getItem('refreshToken');

      const response = await fetch('http://10.10.77.169:5020/authentications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: token,
        }),
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('id_admin');
      localStorage.removeItem('currentNovelId'); 

      if (response.ok) {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className='nav-container-admin'>
      <ValidationToken />
      <nav className='nav-admin'>
        <ul className="nav-list-admin">
          <li>
            <img 
              src='https://drive.google.com/thumbnail?id=1yBnZp5-vm7AkUwViDF_giCXFmmNtQ1OG' 
              alt='Logo' 
              className='logo-img'      
            />
          </li>
          <li>
            <Link to="/admin/dashboard" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/admin/formnovel" className="nav-link">
              Tambah Novel
            </Link>
          </li>
          <li>
            <Link to="/admin/genreadmin" className="nav-link">
              Genre
            </Link>
          </li>
          <li className='login-item'>
            <button className="login-btn-admin" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
