import React, { useState, useEffect } from 'react'
import {  FaEye,  FaPlus} from "react-icons/fa";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import styled from 'styled-components'
import { Chip } from '@mui/material'
import { Link } from "react-router-dom"
import { AirportShuttle, LocalShipping } from '@mui/icons-material'
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import { MdSend } from 'react-icons/md';
import { Modal} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../Context/AuthContext';


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});



const Delivery = () => {

  const { authFetch, token, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedColis, setSelectedColis] = useState([]);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);

  const showToken = () => {
  //alert(`Current token: ${token}`);
};

  const [items, setItems] = useState([]);

    
    const [visibleRow, setVisibleRow] = useState(null);

  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
    const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [error, setError] = useState(null);

    const [deliveries, setDeliveries] = useState([]);
  const [packages, setPackages] = useState({});
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [newDeliveryId, setNewDeliveryId] = useState('');

  const [deliveryToUpdate, setDeliveryToUpdate] = useState('');


  // authFetch deliveries from Spring Boot API
  const fetchDeliveries = async () => {
    try {
    const response = await authFetch("http://192.168.28.128:8080/api/delivery/delivery/allfrom-me");
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setDeliveries(data);
  } catch (err) {
    console.error("Error fetching deliveries:", err);
    setError("Erreur lors du chargement des livraisons: " + err.message);
          if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        window.location.href = '/login';
      }
  }
  };

  const fetchPackagesForDelivery = async (deliveryId) => {
  try {
    const response = await authFetch(
      `http://192.168.28.128:8080/api/delivery/package/all/${deliveryId}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    setPackages((prev) => ({ ...prev, [deliveryId]: data }));
  } catch (err) {
    console.error("Erreur lors du chargement des colis:", err);
    alert("Erreur lors du chargement des colis: " + err.message);
          if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        window.location.href = '/login';
      }
  }
  };


    const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    const getStatusColor = (status) => {
    switch (status) {
      case 'En attente départ':
        return 'bg-yellow-500 text-white';
      case 'En chemin':
        return 'bg-green-500 text-white';
      case 'Livré':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

    const toggleDetails = async (deliveryId) => {
    if (visibleRow === deliveryId) {
      setVisibleRow(null);
    } else {
      setVisibleRow(deliveryId);
      //alert("yo");
      if (!packages[deliveryId]) {
        await fetchPackagesForDelivery(deliveryId);
      }
    }
  };

    const [formData, setFormData] = useState({
    busId: '',
    driverId: '',
    arrivalAgency: ''
  });


 const handleSubmit = async (e) => {
  e.preventDefault();
      setLoading(true);
  try {
    const response = await authFetch("http://192.168.28.128:8080/api/delivery/delivery/delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        driver: formData.driverId,
        bus: formData.busId,
        arrivalAgency: formData.arrivalAgency
      }),
    });
if (!response.ok) {
  alert(`HTTP ${response.status}`);
  return;
}    // Récupère le PDF en blob


const blob = await response.blob();
const url = window.URL.createObjectURL(blob);

alert("Delivery created and sent to printer");
window.location.reload();
// Open PDF in a new window and print
/*
const pdfWindow = window.open(url);
if (pdfWindow) {
  pdfWindow.onload = () => {
    pdfWindow.focus();
    pdfWindow.print();
    
    // Move these inside the callback
    //navigate("/delivery");
  };
} else {
  // Handle case where popup was blocked
  alert("Delivery created but popup was blocked. Please check your browser settings.");
  navigate("/delivery");
}
*/
  } catch (err) {
    setError(err.message);
          if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        window.location.href = '/login';
      }
  } finally {
    setLoading(false);
  }
};

    
  const handlePackageSelect = (packageId) => {
    setSelectedPackages(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  const handleDeleteClick = () => {
    if (selectedPackages.length === 0) {
      alert('Veuillez sélectionner au moins un colis');
      return;
    }
    setShowModalDelete(true);
  };

    const handleUpdateClick = (deliveryId) => {
    setDeliveryToUpdate(deliveryId);
    setShowModalUpdate(true);
  };

    const [showForm, setShowForm] = useState(false);


    const handleButtonClick = () => {
        setShowForm(!showForm);
    };

        const fetchBuses = async () => {
      if (!token) {
        setError('Bearer token is required');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await authFetch('http://192.168.28.128:8080/api/org/bus/available');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bus API Response:', data);
        
        // Extract matricule from the API response
        let busMatricules = [];
        
        if (Array.isArray(data)) {
          // If direct array, extract matricule from each bus object
          busMatricules = data.map(bus => {
            console.log('Processing bus:', bus);
            return bus.matricule;
          }).filter(matricule => {
            console.log('Matricule found:', matricule);
            return matricule;
          });
        } else if (data.buses && Array.isArray(data.buses)) {
          busMatricules = data.buses.map(bus => bus.matricule).filter(matricule => matricule);
        } else if (data.data && Array.isArray(data.data)) {
          busMatricules = data.data.map(bus => bus.matricule).filter(matricule => matricule);
        } else {
          console.error('Unexpected API response structure:', data);
          throw new Error('Invalid API response format');
        }
        
        console.log('Extracted bus matricules:', busMatricules);
        setBuses(busMatricules);
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

        const fetchDrivers = async () => {
      if (!token) {
        setError('Bearer token is required');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await authFetch('http://192.168.28.128:8080/api/users/drivers/available');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Bus API Response:', data);
        
        // Extract matricule from the API response
        let DriversMatricules = [];
        
        if (Array.isArray(data)) {
          // If direct array, extract matricule from each bus object
          DriversMatricules = data.map(driver => {
            return driver.email;
          }).filter(email => {
            console.log('mail found:', email);
            return email;
          });
        } else if (data.drivers && Array.isArray(data.drivers)) {
          DriversMatricules = data.drivers.map(bus => drivers.email).filter(email => email);
        } else if (data.data && Array.isArray(data.data)) {
          DriversMatricules = data.data.map(driver => driver.email).filter(email => email);
        } else {
          console.error('Unexpected API response structure:', data);
          throw new Error('Invalid API response format');
        }
        
        console.log('Extracted bus matricules:', drivers);
        setDrivers(DriversMatricules);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching buses:', err);
              if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        window.location.href = '/login';
      }
      } finally {
        setLoading(false);
      }
    };

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
        
        console.log('Extracted bus matricules:', drivers);
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

      useEffect(() => {

    fetchBuses();
    fetchArrivalAgencies();
    fetchDrivers();
  }, [token]);

    const colisData = [
        { id: 1, colisId: '#C1', nature: 'Document', description: 'Passeport', expediteur: 'John Doe', destination: 'Yaoundé', prix: 5000 },
        { id: 2, colisId: '#C2', nature: 'Electronics', description: 'Mobile Phone', expediteur: 'Paul Smith', destination: 'Douala', prix: 15000 },    
    ];


  const handleConfirmDelete = async () => {
    try {

      setLoading(true);

      if (selectedPackages.length === 0) {
        alert('Aucun colis sélectionné');
        return;
      }

      if (!token) {
        navigate("/login");
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      // Transfer each selected package individually
      for (const packageNumSerie of selectedPackages) {
        try {
          //alert(packageNumSerie);
          const response = await authFetch(`http://192.168.28.128:8080/api/delivery/package/delete/${packageNumSerie}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
            const errorText = await response.text();
            throw new Error(`Colis ${packageNumSerie}: ${errorText || `HTTP ${response.status}`}`);
          }

          successCount++;
        } catch (err) {
          errorCount++;
          errors.push(`Colis ${packageNumSerie}: ${err.message}`);
          
          // If it's an auth error, stop the process
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        window.location.href = '/login';
      }
        }
      }

      // Show results
      if (successCount > 0 && errorCount === 0) {
        alert(`${successCount} colis supprimé(s) avec succès vers la livraison`);
        window.location.reload();
      } else {
        alert(`Échec de la suppression de tous les colis:\n\n${errors.join('\n')}`);
        window.location.reload();
      }

      // Reset state only if at least one transfer was successful
      if (successCount > 0) {
        setSelectedPackages([]);
        setShowModalDelete(false);
        
        // Refresh data
        await fetchDeliveries();
      }
      
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Erreur lors de la suppression: ' + err.message);
      window.location.reload();
    }
    finally{
      setLoading(false);
    }
  };

    const handleConfirmUpdate = async () => {
      setLoading(true);
    try {
          const response = await authFetch(`http://192.168.28.128:8080/api/delivery/delivery/update/${deliveryToUpdate}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
        driver: formData.driverId || "ras",
        bus: formData.busId || "ras",
        arrivalAgency: formData.arrivalAgency || "ras"
      }),
    });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
            const errorText = await response.text();
            alert("error : "+errorText);
            throw new Error(`Livraison ${deliveryToUpdate}: ${errorText || `HTTP ${response.status}`}`);
          }
        alert("success");
        setDeliveryToUpdate('');
        setShowModalUpdate(false);
        // Refresh data
        await fetchDeliveries();
        await fetchDrivers();
        await fetchBuses();

        } catch (err) {
          // If it's an auth error, stop the process
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        window.location.href = '/login';
      }
        }
        finally{
                setLoading(false);
        }
      };
  

const handleStartDelivery = async (deliveryId) => {
  setLoading(true); // Add loading state if you have it
  
  try {
    const response = await authFetch('http://192.168.28.128:8080/api/delivery/delivery/kickoff/'+deliveryId, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const message = await response.text();
    console.log('Delivery started:', deliveryId);
    
    // Update local state
    setDeliveries(prev => prev.map(delivery =>
      delivery.labelLivraison === deliveryId
        ? { ...delivery, status: 'En route' }
        : delivery
    ));

    alert('Livraison démarrée avec succès');
  } catch (err) {
    console.error('Error starting delivery:', err);
    
    // Handle auth errors
    if (err.message.includes('Token') || err.message.includes('Session')) {
      logout();
      return;
    }
    
    alert(`Erreur lors du démarrage: ${err.message}`);
  } finally {
    setLoading(false); // Stop loading
  }
};

  const handleUpdateDelivery = async (deliveryId) => {
    try {
      // Replace with your actual API endpoint
      const newId = prompt('Entrez le nouvel ID de livraison:');
      if (!newId) return;
      
      console.log('Transferring full delivery:', deliveryId, 'to:', newId);
      
      alert('Livraison complète transférée');
      fetchDeliveries();
    } catch (err) {
      alert('Erreur lors du transfert');
    }
  };

    useEffect(() => {
  fetchDeliveries();
}, [authFetch]);
/*
  useEffect(() => {
    (async () => {
      const resp = await authFetch("http://192.168.28.128:8080/api/items");
      if (!resp.ok) {
        console.error("Failed:", await resp.text());
        return;
      }
      const data = await resp.json();
      setItems(data);
    })();
  }, [authFetch]);*/

    return (
        <>
            <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                    <h5 className='mb-0'>Livraison des colis</h5>
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
                            label="Livraisons"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>
                <div >
                    <Link to={"#"} onClick={handleButtonClick}> {/* Using "#" to stay on the page */}
                        <button type="submit" className="btn btn-success w-100">
                            <span className='icon-delivery'><AirportShuttle /></span>
                            CLIQUEZ ICI POUR CREER UNE NOUVELLE LIVRAISON
                        </button>
                    </Link>
                </div>
                {showForm && (
                    <div className="card mt-4 p-4">
                        <h5 className='text-center'>Création  d'une Nouvelle Livraison</h5>
                        <form>
                            <div className="form-group">
                                <label htmlFor="matricule">Matricule du Bus</label>
                                <select className="form-control" id="matricule" value={formData.busId}  onChange={(e) => setFormData({...formData, busId: e.target.value})} required>
        <option value="" disabled>
          {loading ? 'Chargement des bus...' : 'Choisissez le matricule du bus'}
        </option>
        {buses.map((matricule, index) => (
          <option key={index} value={matricule}>
            {matricule}
          </option>
        ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="chauffeur">Chauffeur Bus</label>
                                <select className="form-control" id="chauffeur" value={formData.driverId}     onChange={(e) => setFormData({...formData, driverId: e.target.value})} required>
                                         <option value="" disabled>
          {loading ? 'Chargement des chauffeurs...' : 'Choisissez le matricule du chauffeur'}
        </option>
        {drivers.map((matricule, index) => (
          <option key={index} value={matricule}>
            {matricule}
          </option>
        ))}
                                </select>
                            </div>

                                                        <div className="form-group">
                                <label htmlFor="destination">Agence Destination</label>
                                <select className="form-control" id="chauffeur" value={formData.arrivalAgency}     onChange={(e) => setFormData({...formData, arrivalAgency: e.target.value})} required>
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

<button 
  type="submit" 
  onClick={handleSubmit} 
  className="btn btn-success mt-3"
  disabled={loading}
>
  {loading ? "Soumission..." : "Soumettre"}
</button>                        </form>

                    </div>
                )}


                <div className='title-table card shadow2 border-0 w-100 flex-row d-flex'>

                    <h3 className="hd">Table des Livraisons</h3>

                    <div className="button-right">
                        <p> Trier par : </p>
                        <Button className="flex-button btn-yellow2">En attente</Button>
                        <Button className="flex-button btn-green2">En chemin</Button>
                        <Button className="flex-button btn-error2">Arrivé</Button>

                    </div>

                </div>

                    {/*responsive table */}

                    <div className="card shadow border-0 p-3 mt-4">
<div className="table-responsive mt-3">
        <table className="table table-bordered v-align">
          <thead className="thead-dark">
            <tr>
              <th className="border border-gray-300 p-3 text-left">IdLivraison</th>
              <th className="border border-gray-300 p-3 text-left">Destination</th>
              <th className="border border-gray-300 p-3 text-left">Source</th>
              <th className="border border-gray-300 p-3 text-left">Matricule Bus</th>
              <th className="border border-gray-300 p-3 text-left">Chauffeur</th>
              <th className="border border-gray-300 p-3 text-left">Date Départ</th>
              <th className="border border-gray-300 p-3 text-left">Actions</th>
              <th className="border border-gray-300 p-3 text-left">Statut Livraison</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery, index) => (
              <React.Fragment key={delivery.labelLivraison}>
                <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border border-gray-300 p-3">{delivery.labelLivraison}</td>
                  <td className="border border-gray-300 p-3">{delivery.arrivalAgency}</td>
                  <td className="border border-gray-300 p-3">{delivery.departureAgency}</td>
                  <td className="border border-gray-300 p-3">{delivery.bus || 'N/A'}</td>
                  <td className="border border-gray-300 p-3">{delivery.driver}</td>
                  <td className="border border-gray-300 p-3">{formatDate(delivery.depart)}</td>
                                <td>
                                        <div className="actions d-flex align-items-center justify-content-center">
                                            <Button color="secondary" className="secondary" onClick={() => toggleDetails(delivery.labelLivraison)}>
                                                <span className="icon-container">
                                                    <FaEye />
                                                    <span className="tooltip-text">Voir tous les colis</span>
                                                </span>
                                            </Button>

                                            <Button color="primary" className="primary">
                                                <span className="icon-container">
                                                    <Link to={`/send-package/${delivery.labelLivraison}`}>
                                                        <FaPlus />
                                                    </Link>
                                                    <span className="tooltip-text">Ajouter un colis</span>
                                                </span>
                                            </Button>

                       {delivery.status === 'Chargement' && (
                                            <Button color="success"  onClick={() => handleUpdateClick(delivery.labelLivraison)} className="success">
                                                <span className="icon-container">
                                                    <MdSend />
                                                    <span className="tooltip-text">Modifier la livraison</span>
                                                </span>
                                            </Button>
                                              )}

{delivery.status === "Chargement" && (
  <Button color="info" onClick={() => handleStartDelivery(delivery.labelLivraison)} className="info" disabled={loading}>
    <span className="icon-container">
      <LocalShipping />
      <span className="tooltip-text">Départ Livraison</span>
    </span>
    {loading && <CircularProgress size={18} color="inherit" style={{ marginLeft: 8 }} />}
  </Button>
)}

                                        </div>
                                    </td>
                                    <td className="actionsBtn justify-content-center">
                                        <Button color="secondary" className="btn-${getStatusColor(delivery.status)}"> {delivery.status} </Button>
                                    </td>
                </tr>
                
                {visibleRow === delivery.labelLivraison && packages[delivery.labelLivraison] && (
                  <tr>
                    <td colSpan="8">
                      <div>
                        <table className="table table-bordered">
                          <thead className="beneath-table">
                            <tr>
                              <th className="border border-gray-300 p-2">Sélectionner</th>
                              <th className="border border-gray-300 p-2">ID Colis</th>
                              <th className="border border-gray-300 p-2">Nature</th>
                              <th className="border border-gray-300 p-2">Description</th>
                              <th className="border border-gray-300 p-2">Nom Expéditeur</th>
                              <th className="border border-gray-300 p-2">Destination</th>
                            </tr>
                          </thead>
                          <tbody>
                            {packages[delivery.labelLivraison].map((pkg, pkgIndex) => (
                              <tr key={pkg.numSerie} className={pkgIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="border border-gray-300 p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedPackages.includes(pkg.numSerie)}
                                    onChange={() => handlePackageSelect(pkg.numSerie)}
                                    className="w-4 h-4"
                                  />
                                </td>
                                <td className="border border-gray-300 p-2">{pkg.numSerie}</td>
                                <td className="border border-gray-300 p-2">{pkg.nature}</td>
                                <td className="border border-gray-300 p-2">{pkg.description}</td>
                                <td className="border border-gray-300 p-2">{pkg.exp_number}</td>
                                <td className="border border-gray-300 p-2">{pkg.destination}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {delivery.status === 'Chargement' && (
                              <button
                          onClick={handleDeleteClick}
                          className="mt-3 ml-4 bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded"
                        >
                          Supprimer les colis sélectionnés
                        </button>
                          )}
                        
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
  </div>
      
      {/* Transfer Modal */}
      
      {/*{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Transférer Colis</h5>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="deliveryId" className="block text-sm font-medium text-gray-700 mb-2">
                Nouvelle Livraison ID
              </label>
              <input
                type="text"
                id="deliveryId"
                value={newDeliveryId}
                onChange={(e) => setNewDeliveryId(e.target.value)}
                placeholder="Entrez le nouvel ID de livraison"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Confirmer le transfert
              </button>
            </div>
          </div>
        </div>
      )}*/}

                                                      <Modal show={showModalDelete} onHide={() => setShowModalDelete(false)}>
                                                          <Modal.Header closeButton>
                                                              <Modal.Title>Supprimer Colis</Modal.Title>
                                                          </Modal.Header>
                                                          <Modal.Body>
                                                              <label htmlFor="livraisonId">Etes vous surs de vouloir supprimer le(s) paquet(s) selectionnes ?</label>
                                                          </Modal.Body>
                                                          <Modal.Footer>
                                                              <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
                                                                  Annuler
                                                              </Button>
<Button 
    variant="primary" 
    onClick={handleConfirmDelete}
    disabled={loading}
>
    {loading ? "Suppression..." : "Confirmer la suppression"}
</Button>
                                                          </Modal.Footer>
                                                      </Modal>

                                                      <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)}>
                                                          <Modal.Header closeButton>
                                                              <Modal.Title>update livraison</Modal.Title>
                                                          </Modal.Header>
                                                          <Modal.Body>
                                                                                          <div className="form-group">
                                <label htmlFor="matricule">Changer le matricule du bus</label>
                                <select className="form-control" id="matricule" value={formData.busId}  onChange={(e) => setFormData({...formData, busId: e.target.value})} required>
        <option value="" disabled>
          {loading ? 'Chargement des bus...' : 'Choisissez le matricule du bus'}
        </option>
        {buses.map((matricule, index) => (
          <option key={index} value={matricule}>
            {matricule}
          </option>
        ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="chauffeur">Changer le chauffeur du bus</label>
                                <select className="form-control" id="chauffeur" value={formData.driverId}     onChange={(e) => setFormData({...formData, driverId: e.target.value})} required>
                                         <option value="" disabled>
          {loading ? 'Chargement des chauffeurs...' : 'Choisissez le matricule du chauffeur'}
        </option>
        {drivers.map((matricule, index) => (
          <option key={index} value={matricule}>
            {matricule}
          </option>
        ))}
                                </select>
                            </div>

                                                        <div className="form-group">
                                <label htmlFor="destination">Changer la destination</label>
                                <select className="form-control" id="chauffeur" value={formData.arrivalAgency}     onChange={(e) => setFormData({...formData, arrivalAgency: e.target.value})} required>
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
                                                          </Modal.Body>
                                                          <Modal.Footer>
                                                              <Button variant="secondary" onClick={() => setShowModalUpdate(false)}>
                                                                  Annuler
                                                              </Button>

                                                              <Button 
  variant="primary" 
  onClick={handleConfirmUpdate}
  disabled={loading}
>
  {loading ? "En cours..." : "Confirmer l'update"}
</Button>
                                                          </Modal.Footer>
                                                      </Modal>


                                                      <Button onClick={showToken} variant="primary">
  Show Token
</Button>


                        <div className="d-flex tableFooter">
                            <p>Showing <b>5</b> of <b>20</b> results</p>
                            <Pagination count={20} color="success" className="pagination" showFirstButton showLastButton />
                        </div>
                    </div>
                </div>

        </>
    )
}

export default Delivery
