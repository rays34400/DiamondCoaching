import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/entraineur/entraineur-connexion.css';

const ConnexionEntraineur = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://entraineurapi.onrender.com/api/entraineurs/login', {
        email,
        password,
      });

      const userData = {
        id: res.data.entraineur._id,
        token: res.data.token,
        role: 'entraineur',
      };

      login(userData);
      alert('Connexion réussie');
      navigate('/entraineur/profil');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="entraineur-connexion-container">
      <h2>Connexion Entraîneur</h2>
      <form onSubmit={handleSubmit} className="connexion-form">
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="submit-button">Se connecter</button>
      </form>
    </div>
  );
};

export default ConnexionEntraineur;
