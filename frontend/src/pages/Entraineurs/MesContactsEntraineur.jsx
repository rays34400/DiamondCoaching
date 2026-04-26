import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/entraineur/mes-contacts-entraineur.css';

const MesContactsEntraineur = () => {
  const { user } = useAuth();
  const [keyEntraineur, setKeyEntraineur] = useState('');
  const [clients, setClients] = useState([]);

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
    <div className="mes-contacts-entraineur-page">
      <div className="mes-contacts-entraineur-container">
        <h2>Mes clients affectés</h2>

        <p className="contacts-subtitle">
          Retrouvez ici les clients liés à votre profil entraîneur.
        </p>

        {clients.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun client affecté</h3>
            <p>Les clients acceptés apparaîtront ici.</p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesContactsEntraineur;