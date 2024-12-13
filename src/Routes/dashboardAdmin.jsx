import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../dashboardAdmin.css';

const NovelItem = ({ novel, genre, onDelete }) => {
  const navigate = useNavigate();

  const handleAddChapter = () => {
    localStorage.setItem('currentNovelId', novel.id_novel);
    navigate("/admin/formchapter");
  };

  const handleEdit = () => {
    navigate(`/admin/novel/${novel.id_novel}/editnovel`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(novel.id_novel);
  };

  return (
    <div className="novel-item">
      <Link to={`/admin/novel/${encodeURIComponent(novel.id_novel)}`}>
        <img src={novel.img} alt={novel.judul_novel} className="novel-image" />
        <div style={{ padding: "16px" }}>
          <h4 className="novel-title">{novel.judul_novel}</h4>
          <p><strong>Author:</strong> {novel.pengarang}</p>
          <p><strong>Genre:</strong> {genre}</p>
          <p className='deskripsi'>{novel.deskripsi}</p>
        </div>
      </Link>
      <div>
        <button onClick={handleAddChapter} className="add-chapter-btn">Tambah Chapter</button>
        <button onClick={handleEdit} className="edit-btn">Edit Novel</button>
        <button onClick={handleDelete} className="delete-btn">Hapus Novel</button>
      </div>
    </div>
  );
};

const NovelList = ({ novels, genres, onDelete }) => {
  const getGenreName = (id_genre) => {
    const genre = genres.find((genre) => genre.id_genre === id_genre);
    return genre ? genre.nama_genre : 'Unknown Genre';
  };

  return (
    <div className="novel-list">
      {novels.map((novel) => (
        <NovelItem key={novel.id_novel} novel={novel} genre={getGenreName(novel.id_genre)} onDelete={onDelete} />
      ))}
    </div>
  );
};

const DashboardAdmin = () => {
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [message, setMessage] = useState('');

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await axios.put('http://10.10.77.169:5020/authentications', {
        refreshToken: refreshToken,
      });

      const accessToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

    } catch (error) {
      console.error('Error refreshing token:', error);
      // Redirect to login if refresh token fails
      window.location.href = '/admin/login'; // Redirecting to login
    }
  };

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const response = await axios.get('http://10.10.77.169:5020/novel');
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
  }, []);

  const handleDelete = async (id_novel) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Deleting novel...`);
        const response = await axios.delete(`http://10.10.77.169:5020/novel/${id_novel}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.status === 200) {
          setMessage('Novel berhasil dihapus.');
          setNovels(novels.filter(novel => novel.id_novel !== id_novel));
          break;
        } else {
          setMessage('Gagal menghapus novel. Silakan coba lagi.');
        }
      } catch (error) {
        if (error.response && error.response.status === 402) {
          console.log('Unauthorized (401). Refreshing token...');
          await refreshToken();
          continue; // Retry the request after refreshing the token
        } else {
          console.error('There was an error deleting the novel!', error);
          setMessage('Terjadi kesalahan. Silakan coba lagi.');
          break;
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <NavbarAdmin />
      <div className='novel'>
        <h1 className='heading' style={{ marginBottom: "32px" }}>Daftar Novel</h1>
        {message && <p className="form-message">{message}</p>}
        <NovelList novels={novels} genres={genres} onDelete={handleDelete} />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardAdmin;
