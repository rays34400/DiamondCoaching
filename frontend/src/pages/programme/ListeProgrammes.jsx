import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EditProgrammeModal from '../../components/EditProgrammeModal';
import AjouterExerciceModal from '../../components/AjouterExerciceModal';
import ExercicesTooltip from '../../components/ExercicesTooltip';
import DetailExercicesModal from '../../components/DetailExercicesModal';
import AffecterProgrammeModal from '../../components/AffecterProgrammeModal';
import '../../styles/entraineur/liste-programmes.css';

const ListeProgrammes = () => {
  const { user } = useAuth();
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [programmePourExercice, setProgrammePourExercice] = useState(null);
  const [programmePourDetails, setProgrammePourDetails] = useState(null);
  const [programmePourAffectation, setProgrammePourAffectation] = useState(null);
  const [hoveredProgrammeId, setHoveredProgrammeId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchProgrammes = async () => {
    try {
      const res = await axios.get(`http://localhost:3003/api/programmes/entraineur/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProgrammes(res.data);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des programmes.");
    }
  };

  useEffect(() => {
    if (user?.role === 'entraineur') {
      fetchProgrammes();
    }
  }, [user]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?");
    if (!confirmation) return;

    try {
      await axios.delete(`http://localhost:3003/api/programmes/delete/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Programme supprimé.");
      fetchProgrammes();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3003/api/programmes/modifier/${selectedProgramme._id}`,
        {
          nom: selectedProgramme.nom,
          niveau: selectedProgramme.niveau,
          objectif: selectedProgramme.objectif,
          description: selectedProgramme.description,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert("Programme modifié !");
      setSelectedProgramme(null);
      fetchProgrammes();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification.");
    }
  };

  return (
    <div className="liste-programmes-container">
      <h2>Mes Programmes</h2>
      <ul className="programme-list">
        {programmes.map((programme) => (
          <li
            key={programme._id}
            className="programme-item"
            onMouseEnter={(e) => {
              setHoveredProgrammeId(programme._id);
              setMousePos({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => setHoveredProgrammeId(null)}
          >
            <div>
              <h3>{programme.nom}</h3>
              <p><strong>Niveau :</strong> {programme.niveau}</p>
              <p><strong>Objectif :</strong> {programme.objectif}</p>
              <p>{programme.description}</p>
            </div>
            <div className="programme-buttons">
              <button onClick={() => setSelectedProgramme(programme)}>✏️ Modifier</button>
              <button onClick={() => handleDelete(programme._id)}>🗑️ Supprimer</button>
              <button onClick={() => setProgrammePourExercice(programme)}>➕ Ajouter Exercice</button>
              <button onClick={() => setProgrammePourDetails(programme)}>👁️ Voir les détails</button>
              <button onClick={() => setProgrammePourAffectation(programme)}>🤝 Affecter à un client</button>
            </div>

            {hoveredProgrammeId === programme._id && (
              <ExercicesTooltip programmeId={programme._id} x={mousePos.x} y={mousePos.y} />
            )}
          </li>
        ))}
      </ul>

      {selectedProgramme && (
        <EditProgrammeModal
          programme={selectedProgramme}
          setProgramme={setSelectedProgramme}
          onSubmit={handleUpdate}
          onClose={() => setSelectedProgramme(null)}
        />
      )}

      {programmePourExercice && (
        <AjouterExerciceModal
          programmeId={programmePourExercice._id}
          onClose={() => setProgrammePourExercice(null)}
          onSuccess={fetchProgrammes}
        />
      )}

      {programmePourDetails && (
        <DetailExercicesModal
          programmeId={programmePourDetails._id}
          onClose={() => setProgrammePourDetails(null)}
        />
      )}

      {programmePourAffectation && (
        <AffecterProgrammeModal
          programmeId={programmePourAffectation._id}
          onClose={() => setProgrammePourAffectation(null)}
          onSuccess={fetchProgrammes}
        />
      )}
    </div>
  );
};

export default ListeProgrammes;
