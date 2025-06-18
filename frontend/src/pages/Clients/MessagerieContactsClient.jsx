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
        const res = await axios.get(`https://affectationapi.onrender.com/api/demandes/entraineursContact/${keyClient}`);
        const demandes = res.data;

        const entraineurDetails = await Promise.all(
          demandes.map(async (d) => {
            try {
              const r = await axios.get(`https://entraineurapi.onrender.com/api/entraineurs/bykey/${d.keyEntraineur}`, {
                headers: { Authorization: `Bearer ${user.token}` },
              });
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
    <div className="messagerie-contacts-client">
      <h2>Messagerie avec mes entraîneurs</h2>
      {entraineurs.length === 0 ? (
        <p>Aucun entraîneur affecté.</p>
      ) : (
        <div className="contact-grid">
          {entraineurs.map(entraineur => (
            <div key={entraineur._id} className="contact-card">
              <img
                src={`https://entraineurapi.onrender.com/uploads/${entraineur.photoProfile || 'default.png'}`}
                alt="profil"
                width="100"
              />
              <h4>{entraineur.nom} {entraineur.prenom}</h4>
              <p>Email : {entraineur.email}</p>
              <p>Téléphone : {entraineur.telephone}</p>
              <button onClick={() => setSelectedEntraineurKey(entraineur.keyEntraineur)}>
                ouvrir conversation
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedEntraineurKey && (
  <div className="messagerie-section">
    <button onClick={() => setSelectedEntraineurKey(null)} className="close-btn">
      Fermer la conversation
    </button>
    <MessagerieClient keyEntraineur={selectedEntraineurKey} />
  </div>
)}
    </div>
  );
};

export default MessagerieContactsClient;
