import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/client/liste-rdv-client.css';

const ListeRendezVousClient = ({ keyClient }) => {
  const [rendezVous, setRendezVous] = useState([]);

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const res = await axios.get(`http://localhost:3008/api/rendezvous/client/${keyClient}`);
        setRendezVous(res.data);
      } catch (err) {
        console.error('Erreur chargement rendez-vous :', err);
      }
    };

    if (keyClient) fetchRendezVous();
  }, [keyClient]);

  const deleteRdv = async (id) => {
    try {
      await axios.delete(`http://localhost:3008/api/rendezvous/delete/${id}`);
      setRendezVous(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  return (
    <div className="liste-rdv-client">
      <h3>Mes Rendez-vous</h3>
      {rendezVous.length === 0 ? (
        <p>Aucun rendez-vous trouvé.</p>
      ) : (
        <ul>
          {rendezVous.map(r => (
            <li key={r._id}>
              <strong>{r.date}</strong> à <strong>{r.heure}</strong><br />
              Statut : <em>{r.statut}</em>
              <div className="rdv-actions">
                {r.statut !== 'fait' && (
                  <button onClick={() => deleteRdv(r._id)} style={{ color: 'red' }}>
                    Annuler
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListeRendezVousClient;
