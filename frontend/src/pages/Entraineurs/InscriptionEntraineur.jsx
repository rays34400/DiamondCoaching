import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/entraineur/InscriptionEntraineur.css';


const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const heuresDisponibles = [
  "08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"
];

const InscriptionEntraineur = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    adresse: '',
    telephone: '',
    specialite: '',
    photoProfile: null,
    disponibilites: []
  });

  const [selectedJour, setSelectedJour] = useState('');
  const [selectedHeures, setSelectedHeures] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photoProfile') {
      setFormData({ ...formData, photoProfile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddDisponibilite = () => {
    if (selectedJour && selectedHeures.length > 0) {
      const updated = [...formData.disponibilites, { jour: selectedJour, heures: selectedHeures }];
      setFormData({ ...formData, disponibilites: updated });
      setSelectedJour('');
      setSelectedHeures([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      for (const key in formData) {
        if (key === 'disponibilites') {
          form.append(key, JSON.stringify(formData[key]));
        } else if (formData[key]) {
          form.append(key, formData[key]);
        }
      }

      await axios.post('http://localhost:3002/api/entraineurs/register', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Inscription réussie !');
      navigate('/connexion-entraineur');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="entraineur-inscription-container">
      <h2 className='title'>Inscription Entraîneur</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="inscription-form">
        
        {['nom', 'prenom', 'email', 'password', 'adresse', 'telephone', 'specialite'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
              name={field} onChange={handleChange} required />
          </div>
        ))}

        <div className="form-group">
          <label>Photo de profil (optionnelle)</label>
          <input type="file" name="photoProfile" accept="image/*" onChange={handleChange} />
        </div>

       
        <div className="form-group">
          <label>Jour disponible</label>
          <select value={selectedJour} onChange={(e) => setSelectedJour(e.target.value)}>
            <option value="">Sélectionnez un jour</option>
            {jours.map((jour) => (
              <option key={jour} value={jour}>{jour}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Heures disponibles</label>
          <div className="checkbox-group">
            {heuresDisponibles.map((heure) => (
              <label key={heure}>
                <input
                  type="checkbox"
                  value={heure}
                  checked={selectedHeures.includes(heure)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedHeures((prev) =>
                      checked ? [...prev, heure] : prev.filter((h) => h !== heure)
                    );
                  }}
                />
                {heure}
              </label>
            ))}
          </div>
          <button type="button" onClick={handleAddDisponibilite}>Ajouter Disponibilité</button>
        </div>

        <div className="form-group">
          <h4>Disponibilités ajoutées :</h4>
          <ul>
            {formData.disponibilites.map((d, index) => (
              <li key={index}>
                {d.jour} : {d.heures.join(', ')}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="submit-button">S'inscrire</button>
      </form>
    </div>
  );
};

export default InscriptionEntraineur;
