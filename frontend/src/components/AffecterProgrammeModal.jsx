import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AffecterProgrammeModal = ({ programmeId, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [keyEntraineur, setKeyEntraineur] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedKeyClient, setSelectedKeyClient] = useState('');

  // Étape 1 : récupérer le keyEntraineur
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/api/entraineurs/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setKeyEntraineur(res.data.keyEntraineur);
        console.log("keyEntraineur récupéré:", res.data.keyEntraineur);
      } catch (err) {
        console.error("Erreur récupération keyEntraineur:", err);
      }
    };

    if (user?.id && user?.token) fetchKey();
  }, [user]);

  // Étape 2 : récupérer les clients affectés à cet entraîneur et leurs infos complètes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`http://localhost:3007/api/demandes/clientsContact/${keyEntraineur}`);
        const demandes = res.data;

        const clientsComplets = await Promise.all(
          demandes.map(async (d) => {
            try {
              const r = await axios.get(`http://localhost:3001/api/clients/bykey/${d.keyClient}`);
              return r.data;
            } catch (err) {
              console.error(`Erreur client ${d.keyClient}`, err);
              return null;
            }
          })
        );

        const contacts = clientsComplets.filter(c => c !== null);
        setClients(contacts);
        console.log("Clients complets récupérés :", contacts);
      } catch (err) {
        console.error("Erreur récupération clients:", err);
      }
    };

    if (keyEntraineur) fetchClients();
  }, [keyEntraineur]);

  // Étape 3 : envoyer l'affectation
  const handleAffectation = async () => {
    try {
      await axios.post(`http://localhost:3007/api/affectations/affecter`, {
        programmeId,
        keyEntraineur,
        keyClient: selectedKeyClient,
    });
      alert("Programme affecté avec succès ✅");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Erreur affectation:", err);
      alert("Échec de l'affectation ❌");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Affecter ce programme à un client</h3>

        <label>Choisir un client :</label>
        <select
          value={selectedKeyClient}
          onChange={(e) => setSelectedKeyClient(e.target.value)}
        >
          <option value="">-- Sélectionner un client --</option>
          {clients.map(client => (
            <option key={client.keyClient} value={client.keyClient}>
              {client.nom} {client.prenom} ({client.email})
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button onClick={handleAffectation} disabled={!selectedKeyClient}>✅ Affecter</button>
          <button onClick={onClose}>❌ Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default AffecterProgrammeModal;
