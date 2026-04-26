const InfosProfilEntraineur = ({ entraineur }) => {
  return (
    <div className="profil-infos">
      <p><strong>Nom :</strong> {entraineur.nom || 'Non renseigné'}</p>
      <p><strong>Prénom :</strong> {entraineur.prenom || 'Non renseigné'}</p>
      <p><strong>Email :</strong> {entraineur.email || 'Non renseigné'}</p>
      <p><strong>Adresse :</strong> {entraineur.adresse || 'Non renseignée'}</p>
      <p><strong>Téléphone :</strong> {entraineur.telephone || 'Non renseigné'}</p>
      <p><strong>Spécialité :</strong> {entraineur.specialite || 'Non renseignée'}</p>
    </div>
  );
};

export default InfosProfilEntraineur;