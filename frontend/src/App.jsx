import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import InscriptionClient from './pages/Clients/InscriptionClient';
import ConnexionClient from './pages/Clients/ConnexionClient';
import ProfilClient from './pages/Clients/ProfilClient';
import ModifierProfilClient from './pages/Clients/ModifierProfilClient';
import Navbar from './components/Navbar';
import Accueil from './pages/Accueil';
import InscriptionEntraineur from './pages/Entraineurs/InscriptionEntraineur';
import ConnexionEntraineur from './pages/Entraineurs/ConnexionEntraineur';
import ProfilEntraineur from './pages/Entraineurs/ProfilEntraineur';
import AjouterProgramme from './pages/programme/AjouterProgramme';
import ListeProgrammes from './pages/programme/ListeProgrammes';
import ListeEntraineurs from './pages/Clients/ListeEntraineurs';
import DemandesRecues from './pages/Entraineurs/DemandesRecues';
import MesContactsClient from './pages/Clients/MesContactsClient';
import MesContactsEntraineur from './pages/Entraineurs/MesContactsEntraineur';
import ProgrammesAffectesClient from './pages/Clients/ProgrammesAffectesClient';
import ListeRendezVousEntraineur from './pages/Entraineurs/ListeRendezVousEntraineur';
import ListeRendezVousClient from './pages/Clients/ListeRendezVousClient';
import MessagerieContactsEntraineur from './pages/Entraineurs/MessagerieContactsEntraineur';
import MessagerieContactsClient from './pages/Clients/MessagerieContactsClient';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/inscription-client" element={<InscriptionClient />} />
        <Route path="/connexion-client" element={<ConnexionClient />} />
        <Route path="/client/profil" element={<ProfilClient />} />
        <Route path="/client/modifier-profil" element={<ModifierProfilClient />} />
        <Route path="/client/entraineurs" element={<ListeEntraineurs />} />
        <Route path="/mes-contacts-client" element={<MesContactsClient />} />
        <Route path="/mesProgrammesAff" element={<ProgrammesAffectesClient />} />
        <Route path="/client/rdv" element={<ListeRendezVousClient />} />
        <Route path="/client/messagerie" element={<MessagerieContactsClient />} />
        

        
        
        <Route path="/inscription-entraineur" element={<InscriptionEntraineur />} />
        <Route path="/connexion-entraineur" element={<ConnexionEntraineur />} />
        <Route path="/entraineur/profil" element={<ProfilEntraineur />} />
        <Route path="/demandes-recues" element={<DemandesRecues />} />
        <Route path="/mes-contacts-entraineur" element={<MesContactsEntraineur />} />
        <Route path="/entraineur/rendezvous" element={<ListeRendezVousEntraineur />} />
        <Route path="/entraineur/messagerie" element={<MessagerieContactsEntraineur />} />


        <Route path="/entraineur/ajouter-programme" element={<AjouterProgramme />} />
        <Route path="/entraineur/programmes" element={<ListeProgrammes />} />

        <Route path="*" element={<h1>Page non trouvée</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
