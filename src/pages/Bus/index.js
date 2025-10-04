import React, { useContext, useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import { Chip } from '@mui/material'
import { Link } from "react-router-dom"
import Pagination from "@mui/material/Pagination";
import { styled } from '@mui/material/styles';
import { MyContext } from '../../App';
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useAuth} from '../../Context/AuthContext';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});

const Buses = () => {


      const { authFetch, token, logout } = useAuth();
    
    const [searchTerm, setSearchTerm] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [packageData, setpackageData] = useState([]);

    
  const context = useContext(MyContext);
  useEffect(() => {
      context.setIsHideSidebarAndHeader(false);
  }, []);

            const fetchBuses = async () => {
    try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://192.168.28.128:8080/api/org/bus/allforx', {
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
      setpackageData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching buses:', err);
      setError('Erreur lors du chargement des bus: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

    //filtering based on search terms
    const filteredPackages = packageData.filter(pkg =>
        pkg.matricule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //handling pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

        useEffect(() => {
      fetchBuses();
    }, [token]);

    return (
        <>
            <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                    <h5 className='mb-0'>Gestion des Véhicules</h5>
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

                    <div className='agencyhead'>
                        <h3 className="hd">Liste des Véhicules</h3>
                        <Link to={'/newBus'}>
                            <Button className="btn-blue btn-lg btn-round">Nouveau Bus</Button>

                        </Link>
                    </div>


                    <div className="search-container col-md-6">
                        <form className="searchagency">
                            <input
                                className="form-control search-input search form-control-md mt-4"
                                type="search"
                                placeholder="Recherchez un bus par son numéro d'immatriculation"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>


                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Numéro d'immatriculation</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentPackages.map((pkg, index) => (
                                    <tr key={index}>
                                        <td><b>{pkg.matricule}</b></td>

                                        <td>
                                            <div className="actions d-flex align-items-center justify-content-center">
                                                <Link to={"/editBus"}>
                                                    <Button color="success" className="success"> <FaPencilAlt /> </Button>
                                                </Link>

                                                <Button color="error" className="error"> <MdDelete /> </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        count={Math.ceil(filteredPackages.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="success"
                        className="mt-3 float-right"
                    />
                </div>



            </div>


        </>
    )
}

export default Buses