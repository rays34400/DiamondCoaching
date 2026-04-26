import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../../styles/entraineur/liste-rdv-entraineur.css';

const ListeRendezVousEntraineur = () => {
  const location = useLocation();
  const keyEntraineur = location.state?.keyEntraineur;

  const [rendezVous, setRendezVous] = useState([]);
  const [clients, setClients] = useState({});

  const fetchRendezVous = async () => {
    try {
      const res = await axios.get(`https://rendezvousapi.onrender.com/api/rendezvous/entraineur/${keyEntraineur}`);
      const rdvs = res.data;
      setRendezVous(rdvs);

      const clientData = {};
      await Promise.all(
        rdvs.map(async (rdv) => {
          if (!clientData[rdv.keyClient]) {
            try {
              const clientRes = await axios.get(`https://clientapi-u3uk.onrender.com/api/clients/bykey/${rdv.keyClient}`);
              clientData[rdv.keyClient] = clientRes.data;
            } catch (err) {
              console.error(`Erreur chargement client ${rdv.keyClient}`, err);
            }
          }
        })
      );

      setClients(clientData);
    } catch (err) {
      console.error("Erreur lors du chargement des rendez-vous", err);
    }
  };

  useEffect(() => {
    if (keyEntraineur) {
      fetchRendezVous();
    }
  }, [keyEntraineur]);

  const updateStatut = async (id, newStatut) => {
    try {
      await axios.put(`https://rendezvousapi.onrender.com/api/rendezvous/statut/${id}`, {
        statut: newStatut
      });

      setRendezVous(prev =>
        prev.map(r => r._id === id ? { ...r, statut: newStatut } : r)
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut", err);
    }
  };

  const deleteRdv = async (id) => {
    try {
      await axios.delete(`https://rendezvousapi.onrender.com/api/rendezvous/delete/${id}`);
      setRendezVous(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  return (
    <div className="rdv-entraineur-page">
      <div className="liste-rdv-entraineur">
        <h2>Mes rendez-vous</h2>

        <p className="rdv-subtitle">
          Gérez les demandes de rendez-vous de vos clients.
        </p>

        {rendezVous.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun rendez-vous</h3>
            <p>Les rendez-vous avec vos clients apparaîtront ici.</p>
          </div>
        ) : (
          <div className="rdv-grid">
            {rendezVous.map((r) => {
              const client = clients[r.keyClient];

              return (
                <div key={r._id} className="rdv-card">
                  <p className="rdv-date">
                    {r.date} à {r.heure}
                  </p>

                  <p className="rdv-client">
                    <strong>Client :</strong>{' '}
                    {client ? `${client.nom} ${client.prenom} (${client.email})` : r.keyClient}
                  </p>

                  <p className="rdv-status">
                    <strong>Statut :</strong> <span>{r.statut}</span>
                  </p>

                  <div className="rdv-actions">
                    {r.statut !== 'confirmé' && r.statut !== 'fait' && (
                      <button className="accept-btn" onClick={() => updateStatut(r._id, 'confirmé')}>
                        Accepter
                      </button>
                    )}

                    {r.statut !== 'fait' && (
                      <button className="done-btn" onClick={() => updateStatut(r._id, 'fait')}>
                        Marquer comme fait
                      </button>
                    )}

                    <button className="delete-btn" onClick={() => deleteRdv(r._id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeRendezVousEntraineur;