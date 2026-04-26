const FormEditProfilEntraineur = ({
  entraineur,
  setEntraineur,
  handleUpdate,
  setShowEditForm
}) => {
  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Modifier mon profil</h3>

        <form onSubmit={handleUpdate} className="edit-profile-form">
          <div className="form-row">
            <input
              type="text"
              value={entraineur.nom}
              placeholder="Nom"
              onChange={(e) => setEntraineur({ ...entraineur, nom: e.target.value })}
              required
            />

            <input
              type="text"
              value={entraineur.prenom}
              placeholder="Prénom"
              onChange={(e) => setEntraineur({ ...entraineur, prenom: e.target.value })}
              required
            />
          </div>

          <input
            type="email"
            value={entraineur.email}
            placeholder="Email"
            onChange={(e) => setEntraineur({ ...entraineur, email: e.target.value })}
            required
          />

          <input
            type="text"
            value={entraineur.adresse}
            placeholder="Adresse"
            onChange={(e) => setEntraineur({ ...entraineur, adresse: e.target.value })}
            required
          />

          <input
            type="text"
            value={entraineur.telephone}
            placeholder="Téléphone"
            onChange={(e) => setEntraineur({ ...entraineur, telephone: e.target.value })}
            required
          />

          <input
            type="text"
            value={entraineur.specialite}
            placeholder="Spécialité"
            onChange={(e) => setEntraineur({ ...entraineur, specialite: e.target.value })}
            required
          />

          <div className="modal-actions">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={() => setShowEditForm(false)}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditProfilEntraineur;