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
      await axios.post('http://localhost:3003/api/programmes/add', {
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
    <div className="ajouter-programme-container">
      <h2>Créer un Programme</h2>
      <form className="programme-form" onSubmit={handleSubmit}>
        <label>Nom du programme :</label>
        <input
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <label>Niveau :</label>
        <input
          type="text"
          name="niveau"
          value={form.niveau}
          onChange={handleChange}
          required
        />

        <label>Objectif :</label>
        <input
          type="text"
          name="objectif"
          value={form.objectif}
          onChange={handleChange}
          required
        />

        <label>Description :</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default AjouterProgramme;
