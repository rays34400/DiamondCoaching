import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/client/liste-entraineurs.css';

const ListeEntraineurs = () => {
  const { user } = useAuth();
  const [entraineurs, setEntraineurs] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEntraineurs = async () => {
      try {
        const res = await axios.get('https://entraineurapi.onrender.com/api/entraineurs/all');
        setEntraineurs(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEntraineurs();
  }, []);
  
const getKeyClient = async () => {
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

  if (!token) return null;

  const res = await axios.get('https://clientapi-u3uk.onrender.com/api/clients/key', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data.keyClient;
};

const envoyerDemande = async (keyEntraineur) => {
  try {
    const keyClient = await getKeyClient();

    const res = await axios.post('https://affectationapi.onrender.com/api/demandes/envoyer', {
      keyClient,
      keyEntraineur,
    });

    setMessage("Demande envoyée !");
  } catch (error) {
    console.error(error);
    setMessage("Erreur lors de l'envoi de la demande.");
  }
};

  return (
    <div className="liste-entraineurs">
      <h2>Liste des entraîneurs</h2>
      {message && <p>{message}</p>}

      <div className="entraineur-grid">
        {entraineurs.map(entraineur => (
          <div className="entraineur-card" key={entraineur._id}>
            <img
              src={`https://entraineurapi.onrender.com/uploads/${entraineur.photoProfile || 'default.png'}`}
              alt={`${entraineur.nom} ${entraineur.prenom}`}
              className="entraineur-photo"
            />
            <h4>{entraineur.nom} {entraineur.prenom}</h4>
            <p><strong>Spécialité:</strong> {entraineur.specialite || 'Non spécifiée'}</p>
            <p><strong>Email:</strong> {entraineur.email}</p>
            <button onClick={() => envoyerDemande(entraineur.keyEntraineur)}>➕ Ajouter</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeEntraineurs;
