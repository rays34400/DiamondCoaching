import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PhotoProfil from '../../components/PhotoProfil';
import FormModificationClient from '../../components/FormModificationClient';
import ListeRendezVousClient from './ListeRendezVousClient';
import '../../styles/client/profil-client.css';

const ProfilClient = () => {
  const { user, logout } = useAuth();
  const [client, setClient] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/connexion-client');
      return;
    }

    const fetchClient = async () => {
      try {
        const res = await axios.get(`https://clientapi-u3uk.onrender.com/api/clients/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setClient(res.data);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement du profil.");
      }
    };

    fetchClient();
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://clientapi-u3uk.onrender.com/api/clients/update/${user.id}`,
        {
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          adresse: client.adresse,
          telephone: client.telephone,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Profil mis à jour !");
      setShowEditForm(false);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );

    if (!confirmation) return;

    try {
      await axios.delete(`https://clientapi-u3uk.onrender.com/api/clients/delete/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      logout();
      alert("Compte supprimé avec succès.");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du compte.");
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photoProfile', file);

    try {
      const res = await axios.put(
        `https://clientapi-u3uk.onrender.com/api/clients/update-photo/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setClient(res.data.client);
      alert("Photo mise à jour !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors du changement de photo.");
    }
  };

  if (!client) {
    return (
      <div className="client-profil-page">
        <div className="client-profil-container">
          <div className="empty-state">
            <h3>Chargement du profil...</h3>
            <p>Récupération de vos informations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-profil-page">
      <div className="client-profil-container">
        <h2>Mon profil</h2>

        <p className="profil-subtitle">
          Gérez vos informations personnelles et vos rendez-vous.
        </p>

        <PhotoProfil
          photo={client.photoProfile}
          onPhotoChange={handlePhotoChange}
        />

        <div className="profil-infos">
          <p><strong>Nom :</strong> {client.nom || 'Non renseigné'}</p>
          <p><strong>Prénom :</strong> {client.prenom || 'Non renseigné'}</p>
          <p><strong>Email :</strong> {client.email || 'Non renseigné'}</p>
          <p><strong>Adresse :</strong> {client.adresse || 'Non renseignée'}</p>
          <p><strong>Téléphone :</strong> {client.telephone || 'Non renseigné'}</p>
        </div>

        <div className="profil-actions">
          <button className="edit-button" onClick={() => setShowEditForm(true)}>
            Modifier mon profil
          </button>

          <button className="delete-button" onClick={handleDelete}>
            Supprimer mon compte
          </button>
        </div>

        {showEditForm && (
          <FormModificationClient
            client={client}
            setClient={setClient}
            onCancel={() => setShowEditForm(false)}
            onSubmit={handleUpdate}
          />
        )}

        <div className="profil-rdv-wrapper">
          <ListeRendezVousClient keyClient={client.keyClient} />
        </div>
      </div>
    </div>
  );
};

export default ProfilClient;