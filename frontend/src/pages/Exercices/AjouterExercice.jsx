import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/<chemin>/AjouterExerciceModal.css';

const AjouterExerciceModal = ({ programmeId, onClose, onExerciceAjoute }) => {
  const [form, setForm] = useState({
    nom: '',
    description: '',
    note: '',
    image: null,
    video: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
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
      await axios.post('http://localhost:3004/api/exercices/add', formData);
      alert('Exercice ajouté !');
      onClose();
      onExerciceAjoute(); // pour recharger les données si besoin
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de l'exercice.");
    }
  };

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Ajouter un exercice</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Nom :</label>
          <input type="text" name="nom" value={form.nom} onChange={handleChange} required />

          <label>Description :</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          <label>Note :</label>
          <input type="text" name="note" value={form.note} onChange={handleChange} />

          <label>Image :</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

          <label>Vidéo :</label>
          <input type="file" name="video" accept="video/*" onChange={handleFileChange} />

          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default AjouterExerciceModal;