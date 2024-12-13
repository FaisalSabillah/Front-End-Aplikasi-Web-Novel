import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import axios from 'axios';
import '../formChapter.css';

const EditChapter = () => {
    const { no_chapter, id_novel } = useParams();
    const navigate = useNavigate();
    const [id_Chapter, setId_Chapter] = useState('');
    const [noChapter, setNoChapter] = useState('');
    const [tglChapter, setTglChapter] = useState('');
    const [isiChapter, setIsiChapter] = useState('');
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
        const fetchChapter = async () => {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    console.log(`Attempt ${attempt}: Fetching chapter...`);
                    const response = await axios.get(`http://10.10.77.169:5020/chapter/${no_chapter}/${id_novel}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    });

                    if (response.data.status === 'success') {
                        const chapter = response.data.data.chapter;
                        setNoChapter(chapter.no_chapter);
                        setTglChapter(chapter.tgl_chapter);
                        setIsiChapter(chapter.isi_chapter);
                        setId_Chapter(chapter.id_chapter);
                        break;
                    } else {
                        setMessage('Gagal mengambil data chapter. Silakan coba lagi.');
                        break;
                    }
                } catch (error) {
                    if (error.response && error.response.status === 402) {
                        console.log('Unauthorized (401). Refreshing token...');
                        await refreshToken();
                        continue; // Retry the request after refreshing the token
                    } else {
                        console.error('Error fetching chapter:', error);
                        setMessage('Terjadi kesalahan. Silakan coba lagi.');
                        break;
                    }
                }
            }
        };

        fetchChapter();
    }, [no_chapter, id_novel]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Sending request to update chapter...`);
                const response = await axios.put(`http://10.10.77.169:5020/chapter/${id_Chapter}`, {
                    no_chapter: noChapter,
                    tgl_chapter: tglChapter,
                    isi_chapter: isiChapter,
                    id_admin: localStorage.getItem('id_admin'),
                    id_novel: id_novel,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.status === 200) {
                    setMessage('Chapter berhasil diperbarui!');
                    navigate(`/admin/novel/${localStorage.getItem('currentNovelId')}`);
                    break;
                } else {
                    setMessage('Gagal memperbarui chapter. Silakan coba lagi.');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Unauthorized (401). Refreshing token...');
                    await refreshToken();
                    continue; // Retry the request after refreshing the token
                } else {
                    console.error('Error updating chapter:', error);
                    setMessage('Terjadi kesalahan. Silakan coba lagi.');
                    break;
                }
            }
        }
    };

    return (
        <div className="form-chapter-page">
            <NavbarAdmin />
            <div className="form-container-chapter">
                <h3 className="form-title">Edit Chapter</h3>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="NoChapter">No Chapter:</label>
                        <input
                            type="text"
                            id="NoChapter"
                            name="NoChapter"
                            value={noChapter}
                            onChange={(e) => setNoChapter(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="TglChapter">Tanggal Chapter:</label>
                        <input
                            type="date"
                            id="TglChapter"
                            name="TglChapter"
                            value={tglChapter}
                            onChange={(e) => setTglChapter(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="IsiChapter">Isi Chapter:</label>
                        <textarea
                            id="IsiChapter"
                            name="IsiChapter"
                            value={isiChapter}
                            onChange={(e) => setIsiChapter(e.target.value)}
                            className="form-textarea"
                        />
                    </div>
                    <button type="submit" className="form-button">Simpan Perubahan</button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>
            <Footer />
        </div>
    );
}

export default EditChapter;
