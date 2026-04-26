import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/entraineur/InscriptionEntraineur.css';

const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const heuresDisponibles = [
  '08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'
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
      const updated = [
        ...formData.disponibilites,
        { jour: selectedJour, heures: selectedHeures }
      ];

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

      await axios.post('https://entraineurapi.onrender.com/api/entraineurs/register', form, {
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
    <div className="entraineur-inscription-page">
      <div className="entraineur-inscription-card">
        <h2>Inscription entraîneur</h2>

        <p className="inscription-subtitle">
          Créez votre profil entraîneur et ajoutez vos disponibilités.
        </p>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="inscription-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nom</label>
              <input type="text" name="nom" placeholder="Votre nom" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Prénom</label>
              <input type="text" name="prenom" placeholder="Votre prénom" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Votre email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" placeholder="Votre mot de passe" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input type="text" name="adresse" placeholder="Votre adresse" onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Téléphone</label>
              <input type="text" name="telephone" placeholder="Votre téléphone" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Spécialité</label>
              <input type="text" name="specialite" placeholder="Votre spécialité" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Photo de profil <span>(optionnelle)</span></label>
            <input type="file" name="photoProfile" accept="image/*" onChange={handleChange} />
          </div>

          <div className="availability-box">
            <h3>Disponibilités</h3>

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
                  <label key={heure} className="checkbox-item">
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

              <button type="button" className="add-dispo-button" onClick={handleAddDisponibilite}>
                Ajouter disponibilité
              </button>
            </div>

            <div className="dispos-list">
              <h4>Disponibilités ajoutées</h4>

              {formData.disponibilites.length === 0 ? (
                <p>Aucune disponibilité ajoutée.</p>
              ) : (
                <ul>
                  {formData.disponibilites.map((d, index) => (
                    <li key={index}>
                      <strong>{d.jour}</strong> : {d.heures.join(', ')}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button type="submit" className="submit-button">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default InscriptionEntraineur;