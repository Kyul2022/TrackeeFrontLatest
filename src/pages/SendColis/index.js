import React, { useState, useEffect } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import styled from 'styled-components'
import { Chip } from '@mui/material'
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Logo from '../../assets/images/logo-64.png'
import { useAuth } from '../../Context/AuthContext';


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});


const SendColis = () => {

    const { deliveryId } = useParams();
  const { authFetch, token, logout } = useAuth();
  const navigate = useNavigate();

    const [showChoice, setShowChoice] = useState(true);
    const [importPackageId, setImportPackageId] = useState('');
    const [importType, setImportType] = useState('');
    const [externalDestination, setExternalDestination] = useState('');

      useEffect(() => {

    const fetchArrivalAgencies = async () => {
      if (!token) {
        setError('Bearer token is required');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await authFetch('http://192.168.28.128:8080/api/org/agencies/allforx');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bus API Response:', data);
        
        // Extract matricule from the API response
        let Agencies = [];
        
        if (Array.isArray(data)) {
          // If direct array, extract matricule from each bus object
          Agencies = data.map(agency => {
            return agency.name;
          }).filter(name => {
            console.log('agency found:', name);
            return name;
          });
        }  else {
          console.error('Unexpected API response structure:', data);
          throw new Error('Invalid API response format');
        }
                setAgencies(Agencies);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching buses:', err);
        if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
      } finally {
        setLoading(false);
      }
    };

    fetchArrivalAgencies();
  }, [token]);

    const [categoryVal, setCategoryVal] = useState('');
    const [apiResults, setApiResults] = useState([]);

    // Handler for creating new delivery
    const handleCreateNew = () => {
        setShowChoice(false);
    };

    // Handler for importing existing delivery
const handleImportPackage = async () => {
    setLoading(true);
    if (!importPackageId.trim()) {
        alert('Veuillez saisir un ID de livraison valide');
        return;
    }

    if (!importType) {
        alert('Veuillez sélectionner le type d\'import (interne ou externe)');
        return;
    }

    try {
        let apiUrl;
        let requestBody;
        
        // Use different API endpoints based on import type
        if (importType === 'external') {
            apiUrl = `http://192.168.28.128:8080/api/delivery/handover/changePacketExternal`;
            requestBody = {
                packetId: importPackageId,
                deliveryId: deliveryId,
                arrivalAgency: externalDestination,
                note: "External transit" // Add the missing note field
            };
        } else {
            apiUrl = `http://192.168.28.128:8080/api/delivery/handover/changePacket/${importPackageId}/${deliveryId}`;
            requestBody = { importType: importType };
        }

        // Single API call outside the if/else blocks
        const response = await authFetch(apiUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
            const errorText = await response.text();
            throw new Error(`Colis ${importPackageId}: ${errorText || `HTTP ${response.status}`}`);
        }

        const message = importType === 'internal' ?
            'Transfert interne réussi!' :
            'Import externe réussi!';

        alert(message);
        window.location.href = '/delivery';
        
    } catch (err) {
        // If it's an auth error, stop the process
if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
        // Handle other errors
        alert(`Erreur: ${err.message}`);
    }
    finally{
        setLoading(false);
    }
};

    // Handler to go back to choice
    const handleBackToChoice = () => {
        setShowChoice(true);
        setImportPackageId('');
        setImportType('');
    };

    const handleChangeDest = (event) => {
        setFormData(prev => ({
            ...prev,
            destination: event.target.value
        }));
    };

    const handleChangeNature = (event) => {
        setFormData(prev => ({
            ...prev,
            nature: event.target.value
        }));
    };

    const handleChangeExpNum = (event) => {
        setFormData(prev => ({
            ...prev,
            exp_number: event.target.value
        }));
    };

    const handleChangeDestNum1 = (event) => {
        setFormData(prev => ({
            ...prev,
            dest_number1: event.target.value
        }));
    };

    const handleChangeDestNum2 = (event) => {
        setFormData(prev => ({
            ...prev,
            dest_number2: event.target.value
        }));
    };

    const handleChangeDescription = (event) => {
        setFormData(prev => ({
            ...prev,
            description: event.target.value
        }));
    };

    const handleChangePrix = (event) => {
        setFormData(prev => ({
            ...prev,
            prix: event.target.value
        }));
    };

    const handleChangePoids = (event) => {
        setFormData(prev => ({
            ...prev,
            poids: event.target.value
        }));
    };

    const handleChangeExpName= (event) => { 
        setFormData(prev => ({
            ...prev,
            exp_name: event.target.value
        }));
    };
    const handleChangeDestName= (event) => {    
        setFormData(prev => ({
            ...prev,
            dest_name: event.target.value
        }));
    };




    const [formData, setFormData] = useState({
        exp_number: '',
        exp_name:'',
        dest_name:'',
        prix: '',
        poids: '',
        dest_number1: '',
        dest_number2: '',
        description: '',
        nature: '',
        type: '',
        destination: ''
    });

    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Make API call with form parameters
    const handleSubmit = async (e) => {
          e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const packageData = {
                exp_number: formData.exp_number,
                exp_name:formData.exp_name,
                dest_name:formData.dest_name,
                dest_number1: formData.dest_number1,
                dest_number2: formData.dest_number2,
                description: formData.description,
                nature: formData.nature,
                prix: formData.prix,
                poids: formData.poids,
                destination: formData.destination,
            };

            const apiUrl = `http://192.168.28.128:8080/api/delivery/package/package/${deliveryId}`;
            console.log('API URL:', apiUrl);
            console.log('Package Data:', packageData);

            const response = await authFetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(packageData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

    // Récupère le PDF en blob
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);

// Open PDF in a new window and print
const pdfWindow = window.open(url);
if (pdfWindow) {
  pdfWindow.onload = () => {
    pdfWindow.focus();
    pdfWindow.print();
  };
}

alert("Package created and sent to printer");
navigate("/delivery")

        } catch (err) {
            setError(err.message);
            console.error('API Error:', err);

            if (err.message.includes('404')) {
                alert('Livraison non trouvée');
            } else if (err.message.includes('500')) {
                alert('Erreur serveur lors de l\'ajout du colis');
            }
            else if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
            else {
                alert('Erreur lors de l\'ajout du colis: ' + err.message);
            }
        } finally {
            setLoading(false);
            window.location.href = '/delivery';
        }
    };
