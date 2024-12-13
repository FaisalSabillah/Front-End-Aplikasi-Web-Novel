import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../dashboard.css';

const NovelItem = ({ novel, genre }) => {
  return (
    <Link to={`/novel/${encodeURIComponent(novel.id_novel)}`}>
      <div className="novel-item">
        <img src={novel.img} alt={novel.judul_novel} className="novel-image" />
        <div>
          <h4 className="novel-title">{novel.judul_novel}</h4>
          <p><strong>Author:</strong> {novel.pengarang}</p>
          <p><strong>Genre:</strong> {genre}</p>
          <p className='deskripsi'>{novel.deskripsi}</p>
        </div>
      </div>
    </Link>
  );
};

const NovelList = ({ novels, genres }) => {
  const getGenreName = (id_genre) => {
    const genre = genres.find((genre) => genre.id_genre === id_genre);
    return genre ? genre.nama_genre : 'Unknown Genre';
  };

  if (novels.length === 0) {
    return <p className="no-novels">Novel not found</p>;
  }

  return (
    <div className="novel-list">
      {novels.map((novel) => (
        <NovelItem key={novel.id_novel} novel={novel} genre={getGenreName(novel.id_genre)} />
      ))}
    </div>
  );
};

const NovelListwithGenre = () => {
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const { id_genre } = useParams();  // Mengambil id_genre dari URL

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await axios.get(`http://10.10.77.169:5020/genre/${id_genre}/novel`);
        setNovels(response.data.data.novel);
      } catch (error) {
        console.error('There was an error fetching the novels!', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://10.10.77.169:5020/genre');
        setGenres(response.data.data.genre);
      } catch (error) {
        console.error('There was an error fetching the genres!', error);
      }
    };

    fetchNovels();
    fetchGenres();
  }, [id_genre]);

  return (
    <div className="dashboard">
      <Navbar />
      <div className='novel'>
        <h1 className='heading' style={{ marginBottom: "32px" }}>Novel Berdasarkan Genre</h1>
        <NovelList novels={novels} genres={genres} />
      </div>
      <Footer />
    </div>
  );
};

export default NovelListwithGenre;
