import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import axios from 'axios';
import '../novelDetail.css';

const NovelDetail = () => {
  const { id_novel } = useParams(); 
  const [novel, setNovel] = useState({});
  const [chapters, setChapters] = useState([]);

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

  return (
    <div className="novel-detail-page">
      <Navbar />
      <div className="novel-detail-container">
        <h1>{novel.judul_novel}</h1>
        <div className="novel-detail-content">
          <img src={novel.img} alt={novel.judul_novel} className="novel-image" />
          <div className="novel-info">
            <p><strong>Pengarang:</strong> {novel.pengarang}</p>
            <p><strong>Penerbit:</strong> {novel.penerbit}</p>
            <p><strong>Tahun Rilis:</strong> {novel.tgl_rilis}</p>
            <p><strong>Deskripsi:</strong> {novel.deskripsi}</p>
            <h3>Daftar Chapter</h3>
            <ul>
              {chapters?.map((chapter) => (
                <li key={chapter.id_chapter} className="chapter-item">
                  <Link to={`/novel/${id_novel}/chapter/${chapter.no_chapter}`}>
                    {`Chapter ${chapter.no_chapter}`}
                  </Link>
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
