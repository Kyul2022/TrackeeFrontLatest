import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import { Chip } from '@mui/material'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useAuth } from '../../Context/AuthContext';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    height: '20px',
    color: 'text-primary'
  }
});


const NewAgency = () => {

      const { authFetch, token, logout} = useAuth();
      // Dans votre composant :
  const navigate = useNavigate();
        const [matricule, setMatricule] = useState(''); //agency name
        const [ville, setVille] = useState(''); //agency town
    const [loading, setLoading] = useState(false);
  
      const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validation
      if (!matricule.trim()) {
        alert('Veuillez entrer un numéro d\'immatriculation');
        return;
      }
  
      setLoading(true);
  
      try {
        
        if (!token) {
          alert('Token d\'authentification manquant. Veuillez vous reconnecter.');
          return;
        }
  
        // Créer l'objet Bus selon votre modèle backend
        const busData = {
          name: matricule.trim(),
          ville: ville.trim()
          // Ajoutez d'autres champs si nécessaire
        };
  
        const response = await authFetch('http://84.247.135.231:8080/api/org/agencies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Bearer auth
          },
          body: JSON.stringify(busData),
        });
  
        if (response.ok) {
          const result = await response.text(); // Votre endpoint retourne un String
          alert(result || 'Agence ajouté avec succès!');
          
          // Reset le formulaire
          setMatricule('');
          
          // Optionnel: rediriger ou rafraîchir la liste
          navigate(-1); // Retour en arrière
          
        } else if (response.status === 401) {
          alert('Token expiré. Veuillez vous reconnecter.');
          // Optionnel: rediriger vers login
          // navigate('/login');
          
        } else {
          const errorMessage = await response.text();
          alert(errorMessage || 'Erreur lors de l\'ajout du bus');
        }
  
      } catch (error) {
            if (error.message.includes('Token') || error.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      } 
        console.error('Erreur:', error);
        alert('Erreur de connexion. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <div className='right-content w-100'>
        <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
          <h5 className='mb-0'>Gestion des agences</h5>
          <Breadcrumbs aria-label='breadcrumb' className='breadcrumbs'>
            <StyledBreadcrumb
              className='styledbreadcrumbs'
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />


            <StyledBreadcrumb
              className='styledbreadcrumbs'
              label="Agences"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>

        <div className="card shadow border-0 p-3 mt-4">


    <form onSubmit={handleSubmit}>
      <div className='row align-items-center justify-content-center'>
        <div className='col-sm-8'>
          <div className='card p-4'>
            <h5 className='align-items-center justify-content-center d-flex'>
              <strong>Enregistrer une nouvelle agence</strong>
            </h5>
            
            <div className='form-group mt-3'>
              <h6>Nom de l'agence</h6>
              <input 
                type='text' 
                className='input-50'
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                placeholder="Ex: ABC-123-DEF"
                required
                disabled={loading}
              />
            </div>

            <div className='form-group mt-3'>
              <h6>Ville</h6>
              <input 
                type='text' 
                className='input-50'
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ex: ABC-123-DEF"
                required
                disabled={loading}
              />
            </div>

            <div className='align-items-center justify-content-center d-flex'>
              <Button 
                type="submit"
                className="btn-blue btn-lg btn-round"
                disabled={loading || !matricule.trim() || !ville.trim()}
              >
                {loading ? 'Enregistrement...' : 'Valider'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className='col-sm-5'>
          {/* Espace vide ou contenu additionnel */}
        </div>
      </div>
    </form>




        </div >



      </div >


    </>
  )
}

export default NewAgency;
