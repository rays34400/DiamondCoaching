import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/client/detail-exercices-modal.css';

const DetailExercicesClientModal = ({ programmeId, onClose }) => {
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExercices = async () => {
    try {
      const res = await axios.get(
        `https://exerciceapi.onrender.com/api/exercices/programme/${programmeId}`
      );
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

  const exercicesFiltres = exercices.filter((ex) =>
    ex.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-ajout">
      <div className="modal-content">
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>

        <h3>Détails des exercices</h3>

        <input
          type="text"
          placeholder="Rechercher un exercice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <div className="modal-empty-state">
            <h4>Chargement...</h4>
            <p>Récupération des exercices du programme.</p>
          </div>
        ) : exercices.length === 0 ? (
          <div className="modal-empty-state">
            <h4>Aucun exercice</h4>
            <p>Ce programme ne contient pas encore d’exercice.</p>
          </div>
        ) : exercicesFiltres.length === 0 ? (
          <div className="modal-empty-state">
            <h4>Aucun résultat</h4>
            <p>Aucun exercice ne correspond à votre recherche.</p>
          </div>
        ) : (
          <ul className="detail-exercice-list">
            {exercicesFiltres.map((ex) => (
              <li key={ex._id} className="exercice-detail-item">
                <h4>{ex.nom}</h4>

                <p><strong>Description :</strong> {ex.description || 'Non renseignée'}</p>
                <p><strong>Note :</strong> {ex.note || 'Aucune note'}</p>

                {ex.image && (
                  <div className="media-block">
                    <strong>Image :</strong>
                    <img
                      src={`http://localhost:3004/uploads/${ex.image}`}
                      alt={ex.nom}
                      className="exercice-media"
                    />
                  </div>
                )}

                {ex.video && (
                  <div className="media-block">
                    <strong>Vidéo :</strong>
                    <video controls className="exercice-media">
                      <source
                        src={`http://localhost:3004/uploads/exercices/${ex.video}`}
                        type="video/mp4"
                      />
                      Votre navigateur ne supporte pas la vidéo.
                    </video>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <button className="cancel" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
};

export default DetailExercicesClientModal;