import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/entraineur/demandesRecues.css';

const DemandesRecues = () => {
  const { user } = useAuth();
  const [keyEntraineur, setKeyEntraineur] = useState('');
  const [demandes, setDemandes] = useState([]);
  const [clients, setClients] = useState({});

  //  Récupérer le keyEntraineur via ID 
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await axios.get(`https://entraineurapi.onrender.com/api/entraineurs/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setKeyEntraineur(res.data.keyEntraineur);
      } catch (err) {
        console.error("Erreur récupération keyEntraineur :", err);
      }
    };
    if (user?.id && user?.token) fetchKey();
  }, [user]);

  //  Récupérer uniquement les demandes en attente 
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const res = await axios.get(`https://affectationapi.onrender.com/api/demandes/entraineur/${keyEntraineur}`);
        // Filtrer ici uniquement les demandes en_attente
        const demandesEnAttente = res.data.filter(d => d.statut === 'en_attente');
        setDemandes(demandesEnAttente);

        // Charger les infos clients 
        demandesEnAttente.forEach(async (demande) => {
          const key = demande.keyClient;
          if (!clients[key]) {
            try {
              const clientRes = await axios.get(`https://clientapi-u3uk.onrender.com/api/clients/bykey/${key}`);
              setClients(prev => ({ ...prev, [key]: clientRes.data }));
            } catch (clientErr) {
              console.error(`Erreur récupération client (${key}) :`, clientErr);
            }
          }
        });
      } catch (err) {
        console.error("Erreur récupération demandes :", err);
      }
    };

    if (keyEntraineur) fetchDemandes();
  }, [keyEntraineur]);

  //  Accepter une demande 
  const accepterDemande = async (id) => {
    try {
      await axios.put(`https://affectationapi.onrender.com/api/demandes/accepter/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // On retire la demande de l'affichage, mais elle reste en DB avec statut "accepte"
      setDemandes(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error("Erreur lors de l'acceptation :", err);
    }
  };

  return (
    <div className="demandes-recues-container">
      <h2>Demandes reçues</h2>
      {demandes.length === 0 ? (
        <p>Aucune demande en attente.</p>
      ) : (
        <div className="demande-grid">
          {demandes.map(d => {
            const client = clients[d.keyClient];
            return (
              <div key={d._id} className="demande-card">
                {client ? (
                  <>
                    <img src={`https://clientapi-u3uk.onrender.com/uploads/${client.photoProfile || 'default.png'}`} alt="profil" width="100" />
                    <h4>{client.nom} {client.prenom}</h4>
                    <p>Email : {client.email}</p>
                    <p>Statut : {d.statut}</p>
                    <button onClick={() => accepterDemande(d._id)}>✅ Accepter</button>
                  </>
                ) : (
                  <p>Chargement client...</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DemandesRecues;
