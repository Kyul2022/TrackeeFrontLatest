import React, { useContext, useEffect, useState } from 'react'
import Logo from '../../assets/images/logo-64.png'
import Pattern from '../../assets/images/pattern.webp'
import { MyContext } from '../../App';
import Person2 from '@mui/icons-material/Person2';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdHome } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import {IoShieldCheckmarkSharp} from 'react-icons/io5';
import Select from "@mui/material/Select";
import { MenuItem } from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useAuth} from '../../Context/AuthContext';


const RegisterUser = () => {

    const [inputIndex, setInputIndex] = useState(null)
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const { authFetch, token, logout } = useAuth();
    const [agencies, setAgencies] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiResults, setApiResults] = useState([]);
    const context = useContext(MyContext)

        const [formData, setFormData] = useState({
        email: '',
        poste: '',
        firstName: '',
        lastName: '',
        password: '',
        agencyId: ''
      });

       const handleSubmit = async (e) => {

          e.preventDefault(); // si tu es dans un <form>

  //alert("Form data being sent: " + JSON.stringify(formData)); 
      setLoading(true);
  try {
    const response = await authFetch("http://84.247.135.231:8080/api/users/register-root", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName:formData.lastName,
        poste:formData.poste,
        password:formData.password,
        agencyId: formData.agencyId
      }),
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage || 'Erreur lors de l\'ajout du bus');
    }
    const data = await response.json();
    setApiResults(data);
    alert("User created successfully");
    navigate(-1); // Retour en arrière
  } catch (err) {
    setError(err.message);
    if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
  } finally {
    setLoading(false);
  }
};

        const fetchAgencies = async () => {
      if (!token) {
        setError('Bearer token is required');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await authFetch('http://84.247.135.231:8080/api/org/agencies/allforx');

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
        console.error('Error fetching agencies:', err);
        if (err.message.includes('Token') || err.message.includes('Session')) {
        // Uncomment the line below if you want to redirect to login
        logout();
      }
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, [])

    useEffect(() => {
            fetchAgencies();
          }, [token]);

    const focusInput = (index) => {
        setInputIndex(index);
    }
    return (
        <>
            <img src={Pattern} className='loginPatern' alt='img' />
            <section className='loginSection signUpSection'>

                <div className='row'>
                    

                        <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center '>
                            <h1>TRACkEE EST UNE PLATEFORME DE GESTION DE MESSAGERIE POSTALE</h1>
                            <p>
                                Seuls les utilisateurs autorisés peuvent ajouter des nouvelles personnes dans la platerforme.
                                Notez que toutes les actions réalisées sont sauvegardés pour
                                plus de traçabilité.
                            </p>

                            <div className='w-100 mt-5'>
                                <Link to={"/"}><Button className='btn-blue btn-lg btn-big'><IoMdHome/> Retour à l'accueil</Button>
                                </Link>
                            </div>

                        </div>
                   

                    <div className='col-md-4 part2'>
                        <div className='loginBox signupBox'>
                            <div className='logo text-center'>
                                <img src={Logo} alt='img'
                                    width='60px' />

                                <h5 className='font-weight-bold'>Créer un nouvel utilisateur</h5>
                            </div>

                            <div className='wrapper mt-3 card border'>
                                <form>
                                <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><Person2 /></span>
                                        <input type='text' className='form-control' placeholder='Entrez Le Nom'
                                            onFocus={() => focusInput(0)}
                                            onBlur={() => setInputIndex(null)}
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><Person2 /></span>
                                        <input type='text' className='form-control' placeholder="Entrez Le Prenom de l'utilisateur"
                                            onFocus={() => focusInput(1)}
                                            onBlur={() => setInputIndex(null)}
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            required
                                        />
                                    </div>

                                    <div className={`form-group mb-3 position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><Person2 /></span>
                                        <input type='text' className='form-control' placeholder="Entrez l'adresse mail de l'utilisateur"
                                            onFocus={() => focusInput(2)}
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            onBlur={() => setInputIndex(null)}
                                        required/>
                                    </div>

                                    <div className={`form-group mb-3 position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' placeholder="Mot de passe de l'utilisateur"
                                            onFocus={() => focusInput(3)}
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            onBlur={() => setInputIndex(null)}
                                          required 
                                        />

                                        <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEyeOff /> :
                                                    <IoMdEye />
                                            }

                                        </span>
                                    </div>

                                    <div className={`form-group mb-3 position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmarkSharp /></span>
                                        <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className='form-control' placeholder="Confirmez Le Mot de passe "
                                            onFocus={() => focusInput(4)}
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            onBlur={() => setInputIndex(null)}

                                        />

                                        <span className='toggleShowPassword' onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEyeOff /> :
                                                    <IoMdEye />
                                            }

                                        </span>
                                    </div>

                                    {/* <div className={`form-group mb-3 position-relative ${inputIndex === 5 && 'focus'}`}>
                                        <span className='icon'><RollerShadesClosedOutlined/></span>
                                        <input type='text' className='form-control' placeholder="Entrez Le rôle de l'utilisateur"
                                            onFocus={() => focusInput(5)}
                                            onBlur={() => setInputIndex(null)}
                                        required/>
                                    </div> */}

                                    
                                        <div className='form-group '>
                                            <h6>Rôle</h6>
  <select
    className="form-control"
    id="poste"
    value={formData.poste}
    onChange={(e) => {
      setFormData({ ...formData, poste: e.target.value });
    }}    required
  >
    <option value="" disabled>
      Choisissez un rôle
    </option>
    <option value="GESTIONNAIRE">GESTIONNAIRE</option>
    <option value="CHAUFFEUR">CHAUFFEUR</option>
  </select>
                                        </div>

                                        <div className="form-group">
                                <label htmlFor="destination">Agence</label>
                             <select
  className="form-control"
  id="agence"
  value={formData.agencyId}
  onChange={(e) => {
    setFormData({ ...formData, agencyId: e.target.value });
  }}
  required
>
  <option value="" disabled>
    {loading ? "Chargement des agences..." : "Choisissez l'agence de destination"}
  </option>
  {agencies.map((name, index) => (
    <option key={index} value={name}>
      {name}
    </option>
  ))}
</select>

                            </div>
                                    

                                    <div className='form-group'>
                                        <button 
  type="button" 
  onClick={handleSubmit} 
  className="btn-blue btn-lg w-100 btn-big mt-3"
  disabled={loading}
>
  {loading ? "En cours..." : "Soumettre"}
</button>                               

                                    </div>

                                    <div className='form-group text-center'>
                                        <Link to={'/forget-password'} className='link'>Mot de Passe Oublié ?</Link>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>




            </section>
        </>
    )
}

export default RegisterUser 
