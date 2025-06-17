import React from 'react';

const PhotoProfilEntraineur = ({ photoProfile, onChangePhoto }) => {
  return (
    <div className="photo-container">
      <img
        src={`http://localhost:3002/uploads/${photoProfile}`}
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
        onChange={onChangePhoto}
      />
    </div>
  );
};

export default PhotoProfilEntraineur;
