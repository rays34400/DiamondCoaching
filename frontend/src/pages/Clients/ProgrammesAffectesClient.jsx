import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DetailExercicesClientModal from '../../components/DetailExercicesClientModal'; // ✅ nouveau composant
import '../../styles/client/programmes-client.css';

const ProgrammesAffectesClient = () => {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState([]);
  const [programmePourDetails, setProgrammePourDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProgrammesAffectes = async () => {
    try {
      //  récupérer keyClient
      const keyRes = await axios.get('https://clientapi-u3uk.onrender.com/api/clients/key', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const keyClient = keyRes.data.keyClient;

      //  appeler l'API pour obtenir les programmes affectés
      const progRes = await axios.get(`https://affectationapi.onrender.com/api/affectations/programmesClientComplet/${keyClient}`);
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
    <div className="liste-programmes-container">
      <h2>Mes Programmes Affectés</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : programmes.length === 0 ? (
        <p>Aucun programme affecté pour le moment.</p>
      ) : (
        <ul className="programme-list">
          {programmes.map((programme) => (
            <li key={programme._id} className="programme-item">
              <div>
                <h3>{programme.nom}</h3>
                <p><strong>Niveau :</strong> {programme.niveau}</p>
                <p><strong>Objectif :</strong> {programme.objectif}</p>
                <p><strong>Description :</strong> {programme.description}</p>
              </div>
              <div className="programme-buttons">
                <button onClick={() => setProgrammePourDetails(programme)}>👁️ Voir les détails</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {programmePourDetails && (
        <DetailExercicesClientModal
          programmeId={programmePourDetails._id}
          onClose={() => setProgrammePourDetails(null)}
        />
      )}
    </div>
  );
};

export default ProgrammesAffectesClient;
