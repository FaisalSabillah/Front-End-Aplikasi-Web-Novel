import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import '../genreAdmin.css';

const GenreAdmin = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://10.10.77.169:5020/genre', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data && response.data.data && response.data.data.genre) {
          setGenres(response.data.data.genre);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('There was an error fetching the genres!', error);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
          // Redirect to login page or handle token refresh
        }
      }
    };

    fetchGenres();
  }, [accessToken]);

  const handleAddGenre = () => {
    navigate('/admin/genreadmin/formgenre');
  };

  const handleEditGenre = (id_genre) => {
    navigate(`/admin/genreadmin/editgenre/${id_genre}`);
  };

  return (
    <div>
      <NavbarAdmin />
      <div className='Genre-admin'>
        <h1>GENRE</h1>
        <div className='GenreList-admin'>
          {genres.length > 0 ? (
            genres.map((genre) => (
              <div key={genre.id_genre} className='genre-item-admin'>
                <span className='genre-name-admin'>{genre.nama_genre}</span>
                <button onClick={() => handleEditGenre(genre.id_genre)} className='edit-genre-btn-admin'>
                  Edit
                </button>
              </div>
            ))
          ) : (
            <p>No genres found</p>
          )}
        </div>
        <button onClick={handleAddGenre} className='add-genre-btn-admin'>
          Tambah Genre
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default GenreAdmin;
