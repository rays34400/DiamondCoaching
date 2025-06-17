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
        const res = await axios.get(`http://localhost:3002/api/entraineurs/${user.id}`, {
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
        const res = await axios.get(`http://localhost:3007/api/demandes/clientsContact/${keyEntraineur}`);
        const demandes = res.data;

        const clientDetails = await Promise.all(
          demandes.map(async (d) => {
            try {
              const r = await axios.get(`http://localhost:3001/api/clients/bykey/${d.keyClient}`);
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
    <div>
      <h2>Messagerie avec mes clients</h2>
      {clients.length === 0 ? (
        <p>Aucun client affecté.</p>
      ) : (
        <div className="contact-grid">
          {clients.map(client => (
            <div key={client._id} className="contact-card">
              <img
                src={`http://localhost:3001/uploads/${client.photoProfile || 'default.png'}`}
                alt="profil"
                width="100"
              />
              <h4>{client.nom} {client.prenom}</h4>
              <p>Email : {client.email}</p>
              <p>Sexe : {client.sexe}</p>
              <p>Adresse : {client.adresse}</p>
              <button onClick={() => setSelectedClientKey(client.keyClient)}>
                ouvrir Conversation
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedClientKey && (
  <div className="messagerie-section">
    <button onClick={() => setSelectedClientKey(null)} className="close-btn">
      Fermer la conversation
    </button>
    <MessagerieEntraineur keyClient={selectedClientKey} />
  </div>
)}
    </div>
  );
};

export default MessagerieContactsEntraineur;
