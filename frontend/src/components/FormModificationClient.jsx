const FormModificationClient = ({ client, setClient, onCancel, onSubmit }) => {
  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Modifier mon profil</h3>

        <form onSubmit={onSubmit} className="edit-profile-form">
          <div className="form-row">
            <input
              type="text"
              value={client.nom}
              placeholder="Nom"
              onChange={(e) => setClient({ ...client, nom: e.target.value })}
              required
            />

            <input
              type="text"
              value={client.prenom}
              placeholder="Prénom"
              onChange={(e) => setClient({ ...client, prenom: e.target.value })}
              required
            />
          </div>

          <input
            type="email"
            value={client.email}
            placeholder="Email"
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            required
          />

          <input
            type="text"
            value={client.adresse}
            placeholder="Adresse"
            onChange={(e) => setClient({ ...client, adresse: e.target.value })}
            required
          />

          <input
            type="text"
            value={client.telephone}
            placeholder="Téléphone"
            onChange={(e) => setClient({ ...client, telephone: e.target.value })}
            required
          />

          <div className="modal-actions">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModificationClient;