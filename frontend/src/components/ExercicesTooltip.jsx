// components/ExercicesTooltip.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExercicesTooltip = ({ programmeId, x, y }) => {
  const [exercices, setExercices] = useState([]);

  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const res = await axios.get(`https://exerciceapi.onrender.com/api/exercices/programme/${programmeId}`);
        setExercices(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des exercices :", error);
      }
    };

    fetchExercices();
  }, [programmeId]);

  return (
    <div className="exercice-tooltip" style={{ top: y + 15, left: x + 15 }}>
      <h4>Exercices</h4>
      {exercices.length === 0 ? (
        <p>Aucun exercice</p>
      ) : (
        <ul>
          {exercices.map((exercice) => (
            <li key={exercice._id}>
              <strong>{exercice.nom}</strong> – {exercice.note || 'Aucune note'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExercicesTooltip;
