
const EditProgrammeModal = ({ programme, setProgramme, onSubmit, onClose }) => {
  if (!programme) return null;

  return (
    <div className="edit-modal">
      <div className="modal-content">
        <h3>Modifier le programme</h3>
        <form onSubmit={onSubmit}>
          <label>Nom du programme :</label>
          <input
            type="text"
            value={programme.nom}
            onChange={(e) => setProgramme({ ...programme, nom: e.target.value })}
            required
          />

          <label>Niveau :</label>
          <input
            type="text"
            value={programme.niveau}
            onChange={(e) => setProgramme({ ...programme, niveau: e.target.value })}
            required
          />

          <label>Objectif :</label>
          <input
            type="text"
            value={programme.objectif}
            onChange={(e) => setProgramme({ ...programme, objectif: e.target.value })}
            required
          />

          <label>Description :</label>
          <textarea
            value={programme.description}
            onChange={(e) => setProgramme({ ...programme, description: e.target.value })}
            required
          ></textarea>

          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default EditProgrammeModal;
