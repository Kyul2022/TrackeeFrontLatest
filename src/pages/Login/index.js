import React, { useContext, useEffect, useState } from 'react'
import Logo from '../../assets/images/logo-64.png'
import Pattern from '../../assets/images/pattern.webp'
import { MyContext } from '../../App';
import Person2 from '@mui/icons-material/Person2';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

import { useAuth } from '../../Context/AuthContext';

import { useNavigate } from "react-router-dom";


const Login = () => {

    const [inputIndex, setInputIndex] = useState(null);
        const [loading, setLoading] = useState(false);
    const[isShowPassword, setIsShowPassword] = useState(false);
    const context = useContext(MyContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { authFetch } = useAuth();
  const navigate = useNavigate(); 

  const {token, login, logout} = useAuth();


const handleSubmit = async (e) => {
  e.preventDefault();
  const confirm = window.confirm(
    `Email: ${email}\nPassword: ${password}\n\nClick OK to continue`
  );

  if (!confirm) return;

  setLoading(true);

  try {
    const {accessToken, userInfo} = await login(email, password); // login sets token in context
    //alert(`Token received: ${accessToken}`);
    navigate("/");
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
  finally{
          setLoading(false);
  }
};






    useEffect(() => {
             context.setIsHideSidebarAndHeader(true);
    }, [])

    const focusInput = (index) => {
        setInputIndex(index);
    }
    return (
        <>
            <img src={Pattern} className='loginPatern' alt='img' />
            <section className='loginSection'>
                <div className='loginBox'>
                    <div className='logo text-center'>
                        <img src={Logo} alt='img'
                            width='60px' />

                        <h5 className='font-weight-bold'>Connectez-vous sur Trackee</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={handleSubmit}>
                            <div className={`form-group mb-3 position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><Person2 /></span>
                                <input type='text' className='form-control' placeholder='Entrez votre Email' value={email}
  onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => focusInput(0)}
                                    onBlur={() => setInputIndex(null)}
                                />
                            </div>

                            <div className={`form-group mb-3 position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input type={`${isShowPassword===true ? 'text' : 'password'}`} className='form-control' placeholder='Entrez votre Mot de passe' value={password}
  onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => focusInput(1)}
                                    onBlur={() => setInputIndex(null)}

                                />

                                <span className='toggleShowPassword' onClick={()=>setIsShowPassword(!isShowPassword)}> 
                                    {
                                        isShowPassword===true ?  <IoMdEyeOff/>  : 
                                        <IoMdEye/>
                                    }
                                   
                                </span>
                            </div>

                            <div className='form-group'>
                                <Button
  type="submit"
  className="btn-blue btn-lg w-100 btn-big mt-3"
  disabled={loading} // disable si loading ou si login non rempli
  onClick={(e) => {
    if (token) {
      // Déjà connecté → déconnexion
      e.preventDefault();
      logout();
      alert("Vous êtes déconnecté !");
    } else {
      // Pas encore connecté → login
      handleSubmit(e);
    }
  }}
>
   {loading ? "Connexion..." : token ? "SE DÉCONNECTER" : "SE CONNECTER"}

</Button>


                            </div>

                            <div className='form-group text-center'>
                            <Link to={'/forget-password'} className='link'>Mot de Passe Oublié ?</Link>

                            </div>
                        </form>
                    </div>
                </div>


            </section>
        </>
    )
}

export default Login
