import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import NavbarAdmin from '../Components/NavbarAdmin';
import Footer from '../Components/Footer';
import '../formGenre.css';

const FormGenre = () => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Sending request to add genre...`);
                const response = await axios.post('http://10.10.77.169:5020/genre', {
                    nama_genre,
                    id_admin: localStorage.getItem('id_admin'),
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (response.status === 200 || response.status === 201) {
                    setMessage('Genre berhasil ditambahkan!');
                    setNamaGenre('');
                    break;
                } else {
                    setMessage('Gagal menambahkan genre. Silakan coba lagi.');
                    break;
                }
            } catch (error) {
                if (error.response && error.response.status === 402) {
                    console.log('Unauthorized (401). Refreshing token...');
                    await refreshToken();
                    continue; // Retry the request after refreshing the token
                } else {
                    console.error('Error adding genre:', error);
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
                <h3 className="form-title">Tambah Genre Baru</h3>
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
                    <button type="submit" className="form-button">Tambah Genre</button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default FormGenre;