/*
    useEffect(() => {
        const fetchAgencies = async () => {
            if (!token) {
                setError('Bearer token is required');
                return;
            }
            alert("yo");
            setLoading(true);
            setError(null);

            try {
                const response = await authFetch('http://192.168.28.128:8080/agencies', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                let cityNames = [];

                if (Array.isArray(data)) {
                    cityNames = data.map(item => item.ville).filter(ville => ville);
                } else if (data.agencies && Array.isArray(data.agencies)) {
                    cityNames = data.agencies.map(item => item.ville).filter(ville => ville);
                } else if (data.data && Array.isArray(data.data)) {
                    cityNames = data.data.map(item => item.ville).filter(ville => ville);
                } else {
                    throw new Error('Invalid API response format');
                }

                setAgencies(cityNames);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching agencies:', err);
            } finally {
                setLoading(false);
            }
        };

        // Only authFetch agencies when form is visible
        if (!showChoice) {
            fetchAgencies();
        }
    }, [showChoice, token]);*/

    // Initial Choice Card Component
    const ChoiceCard = () => (
        <div className='right-content w-100'>
            <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                <h5 className='mb-0'>Envoi de colis</h5>
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
                        label="Envoi de colis"
                        href="#"
                        deleteIcon={<ExpandMoreIcon />}
                    />
                </Breadcrumbs>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <div className="card-body text-center">
                            <h4 className="card-title mb-4">Que souhaitez-vous faire ?</h4>

                            <div className="mb-4">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className="w-100 mb-3"
                                    onClick={handleCreateNew}
                                >
                                    Créer un nouveau colis
                                </Button>
                            </div>

                            <div className="mb-3">
                                <h6 className="mb-3">Ou importer un colis existant :</h6>

                                {/* Import Type Selection */}
                                <div className="mb-3">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="importType"
                                                    id="internal"
                                                    value="internal"
                                                    checked={importType === 'internal'}
                                                    onChange={(e) => setImportType(e.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor="internal">
                                                    <Button
                                                        variant={importType === 'internal' ? "contained" : "outlined"}
                                                        color="primary"
                                                        size="small"
                                                        className="w-100"
                                                        onClick={() => setImportType('internal')}
                                                    >
                                                        Colis Interne
                                                    </Button>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="importType"
                                                    id="external"
                                                    value="external"
                                                    checked={importType === 'external'}
                                                    onChange={(e) => setImportType(e.target.value)}
                                                    style={{ display: 'none' }}
                                                />
                                                <label className="form-check-label" htmlFor="external">
                                                    <Button
                                                        variant={importType === 'external' ? "contained" : "outlined"}
                                                        color="success"
                                                        size="small"
                                                        className="w-100 "
                                                        onClick={() => setImportType('external')}
                                                    >
                                                        Colis Externe
                                                    </Button>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Package ID Input */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`ID du colis ${importType === 'internal' ? 'interne' : importType === 'external' ? 'externe' : ''}`}
                                        value={importPackageId}
                                        onChange={(e) => setImportPackageId(e.target.value)}
                                      
                                    />
                                </div>

                             
                           {importType === 'external' && (
                            
                            <div className="form-group">
                                <label htmlFor="destination">Destination du colis externe</label>
                                <select className="form-control" id="chauffeur" value={externalDestination}     onChange={(e) => setExternalDestination(e.target.value)} required>
                                         <option value="" disabled>
          {loading ? 'Chargement des agences...' : 'Choisissez l agence de destination'}
        </option>
        {agencies.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
                                </select>
                            </div> 

    )}

                                {/* Validation Button */}
                                <div className="mb-3">

                                    <Button
  variant="contained"
  color={importType === 'internal' ? "primary" : "secondary"}
  size="medium"
  className="w-100"
  onClick={handleImportPackage}
  disabled={
    loading ||
    !importPackageId.trim() ||
    !importType ||
    (importType === 'external' && !externalDestination)
  }
>
  {loading ? "En cours..." : "Valider l'import"}
</Button>
                                </div>

                                {/* Help text */}
                                {importType && (
                                    <div className="alert alert-info mt-3" style={{ fontSize: '0.9rem' }}>
                                        {importType === 'internal' ? (
                                            <span>🔄 Import interne : Transfert d'un colis depuis une autre livraison de votre organisation</span>
                                        ) : (
                                            <span>🌐 Import externe : Import d'un colis depuis une source externe vers {externalDestination || 'une destination à sélectionner'}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Show choice card initially
    if (showChoice) {
        return <ChoiceCard />;
    }

    // Main form (your existing code)
    return (
        <>
            <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                    <h5 className='mb-0'>Envoi de colis</h5>
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
                            label="Envoi de colis"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>
                <form>
                    <div className='row'>
                        <div className='col-sm-12 col-md-7'>
                            <div className='card p-4'>
                                <div className='headpage'>
                                    <h5>Veuillez renseigner les champs ci-dessous</h5>
                                    <Button
                                        className='btn-yellow btn-lg btn-round me-2'
                                        onClick={handleBackToChoice}
                                    >
                                        Retour
                                    </Button>
                                    {/* <Button className='btn-error btn-lg btn-round'>Annuler</Button> */}
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>DESTINATION</h6>
                                            <Select
                                                value={formData.destination}
                                                onChange={handleChangeDest}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="" disabled>
                                                    {loading ? 'Chargement des agences...' : 'Choisir une agence'}
                                                </MenuItem>
                                                {agencies.map((agencyName, index) => (
                                                    <MenuItem key={index} value={agencyName}>
                                                        {agencyName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>NATURE</h6>
                                            <Select
                                                value={formData.nature}
                                                onChange={handleChangeNature}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                </MenuItem>
                                                <MenuItem value="COURRIER">COURRIER</MenuItem>
                                                <MenuItem value="COLIS">COLIS</MenuItem>
                                                <MenuItem value="DEPECHE">DEPECHE</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className='form-group'>
                                    <h6>DESCRIPTION</h6>
                                    <input type='text' value={formData.description} onChange={handleChangeDescription} />
                                </div>
                                <div className='form-group'>
                                    <h6>PRIX</h6>
                                    <input type='number' value={formData.prix} onChange={handleChangePrix} 
                                        autoComplete="off"
                                    />
                                </div>
                                <div className='form-group'>
                                    <h6>POIDS(g)</h6>
                                    <input type='number' value={formData.poids} onChange={handleChangePoids} autoComplete="off"
/>
                                </div>
                                <div className='form-group'>
                                    <h6>EXPEDITEUR</h6>
                                    <input type='text' value={formData.exp_name} onChange={handleChangeExpName} />
                                </div>
                                <div className='form-group'>
                                    <h6>TELEPHONE EXPEDITEUR</h6>
                                    <input type='number' value={formData.exp_number} onChange={handleChangeExpNum}  autoComplete="off"
/>
                                </div>
                                <div className='form-group'>
                                    <h6>DESTINATAIRE</h6>
                                    <input type='text'  value={formData.dest_name} onChange={handleChangeDestName}/>
                                </div>
                                <div className='form-group'>
                                    <h6>TELEPHONE DESTINATAIRE</h6>
                                    <input type='number' value={formData.dest_number1} onChange={handleChangeDestNum1} autoComplete="off"
 />
                                </div>
                                <div className='form-group'>
                                    <h6>TELEPHONE DESTINATAIRE SECONDAIRE</h6>
                                    <input type='number' value={formData.dest_number2} onChange={handleChangeDestNum2} autoComplete="off"/>
                                </div>

<button 
  type="submit" 
  className="btn btn-success" 
  onClick={handleSubmit}
  disabled={loading} // disable when loading
>
  {loading ? "Enregistrement..." : "Enregistrer"}
</button>

                            </div>
                        </div>

                        <div className='col-sm-12 col-md-5'>
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center ">
                                        <div className="logo align-items-center">
                                            <img src={Logo} alt="" />
                                            <span className="d-none d-lg-block ">TRACKEE</span>
                                        </div>
                                    </div>

                                    <h5 className="card-title text-center">Facture de Livraison</h5>
                                    <table className="table table-bordered justify-content-center" >
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Données</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row">ID Colis</th>
                                                <td>AAAA</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Nature du colis</th>
                                                <td>{formData.nature}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Poids</th>
                                                <td>{formData.poids}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Destination</th>
                                                <td>{formData.destination}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Frais</th>
                                                <td>{formData.prix} XAF</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Expéditeur</th>
                                                <td>{formData.exp_name}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Télephone Expéditeur</th>
                                                <td>{formData.exp_number}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Destinataire</th>
                                                <td>{formData.dest_name}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">téléphone Destinataire</th>
                                                <td>{formData.dest_number1}</td>
                                            </tr>
                                              <tr>
                                                <th scope="row">téléphone Destinataire 2</th>
                                                <td>{formData.dest_number2}</td> 
                                            </tr>
                                            <tr>
                                                <th scope="row">Date de l'expédition</th>
                                                <td>get the date</td>
                                            </tr>
                                          
                                             <tr>
                                                <th scope="row">Description du colis</th>
                                                <td>{formData.description}</td> 
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SendColis