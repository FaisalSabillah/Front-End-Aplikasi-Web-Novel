import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import axios from 'axios';
import '../readChapter.css';

const ReadChapter = () => {
  const { no_chapter, id_novel } = useParams();
  const [chapterContent, setChapterContent] = useState('');
  const [chapterNumber, setChapterNumber] = useState(null); 
  const [novelId, setNovelId] = useState('');

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`http://10.10.77.169:5020/chapter/${no_chapter}/${id_novel}`);
        if (response.data.status === 'success') {
          const chapter = response.data.data.chapter;
          setChapterContent(chapter.isi_chapter);
          setChapterNumber(parseInt(chapter.no_chapter, 10));
          setNovelId(chapter.id_novel);
        } else {
          console.error('Failed to fetch chapter');
        }
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    fetchChapter();

    // Disable right click and Ctrl + C
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [no_chapter, id_novel]);

  return (
    <div className="read-chapter-page">
      <Navbar />
      <div className="read-chapter-container">
        <h2>Chapter {chapterNumber}</h2>
        <p className="chapter-content">{chapterContent}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link
            to={`/novel/${novelId}/chapter/${chapterNumber - 1}`}
            className="nav-button"
          >
            <button disabled={chapterNumber <= 1}>Previous</button>
          </Link>
          <Link
            to={`/novel/${novelId}/chapter/${chapterNumber + 1}`}
            className="nav-button"
          >
            <button>Next</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReadChapter;
