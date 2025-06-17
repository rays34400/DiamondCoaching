

const FormEditProfilEntraineur = ({ entraineur, setEntraineur, handleUpdate, setShowEditForm }) => {
  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Modifier mon profil</h3>
        <form onSubmit={handleUpdate}>
          <input type="text" value={entraineur.nom} onChange={(e) => setEntraineur({ ...entraineur, nom: e.target.value })} required />
          <input type="text" value={entraineur.prenom} onChange={(e) => setEntraineur({ ...entraineur, prenom: e.target.value })} required />
          <input type="email" value={entraineur.email} onChange={(e) => setEntraineur({ ...entraineur, email: e.target.value })} required />
          <input type="text" value={entraineur.adresse} onChange={(e) => setEntraineur({ ...entraineur, adresse: e.target.value })} required />
          <input type="text" value={entraineur.telephone} onChange={(e) => setEntraineur({ ...entraineur, telephone: e.target.value })} required />
          <input type="text" value={entraineur.specialite} onChange={(e) => setEntraineur({ ...entraineur, specialite: e.target.value })} required />
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setShowEditForm(false)}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default FormEditProfilEntraineur;
