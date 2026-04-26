import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MessagerieClient from './MessagerieClient';
import '../../styles/client/messagerie-contacts-client.css';

const MessagerieContactsClient = () => {
  const { user } = useAuth();
  const [keyClient, setKeyClient] = useState('');
  const [entraineurs, setEntraineurs] = useState([]);
  const [selectedEntraineurKey, setSelectedEntraineurKey] = useState(null);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await axios.get('https://clientapi-u3uk.onrender.com/api/clients/key', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setKeyClient(res.data.keyClient);
      } catch (err) {
        console.error("Erreur récupération keyClient :", err);
      }
    };

    if (user?.token) fetchKey();
  }, [user]);

  useEffect(() => {
    const fetchEntraineurs = async () => {
      try {
        const res = await axios.get(
          `https://affectationapi.onrender.com/api/demandes/entraineursContact/${keyClient}`
        );
        const demandes = res.data;

        const entraineurDetails = await Promise.all(
          demandes.map(async (d) => {
            try {
              const r = await axios.get(
                `https://entraineurapi.onrender.com/api/entraineurs/bykey/${d.keyEntraineur}`,
                {
                  headers: { Authorization: `Bearer ${user.token}` },
                }
              );
              return r.data;
            } catch (err) {
              console.error(`Erreur entraîneur ${d.keyEntraineur}`, err);
              return null;
            }
          })
        );

        setEntraineurs(entraineurDetails.filter(e => e !== null));
      } catch (err) {
        console.error("Erreur récupération entraîneurs affectés :", err);
      }
    };

    if (keyClient) fetchEntraineurs();
  }, [keyClient, user.token]);

  return (
    <div className="messagerie-contacts-page">
      <div className="messagerie-contacts-container">
        <h2>Messagerie avec mes entraîneurs</h2>

        <p className="messagerie-subtitle">
          Sélectionnez un entraîneur pour ouvrir une conversation.
        </p>

        {entraineurs.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun entraîneur affecté</h3>
            <p>Vos conversations apparaîtront ici lorsque vous aurez un entraîneur affecté.</p>
          </div>
        ) : (
          <div className="contact-grid">
            {entraineurs.map((entraineur) => (
              <div key={entraineur._id} className="contact-card">
                <img
                  src={`https://entraineurapi.onrender.com/uploads/${entraineur.photoProfile || 'default.png'}`}
                  alt={`${entraineur.nom} ${entraineur.prenom}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Coach';
                  }}
                />

                <h4>{entraineur.nom} {entraineur.prenom}</h4>

                <p><strong>Email :</strong> {entraineur.email || 'Non renseigné'}</p>
                <p><strong>Téléphone :</strong> {entraineur.telephone || 'Non renseigné'}</p>

                <button onClick={() => setSelectedEntraineurKey(entraineur.keyEntraineur)}>
                  Ouvrir conversation
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedEntraineurKey && (
          <div className="messagerie-section">
            <button
              onClick={() => setSelectedEntraineurKey(null)}
              className="close-btn"
            >
              Fermer la conversation
            </button>

            <MessagerieClient keyEntraineur={selectedEntraineurKey} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagerieContactsClient;