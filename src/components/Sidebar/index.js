import { useState } from 'react'
import Button from '@mui/material/Button'
import { MdDashboard, MdMessage } from "react-icons/md"
import { FaAngleRight, FaBell } from "react-icons/fa6"
import { IoMdLogOut } from 'react-icons/io'
import { Link } from 'react-router-dom'
import Send from '@mui/icons-material/Send'
import { AirportShuttle, Report, ScatterPlotSharp } from '@mui/icons-material'
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { PiHandWithdrawFill } from 'react-icons/pi'
import { GrResources } from 'react-icons/gr'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(null)
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(false)

  const isOpenSubmenu = (index) => {
    setActiveTab(index)
    setIsToggleSubmenu(activeTab === index ? !isToggleSubmenu : true)
  }

  return (
    <>
      <div className='sidebar'>
        <ul>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 0 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(0)}
                style={{ color: activeTab === 0 ? '#20948B' : 'black' }}
              >
                <span className='icon'><MdDashboard /></span>
                Dashboard
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/send-package">
              <Button
                className={`w-100 ${activeTab === 4 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(4)}
                style={{ color: activeTab === 4 ? '#20948B' : 'black' }}
              >
                <span className='icon'><Send /></span>
                Envoi de colis
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/reception">
              <Button
                className={`w-100 ${activeTab === 9 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(9)}
                style={{ color: activeTab === 9 ? '#20948B' : 'black' }}
              >
                <span className='icon'><PiHandWithdrawFill /></span>
                Reception et Retrait
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/delivery">
              <Button
                className={`w-100 ${activeTab === 5 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(5)}
                style={{ color: activeTab === 5 ? '#20948B' : 'black' }}
              >
                <span className='icon'><AirportShuttle /></span>
                Livraison en cours
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/tracking">
              <Button
                className={`w-100 ${activeTab === 6 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(6)}
                style={{ color: activeTab === 6 ? '#20948B' : 'black' }}
              >
                <span className='icon'><GpsFixedIcon /></span>
                Tracking
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Button
              className={`w-100 ${activeTab === 1 && isToggleSubmenu ? 'active' : ''}`}
              onClick={() => isOpenSubmenu(1)}
              style={{ color: activeTab === 1 ? '#20948B' : 'black' }}
            >
              <span className='icon'><GrResources /></span>
              Gestion Des Ressources
              <span className='arrow'><FaAngleRight /></span>
            </Button>
            <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu ? 'colapse' : 'colapsed'}`}>
              <ul className='submenu'>
                <li><Link to="/buses">Gestion des Véhicules</Link></li>
                <li><Link to="/personnel">Gestion du Personnel</Link></li>
                <li><Link to="/agencies">Gestion des Agences</Link></li>
              </ul>
            </div>
          </li>

          <li>
            <Link to="/rebuts">
              <Button
                className={`w-100 ${activeTab === 7 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(7)}
                style={{ color: activeTab === 7 ? '#20948B' : 'black' }}
              >
                <span className='icon'><ScatterPlotSharp /></span>
                Rebuts
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/rapports">
              <Button
                className={`w-100 ${activeTab === 8 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(8)}
                style={{ color: activeTab === 8 ? '#20948B' : 'black' }}
              >
                <span className='icon'><Report /></span>
                Rapports
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="history-transit">
              <Button
                className={`w-100 ${activeTab === 10 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(10)}
                style={{ color: activeTab === 10 ? '#20948B' : 'black' }}
              >
                <span className='icon'><Report /></span>
                Transit
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="#">
              <Button
                className={`w-100 ${activeTab === 3 ? 'active' : ''}`}
                onClick={() => isOpenSubmenu(3)}
                style={{ color: activeTab === 3 ? '#20948B' : 'black' }}
              >
                <span className='icon'><FaBell /></span>
                Notifications
                <span className='arrow'><FaAngleRight /></span>
              </Button>
            </Link>
          </li>
        </ul>

        <br />
        <div className='logoutWrapper'>
          <div className='logoutBox'>
            <Button variant='contained'><IoMdLogOut /> Déconnexion</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar