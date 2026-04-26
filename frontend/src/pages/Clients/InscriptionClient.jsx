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
    <div className="client-inscription-page">
      <div className="client-inscription-card">
        <h2>Inscription Client</h2>
        <p className="inscription-subtitle">
          Créez votre compte pour accéder à votre espace coaching.
        </p>

        <form onSubmit={handleSubmit} className="inscription-form" encType="multipart/form-data">
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

          <div className="form-group">
            <label>Téléphone</label>
            <input type="text" name="telephone" placeholder="Votre téléphone" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Photo de profil <span>(optionnelle)</span></label>
            <input type="file" name="photoProfile" accept="image/*" onChange={handleChange} />
          </div>

          <button type="submit" className="submit-button">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientInscription;