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
      const res = await axios.post('http://localhost:3001/api/clients/login', {
        email,
        password
      });

      //  récupère token et id du client
      const { token, id } = res.data;

      //  stocke dans le AuthContext + localStorage
      login({ id, token, role: 'client' });

      //  redirige vers la page de profil
      navigate('/client/profil');
    } catch (error) {
      console.error(error);
      alert("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="client-connexion-container">
      <h2>Connexion Client</h2>
      <form className="connexion-form" onSubmit={handleConnexion}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Se connecter</button>
      </form>
    </div>
  );
};

export default ConnexionClient;
