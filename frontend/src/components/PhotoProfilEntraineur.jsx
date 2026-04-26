const PhotoProfilEntraineur = ({ photoProfile, onChangePhoto }) => {
  const imageSrc = photoProfile
    ? `https://entraineurapi.onrender.com/uploads/${photoProfile}`
    : 'https://via.placeholder.com/120x120?text=Coach';

  return (
    <div className="photo-container">
      <img
        src={imageSrc}
        alt="Photo de profil"
        className="profil-photo"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Coach';
        }}
      />

      <button
        type="button"
        className="change-photo-button"
        onClick={() => document.getElementById('photoUpload').click()}
      >
        ✏️
      </button>

      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onChangePhoto}
      />
    </div>
  );
};

export default PhotoProfilEntraineur;