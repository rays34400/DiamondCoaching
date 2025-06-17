import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Accueil.css';

function Accueil() {
  return (
    <div className="accueil-container">
      <header className="accueil-header">
        <h1>Bienvenue sur Diamond Coaching</h1>
        <p>Libère ton potentiel avec nos coachs certifiés. Atteins tes objectifs et dépasse-les !</p>
      </header>

      <section className="accueil-actions">
        <Link to="/inscription-client" className="accueil-button">Inscription Client</Link>
        <Link to="/connexion-client" className="accueil-button">Connexion Client</Link>
        <Link to="/inscription-entraineur" className="accueil-button">Inscription Entraîneur</Link>
        <Link to="/connexion-entraineur" className="accueil-button">Connexion Entraîneur</Link>
      </section>

      <section className="accueil-info-cards">
        <div className="card">
          <img src="/images/transformation.png" alt="Transformation" />
          <p>Un parcours sur mesure pour transformer ton corps et ton esprit.</p>
        </div>
        <div className="card">
          <img src="/images/coach.png" alt="Coach certifiés" />
          <p>Des coachs experts et passionnés pour t’accompagner à chaque étape.</p>
        </div>
        <div className="card">
          <img src="/images/communauté.png" alt="Communauté" />
          <p>Rejoins une communauté engagée et motivante.</p>
        </div>
      </section>

      
      <section className="accueil-specialites">
        <p>
          Nos coachs couvrent une grande variété de spécialités : musculation, boxe, yoga, sport santé, préparation mentale, et bien d'autres.
          Quel que soit ton sport ou ton objectif — perte de poids, performance, bien-être ou dépassement personnel — un coach adapté t’attend.
        </p>
      </section>

      <footer className="accueil-footer">
        <p>© 2025 Diamond Coaching — Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default Accueil;
