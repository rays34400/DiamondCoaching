import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PhotoProfilEntraineur from '../../components/PhotoProfilEntraineur';
import InfosProfilEntraineur from '../../components/InfosProfilEntraineur';
import FormEditProfilEntraineur from '../../components/FormEditProfilEntraineur';
import ModalDisponibilites from '../../components/ModalDisponibilites';
import '../../styles/entraineur/profil-entraineur.css';

const ProfilEntraineur = () => {
  const { user, logout } = useAuth();
  const [entraineur, setEntraineur] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDisponibilitesModal, setShowDisponibilitesModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'entraineur') {
      navigate('/connexion-entraineur');
      return;
    }

    const fetchEntraineur = async () => {
      try {
        const res = await axios.get(`https://entraineurapi.onrender.com/api/entraineurs/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setEntraineur(res.data);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement du profil.");
      }
    };

    fetchEntraineur();
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://entraineurapi.onrender.com/api/entraineurs/update/${user.id}`,
        {
          nom: entraineur.nom,
          prenom: entraineur.prenom,
          email: entraineur.email,
          adresse: entraineur.adresse,
          telephone: entraineur.telephone,
          specialite: entraineur.specialite,
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
      await axios.delete(`https://entraineurapi.onrender.com/api/entraineurs/delete/${user.id}`, {
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
        `https://entraineurapi.onrender.com/api/entraineurs/update-photo/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEntraineur(res.data.entraineur);
      alert("Photo mise à jour !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors du changement de photo.");
    }
  };

  if (!entraineur) {
    return (
      <div className="entraineur-profil-page">
        <div className="entraineur-profil-container">
          <div className="empty-state">
            <h3>Chargement du profil...</h3>
            <p>Récupération de vos informations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="entraineur-profil-page">
      <div className="entraineur-profil-container">
        <h2>Mon profil entraîneur</h2>

        <p className="profil-subtitle">
          Gérez vos informations, vos disponibilités et vos rendez-vous.
        </p>

        <PhotoProfilEntraineur
          photoProfile={entraineur.photoProfile}
          onChangePhoto={handlePhotoChange}
        />

        <InfosProfilEntraineur entraineur={entraineur} />

        <div className="profil-actions">
          <button className="edit-button" onClick={() => setShowEditForm(true)}>
            Modifier mon profil
          </button>

          <button className="edit-button" onClick={() => setShowDisponibilitesModal(true)}>
            Modifier mes disponibilités
          </button>

          <Link
            to="/entraineur/rendezvous"
            state={{ keyEntraineur: entraineur.keyEntraineur }}
          >
            <button className="view-rdv-button">Voir mes rendez-vous</button>
          </Link>

          <button className="delete-button" onClick={handleDelete}>
            Supprimer mon compte
          </button>
        </div>

        {showEditForm && (
          <FormEditProfilEntraineur
            entraineur={entraineur}
            setEntraineur={setEntraineur}
            handleUpdate={handleUpdate}
            setShowEditForm={setShowEditForm}
          />
        )}

        {showDisponibilitesModal && (
          <ModalDisponibilites
            entraineur={entraineur}
            setEntraineur={setEntraineur}
            onClose={() => setShowDisponibilitesModal(false)}
          />
        )}

        <div className="disponibilites-section">
          <h3>Mes disponibilités</h3>

          {entraineur.disponibilites && entraineur.disponibilites.length > 0 ? (
            <ul>
              {entraineur.disponibilites.map((d, index) => (
                <li key={index}>
                  <strong>{d.jour}</strong> : {d.heures.join(', ')}
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state small">
              <h3>Aucune disponibilité</h3>
              <p>Ajoutez vos disponibilités pour permettre aux clients de réserver.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilEntraineur;