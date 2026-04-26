import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/client/client-connexion.css';

const ConnexionClient = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleConnexion = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://clientapi-u3uk.onrender.com/api/clients/login', {
        email,
        password
      });

      const { token, id } = res.data;

      login({ id, token, role: 'client' });

      navigate('/client/profil');
    } catch (error) {
      console.error(error);
      alert("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="client-connexion-page">
      <div className="client-connexion-card">
        <h2>Connexion Client</h2>
        <p className="connexion-subtitle">
          Connectez-vous pour accéder à votre espace personnel.
        </p>

        <form className="connexion-form" onSubmit={handleConnexion}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConnexionClient;