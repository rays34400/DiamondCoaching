import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 🔑 Importer le contexte

const AjouterExerciceModal = ({ programmeId, onClose, onSuccess }) => {
  const { user } = useAuth(); //  Récupérer l'utilisateur connecté

  const [form, setForm] = useState({
    nom: '',
    description: '',
    note: '',
    image: null,
    video: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', form.nom);
    formData.append('description', form.description);
    formData.append('note', form.note);
    formData.append('programmeId', programmeId);
    if (form.image) formData.append('image', form.image);
    if (form.video) formData.append('video', form.video);

    try {
      await axios.post('http://localhost:3004/api/exercices/add', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`, //  Ajouter le token
        },
      });
      alert('Exercice ajouté avec succès.');
      onSuccess();
      onClose();
      return;
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de l'exercice.");
    }
  };

  return (
    <div className="modal-ajout">
      <div className="modal-content">
        <h3>Ajouter un exercice</h3>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input type="text" name="nom" value={form.nom} onChange={handleChange} required />

          <label>Description :</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          <label>Note :</label>
          <input type="text" name="note" value={form.note} onChange={handleChange} />

          <label>Image :</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />

          <label>Vidéo :</label>
          <input type="file" name="video" accept="video/*" onChange={handleChange} />

          <div className="modal-buttons">
            <button type="submit" className="submit">Ajouter</button>
            <button type="button" onClick={onClose} className="cancel">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterExerciceModal;
