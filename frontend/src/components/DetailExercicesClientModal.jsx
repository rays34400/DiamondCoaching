import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/client/detail-exercices-modal.css';

const DetailExercicesClientModal = ({ programmeId, onClose }) => {
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExercices = async () => {
    try {
      const res = await axios.get(`http://localhost:3004/api/exercices/programme/${programmeId}`);
      setExercices(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des exercices :", error);
      alert("Erreur lors du chargement des exercices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programmeId) fetchExercices();
  }, [programmeId]);

  return (
    <div className="modal-ajout">
      <div className="modal-content">
        <div className="close-button" onClick={onClose}>❌</div>

        <h3>Détails des exercices</h3>

        <input
          type="text"
          placeholder="Rechercher un exercice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <p>Chargement...</p>
        ) : exercices.length === 0 ? (
          <p>Aucun exercice pour ce programme.</p>
        ) : (
          <ul className="detail-exercice-list">
            {exercices
              .filter((ex) =>
                ex.nom.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((ex) => (
                <li key={ex._id} className="exercice-detail-item">
                  <h4>{ex.nom}</h4>
                  <p><strong>Description :</strong> {ex.description}</p>
                  <p><strong>Note :</strong> {ex.note}</p>

                  {ex.image && (
                    <div>
                      <strong>Image :</strong><br />
                      <img
                        src={`http://localhost:3004/uploads/${ex.image}`}
                        alt={ex.nom}
                        className="exercice-media"
                      />
                    </div>
                  )}

                  {ex.video && (
                    <div>
                      <strong>Vidéo :</strong><br />
                      <video controls className="exercice-media">
                        <source src={`http://localhost:3004/uploads/exercices/${ex.video}`} type="video/mp4" />
                        Votre navigateur ne supporte pas la vidéo.
                      </video>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}

        <button className="cancel" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default DetailExercicesClientModal;
