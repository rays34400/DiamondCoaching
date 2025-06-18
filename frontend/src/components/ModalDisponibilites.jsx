import React, { useState } from 'react';
import axios from 'axios';

const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const heuresDisponibles = [
  "08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"
];

const ModalDisponibilites = ({ entraineur, setEntraineur, onClose }) => {
  const [selectedJour, setSelectedJour] = useState('');
  const [selectedHeures, setSelectedHeures] = useState([]);
  const [disponibilites, setDisponibilites] = useState(entraineur.disponibilites || []);

  const handleAddDisponibilite = () => {
    if (!selectedJour || selectedHeures.length === 0) return;

    const updated = disponibilites.filter(d => d.jour !== selectedJour);
    updated.push({ jour: selectedJour, heures: selectedHeures });
    setDisponibilites(updated);
    setSelectedJour('');
    setSelectedHeures([]);
  };

  const handleDeleteJour = (jour) => {
    const updated = disponibilites.filter(d => d.jour !== jour);
    setDisponibilites(updated);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`https://entraineurapi.onrender.com/api/entraineurs/disponibilites/${entraineur.keyEntraineur}`, {
        disponibilites: JSON.stringify(disponibilites)
      });
      alert("Disponibilités mises à jour avec succès.");
      setEntraineur({ ...entraineur, disponibilites: response.data.disponibilites });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour des disponibilités.");
    }
  };

  const joursDisponibles = jours.filter(j =>
    !disponibilites.some(d => d.jour === j) || j === selectedJour
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Modifier mes disponibilités</h3>

        <div className="form-group">
          <label>Jour</label>
          <select value={selectedJour} onChange={(e) => setSelectedJour(e.target.value)}>
            <option value="">Choisir un jour</option>
            {joursDisponibles.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Heures disponibles</label>
          <div className="checkbox-group">
            {heuresDisponibles.map(h => (
              <label key={h}>
                <input
                  type="checkbox"
                  value={h}
                  checked={selectedHeures.includes(h)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedHeures(prev => checked ? [...prev, h] : prev.filter(x => x !== h));
                  }}
                />
                {h}
              </label>
            ))}
          </div>
        </div>

        <button type="button" onClick={handleAddDisponibilite} className="add-button">
          Ajouter / Modifier cette disponibilité
        </button>

        <div className="form-group">
          <h4>Disponibilités actuelles :</h4>
          <ul>
            {disponibilites.map((d, i) => (
              <li key={i}>
                {d.jour} : {d.heures.join(', ')}
                <button onClick={() => handleDeleteJour(d.jour)} style={{ marginLeft: '10px', color: 'red' }}>❌</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="submit-button">Enregistrer</button>
          <button onClick={onClose} className="cancel-button">Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDisponibilites;