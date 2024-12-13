import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import '../formGenre.css';

const EditGenre = () => {
    const { id_genre } = useParams();
    const navigate = useNavigate();
    const [nama_genre, setNamaGenre] = useState('');
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
        const fetchGenre = async () => {
            try {
                const response = await axios.get(`http://10.10.77.169:5020/genre/${id_genre}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.data && response.data.data) {
                    setNamaGenre(response.data.data.nama_genre);
                } else {
                    throw new Error('Invalid response structure');
                }
                } catch (error) {
                    console.error('Error fetching genre:', error);
                    setMessage('Terjadi kesalahan. Silakan coba lagi.');
                }
        };

    fetchGenre();
    }, [id_genre]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Sending request to update genre...`);
                const response = await axios.put(`http://10.10.77.169:5020/genre/${id_genre}`, {
                    nama_genre,
                    id_admin: localStorage.getItem('id_admin'),
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.status === 200) {
                    setMessage('Genre berhasil diperbarui!');
                    navigate('/admin/genreadmin');
                    break;
                } else {
                    setMessage('Gagal memperbarui genre. Silakan coba lagi.');
                }
            } catch (error) {
                if (error.response && error.response.status === 402) {
                    console.log('Unauthorized (401). Refreshing token...');
                    await refreshToken();
                    continue; // Retry the request after refreshing the token
                } else {
                    console.error('Error updating genre:', error);
                    setMessage('Terjadi kesalahan. Silakan coba lagi.');
                    break;
                }
            }
        }
    };

    return (
        <div className="form-genre-page">
            <NavbarAdmin />
            <div className="form-container">
                <h3 className="form-title">Edit Genre</h3>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="nama_genre">Genre:</label>
                        <input
                            type="text"
                            id="nama_genre"
                            value={nama_genre}
                            onChange={(e) => setNamaGenre(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-button">Simpan Perubahan</button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default EditGenre;
