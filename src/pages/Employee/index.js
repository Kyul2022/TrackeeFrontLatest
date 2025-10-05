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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});


const Employees = () => {


    const { authFetch, token, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [itemsPerPage] = useState(10);
    const [packageData, setpackageData] = useState([]);

    const context = useContext(MyContext);
    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
    }, []);

    const fetchEmployees = async () => {
        try {
      
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      const response = await authFetch('http://84.247.135.231:8080/api/users/allforx', {
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
        else {
        const errorMessage = await response.text();
        alert(errorMessage || 'Erreur lors de l\'affichage des employes');
        navigate("/");
      }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("first")
      console.log(JSON.stringify(data,2,null))
      setpackageData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Erreur lors du chargement des employes: ' + err.message);
      setLoading(false);
      
      // Redirect to login if authentication error
      if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
    }
  };

    useEffect(() => {
        fetchEmployees();
      }, [token]);

    //filtering based on search terms
    const filteredPackages = packageData.filter(pkg =>
        pkg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //handling pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPackages = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    return (
        <>
            <div className='right-content w-100'>
                <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                    <h5 className='mb-0'>Gestion du Personnel</h5>
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
                            label="Personnel"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">

                    <div className='agencyhead'>
                        <h3 className="hd">Liste du Personnel</h3>
                        <Link to={'/register-user'}>
                            <Button className="btn-blue btn-lg btn-round">Ajouter un employé</Button>

                        </Link>
                    </div>


                    <div className="search-container col-md-6">
                        <form className="searchagency">
                            <input
                                className="form-control search-input search form-control-md mt-4"
                                type="search"
                                placeholder="Recherchez un employé par son adresse mail"
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
                                    <th>Matricule</th>
                                    <th>NOM</th>
                                    <th>PRENOM</th>
                                    <th>Poste</th>
                                    <th>Agence</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentPackages.map((pkg, index) => (
                                    <tr key={index}>
                                        <td>{pkg.email}</td>
                                        <td><b>{pkg.firstName}</b></td>
                                        <td><b>{pkg.lastName}</b></td>
                                        <td><b>{pkg.poste}</b></td>
                                        <td><b>{pkg.agence}</b></td>

                                        <td>
                                            <div className="actions d-flex align-items-center justify-content-center">
                                                <Link to={"/editPersonnel"}>
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

export default Employees