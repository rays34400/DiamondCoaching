

const InfosProfilEntraineur = ({ entraineur }) => {
  return (
    <div className="profil-infos">
      <p><strong>Nom :</strong> {entraineur.nom}</p>
      <p><strong>Prénom :</strong> {entraineur.prenom}</p>
      <p><strong>Email :</strong> {entraineur.email}</p>
      <p><strong>Adresse :</strong> {entraineur.adresse}</p>
      <p><strong>Téléphone :</strong> {entraineur.telephone}</p>
      <p><strong>Spécialité :</strong> {entraineur.specialite}</p>
    </div>
  );
};

export default InfosProfilEntraineur;
