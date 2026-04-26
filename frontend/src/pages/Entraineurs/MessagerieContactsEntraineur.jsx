import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MessagerieEntraineur from './MessagerieEntraineur';
import '../../styles/entraineur/messagerie-entraineur.css';

const MessagerieContactsEntraineur = () => {
  const { user } = useAuth();
  const [keyEntraineur, setKeyEntraineur] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClientKey, setSelectedClientKey] = useState(null);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await axios.get(`https://entraineurapi.onrender.com/api/entraineurs/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setKeyEntraineur(res.data.keyEntraineur);
      } catch (err) {
        console.error("Erreur récupération keyEntraineur :", err);
      }
    };

    if (user?.id && user?.token) fetchKey();
  }, [user]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`https://affectationapi.onrender.com/api/demandes/clientsContact/${keyEntraineur}`);
        const demandes = res.data;

        const clientDetails = await Promise.all(
          demandes.map(async (d) => {
            try {
              const r = await axios.get(`https://clientapi-u3uk.onrender.com/api/clients/bykey/${d.keyClient}`);
              return r.data;
            } catch (err) {
              console.error(`Erreur client ${d.keyClient}`, err);
              return null;
            }
          })
        );

        setClients(clientDetails.filter(c => c !== null));
      } catch (err) {
        console.error("Erreur récupération clients affectés :", err);
      }
    };

    if (keyEntraineur) fetchClients();
  }, [keyEntraineur]);

  return (
    <div className="messagerie-entraineur-page">
      <div className="messagerie-entraineur-container">
        <h2>Messagerie avec mes clients</h2>

        <p className="messagerie-subtitle">
          Sélectionnez un client pour ouvrir une conversation.
        </p>

        {clients.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun client affecté</h3>
            <p>Vos conversations apparaîtront ici lorsque vous aurez des clients affectés.</p>
          </div>
        ) : (
          <div className="contact-grid">
            {clients.map((client) => (
              <div key={client._id} className="contact-card">
                <img
                  src={`https://clientapi-u3uk.onrender.com/uploads/${client.photoProfile || 'default.png'}`}
                  alt={`${client.nom} ${client.prenom}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Client';
                  }}
                />

                <h4>{client.nom} {client.prenom}</h4>

                <p><strong>Email :</strong> {client.email || 'Non renseigné'}</p>
                <p><strong>Téléphone :</strong> {client.telephone || 'Non renseigné'}</p>

                <button onClick={() => setSelectedClientKey(client.keyClient)}>
                  Ouvrir conversation
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedClientKey && (
          <div className="messagerie-section">
            <button
              onClick={() => setSelectedClientKey(null)}
              className="close-btn"
            >
              Fermer la conversation
            </button>

            <MessagerieEntraineur keyClient={selectedClientKey} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagerieContactsEntraineur;