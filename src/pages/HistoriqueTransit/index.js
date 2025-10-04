import React, { useState, useEffect } from 'react'
import { FaEye, FaPlus } from "react-icons/fa";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import { Modal, Form } from 'react-bootstrap';
import styled from 'styled-components'
import { Chip } from '@mui/material'
import { Link } from "react-router-dom"
import { AirportShuttle, LocalShipping } from '@mui/icons-material'
import Button from '@mui/material/Button';
import Pagination from "@mui/material/Pagination";
import { MdSend } from 'react-icons/md';
import { useAuth } from '../../Context/AuthContext';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    height: '20px',
    color: 'text-primary'
  }
});


const HistoriqueTransit = () => {
  const [activeTab, setActiveTab] = useState('transfere');
  const [selectedColis, setSelectedColis] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [colisNormaux, setColisNormaux] = useState([]);

  const [destSearchTerm, setDestSearchTerm] = useState('');
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [newTransit, setNewTransit] = useState({
    packageId: '',
    toDelivery: '',
    notes: '',
    isExternal: false,
    selectedAgency: ''
  });

  const [colisTransferes, setColisTransferes] = useState([]);
  const [normalTransits, setNormalTransits] = useState([]);
  const [transits, setTransits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 4;
  const { authFetch, token, logout } = useAuth();

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
          alert(name);
          return name;
        });
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid API response format');
      }

      //console.log('Extracted agencies:', drivers);
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

  const fetchPackagesNormaux = async () => {
    try {

      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/handover/history/packages/from-me', {
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
      console.log(JSON.stringify(data, 2, null))
      setColisNormaux(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des paquets: ' + err.message);
      setLoading(false);

      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };


  const fetchDeliveries = async () => {
    try {

      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/delivery/available', {
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
      console.log(JSON.stringify(data, 2, null))
      setDeliveries(data);
      //alert(JSON.stringify(data,2,null));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des paquets: ' + err.message);
      setLoading(false);

      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

  const fetchHistoryForPackage = async (colisId) => {
    try {

      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/handover/history/from-me/onpackage/' + colisId, {
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
      setNormalTransits(data);
      //alert(normalTransits.length)
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des paquets: ' + err.message);
      setLoading(false);

      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };


  const handleCreateTransit = async () => {
    // Validation
    if (!newTransit.packageId || !newTransit.toDelivery) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (newTransit.isExternal && !newTransit.selectedAgency) {
      alert('Veuillez sélectionner une agence pour le transit externe');
      return;
    }


    setLoading(true); // Start loading

    try {
      let apiUrl;
      let requestBody;

      // Use different API endpoints based on transit type
      if (newTransit.isExternal) {
        apiUrl = `http://192.168.28.128:8080/api/delivery/handover/changePacketExternal`;
        requestBody = {
          packetId: newTransit.packageId,
          deliveryId: newTransit.toDelivery,
          arrivalAgency: newTransit.selectedAgency,
          note: newTransit.notes || "Transit externe"
        };
      } else {
        apiUrl = `http://192.168.28.128:8080/api/delivery/handover/changePacket/${newTransit.packageId}/${newTransit.toDelivery}`;
        requestBody = {
        };
      }

      // Single API call
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
        throw new Error(`Colis ${newTransit.packageId}: ${errorText || `HTTP ${response.status}`}`);
      }

      const message = newTransit.isExternal ?
        'Transit externe créé avec succès!' :
        'Transit interne créé avec succès!';

      alert(message);

      // Reset form and close modal
      setNewTransit({
        packageId: '',
        toDelivery: '',
        notes: '',
        isExternal: false,
        selectedAgency: ''
      });
      setDestSearchTerm('');
      setShowDestDropdown(false);
      setShowCreateModal(false);

      // Refresh data
      fetchPackagesNormaux();
      fetchPackagesTransferes();
      fetchHistoryForTransit();

    } catch (err) {
      // Handle auth errors
      if (err.message.includes('Token') || err.message.includes('Session')) {
        logout();
        return;
      }
      // Handle other errors
      alert(`Erreur: ${err.message}`);
    }
    finally {
      setLoading(false); // Start loading
    }
  };

  const fetchHistoryForTransit = async () => {
    try {

      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/handover/history/throughMe', {
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
      setTransits(data);
      //alert(transits.length)
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Erreur lors du chargement des paquets: ' + err.message);
      setLoading(false);

      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        // window.location.href = '/login';
      }
    }
  };

  const fetchPackagesTransferes = async () => {
    try {

      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://192.168.28.128:8080/api/delivery/handover/history/packages/throughMe', {
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
      console.log(JSON.stringify(data, 2, null))
      setColisTransferes(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Erreur lors du chargement des paquets: ' + err.message);
      setLoading(false);

      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        // window.location.href = '/login';
      }
    }
  };

  const getCurrentColis = () => {
    return activeTab === 'normal' ? colisNormaux : colisTransferes;
  };

  const getColisCount = (type) => {
    return type === 'normal' ? colisNormaux.length : colisTransferes.length;
  };

  const getTotalPages = () => {
    return Math.ceil(getCurrentColis().length / itemsPerPage);
  };

  const getPaginatedColis = () => {
    const allColis = getCurrentColis();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allColis.slice(startIndex, endIndex);
  };

  // Gestionnaires d'événements
  const handleColisClick = (colis) => {
    //alert(colis.numSerie);
    setSelectedColis(colis);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedColis(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedColis(null);
  };

  useEffect(() => {
    if (selectedColis?.numSerie) {
      if (activeTab === 'normal') {
        fetchHistoryForPackage(selectedColis.numSerie);
      } else {
        fetchHistoryForPackage(selectedColis.numSerie);
      }
    }
  }, [selectedColis?.numSerie, activeTab]);

  useEffect(() => {
    fetchPackagesTransferes();
    fetchHistoryForTransit();
    fetchPackagesNormaux();
    fetchArrivalAgencies();
    fetchDeliveries();
  }, []);

  // Styles
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '10px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 40px 0'
    },
    tabContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '40px',
      width: '100%',
      padding: '0 20px'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '20px 24px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      justifyContent: 'center',
      width: '100%'
    },
    tabInactive: {
      backgroundColor: '#ffffff',
      color: '#64748b',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    tabActive: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      gap: '32px',
      alignItems: 'start',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    leftPanel: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    rightPanel: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      minHeight: '500px'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '24px'
    },
    colisCard: {
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff'
    },
    colisCardSelected: {
      borderColor: '#2563eb',
      backgroundColor: '#f8fafc'
    },
    colisCardHover: {
      borderColor: '#cbd5e1',
      backgroundColor: '#f1f5f9'
    },
    colisHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    colisId: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: '#2563eb',
      color: '#ffffff'
    },
    colisInfo: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.5',
      marginBottom: '8px'
    },
    colisDetails: {
      fontSize: '13px',
      color: '#94a3b8'
    },
    viewDetailsLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#2563eb',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none',
      marginTop: '12px',
      cursor: 'pointer'
    },
    detailsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    detailsTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 20px 0',
      paddingBottom: '12px',
      borderBottom: '1px solid #e2e8f0'
    },
    detailCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#ffffff'
    },
    detailCardGray: {
      backgroundColor: '#f8fafc'
    },
    detailField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    detailLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b'
    },
    detailValue: {
      fontSize: '16px',
      color: '#1e293b',
      fontWeight: '400',
      marginTop: '4px'
    },
    noSelection: {
      textAlign: 'center',
      color: '#64748b',
      fontSize: '16px',
      marginTop: '100px'
    },
    icon: {
      width: '16px',
      height: '16px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      marginTop: '20px',
      padding: '16px 0'
    },
    paginationButton: {
      padding: '10px 16px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      color: '#64748b',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      minWidth: '44px'
    },
    paginationButtonActive: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderColor: '#2563eb'
    },
    paginationButtonHover: {
      backgroundColor: '#f1f5f9',
      borderColor: '#cbd5e1'
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 16px',
      fontWeight: '500',
      backgroundColor: '#f1f5f9',
      padding: '8px 12px',
      borderRadius: '6px'
    }
  };

  // Composants d'icônes
  const UserIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const LocationIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  const TruckIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 002 0V7h2.5A1.5 1.5 0 018 8.5V13h8a1 1 0 002-2V8a1 1 0 00-1-1V5a1 1 0 00-1-1H3zM14 5v4a1.5 1.5 0 01-1.5 1.5h-2A1.5 1.5 0 019 9V5h5z" />
    </svg>
  );

  const PackageIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
  );

  const WeightIcon = () => (
    <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className='right-content w-100'>

      <div className='card shadow border-0 w-100 d-flex flex-row p-4 justify-content-between align-items-center'>
        <div className='d-flex align-items-center'>
          <h5 className='mb-0 me-3'>Transit</h5>
        </div>
        <Button
          variant="contained"
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary d-flex align-items-center"
          style={{
            backgroundColor: '#2563eb',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px'
          }}
        >
          <FaPlus className="me-2" />
          Créer Transit
        </Button>
      </div>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Gestionnaire de Colis</h1>
          <p style={styles.subtitle}>Gérez vos colis et transferts en temps réel</p>
        </div>

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'normal' ? styles.tabActive : styles.tabInactive)
            }}
            onClick={() => handleTabChange('normal')}
          >
            <PackageIcon />
            Colis émis({getColisCount('normal')})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'transfere' ? styles.tabActive : styles.tabInactive)
            }}
            onClick={() => handleTabChange('transfere')}
          >
            <TruckIcon />
            Colis Transférés ({getColisCount('transfere')})
          </button>
        </div>

        <div  style={styles.mainContent}>
          <div style={styles.leftPanel}>
            <h2 style={styles.sectionTitle}>
              <TruckIcon />
              {activeTab === 'normal' ? 'Colis' : 'Colis Transférés'}
            </h2>

            {activeTab === 'normal' ? (
              getPaginatedColis().map((colis) => (  // ← Remove the extra curly braces
                <div
                  key={colis.numSerie}
                  style={{
                    ...styles.colisCard,
                    ...(selectedColis?.numSerie === colis.numSerie ? styles.colisCardSelected : {})
                  }}
                  onClick={() => handleColisClick(colis)}
                  onMouseEnter={(e) => {
                    if (selectedColis?.numSerie !== colis.numSerie) {
                      Object.assign(e.currentTarget.style, styles.colisCardHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedColis?.numSerie !== colis.numSerie) {
                      Object.assign(e.currentTarget.style, styles.colisCard);
                    }
                  }}
                >
                  <div style={styles.colisHeader}>
                    <div style={styles.colisId}>{colis.numSerie}</div>
                    <div style={styles.statusBadge}>
                      {activeTab === 'normal' ? 'Actif' : 'Transféré'}
                    </div>
                  </div>
                  <div style={styles.colisInfo}>
                    {colis.expediteur} → {colis.destinataire}
                  </div>
                  <div style={styles.colisDetails}>
                    {colis.poids} • {colis.type}
                  </div>
                  <div style={styles.viewDetailsLink}>
                    Voir détails
                    <svg style={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              "Historique des paquets transférés"  // ← Should be a string or proper JSX
            )}

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                  }}
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>

                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    style={{
                      ...styles.paginationButton,
                      ...(currentPage === page ? styles.paginationButtonActive : {})
                    }}
                    onClick={() => handlePageChange(page)}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        Object.assign(e.target.style, styles.paginationButtonHover);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        Object.assign(e.target.style, styles.paginationButton);
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === getTotalPages() ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                  }}
                  onClick={() => currentPage < getTotalPages() && handlePageChange(currentPage + 1)}
                  disabled={currentPage === getTotalPages()}
                >
                  Suivant
                </button>

                <div style={styles.paginationInfo}>
                  Page {currentPage} sur {getTotalPages()}
                </div>
              </div>
            )}
          </div>

          <div style={styles.rightPanel}>
            {selectedColis ? (
              <div className=''>
                <h2 style={styles.detailsTitle}>
                  Historique du Colis {selectedColis.numSerie}
                </h2>

                <div className=''>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID Colis</th>
                        <th>Livraison source</th>
                        <th>Entreprise source</th>
                        <th>Livraison destination</th>
                        <th>Entreprise destination</th>
                        <th>Lieu</th>
                        <th>Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === 'normal' ? (
                        // Dynamic normal transits from API
                        normalTransits.length > 0 ? (
                          normalTransits.map((transit, index) => (
                            <tr key={index}>
                              <td>{selectedColis.numSerie}</td>
                              <td>{transit.srcDelivery}</td>
                              <td>{transit.srcEnterprise}</td>
                              <td>{transit.destDelivery}</td>
                              <td>{transit.destEnterprise}</td>
                              <td>{transit.transitPlace}</td>
                              <td>{formatDate(transit.time)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              Aucun transit trouvé
                            </td>
                          </tr>
                        )
                      ) : (
                        // Dynamic transfer data from API

                        normalTransits ? (
                          <tr>
                            <td>{selectedColis.numSerie}</td>
                            <td>{selectedColis.adresseDepart}</td>
                            <td>{selectedColis.adresseArrivee}</td>
                            <td>{normalTransits.status || 'Transfert terminé'}</td>
                            <td>{normalTransits.completedAt || normalTransits.dateTransfert}</td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              Aucune donnée de transfert trouvée
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              activeTab === 'normal' ? (
                <div style={styles.noSelection}>
                  Sélectionnez un colis pour voir son historique
                </div>
              ) : (
                <div>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID Colis</th>
                        <th>Livraison source</th>
                        <th>Entreprise source</th>
                        <th>Livraison destination</th>
                        <th>Entreprise destination</th>
                        <th>Lieu</th>
                        <th>Heure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transits.length > 0 ? (
                        transits.map((transit, index) => (
                          <tr key={index}>
                            <td>{transit.packet}</td>
                            <td>{transit.srcDelivery}</td>
                            <td>{transit.srcEnterprise}</td>
                            <td>{transit.destDelivery}</td>
                            <td>{transit.destEnterprise}</td>
                            <td>{transit.transitPlace}</td>
                            <td>{formatDate(transit.time)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            Aucun transit trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>

        </div>
      </div>
      {/* Create Transit Modal */}
      {/* Create Transit Modal */}
      {/* Create Transit Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex align-items-center">
              <MdSend className="me-2" style={{ color: '#2563eb' }} />
              Créer un Nouveau Transit
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>ID du Paquet <span style={{ color: 'red' }}>*</span></strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: PKG-001"
                    value={newTransit.packageId}
                    onChange={(e) => setNewTransit({ ...newTransit, packageId: e.target.value })}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Type de Transit</strong>
                  </Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      id="internal-transit"
                      name="transitType"
                      label="Transit Interne"
                      checked={!newTransit.isExternal}
                      onChange={() => setNewTransit({ ...newTransit, isExternal: false, selectedAgency: '' })}
                    />
                    <Form.Check
                      type="radio"
                      id="external-transit"
                      name="transitType"
                      label="Transit Externe"
                      checked={newTransit.isExternal}
                      onChange={() => setNewTransit({ ...newTransit, isExternal: true })}
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            {/* Agency Selection - Only show if external transit */}
            {newTransit.isExternal && (
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Agence <span style={{ color: 'red' }}>*</span></strong>
                    </Form.Label>
                    <Form.Select
                      value={newTransit.selectedAgency}
                      onChange={(e) => setNewTransit({ ...newTransit, selectedAgency: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner une agence</option>
                      {agencies.map((agency) => (
                        <option key={agency} value={agency}>
                          {agency}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            )}

            <div className="row">

              <div className="col-md-6">
                <Form.Group className="mb-3" style={{ position: 'relative' }}>
                  <Form.Label>
                    <strong>Livraison Destination <span style={{ color: 'red' }}>*</span></strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tapez pour rechercher la livraison destination..."
                    value={destSearchTerm}
                    onChange={(e) => {
                      setDestSearchTerm(e.target.value);
                      setShowDestDropdown(true);
                    }}
                    onFocus={() => setShowDestDropdown(true)}
                    required
                  />
                  {showDestDropdown && destSearchTerm && (
                    <div style={{
                      border: '1px solid #ccc',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      position: 'absolute',
                      zIndex: 1000,
                      width: '100%',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {deliveries
                        .filter(delivery =>
                        (delivery.labelLivraison?.toLowerCase().includes(destSearchTerm.toLowerCase()) ||
                          delivery.address?.toLowerCase().includes(destSearchTerm.toLowerCase()))
                        )
                        .map((delivery) => (
                          <div
                            key={delivery.labelLivraison}
                            onClick={() => {
                              setNewTransit({ ...newTransit, toDelivery: delivery.labelLivraison });
                              setDestSearchTerm(delivery.labelLivraison);
                              setShowDestDropdown(false);
                            }}
                            style={{
                              padding: '10px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          >
                            {delivery.labelLivraison}
                          </div>
                        ))}
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Notes (Optionnel)</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ajouter des notes sur ce transit..."
                value={newTransit.notes}
                onChange={(e) => setNewTransit({ ...newTransit, notes: e.target.value })}
              />
            </Form.Group>

            {/* Transit Summary */}
            {newTransit.toDelivery && (
              <div className="alert alert-info">
                <h6><strong>Résumé du Transit:</strong></h6>
                <p className="mb-1">
                  <strong>Type:</strong> {newTransit.isExternal ? 'Transit Externe' : 'Transit Interne'}
                </p>
                {newTransit.isExternal && newTransit.selectedAgency && (
                  <p className="mb-1">
                    <strong>Agence:</strong> {agencies.find(a => a.id === newTransit.selectedAgency)?.name || 'Non sélectionnée'}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Paquet:</strong> {newTransit.packageId || 'Non spécifié'}
                </p>
                <p className="mb-0">
                  <strong>Vers:</strong> {deliveries.find(d => d.labelLivraison === newTransit.toDelivery)?.labelLivraison || 'Non sélectionné'}
                </p>
              </div>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateModal(false);
              setNewTransit({
                packageId: '',
                toDelivery: '',
                notes: '',
                isExternal: false,
                selectedAgency: ''
              });
              setDestSearchTerm('');
              setShowDestDropdown(false);
            }}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateTransit}
            disabled={
              !newTransit.packageId ||
              !newTransit.toDelivery ||
              (newTransit.isExternal && !newTransit.selectedAgency) ||
              loading // Disable during loading
            }
            style={{
              backgroundColor: '#2563eb',
              border: 'none'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Traitement...
              </>
            ) : (
              <>
                <MdSend className="me-2" />
                Créer le Transit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HistoriqueTransit;