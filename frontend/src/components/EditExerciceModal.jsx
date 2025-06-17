import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ✅ Import du contexte

const EditExerciceModal = ({ exercice, onClose, onSuccess }) => {
  const { user } = useAuth(); // ✅ Récupération du token
  const [form, setForm] = useState({
    nom: exercice.nom || '',
    description: exercice.description || '',
    note: exercice.note || '',
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
    if (form.image) formData.append('image', form.image);
    if (form.video) formData.append('video', form.video);

    try {
      await axios.put(
        `http://localhost:3004/api/exercices/modifier/${exercice._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // ✅ Ajout du token
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Exercice modifié avec succès.');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification de l'exercice.");
    }
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Modifier l'exercice</h3>
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
            <button type="submit" className="submit">Modifier</button>
            <button type="button" className="cancel" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExerciceModal;
