import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import '../genre.css';

const Genre = () => {
  const [genre, setGenre] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://10.10.77.169:5020/genre');
        
        if (response.data && response.data.data && response.data.data.genre) {
          setGenre(response.data.data.genre);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('There was an error fetching the genres!', error);
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
        }
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (id_genre) => {
    navigate(`/genre/novel/${id_genre}`);
  };

  return (
    <div>
      <Navbar />
      <div className='Genre'>
        <h1>GENRE</h1>
        <div className='GenreList'>
          {genre.length > 0 ? (
            genre.map((genre) => (
              <button 
                key={genre.id_genre} 
                className='genreBtn'
                onClick={() => handleGenreClick(genre.id_genre)}
              >
                {genre.nama_genre}
              </button>
            ))
          ) : (
            <p>No genres found</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Genre;
