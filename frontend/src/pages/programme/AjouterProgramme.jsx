import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/entraineur/ajouter-programme.css';

const AjouterProgramme = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    description: '',
    niveau: '',
    objectif: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('https://programmeapi.onrender.com/api/programmes/add', {
        ...form,
        keyEntraineur: user.id,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert('Programme créé avec succès !');
      navigate('/entraineur/programmes');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du programme.");
    }
  };

  return (
    <div className="ajouter-programme-page">
      <div className="ajouter-programme-container">
        <h2>Créer un programme</h2>

        <p className="programme-subtitle">
          Ajoutez un nouveau programme que vous pourrez ensuite compléter avec des exercices.
        </p>

        <form className="programme-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom du programme</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ex : Programme perte de poids"
              required
            />
          </div>

          <div className="form-group">
            <label>Niveau</label>
            <input
              type="text"
              name="niveau"
              value={form.niveau}
              onChange={handleChange}
              placeholder="Ex : Débutant, intermédiaire..."
              required
            />
          </div>

          <div className="form-group">
            <label>Objectif</label>
            <input
              type="text"
              name="objectif"
              value={form.objectif}
              onChange={handleChange}
              placeholder="Ex : Force, endurance, perte de poids..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décrivez le programme..."
              required
            ></textarea>
          </div>

          <button type="submit">Créer le programme</button>
        </form>
      </div>
    </div>
  );
};

export default AjouterProgramme;