import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/client/MesContactsClient.css';

const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const MesContactsClient = () => {
  const { user } = useAuth();
  const [keyClient, setKeyClient] = useState('');
  const [entraineurs, setEntraineurs] = useState([]);
  const [selectedEntraineur, setSelectedEntraineur] = useState(null);
  const [rdvs, setRdvs] = useState([]);

useEffect(() => {
  const fetchKey = async () => {
    try {
      if (!user?.token) return;
      const keyRes = await axios.get('https://clientapi-u3uk.onrender.com/api/clients/key', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setKeyClient(keyRes.data.keyClient);
    } catch (err) {
      console.error("Erreur récupération keyClient :", err);
    }
  };
  fetchKey();
}, [user]);

  useEffect(() => {
    const fetchEntraineurs = async () => {
      try {
        const res = await axios.get(`https://affectationapi.onrender.com/api/demandes/entraineursContact/${keyClient}`);
        const demandes = res.data;

        const entraineurDetails = await Promise.all(
          demandes.map(async (d) => {
            try {
              const r = await axios.get(`https://entraineurapi.onrender.com/api/entraineurs/bykey/${d.keyEntraineur}`, {
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              });
              return r.data;
            } catch (err) {
              console.error(`Erreur entraineur ${d.keyEntraineur}`, err);
              return null;
            }
          })
        );

        const contacts = entraineurDetails.filter(e => e !== null);
        setEntraineurs(contacts);
      } catch (err) {
        console.error("Erreur récupération entraîneurs affectés :", err);
      }
    };

    if (keyClient) fetchEntraineurs();
  }, [keyClient, user.token]);

  const fetchRendezVous = async (keyEntraineur) => {
    try {
      const res = await axios.get(`https://rendezvousapi.onrender.com/api/rendezvous/entraineur/${keyEntraineur}`);
      setRdvs(res.data);
    } catch (err) {
      console.error("Erreur récupération rdvs", err);
    }
  };

  const handleChoisir = async (entraineur) => {
    setSelectedEntraineur(entraineur);
    await fetchRendezVous(entraineur.keyEntraineur);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const isSlotTaken = (dateStr, heure) => {
    return rdvs.some(r => r.date === dateStr && r.heure === heure && ['en attente', 'confirmé'].includes(r.statut));
  };

  const handleReserver = async (dateStr, heure) => {
    try {
      await axios.post('https://rendezvousapi.onrender.com/api/rendezvous/add', {
        keyClient,
        keyEntraineur: selectedEntraineur.keyEntraineur,
        date: dateStr,
        heure
      });
      alert("Demande envoyée !");
      await fetchRendezVous(selectedEntraineur.keyEntraineur);
    } catch (err) {
      console.error("Erreur réservation", err);
      alert("Erreur lors de la demande de rendez-vous.");
    }
  };

  return (
    <div>
      <h2>Mes Entraîneurs Affectés</h2>
      {entraineurs.length === 0 ? (
        <p>Aucun entraîneur affecté.</p>
      ) : (
        <div className="contact-grid">
          {entraineurs.map(entraineur => (
            <div key={entraineur._id} className="contact-card">
              <img
                src={`https://entraineurapi.onrender.com/uploads/${entraineur.photoProfile || 'default.png'}`}
                alt="profil"
                width="100"
              />
              <h4>{entraineur.nom} {entraineur.prenom}</h4>
              <p>Email : {entraineur.email}</p>
              <p>Téléphone : {entraineur.telephone}</p>
              <p>Spécialité : {entraineur.specialite}</p>
              <button onClick={() => handleChoisir(entraineur)}>Prendre RDV</button>
            </div>
          ))}
        </div>
      )}

      {selectedEntraineur && (
        <div className="rdv-section">
          <h3>Créneaux disponibles cette semaine - {selectedEntraineur.nom}</h3>
          <div className="horaire-grille">
            {getWeekDates().map(date => {
              const jour = jours[date.getDay()];
              const dateStr = date.toISOString().split('T')[0];
              const dispo = selectedEntraineur.disponibilites.find(d => d.jour === jour);
              if (!dispo) return null;

              return (
                <div key={dateStr} className="jour-disponibilite">
                  <strong>{jour} ({dateStr})</strong>
                  <div className="horaire-list">
                    {dispo.heures.map(heure => (
                      <button
                        key={heure}
                        disabled={isSlotTaken(dateStr, heure)}
                        onClick={() => handleReserver(dateStr, heure)}
                      >
                        {heure}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MesContactsClient;