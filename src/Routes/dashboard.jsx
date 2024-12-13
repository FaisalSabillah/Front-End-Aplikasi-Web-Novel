import React, { useState, useEffect } from 'react';
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

  return (
    <div className="novel-list">
      {novels.map((novel) => (
        <NovelItem key={novel.id_novel} novel={novel} genre={getGenreName(novel.id_genre)} />
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await axios.get('http://localhost:5020/novel');
        const novels = response.data.data.novel;

        // Convert release date to Date object and sort novels
        const sortedNovels = novels
          .map(novel => ({
            ...novel,
            tanggal_rilis: new Date(novel.tgl_rilis)
          }))
          .sort((a, b) => b.tanggal_rilis - a.tanggal_rilis);

        setNovels(sortedNovels.slice(0, 10));
      } catch (error) {
        console.error('There was an error fetching the novels!', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:5020/genre');
        setGenres(response.data.data.genre);
      } catch (error) {
        console.error('There was an error fetching the genres!', error);
      }
    };

    fetchNovels();
    fetchGenres();
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <div className='novel'>
        <h1 className='heading' style={{ marginBottom: "32px" }}>Novel Terbaru</h1>
        <NovelList novels={novels} genres={genres} />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
