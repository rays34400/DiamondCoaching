import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/client/liste-rdv-client.css';

const ListeRendezVousClient = ({ keyClient }) => {
  const [rendezVous, setRendezVous] = useState([]);

  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        const res = await axios.get(
          `https://rendezvousapi.onrender.com/api/rendezvous/client/${keyClient}`
        );
        setRendezVous(res.data);
      } catch (err) {
        console.error('Erreur chargement rendez-vous :', err);
      }
    };

    if (keyClient) fetchRendezVous();
  }, [keyClient]);

  const deleteRdv = async (id) => {
    try {
      await axios.delete(`https://rendezvousapi.onrender.com/api/rendezvous/delete/${id}`);
      setRendezVous((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression', err);
    }
  };

  return (
    <div className="liste-rdv-page">
      <div className="liste-rdv-container">
        <h2>Mes rendez-vous</h2>

        {rendezVous.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun rendez-vous</h3>
            <p>Vos rendez-vous apparaîtront ici.</p>
          </div>
        ) : (
          <div className="rdv-grid">
            {rendezVous.map((r) => (
              <div key={r._id} className="rdv-card">
                <p className="rdv-date">
                  {r.date} à {r.heure}
                </p>

                <p className="rdv-status">
                  Statut : <span>{r.statut}</span>
                </p>

                {r.statut !== 'fait' && (
                  <button className="rdv-delete-btn" onClick={() => deleteRdv(r._id)}>
                    Annuler
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeRendezVousClient;