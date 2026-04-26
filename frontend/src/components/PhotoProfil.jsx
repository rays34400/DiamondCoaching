const PhotoProfil = ({ photo, onPhotoChange }) => {
  const imageSrc = photo
    ? `https://clientapi-u3uk.onrender.com/uploads/${photo}`
    : 'https://via.placeholder.com/120x120?text=Client';

  return (
    <div className="photo-container">
      <img
        src={imageSrc}
        alt="Photo de profil"
        className="profil-photo"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Client';
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
        onChange={onPhotoChange}
      />
    </div>
  );
};

export default PhotoProfil;