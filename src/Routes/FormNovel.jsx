import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import axios from 'axios';
import '../formNovel.css';

const FormNovel = () => {
    const [judulNovel, setJudulNovel] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [pengarang, setPengarang] = useState('');
    const [penerbit, setPenerbit] = useState('');
    const [tahunRilis, setTahunRilis] = useState('');
    const [sampulNovel, setSampulNovel] = useState('');
    const [message, setMessage] = useState('');
    const [id_genre, setId_genre] = useState('');
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://10.10.77.169:5020/genre', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.data && response.data.data) {
                    setGenres(response.data.data.genre);
                } else {
                    setMessage('Gagal mengambil genre. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
                setMessage('Terjadi kesalahan. Silakan coba lagi.');
            }
        };

        fetchGenres();
    }, []);
    
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
            navigate('/admin/login');
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Sending request to add novel...`);
                const response = await axios.post('http://10.10.77.169:5020/novel', {
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

                if (response.status === 201) {
                    setMessage('Novel berhasil ditambahkan!');
                    setJudulNovel('');
                    setDeskripsi('');
                    setPengarang('');
                    setPenerbit('');
                    setTahunRilis('');
                    setSampulNovel('');
                    setId_genre('');
                    break;
                } else {
                    setMessage('Gagal menambahkan novel. Silakan coba lagi.');
                    break;
                }
            } catch (error) {
                if (error.response && error.response.status === 402) {
                    console.log('Unauthorized (401). Refreshing token...');
                    await refreshToken();
                    continue; // Retry the request after refreshing the token
                } else {
                    console.error('Error adding novel:', error);
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
                <h3 className="form-title">Tambah Novel</h3>
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
                    <button type="submit" className="form-button">Simpan</button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default FormNovel;
