import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import axios from 'axios';
import '../novelDetailAdmin.css';

const NovelDetail = () => {
  const { id_novel } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState({});
  const [chapters, setChapters] = useState([]);
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
    const fetchNovel = async () => {
      try {
        const response = await axios.get(`http://10.10.77.169:5020/novel/${id_novel}`);
        if (response.data.status === 'success') {
          setNovel(response.data.data.novel);
        } else {
          console.error('Failed to fetch novel');
        }
      } catch (error) {
        console.error('Error fetching novel:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const response = await axios.get(`http://10.10.77.169:5020/chapterlist/${id_novel}`);
        if (response.data.status === 'success') {
          setChapters(response.data.data.chapter);
        } else {
          console.error('Failed to fetch chapters');
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchNovel();
    fetchChapters();
  }, [id_novel]);

  const handleDeleteChapter = async (id_chapter) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Deleting chapter...`);
        const response = await axios.delete(`http://10.10.77.169:5020/chapter/${id_chapter}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.status === 200) {
          setMessage('Chapter berhasil dihapus.');
          setChapters(chapters.filter(chapter => chapter.id_chapter !== id_chapter));
          break;
        } else {
          setMessage('Gagal menghapus chapter. Silakan coba lagi.');
        }
      } catch (error) {
        if (error.response && error.response.status === 402) {
          console.log('Unauthorized (401). Refreshing token...');
          await refreshToken();
          continue; // Retry the request after refreshing the token
        } else {
          console.error('Error deleting chapter:', error);
          setMessage('Terjadi kesalahan. Silakan coba lagi.');
          break;
        }
      }
    }
  };

  const handleEditChapter = (no_chapter, id_novel) => {
    navigate(`/admin/formchapter/${id_novel}/editchapter/${no_chapter}`);
  };

  return (
    <div className="novel-detail-page-admin">
      <NavbarAdmin />
      <div className="novel-detail-container-admin">
        <h1>{novel.judul_novel}</h1>
        <div className="novel-detail-content-admin">
          <img src={novel.img} alt={novel.judul_novel} className="novel-image-admin" />
          <div className="novel-info-admin">
            <p><strong>Pengarang:</strong> {novel.pengarang}</p>
            <p><strong>Penerbit:</strong> {novel.penerbit}</p>
            <p><strong>Tahun Rilis:</strong> {novel.tgl_rilis}</p>
            <p><strong>Deskripsi:</strong> {novel.deskripsi}</p>
            <h3>Daftar Chapter</h3>
            {message && <p className="form-message">{message}</p>}
            <ul>
              {chapters?.map((chapter) => (
                <li key={chapter.id_chapter} className="chapter-item-admin">
                  <Link to={`/novel/${id_novel}/chapter/${chapter.no_chapter}`}>
                    {`Chapter ${chapter.no_chapter}`} 
                  </Link>
                  <div className='edit-delete-btn'>
                    <button onClick={() => handleEditChapter(chapter.no_chapter, chapter.id_novel)} className="edit-chapter-btn">Edit Chapter</button>
                    <button onClick={() => handleDeleteChapter(chapter.id_chapter)} className="delete-chapter-btn">Hapus Chapter</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NovelDetail;
