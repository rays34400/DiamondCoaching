import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/client/modifier-profil-client.css';

function ModifierProfilClient() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    sexe: '',
    dateNaissance: ''
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (user?.id) {
      axios.get(`https://clientapi-u3uk.onrender.com/api/clients/byid/${user.id}`)
        .then(res => {
          const data = res.data;
          if (data.dateNaissance) {
            data.dateNaissance = data.dateNaissance.split('T')[0];
          }
          setForm(data);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user || !user.id || !user.token) {
      alert("Utilisateur non connecté.");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (photo) {
        formData.append('photo', photo);
      }

      await axios.put(`https://clientapi-u3uk.onrender.com/api/clients/modifier`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        }
      });

      alert('Profil mis à jour !');
      navigate('/client/profil');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  return (
    <div className="modifier-profil-page">
      <div className="profil-container">
        <h2 className="form-title">Modifier mon profil</h2>

        <p className="form-subtitle">
          Mettez à jour vos informations personnelles.
        </p>

        {user ? (
          <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
            <div className="form-row">
              <div className="form-group">
                <label>Nom</label>
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-group">
                <label>Prénom</label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Votre email"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sexe</label>
                <select
                  name="sexe"
                  value={form.sexe}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date de naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={form.dateNaissance}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="form-button">
              Enregistrer
            </button>
          </form>
        ) : (
          <div className="empty-state">
            <h3>Chargement...</h3>
            <p>Récupération de vos informations.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModifierProfilClient;