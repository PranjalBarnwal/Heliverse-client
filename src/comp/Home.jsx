import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Home = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token); 

  useEffect(() => {
    if (!token || token.trim() === '') {
      navigate('/signin'); 
    }
  }, []);

  return (
    <div>
      Home
    </div>
  );
};
