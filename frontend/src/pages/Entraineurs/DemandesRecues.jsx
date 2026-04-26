import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/entraineur/demandesRecues.css';

const DemandesRecues = () => {
  const { user } = useAuth();
  const [keyEntraineur, setKeyEntraineur] = useState('');
  const [demandes, setDemandes] = useState([]);
  const [clients, setClients] = useState({});

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

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const res = await axios.get(
          `https://affectationapi.onrender.com/api/demandes/entraineur/${keyEntraineur}`
        );

        const demandesEnAttente = res.data.filter(d => d.statut === 'en_attente');
        setDemandes(demandesEnAttente);

        demandesEnAttente.forEach(async (demande) => {
          const key = demande.keyClient;

          if (!clients[key]) {
            try {
              const clientRes = await axios.get(
                `https://clientapi-u3uk.onrender.com/api/clients/bykey/${key}`
              );
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

  const accepterDemande = async (id) => {
    try {
      await axios.put(`https://affectationapi.onrender.com/api/demandes/accepter/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setDemandes(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error("Erreur lors de l'acceptation :", err);
    }
  };

  return (
    <div className="demandes-recues-page">
      <div className="demandes-recues-container">
        <h2>Demandes reçues</h2>

        <p className="demandes-subtitle">
          Gérez les demandes d’affectation envoyées par les clients.
        </p>

        {demandes.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune demande en attente</h3>
            <p>Les nouvelles demandes apparaîtront ici.</p>
          </div>
        ) : (
          <div className="demande-grid">
            {demandes.map((d) => {
              const client = clients[d.keyClient];

              return (
                <div key={d._id} className="demande-card">
                  {client ? (
                    <>
                      <img
                        src={`https://clientapi-u3uk.onrender.com/uploads/${client.photoProfile || 'default.png'}`}
                        alt={`${client.nom} ${client.prenom}`}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Client';
                        }}
                      />

                      <h4>{client.nom} {client.prenom}</h4>

                      <p><strong>Email :</strong> {client.email || 'Non renseigné'}</p>
                      <p><strong>Statut :</strong> {d.statut}</p>

                      <button onClick={() => accepterDemande(d._id)}>
                        Accepter
                      </button>
                    </>
                  ) : (
                    <div className="card-loading">
                      <h4>Chargement...</h4>
                      <p>Récupération du client.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandesRecues;