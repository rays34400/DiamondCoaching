import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DetailExercicesClientModal from '../../components/DetailExercicesClientModal';
import '../../styles/client/programmes-client.css';

const ProgrammesAffectesClient = () => {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState([]);
  const [programmePourDetails, setProgrammePourDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgrammesAffectes = async () => {
    try {
      const keyRes = await axios.get('https://clientapi-u3uk.onrender.com/api/clients/key', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const keyClient = keyRes.data.keyClient;

      const progRes = await axios.get(
        `https://affectationapi.onrender.com/api/affectations/programmesClientComplet/${keyClient}`
      );

      setProgrammes(progRes.data);
    } catch (error) {
      console.error("Erreur dans fetchProgrammesAffectes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProgrammesAffectes();
    }
  }, [user]);

  return (
    <div className="programmes-client-page">
      <div className="liste-programmes-container">
        <h2>Mes programmes affectés</h2>

        <p className="programmes-subtitle">
          Retrouvez ici les programmes que vos entraîneurs vous ont attribués.
        </p>

        {loading ? (
          <div className="empty-state">
            <h3>Chargement...</h3>
            <p>Récupération de vos programmes.</p>
          </div>
        ) : programmes.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun programme affecté</h3>
            <p>Vos programmes apparaîtront ici lorsqu’un entraîneur vous en attribuera un.</p>
          </div>
        ) : (
          <div className="programme-list">
            {programmes.map((programme) => (
              <div key={programme._id} className="programme-item">
                <h3>{programme.nom}</h3>

                <p><strong>Niveau :</strong> {programme.niveau || 'Non renseigné'}</p>
                <p><strong>Objectif :</strong> {programme.objectif || 'Non renseigné'}</p>
                <p><strong>Description :</strong> {programme.description || 'Non renseignée'}</p>

                <div className="programme-buttons">
                  <button onClick={() => setProgrammePourDetails(programme)}>
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {programmePourDetails && (
          <DetailExercicesClientModal
            programmeId={programmePourDetails._id}
            onClose={() => setProgrammePourDetails(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ProgrammesAffectesClient;