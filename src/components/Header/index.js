
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import logo from '../../assets/images/logo-64.png';
import user from '../../assets/images/user.jpg';
import Button from '@mui/material/Button';
import { MdMenuOpen, MdOutlineMailOutline } from 'react-icons/md';
import { FaRegBell, FaBell } from 'react-icons/fa6'; // Added FaBell for notification state
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import SearchBox from '../SearchBox';
import Badge from '@mui/material/Badge';
import { MyContext } from '../../App';
import { NotificationContext } from '../../NotificationContext'; // Import the context
import { useAuth } from "../../Context/AuthContext";
import { useTranslation } from 'react-i18next';



const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ email: "", lastName: "" });
  const [notificationOpenDrop, setNotificationOpenDrop] = useState(null);
  const { unreadMessages, addNotification, removeNotification, hasNewMessage, setHasNewMessage } = useContext(NotificationContext);
  const open = Boolean(anchorEl);
  const openNotifications = Boolean(notificationOpenDrop);

  const context = useContext(MyContext);
  const navigate = useNavigate(); // For navigation

  const { token, logout, authFetch } = useAuth();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // or your storage
        const response = await authFetch("http://84.247.135.231:8080/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {

    const socket = new SockJS('http://84.247.135.231:8080/ws'); // Update with your actual backend URL
    const stompClient = Stomp.over(socket);

    // Connect to the WebSocket server
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      // Subscribe to the agency-specific topic
      //35 as agency id
      stompClient.subscribe(`/topic/messages/35`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        if (Notification.permission === 'granted') {
          //  alert("nouveau message");
          new Notification('New Message', {
            body: receivedMessage.message, // Assuming 'content' is the message text
          });
        } else if (Notification.permission == 'default' || Notification.permission == 'denied') {
          // Request permission if not granted
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              //    alert("no");
              new Notification('New Message', {
                body: receivedMessage.message,
              });
            }
          });
        }
        // Add message to unread messages and set notification state
        //setUnreadMessages((prev) => [...prev, receivedMessage]);
        setHasNewMessage(true); // Update bell icon state
        addNotification(receivedMessage);
        console.log('Notification permission:', Notification.permission);
      });
    });

    // Cleanup function to disconnect STOMP client
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('Disconnected from WebSocket');
        });
      }
    };
  }, [addNotification]);


  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handlenotificationOpenDrop = (event) => {
    setNotificationOpenDrop(event.currentTarget);
  };

  const handlenotificationCloseDrop = () => {
    setNotificationOpenDrop(null);
  };

  // Mark message as read and redirect
  const handleNotificationClick = (message) => {
    removeNotification(message.id); // Remove from unread notifications
    if (unreadMessages.length === 1) {
      setHasNewMessage(false); // Reset the new message state if it was the last notification
    }
    navigate('/formupload');
  };
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  }

  const lang = [
    { code: "fr", label: "French" },
    { code: "en", label: "english" }
  ]

  const { t } = useTranslation();


  return (
    <div>
      <header className='d-flex align-items-center'>
        <div className='container-fluid w-100'>
          <div className='row d-flex align-items-center w-100'>

            {/* Logo Wrapper starts */}
            <div className='col-sm-2 part1'>
              <Link to={'/'} className='d-flex align-items-center logo'>
                <img src={logo} alt='logo' />
                <span className='ml-2'>TRACKEE</span>
              </Link>
            </div>
            {/* Logo Wrapper ends */}

            {/* searchBox Wrapper starts */}

            {context.windowWidth > 992 && (

              <div className='col-sm-3 d-flex align-items-center part2 res-hide'>
                <Button className='rounded-circle mr-3' onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                  <MdMenuOpen />
                </Button>


              </div>
            )}
            {/* searchBox Wrapper ends */}


            {/* other header Wrapper starts */}
            <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
              <button
                key={lang.code}
                onClick={() => changeLanguage("fr")}
                className={`px-3 py-1 rounded ${i18n.language === "fr" ? "btn-blue" : "btn btn-light"}`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 rounded ${i18n.language === "en" ? "btn-blue" : "btn btn-light"}`}
              >
                EN
              </button>

              {!token ? (
                // If NOT logged in → show connect button
                <Link to={'/login'}>
                  <Button className="btn-blue btn-lg btn-round">Se Connecter</Button>
                </Link>
              ) : (
                // If logged in → show user menu with logout
                <div className='myAccWrapper flex '>
                  <Button className='myAcc d-flex align-items-center' onClick={handleOpenMyAccDrop}>
                    <div className="userInfo res-hide">
                      <h4>{user.agence || "Agence"}</h4>
                      <p className="mb-0">{user.email || "Matricule"}</p>
                    </div>
                  </Button>




                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleCloseMyAccDrop}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleCloseMyAccDrop}>
                      <ListItemIcon><PersonAdd /></ListItemIcon>
                      Mon Compte
                    </MenuItem>
                    <MenuItem onClick={handleCloseMyAccDrop}>
                      <ListItemIcon><Settings /></ListItemIcon>
                      Paramètres
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        logout();
                        handleCloseMyAccDrop();
                      }}
                    >
                      <ListItemIcon><Logout /></ListItemIcon>
                      Déconnexion
                    </MenuItem>
                  </Menu>
                </div>
              )}



            </div>

          </div>
        </div>
      </header >
    </div >
  );
};

export default Header;