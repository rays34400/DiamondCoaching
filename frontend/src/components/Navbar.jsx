import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMenu(false);
  };

  const toggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <li><Link to="/inscription-client" onClick={() => setShowMenu(false)}>Inscription Client</Link></li>
          <li><Link to="/connexion-client" onClick={() => setShowMenu(false)}>Connexion Client</Link></li>
          <li><Link to="/inscription-entraineur" onClick={() => setShowMenu(false)}>Inscription Entraîneur</Link></li>
          <li><Link to="/connexion-entraineur" onClick={() => setShowMenu(false)}>Connexion Entraîneur</Link></li>
        </>
      );
    }

    if (user.role === 'client') {
      return (
        <>
          <li><Link to="/client/profil" onClick={() => setShowMenu(false)}>Mon Profil</Link></li>
          <li><Link to="/client/entraineurs" onClick={() => setShowMenu(false)}>Voir les entraîneurs</Link></li>
          <li><Link to="/mes-contacts-client" onClick={() => setShowMenu(false)}>Mes contacts</Link></li>
          <li><Link to="/mesProgrammesAff" onClick={() => setShowMenu(false)}>Mes programmes</Link></li>
          <li><Link to="/client/messagerie" onClick={() => setShowMenu(false)}>Messagerie</Link></li>
          <li><button onClick={handleLogout}>Déconnexion</button></li>
        </>
      );
    }

    if (user.role === 'entraineur') {
      return (
        <>
          <li><Link to="/entraineur/profil" onClick={() => setShowMenu(false)}>Mon Profil</Link></li>
          <li><Link to="/entraineur/ajouter-programme" onClick={() => setShowMenu(false)}>Créer Programme</Link></li>
          <li><Link to="/entraineur/programmes" onClick={() => setShowMenu(false)}>Mes Programmes</Link></li>
          <li><Link to="/demandes-recues" onClick={() => setShowMenu(false)}>📨 Demandes reçues</Link></li>
          <li><Link to="/mes-contacts-entraineur" onClick={() => setShowMenu(false)}>Mes contacts</Link></li>
          <li><Link to="/entraineur/messagerie" onClick={() => setShowMenu(false)}>Messagerie</Link></li>
          <li><button onClick={handleLogout}>Déconnexion</button></li>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <li><Link to="/admin/dashboard" onClick={() => setShowMenu(false)}>Dashboard</Link></li>
          <li><button onClick={handleLogout}>Déconnexion</button></li>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={() => setShowMenu(false)}>🏋️ Diamond Coaching</Link>
      </div>

      {/* Bouton burger pour mobile */}
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>

      <ul className={`navbar-links ${showMenu ? 'show' : ''}`}>
        {renderLinks()}
      </ul>
    </nav>
  );
};

export default Navbar;
