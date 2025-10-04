import DashboardBox from "./components/dashboardBox";
import Transitdeliveries from "./components/transitdeliveries";
import Unremovedpack from "./components/unremovedpack";
import { IoMdCart } from "react-icons/io";
import Pagination from "@mui/material/Pagination";
import React, { useEffect, useState, useContext } from 'react'
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { useAuth } from '../../Context/AuthContext';
import { MyContext } from '../../App';

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const context = useContext(MyContext);
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

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/delivery/alltome', {
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
      //alert("error : "+err.message);
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

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/package/alltome', {
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

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/delivery/going-external', {
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


    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
    });

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
      const response = await authFetch('http://192.168.28.128:8080/api/delivery/retrait/'+selectedItem, {
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
      navigate("/"); // Retour en arrière

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
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-12 col-sm-12">
<div className="dashboardBoxWrapper" style={{ gap: "10px", display: "flex", width: "100%" }}>
   <div
    style={{
      flex: 1,
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      padding: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      minHeight: "200px",
      textAlign: "center"
    }}
  >
    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1e5dd0", marginBottom: "10px" }}>
      Bienvenue
    </h1>
    <p style={{ fontSize: "16px", color: "#555" }}>
      Suivez vos livraisons en temps réel et restez informé.
    </p>
  </div>

</div>


                    </div>
                </div>

               <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Tableau des Colis</h3>

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
                </div>
            </div>
        </>
    );
};

export default Dashboard;
