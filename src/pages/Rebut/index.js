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
import Pagination from "@mui/material/Pagination";
import { useAuth} from '../../Context/AuthContext';
import { MdSend } from 'react-icons/md';
import { Modal} from 'react-bootstrap';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});

const Rebut = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rebutsData, setRebutsData] = useState([]);
  const { authFetch, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

      const fetchRebuts = async () => {
    try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://84.247.135.231:8080/api/delivery/rebut/allforme', {
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
      setRebutsData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rebuts:', err);
      setError('Erreur lors du chargement des rebuts: ' + err.message);
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
      fetchRebuts();
      // mise en place du timer toutes les 5 minutes (300000 ms)
      const interval = setInterval(() => {

        fetchRebuts();

      }, 300000);
  
      // nettoyage quand le composant est démonté
      return () => clearInterval(interval);
    }, []); // dépendances vides → uniquement au montage

  const itemsPerPage = 5;

  // Données d'exemple pour les rébuts

  // Filtrer les données basées sur la recherche
  const filteredData = rebutsData.filter(item =>
    item.numSerie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer la pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Gérer le changement de page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Réinitialiser la page quand on recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                    <h5 className='mb-0'>Les Rébuts</h5>
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
                            label="Les Rébuts"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>


                <div className='card shadow border-0 mt-4 p-4'>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h5 className='mb-0'>Liste des rébuts</h5>
                       
                    </div>

                    {/* Barre de recherche */}
                    <div className='mb-4'>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='form-group'>
                                    <label className='form-label mb-2'>Rechercher par ID Colis</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Entrez ID du colis...'
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            padding: '10px 15px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau des rébuts */}
                    <div className='table-responsive'>
                        <table className='table table-striped table-hover'>
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        ID Colis
                                    </th>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        Nature
                                    </th>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        Nom Expéditeur
                                    </th>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        Destination
                                    </th>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        N° Expéditeur
                                    </th>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        N° Destinataire
                                    </th>
                                    <th scope='col' style={{ fontWeight: '600', color: '#495057', padding: '15px' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                                            <td style={{ padding: '15px', fontWeight: '500', color: '#007bff' }}>
                                                {item.numSerie}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span 
                                                    className={`badge ${
                                                        item.nature === 'Document' ? 'bg-warning' :
                                                        item.nature === 'Express' ? 'bg-success' :
                                                        'bg-secondary'
                                                    }`}
                                                    style={{ padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    {item.nature}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>{item.exp_name}</td>
                                            <td style={{ padding: '15px' }}>
                                                <div className='d-flex align-items-center'>
                                                    <LocalShipping style={{ marginRight: '5px', color: '#6c757d', fontSize: '16px' }} />
                                                    {item.destination}
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px', color: '#6c757d' }}>
                                                {item.exp_number}
                                            </td>
                                            <td style={{ padding: '15px', color: '#6c757d' }}>
                                                {item.dest_number1}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <button 
                                                    className='btn btn-outline-primary btn-sm'
                                                    style={{ 
                                                        borderRadius: '5px',
                                                        padding: '5px 10px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    <FaEye style={{ marginRight: '5px' }} />
                                                    Voir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan='7' style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                                            <div>
                                                <LocalShipping style={{ fontSize: '48px', marginBottom: '15px', opacity: '0.3' }} />
                                                <p className='mb-0'>Aucun colis trouvé avec cet ID</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <div className='d-flex justify-content-between align-items-center mt-4'>
                            <div>
                                <span className='text-muted'>
                                    Affichage de {startIndex + 1} à {Math.min(endIndex, filteredData.length)} sur {filteredData.length} résultat(s)
                                </span>
                            </div>
                            <Pagination 
                                count={totalPages} 
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary" 
                                variant="outlined" 
                                shape="rounded"
                                showFirstButton 
                                showLastButton
                            />
                        </div>
                    )}
                  
                 </div>                             
                        
    </div>
  )
}

export default Rebut