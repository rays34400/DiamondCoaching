import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/client/liste-entraineurs.css';

const ListeEntraineurs = () => {
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
    const token = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')).token
      : null;

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

      await axios.post('https://affectationapi.onrender.com/api/demandes/envoyer', {
        keyClient,
        keyEntraineur,
      });

      setMessage('Demande envoyée !');
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="liste-entraineurs-page">
      <div className="liste-entraineurs-container">
        <h2>Liste des entraîneurs</h2>

        <p className="liste-entraineurs-subtitle">
          Découvrez les entraîneurs disponibles et envoyez une demande d’affectation.
        </p>

        {message && <p className="message">{message}</p>}

        {entraineurs.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun entraîneur disponible</h3>
            <p>Les entraîneurs apparaîtront ici lorsqu’ils seront ajoutés.</p>
          </div>
        ) : (
          <div className="entraineur-grid">
            {entraineurs.map((entraineur) => (
              <div className="entraineur-card" key={entraineur._id}>
                <img
                  src={`https://entraineurapi.onrender.com/uploads/${entraineur.photoProfile || 'default.png'}`}
                  alt={`${entraineur.nom} ${entraineur.prenom}`}
                  className="entraineur-photo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Coach';
                  }}
                />

                <h4>
                  {entraineur.nom} {entraineur.prenom}
                </h4>

                <p>
                  <strong>Spécialité :</strong> {entraineur.specialite || 'Non spécifiée'}
                </p>

                <p>
                  <strong>Email :</strong> {entraineur.email || 'Non renseigné'}
                </p>

                <button onClick={() => envoyerDemande(entraineur.keyEntraineur)}>
                  Ajouter
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeEntraineurs;