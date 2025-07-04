

const PhotoProfil = ({ photo, onPhotoChange }) => {
  return (
    <div className="photo-container">
      <img
        src={`https://clientapi-u3uk.onrender.com/uploads/${photo}`}
        alt="Photo de profil"
        className="profil-photo"
      />
      <button
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
