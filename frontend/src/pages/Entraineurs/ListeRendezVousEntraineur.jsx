import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/entraineur/liste-rdv-entraineur.css';

const ListeRendezVousEntraineur = () => {
  const { user } = useAuth();
  const location = useLocation();
  const keyEntraineur = location.state?.keyEntraineur;

  const [rendezVous, setRendezVous] = useState([]);
  const [clients, setClients] = useState({});

  const fetchRendezVous = async () => {
    try {
      const res = await axios.get(`https://rendezvousapi.onrender.com/api/rendezvous/entraineur/${keyEntraineur}`);
      const rdvs = res.data;
      setRendezVous(rdvs);

      // Charger les infos client pour chaque rendez-vous
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
      await axios.put(`https://rendezvousapi.onrender.com/api/rendezvous/statut/${id}`, { statut: newStatut });
      setRendezVous(prev => prev.map(r => r._id === id ? { ...r, statut: newStatut } : r));
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
    <div className="liste-rdv-entraineur">
      <h3>Mes Rendez-vous</h3>
      {rendezVous.length === 0 ? (
        <p>Aucun rendez-vous trouvé.</p>
      ) : (
        <ul>
          {rendezVous.map(r => {
            const client = clients[r.keyClient];
            return (
              <li key={r._id}>
                <strong>{r.date}</strong> à <strong>{r.heure}</strong><br />
                Client : {client ? `${client.nom} ${client.prenom} (${client.email})` : r.keyClient}<br />
                Statut : <em>{r.statut}</em>
                <div className="rdv-actions">
                  {r.statut !== 'confirmé' && r.statut !== 'fait' && (
                    <button onClick={() => updateStatut(r._id, 'confirmé')}>Accepter</button>
                  )}
                  {r.statut !== 'fait' && (
                    <button onClick={() => updateStatut(r._id, 'fait')}>Marquer comme fait</button>
                  )}
                  <button onClick={() => deleteRdv(r._id)} style={{ color: 'red' }}>Supprimer</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ListeRendezVousEntraineur;
