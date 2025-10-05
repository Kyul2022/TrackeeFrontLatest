import React, { useState, useEffect} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import styled from "styled-components";
import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { useAuth } from '../../Context/AuthContext';


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    height: "20px",
    color: "text-primary",
  };
});

const Reception = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchR, setSearchR] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('livraison');
  const [withdrawnStates, setWithdrawnStates] = useState({});
  const navigate = useNavigate();

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

  const [openModal, setOpenModal] = useState(false); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [currentDeliveryId, setCurrentDeliveryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Adjust this value for the number of rows per page

  const [deliveries, setDeliveries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packagesExt, setPackagesExt] = useState([]);
  const { authFetch, token, logout } = useAuth();


    const fetchDeliveries = async () => {
    try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://84.247.135.231:8080/api/delivery/delivery/alltome', {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("first")
      //alert(JSON.stringify(data,2,null))
      setDeliveries(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      alert("error : "+err.message);
      setError('Erreur lors du chargement des livraisons: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };
  useEffect(() => {
    // appel initial au montage
    fetchDeliveries();
    fetchPackages();
    fetchExternalTransitPackages();
    // mise en place du timer toutes les 5 minutes (300000 ms)
    const interval = setInterval(() => {
      fetchDeliveries();
      fetchPackages();
    }, 300000);

    // nettoyage quand le composant est démonté
    return () => clearInterval(interval);
  }, [token]); // dépendances vides → uniquement au montage

        const fetchPackages = async () => {
    try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://84.247.135.231:8080/api/delivery/package/alltome', {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("first")
      console.log(JSON.stringify(data,2,null))
      //alert(JSON.stringify(data,2,null))
      setPackages(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des livraisons: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

          const fetchExternalTransitPackages = async () => {
    try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://84.247.135.231:8080/api/delivery/delivery/going-external', {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("first")
      console.log(JSON.stringify(data,2,null))
      setPackagesExt(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des livraisons: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

   // Open modal for a specific delivery
   const handleOpenModalDelivery = (id) => {
    setCurrentDeliveryId(id);
    setShowModal(true);
  };

  // Close modal without making any changes
  const handleCloseModalDelivery = () => {
    setShowModal(false);
    setCurrentDeliveryId(null);
  };

    const getDriver = (delivery) => {
    // Mock driver data - replace with actual API call
    return 'KAMDEM';
  };

   // Handle confirmation of delivery state change
   const handleConfirmArrival = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
        try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }
      //alert(currentDeliveryId)
      const response = await authFetch('http://84.247.135.231:8080/api/delivery/reception/'+currentDeliveryId, {
        method: 'POST',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data)

      alert("Succès");
      fetchDeliveries();
      fetchPackages();
      navigate("/reception"); // Retour en arrière

    } catch (err) {
      console.error('Error setting arrived:', err);
      setError('Erreur lors du marquage comme arrivé: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
    finally{
    setLoading(false);
    setShowModal(false);
    setCurrentDeliveryId(null);
    }
  };

    // Pagination calculations
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentDeliveries = deliveries
  .filter((item) => {
    const result = search.toLowerCase() === ""
      ? item
      : item.arrivalAgency.toLowerCase().includes(search);
    return result;
  })
  .slice(indexOfFirstRow, indexOfLastRow);

console.log("After filter:", deliveries.length);
console.log("After slice:", currentDeliveries.length);
console.log("Current deliveries IDs:", currentDeliveries.map(d => d.numSerie));
  
    // Handle page change
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

  const handleOpenModal = (itemR) => {
    //alert(itemR);
    setSelectedItem(itemR); 
    setOpenModal(true); 
  };

  const handleConfirmWithdrawn = async (e) => {
        e.preventDefault();
    setLoading(true); // start loading
        try {
      
      if (!token || !selectedItem) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }
      //alert(selectedItem);
      const response = await authFetch('http://84.247.135.231:8080/api/delivery/retrait/'+selectedItem, {
        method: 'POST',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data)

      alert("Succès");
      fetchDeliveries();
      fetchPackages();
      navigate("/reception"); // Retour en arrière

    } catch (err) {
      console.error('Error setting arrived:', err);
      setError('Erreur lors du marquage comme arrivé: ' + err.message);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
    finally{
    setOpenModal(false);
    setLoading(false);
    setSelectedItem(null);
    }
  };

  
  const handleCloseModal = () => {
    setOpenModal(false); 
    setSelectedItem(null); 
  };

  
  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 d-flex justify-content-between align-items-center flex-row p-4">
          <h5 className="mb-0">Reception</h5>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
            <StyledBreadcrumb
              className="styledbreadcrumbs"
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb
              className="styledbreadcrumbs"
              label="Reception"
              href="#"
              deleteIcon={<ExpandMoreIcon />}
            />
          </Breadcrumbs>
        </div>



        <div class="container">
          <div class="row">

            <div className="col-lg-12">
              <div className="card z-depth-3">
                <div className="card-body">
                  <ul className="nav nav-pills nav-pills-primary nav-justified">
                   <li className="nav-item d-flex">
  {/* Livraisons en Cours */}
  <Button
    onClick={() => setActiveTab('livraison')}
    style={{
      backgroundColor: activeTab === 'livraison' ? '#20948B' : 'transparent',
      color: activeTab === 'livraison' ? 'white' : 'black',
    }}
    className={`nav-link ${activeTab === 'livraison' ? 'active show' : ''}`}
  >
    <i className="icon-user"></i> <span className="hidden-xs">Livraisons en Cours</span>
  </Button>

  {/* Retrait colis */}
  <Button
    onClick={() => setActiveTab('retrait')}
    style={{
      backgroundColor: activeTab === 'retrait' ? '#20948B' : 'transparent',
      color: activeTab === 'retrait' ? 'white' : 'black',
    }}
    className={`nav-link ${activeTab === 'retrait' ? 'active show' : ''}`}
  >
    <i className="icon-envelope-open"></i> <span className="hidden-xs">Retrait colis</span>
  </Button>

  {/* Colis Externes */}
  <Button
    onClick={() => setActiveTab('externe')}
    style={{
      backgroundColor: activeTab === 'externe' ? '#20948B' : 'transparent',
      color: activeTab === 'externe' ? 'white' : 'black',
    }}
    className={`nav-link ${activeTab === 'externe' ? 'active show' : ''}`}
  >
    <i className="icon-globe"></i> <span className="hidden-xs">Colis Externes</span>
  </Button>
</li>

                </ul>

                  <div className="tab-content p-3">
                    {activeTab === 'livraison' && (
                      <div className="tab-pane active show" id="livraison">
                        <div className="card shadow border-0 p-3 mt-4">
                          <div className="d-flex align-items-center justify-content-between">
                            <h3 className="hd">Table des Livraisons</h3>

                            <div className="searchBox position-relative d-flex align-items-center">
                              <IoSearch className="mr-2" />
                              <input
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Rechercher ici..."
                                className="text-black"
                              />
                            </div>
                          </div>

                          {/*responsive table livraison*/}

                          <div className="table-responsive mt-4">
        <table className="table table-bordered v-align">
          <thead className="thead-dark">
            <tr>
              <th>UID Livraison</th>
              <th>Destination</th>
              <th>Source</th>
              <th>Matricule Bus</th>
              <th>Chauffeur Bus</th>
              <th>Date Départ</th>
              <th>Actions/Statut</th>
            </tr>
          </thead>

          <tbody>
            {currentDeliveries.map((item) => (
              <tr key={item.labelLivraison}>
                <td>{item.labelLivraison}</td>
                <td>{item.arrivalAgency}</td>
                <td>{item.departureAgency}</td>
                <td>{item.bus}</td>
                <td>{item.driver}</td>
                <td>{formatDate(item.Depart)}</td>


                <td className="actionsBtn justify-content-center">
                  <Button
                    color="success"
                    className="btn-gray"
                    onClick={() => handleOpenModalDelivery(item.labelLivraison)}
                    disabled={item.status === "Arrivée"} // Disable action if already "Arrivé"
                  >
                    {item.status === "Arrivée" ? "Déjà arrivée" : "Validez l'arrivée"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex tableFooter">
          <p>
            Showing <b>{currentDeliveries.length}</b> of <b>{deliveries.length}</b>{" "}
            results
          </p>
          <Pagination
            count={Math.ceil(deliveries.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="success"
            className="pagination"
            showFirstButton
            showLastButton
          />
        </div>
      </div>

      {/* Modal for Confirming Arrival */}
      <Modal show={showModal} onHide={handleCloseModalDelivery}>
        <Modal.Header closeButton>
        <Modal.Title>Confirmer l'arrivée</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          Êtes-vous sûr de vouloir marquer cette livraison comme "Arrivé"?
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" onClick={handleCloseModalDelivery}>
            Annuler
          </Button>
    <Button variant="success" onClick={handleConfirmArrival} disabled={loading}>
      {loading ? "Traitement..." : "Confirmer"}
    </Button>
        </Modal.Footer>
      </Modal>
      
                        </div>
                      </div>
                    )}
                    {activeTab === 'retrait' && (
                      <div className="tab-pane active show" id="retrait">
                        <div className="card shadow border-0 p-3 mt-4">
                          <div className="d-flex align-items-center justify-content-between">
                            <h3 className="hd">Retrait des colis</h3>

                            <div className="searchBox position-relative d-flex align-items-center">
                              <IoSearch className="mr-2" />
                              <input
                                onChange={(e) => setSearchR(e.target.value)}
                                type="text"
                                placeholder="Rechercher ici..."
                                className="text-black"
                              />
                            </div>
                          </div>

                          {/*responsive table retait des colis*/}
                          <div className="table-responsive mt-4">
                            <table className="table table-bordered v-align">
                              <thead className="thead-dark">
                                <tr>
                                  <th>ID COLIS</th>
                                  <th>ID LIVRAISON</th>
                                  <th>VILLE DEPART</th>
                                  <th>VILLE DESTINATRICE</th>
                                  <th>EXPEDITEUR</th>
                                  <th>DESTINATAIRE</th>
                                  <th>STATUT</th>
                                  <th>ACTIONS</th>
                                </tr>
                              </thead>

                              <tbody>
                                {packages
                                  .filter((itemR) => {
                                    return searchR.toLowerCase() === ""
                                      ? itemR
                                      : itemR.numSerie.toLowerCase().includes(searchR);
                                  })
.map((itemR) => (
  <tr key={itemR.numSerie}>
    <td>{itemR.numSerie}</td>
    <td>{itemR.labelLivrasion.labelLivraison}</td>
    <td>{itemR.source}</td>
    <td>{itemR.destination}</td>
    <td>{itemR.exp_name}</td>
    <td>{itemR.dest_name}</td>
    <td className="actionsBtn justify-content-center">
      <Button
        color="success"
        className={itemR.status === "Retiré" ? "btn-error" : "btn-green"}
      >
        {itemR.status}
      </Button>
    </td>
    <td className="actionsBtn justify-content-center">
      <Button
        onClick={() => handleOpenModal(itemR.numSerie)}
        color="success"
        disabled={itemR.status === "Retiré"} // Disabled if already withdrawn
        className={itemR.status === "Retiré" ? "btn-error" : "btn-green"}
      >
        {itemR.status === "Retiré" ? "Déjà retiré" : "Retirer"}
      </Button>
    </td>
  </tr>
))
}
                              </tbody>
                            </table>
                            <div className="d-flex tableFooter">
                              <p>
                                Showing <b>5 </b> of <b>20 </b> results
                              </p>
                              <Pagination
                                count={20}
                                color="success"
                                className="pagination"
                                showFirstButton
                                showLastButton
                              />
                            </div>
                          </div>

                          <Dialog
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="withdrawal-confirmation-title"
                            aria-describedby="withdrawal-confirmation-description"
                          >
                            <DialogTitle id="withdrawal-confirmation-title">
                              {"Confirmer le Retrait du Colis"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="withdrawal-confirmation-description">
                                Êtes-vous sûr de vouloir retirer ce colis ? Cette action est irréversible.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseModal} color="error">
                                Annuler
                              </Button>
<Button 
  onClick={handleConfirmWithdrawn} 
  color="success" 
  autoFocus 
  disabled={loading} // prevent multiple clicks
>
  {loading ? "Traitement..." : "Confirmer"}
</Button>

                            </DialogActions>
                          </Dialog>
                        </div>
                      </div>
                    )}
                     {activeTab === 'externe' && (
                      <div className="tab-pane active show" id="retrait">
                        <div className="card shadow border-0 p-3 mt-4">
                          <div className="d-flex align-items-center justify-content-between">
                            <h3 className="hd">Colis Externes</h3>

                           {/*  <div className="searchBox position-relative d-flex align-items-center">
                              <IoSearch className="mr-2" />
                              <input
                                onChange={(e) => setSearchR(e.target.value)}
                                type="text"
                                placeholder="Rechercher ici..."
                                className="text-black"
                              />
                            </div> */}
                          </div>

                          {/*responsive table retait des colis*/}
                          <div className="table-responsive mt-4">
                            <table className="table table-bordered v-align">
                              <thead className="thead-dark">
                                <tr>
                                  <th>ID COLIS</th>
                                  <th>DESCRIPTION</th>
                                  <th>DESTINATION</th>
                                 
                                </tr>
                              </thead>

                              <tbody>
                                {packagesExt
                                  .filter((itemR) => {
                                    return searchR.toLowerCase() === ""
                                      ? itemR
                                      : itemR.numSerie.toLowerCase().includes(searchR);
                                  })
                                  .map((itemR) => (
                                    <tr key={itemR.numSerie}>
                                    
                                      <td>{itemR.destination}</td>
                                      <td>{itemR.description}</td>
                                     
                                      <td className="actionsBtn justify-content-center">
                                       {itemR.noteExternalTransit}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                            <div className="d-flex tableFooter">
                              <p>
                                Showing <b>5 </b> of <b>20 </b> results
                              </p>
                              <Pagination
                                count={20}
                                color="success"
                                className="pagination"
                                showFirstButton
                                showLastButton
                              />
                            </div>
                          </div>

                          <Dialog
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="withdrawal-confirmation-title"
                            aria-describedby="withdrawal-confirmation-description"
                          >
                            <DialogTitle id="withdrawal-confirmation-title">
                              {"Confirmer le Retrait du Colis"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="withdrawal-confirmation-description">
                                Êtes-vous sûr de vouloir retirer ce colis ? Cette action est irréversible.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseModal} color="error">
                                Annuler
                              </Button>
                              <Button onClick={handleConfirmWithdrawn} color="success" autoFocus>
                                Confirmer
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
};

export default Reception;