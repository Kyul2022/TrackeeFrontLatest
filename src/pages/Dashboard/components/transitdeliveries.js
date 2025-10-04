import { TrendingDown, TrendingUp} from "@mui/icons-material"
import React, { useState, useEffect} from "react";
import { useAuth } from '../../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Transitdeliveries = (props) => {

      const [count, setCount] = useState(1);
      const { authFetch, token } = useAuth();
      const navigate = useNavigate();

      const fetchRebutNumber = async () => {
        try {
              
            if (!token) {
              navigate("/"); 
          throw new Error('Authentication token is missing. Please log in.');
        }
          const response = await authFetch(`http://192.168.28.128:8080/api/delivery/rebut/all`);

          const data = await response.json();
          setCount(data);
          } catch (error) {
            alert(`Erreur lors du chargement des données:`, error);
          }
        };
      
        // Charger les données au changement d'onglet
        useEffect(() => {
          fetchRebutNumber();
        }, [token]);

    return (
        <div className='dashboardBox'
            style={{ backgroundImage: `linear-gradient(to right, ${props.color?.[0]} , ${props.color?.[1]})` }}
        >

            {
                props.grow === true? 
                <span className="chart"><TrendingUp/></span>
                :
                <span className="chart"><TrendingDown/></span>
             
            }
            <div className="innerDashbox">
                <div className="col1">
                    <h4 className="text-white">Rebuts</h4>
                    <span className="text-white">{count}</span>
                </div>

                <div className="innerDashboxIcon ">
                    {
                        props.icon ?
                            <span className="icon">
                                {props.icon ? props.icon : ''}
                            </span>
                            :
                            ''
                    }

                </div>
            </div>

            {/* <div className="innerDashboxDate">
                <h6 className="text-white"></h6>
            </div> */}

        </div>


    )
}

export default Transitdeliveries
