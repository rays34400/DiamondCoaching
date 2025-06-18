import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/client/client-inscription.css';
const ClientInscription = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    adresse: '',
    telephone: '',
    photoProfile: null
  });

  const handleChange = (e) => {
    if (e.target.name === 'photoProfile') {
      setFormData({ ...formData, photoProfile: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      }

      const res = await axios.post('https://clientapi-u3uk.onrender.com/api/clients/register', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Inscription réussie !');
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="client-inscription-container">
      <h2 className="title">Inscription Client</h2>
      <form onSubmit={handleSubmit} className="inscription-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Nom</label>
          <input type="text" name="nom" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input type="text" name="prenom" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Adresse</label>
          <input type="text" name="adresse" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input type="text" name="telephone" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Photo de profil (optionnelle)</label>
          <input type="file" name="photoProfile" accept="image/*" onChange={handleChange} />
        </div>

        <button type="submit" className="submit-button">S'inscrire</button>
      </form>
    </div>
  );
};

export default ClientInscription;
