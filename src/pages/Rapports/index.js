import React, { useState, useEffect} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import styled from 'styled-components'
import { Chip } from '@mui/material'
import { FileDown, Printer, Calendar } from 'lucide-react'
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    height: '20px',
    color: 'text-primary'
  }
});

const Rapports = () => {
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: '2025-09-10'
  });

  // --- Pagination states ---
  const [typePage, setTypePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [txnPage, setTxnPage] = useState(1);
  const { authFetch, token, logout } = useAuth();
    // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('emis');
  
  const [stats, setStats] = useState([]);
  // États pour les données de chaque onglet
  const [emisStatsArray, setEmisStatsArray] = useState([]);
  const [recusStatsArray, setRecusStatsArray] = useState([]);
  const [transitesStatsArray, setTransitesStatsArray] = useState([]);
  
  // États pour la pagination de chaque onglet
  const [emisPage, setEmisPage] = useState(1);
  const [recusPage, setRecusPage] = useState(1);
  const [transitesPage, setTransitesPage] = useState(1);
  
  const rowsPerPage = 5;

  // --- Données simulées ---
  const company = {
    id: 'ENT001',
    name: 'Totaux',
    sector: 'Distribution postale',
    status: 'Actif',
    transactions: [
      { id: 'TXN001', date: '09/01/2025', type: 'Lettre recommandée', weight: 0.02, destination: 'Yaoundé', price: 2500, status: "Validé" },
      { id: 'TXN002', date: '09/01/2025', type: 'Colis standard', weight: 2.5, destination: 'Douala', price: 8000, status: "Validé" },
      { id: 'TXN003', date: '08/01/2025', type: 'Lettre prioritaire', weight: 0.1, destination: 'Bafoussam', price: 1500, status: "Rebut" },
      { id: 'TXN004', date: '07/01/2025', type: 'Colis express', weight: 5.2, destination: 'Garoua', price: 12000, status: "Validé" },
      { id: 'TXN005', date: '06/01/2025', type: 'Colis standard', weight: 3.1, destination: 'Bertoua', price: 9500, status: "Validé" },
      { id: 'TXN006', date: '05/01/2025', type: 'Lettre recommandée', weight: 0.03, destination: 'Ngaoundéré', price: 3000, status: "Validé" },
      { id: 'TXN007', date: '04/01/2025', type: 'Colis express', weight: 1.8, destination: 'Kribi', price: 6000, status: "Rebut" }
    ]
  };

  // --- Fonctions export ---
  const handlePrint = async (type) => {

                setLoading(true);
            try {

                    const startFormatted = new Date(dateRange.start).toISOString().split('T')[0];
    const endFormatted = new Date(dateRange.end).toISOString().split('T')[0];
    // Create URL with query parameters
    const params = new URLSearchParams({
      start: startFormatted,  // '2025-01-01' format
      end: endFormatted      // '2025-09-10' format
    });

            const apiUrl = `http://84.247.135.231:8080/api/delivery/stats/${type}/pdf?${params}`;
            console.log('API URL:', apiUrl);

            const response = await authFetch(apiUrl);

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

alert("Printing done !");
navigate("/rapports")

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
            window.location.href = '/rapports';
        }
  };

  const handleExportExcel = () => {
    alert("Export Excel en cours (à connecter avec SheetJS ou backend)...");
  };

  const handleExportPDF = async (type) => {
                setLoading(true);
            try {

                    const startFormatted = new Date(dateRange.start).toISOString().split('T')[0];
    const endFormatted = new Date(dateRange.end).toISOString().split('T')[0];
    // Create URL with query parameters
    const params = new URLSearchParams({
      start: startFormatted,  // '2025-01-01' format
      end: endFormatted      // '2025-09-10' format
    });

            const apiUrl = `http://84.247.135.231:8080/api/delivery/stats/${type}/pdf?${params}`;
            console.log('API URL:', apiUrl);

            const response = await authFetch(apiUrl);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

    // Récupère le PDF en blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `rapports.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    alert("Printing done !");
    navigate("/rapports")

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
            window.location.href = '/rapports';
        }  };

    // Fonction de pagination réutilisable
  const paginate = (array, page) => {
    const startIndex = (page - 1) * rowsPerPage;
    return array.slice(startIndex, startIndex + rowsPerPage);
  };

  // Fonction pour récupérer les données selon l'onglet
const fetchStatsData = async (type) => {
  try {
        // Convertir les dates en format ISO string (YYYY-MM-DD)
    const startFormatted = new Date(dateRange.start).toISOString().split('T')[0];
    const endFormatted = new Date(dateRange.end).toISOString().split('T')[0];
    // Create URL with query parameters
    const params = new URLSearchParams({
      start: startFormatted,  // '2025-01-01' format
      end: endFormatted      // '2025-09-10' format
    });

      if (!token) {
        navigate("/login"); // Retour en arrière
    throw new Error('Authentication token is missing. Please log in.');
  }
    
    const response = await authFetch(`http://84.247.135.231:8080/api/delivery/stats/${type}?${params}`);
    const data = await response.json();
      
      switch(type) {
        case 'emis':
          setEmisStatsArray(data);
          break;
        case 'recus':
          setRecusStatsArray(data);
          break;
        case 'transites':
          setTransitesStatsArray(data);
          break;
      }
    } catch (error) {
      alert(`Erreur lors du chargement des données ${type}:`, error);
            if (error.message.includes('Token') || error.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

  const fetchStatsGlobal = async () => {
  try {
        // Convertir les dates en format ISO string (YYYY-MM-DD)
    const startFormatted = new Date(dateRange.start).toISOString().split('T')[0];
    const endFormatted = new Date(dateRange.end).toISOString().split('T')[0];
    // Create URL with query parameters
    const params = new URLSearchParams({
      start: startFormatted,  // '2025-01-01' format
      end: endFormatted      // '2025-09-10' format
    });

      if (!token) {
        navigate("/login"); // Retour en arrière
    throw new Error('Authentication token is missing. Please log in.');
  }
    
    const response = await authFetch(`http://84.247.135.231:8080/api/delivery/stats/summary?${params}`);
    const data = await response.json();
    setStats(data);
    } catch (error) {
      alert(`Erreur lors du chargement des données`, error);
            if (error.message.includes('Token') || error.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

  // Charger les données au changement d'onglet
  useEffect(() => {
    fetchStatsData(activeTab);
  }, [activeTab, dateRange]);

  useEffect(() => {
    fetchStatsGlobal();
  }, [dateRange]);

  // Fonction pour obtenir les données et la page courantes
  const getCurrentData = () => {
    switch(activeTab) {
      case 'emis':
        return { data: emisStatsArray, page: emisPage, setPage: setEmisPage };
      case 'recus':
        return { data: recusStatsArray, page: recusPage, setPage: setRecusPage };
      case 'transites':
        return { data: transitesStatsArray, page: transitesPage, setPage: setTransitesPage };
      default:
        return { data: [], page: 1, setPage: () => {} };
    }
  };

  const { data: currentData, page: currentPage, setPage: setCurrentPage } = getCurrentData();

  // Styles pour les onglets
  const tabStyles = {
    active: "nav-link active bg-primary text-white",
    inactive: "nav-link text-primary border-primary"
  };

  return (
    <div className='right-content w-100'>
      {/* Breadcrumb */}
      <div className='card shadow border-0 w-100 d-flex flex-row p-4 mb-4 justify-content-between align-items-center'>
        <h5 className='mb-0'>{company.name}</h5>
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
            label="Rapports"
            deleteIcon={<ExpandMoreIcon />}
          />
        </Breadcrumbs>
      </div>

      {/* Cards Statistiques */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow p-3">
            <h6>Transactions</h6>
            <h4>{stats.totalTransactions}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark shadow p-3">
            <h6>Poids total</h6>
            <h4>{stats.weightTotal} g</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow p-3">
            <h6>Revenus totaux</h6>
            <h4>{stats.priceTotal} FCFA</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white shadow p-3">
            <h6>Rebuts</h6>
            <h4>{stats.rebutTotal}</h4>
          </div>
        </div>
      </div>

      {/* Période */}
      <div className="card shadow border-0 w-100 p-4 mb-4">
        <div className="d-flex align-items-center gap-4 mb-0">
          <div className="d-flex align-items-center gap-2">
            <Calendar size={20} className="text-primary" />
            <span className="fw-semibold">Période d'analyse</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="form-control form-control-sm"
              style={{ width: 'auto' }}
            />
            <span>à</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="form-control form-control-sm"
              style={{ width: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* Boutons Export */}
      <div className="mb-3 d-flex gap-2">

    <button
      className="btn btn-outline-primary d-flex align-items-center gap-2"
  onClick={() => handlePrint(activeTab)}
      disabled={loading} // disable while printing
    >
      <Printer size={18} />
      {loading ? "Impression..." : "Imprimer"}
    </button>

        <button className="btn btn-outline-success d-flex align-items-center gap-2" onClick={handleExportExcel}>
          <FileDown size={18} /> Export Excel
        </button>

    <button
      className="btn btn-outline-primary d-flex align-items-center gap-2"
  onClick={() => handleExportPDF(activeTab)}
      disabled={loading} // disable while printing
    >
      <FileDown size={18} />
      {loading ? "Export en cours..." : "Export PDF"}
    </button>

      </div>

      {/* Analyse par type de colis */}
<div className="card shadow border-0 w-100 p-4 mb-4">
      {/* Navigation par onglets */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Analyse par type de colis</h4>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button
              className={activeTab === 'emis' ? tabStyles.active : tabStyles.inactive}
              onClick={() => setActiveTab('emis')}
            >
              <i className="bi bi-send me-2"></i>
              Émis
            </button>
          </li>
          <li className="nav-item">
            <button
              className={activeTab === 'recus' ? tabStyles.active : tabStyles.inactive}
              onClick={() => setActiveTab('recus')}
            >
              <i className="bi bi-inbox me-2"></i>
              Reçus
            </button>
          </li>
          <li className="nav-item">
            <button
              className={activeTab === 'transites' ? tabStyles.active : tabStyles.inactive}
              onClick={() => setActiveTab('transites')}
            >
              <i className="bi bi-arrow-left-right me-2"></i>
              Transités
            </button>
          </li>
        </ul>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Type de colis</th>
              <th>Nombre</th>
              <th>Volume (g)</th>
              <th>Prix moyen</th>
              <th>Revenus total</th>
            </tr>
          </thead>
<tbody>
  {paginate(currentData, currentPage).map((data, index) => (
    <tr key={`${activeTab}-${index}`}>
      <td>{data.type}</td>
      <td>{parseInt(data.count)}</td>
      <td>{parseFloat(data.totalweight).toFixed(1)} kg</td>
      <td>{(parseFloat(data.totalprice) / Math.max(parseInt(data.count),1)).toFixed(2)} FCFA</td>
      <td>{parseFloat(data.totalprice).toFixed(1)} FCFA</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-sm btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Précédent
        </button>
        <span>Page {currentPage} / {Math.ceil(currentData.length / rowsPerPage)}</span>
        <button
          className="btn btn-sm btn-outline-primary"
          disabled={currentPage === Math.ceil(currentData.length / rowsPerPage)}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Suivant
        </button>
      </div>
    </div>

      {/* Détail transactions 
      <div className="card shadow border-0 w-100 p-4">
        <h4 className="mb-2">Détail des transactions</h4>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>ID Transaction</th>
                <th>Type</th>
                <th>Poids</th>
                <th>Destination</th>
                <th>Prix (FCFA)</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {paginate(stats.allTransactions, txnPage).map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.id}</td>
                  <td>{t.type}</td>
                  <td>{t.weight} kg</td>
                  <td>{t.destination}</td>
                  <td>{t.price.toLocaleString()}</td>
                  <td className={t.status === "Rebut" ? "text-danger fw-bold" : "text-success fw-bold"}>
                    {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination controls 
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={txnPage === 1}
            onClick={() => setTxnPage(p => p - 1)}
          >
            Précédent
          </button>
          <span>Page {txnPage} / {Math.ceil(stats.allTransactions.length / rowsPerPage)}</span>
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={txnPage === Math.ceil(stats.allTransactions.length / rowsPerPage)}
            onClick={() => setTxnPage(p => p + 1)}
          >
            Suivant
          </button>
        </div>*
      </div>*/}
    </div>
  )
}

export default Rapports