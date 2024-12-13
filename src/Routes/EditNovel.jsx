import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../formNovel.css';

const EditNovel = () => {
    const { id_novel } = useParams();
    const navigate = useNavigate();
    const [judulNovel, setJudulNovel] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [pengarang, setPengarang] = useState('');
    const [penerbit, setPenerbit] = useState('');
    const [tahunRilis, setTahunRilis] = useState('');
    const [sampulNovel, setSampulNovel] = useState('');
    const [message, setMessage] = useState('');
    const [id_genre, setId_genre] = useState('');
    const [genres, setGenres] = useState([]);

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
        const fetchGenres = async () => {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    console.log(`Attempt ${attempt}: Fetching genres...`);
                    const response = await axios.get('http://10.10.77.169:5020/genre', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    });

                    if (response.data && response.data.data) {
                        setGenres(response.data.data.genre);
                        break;
                    } else {
                        setMessage('Gagal mengambil genre. Silakan coba lagi.');
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.log('Unauthorized (401). Refreshing token...');
                        await refreshToken();
                        continue; // Retry the request after refreshing the token
                    } else {
                        console.error('Error fetching genres:', error);
                        setMessage('Terjadi kesalahan. Silakan coba lagi.');
                        break;
                    }
                }
            }
        };

        const fetchNovel = async () => {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    console.log(`Attempt ${attempt}: Fetching novel...`);
                    const response = await axios.get(`http://10.10.77.169:5020/novel/${id_novel}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    });

                    if (response.data && response.data.data) {
                        const novel = response.data.data.novel;
                        setJudulNovel(novel.judul_novel);
                        setDeskripsi(novel.deskripsi);
                        setPengarang(novel.pengarang);
                        setPenerbit(novel.penerbit);
                        setTahunRilis(novel.tgl_rilis);
                        setSampulNovel(novel.img);
                        setId_genre(novel.id_genre);
                        break;
                    } else {
                        setMessage('Gagal mengambil data novel. Silakan coba lagi.');
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.log('Unauthorized (401). Refreshing token...');
                        await refreshToken();
                        continue; // Retry the request after refreshing the token
                    } else {
                        console.error('Error fetching novel:', error);
                        setMessage('Terjadi kesalahan. Silakan coba lagi.');
                        break;
                    }
                }
            }
        };

        fetchGenres();
        fetchNovel();
    }, [id_novel]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Sending request to update novel...`);
                const response = await axios.put(`http://10.10.77.169:5020/novel/${id_novel}`, {
                    judul_novel: judulNovel,
                    deskripsi,
                    pengarang,
                    penerbit,
                    tgl_rilis: tahunRilis,
                    img: sampulNovel,
                    id_admin: localStorage.getItem('id_admin'),
                    id_genre: id_genre,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.status === 200) {
                    setMessage('Novel berhasil diperbarui!');
                    setTimeout(() => navigate('/admin/dashboard'), 2000); // Redirect setelah 2 detik
                    break;
                } else {
                    setMessage('Gagal memperbarui novel. Silakan coba lagi.');
                }
            } catch (error) {
                if (error.response && error.response.status === 402) {
                    console.log('Unauthorized (401). Refreshing token...');
                    await refreshToken();
                    continue; // Retry the request after refreshing the token
                } else {
                    console.error('Error updating novel:', error);
                    setMessage('Terjadi kesalahan. Silakan coba lagi.');
                    break;
                }
            }
        }
    };

    return (
        <div className="form-novel-page">
            <NavbarAdmin />
            <div className="form-container-novel">
                <h3 className="form-title">Edit Novel</h3>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="judulNovel">Judul Novel:</label>
                        <input
                            type="text"
                            id="judulNovel"
                            value={judulNovel}
                            onChange={(e) => setJudulNovel(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deskripsi">Deskripsi:</label>
                        <textarea
                            id="deskripsi"
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            className="form-textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pengarang">Pengarang:</label>
                        <input
                            type="text"
                            id="pengarang"
                            value={pengarang}
                            onChange={(e) => setPengarang(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="penerbit">Penerbit:</label>
                        <input
                            type="text"
                            id="penerbit"
                            value={penerbit}
                            onChange={(e) => setPenerbit(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tahunRilis">Tahun Rilis:</label>
                        <input
                            type="date"
                            id="tahunRilis"
                            value={tahunRilis}
                            onChange={(e) => setTahunRilis(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sampulNovel">Sampul Novel:</label>
                        <input
                            type="text"
                            id="sampulNovel"
                            value={sampulNovel}
                            onChange={(e) => setSampulNovel(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="genre">Genre:</label>
                        <select
                            id="genre"
                            value={id_genre}
                            onChange={(e) => setId_genre(e.target.value)}
                            className="form-select"
                        >
                            <option value=''>Select Genre:</option>
                            {genres.map((genre) => (
                                <option key={genre.id_genre} value={genre.id_genre}>
                                    {genre.nama_genre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="form-button">Simpan Perubahan</button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default EditNovel;
