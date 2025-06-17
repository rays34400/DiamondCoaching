

const FormModificationClient = ({ client, setClient, onCancel, onSubmit }) => {
  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Modifier mon profil</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={client.nom}
            onChange={(e) => setClient({ ...client, nom: e.target.value })}
            required
          />
          <input
            type="text"
            value={client.prenom}
            onChange={(e) => setClient({ ...client, prenom: e.target.value })}
            required
          />
          <input
            type="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            required
          />
          <input
            type="text"
            value={client.adresse}
            onChange={(e) => setClient({ ...client, adresse: e.target.value })}
            required
          />
          <input
            type="text"
            value={client.telephone}
            onChange={(e) => setClient({ ...client, telephone: e.target.value })}
            required
          />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onCancel}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default FormModificationClient;
