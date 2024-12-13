import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return null;
};

export default ValidationToken;
