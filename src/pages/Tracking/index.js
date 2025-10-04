
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import HomeIcon from '@mui/icons-material/Home'
import styled from 'styled-components'
import { Chip } from '@mui/material'


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        height: '20px',
        color: 'text-primary'
    }
});

const Tracking = () => {

    const [idLivraison, setIdLivraison] = useState('');
    const [idColis, setIdColis] = useState('');
    const [loading, setLoading] = useState(false);
    // State for Google Maps data
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [lastReferencedLocation, setLastReferencedLocation] = useState('');

const handleSearch = async () => {
    setLoading(true);
    try {
        let searchValue = "";

        if (idLivraison) searchValue = `LIV-${idLivraison}`;
        else if (idColis) searchValue = `COL-${idColis}`;

        if (!searchValue) {
            console.warn("No search value provided");
            return;
        }

const response = await fetch(`http://192.168.28.128:8080/api/delivery/tracking/fromOffice/${searchValue}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
});
  if (!response.ok) {
    throw new Error("Failed to fetch tracking info");
  }

  const data = await response.json(); 

  setLastReferencedLocation(data.city);
  alert(data.city);

    } catch (error) {
        console.error("Error fetching city:", error);
    }
    finally{
        setLoading(false);
    }
};

useEffect(() => {
  if (!lastReferencedLocation) return;

  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address: lastReferencedLocation }, (results, status) => {
    if (status === "OK" && results[0]) {
      const { lat, lng } = results[0].geometry.location;
      setLocation({ lat: lat(), lng: lng() });
    } else {
      console.error("Geocode failed: " + status);
    }
  });
}, [lastReferencedLocation]);

    return (
        <>
            <div className='right-content w-100'>
                <div className="container">

                    <div className='card shadow border-0 w-100 d-flex flex-row p-4'>
                        <h5 className='mb-0'>Tracking des colis</h5>
                        <Breadcrumbs aria-label='breadcrumb' className='breadcrumbs'>
                            <StyledBreadcrumb
                                className='styledbreadcrumbs'
                                component="a"
                                href="/"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />


                            <StyledBreadcrumb
                                className='styledbreadcrumbs ml-2'
                                label="Tracking"
                                href="#"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                    </div>


                    {/* Search fields */}
                    <div className='cardcolor'>
                        <div className="cardrow row mb-4">
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher ID Livraison"
                                    value={idLivraison}
                                    onChange={(e) => setIdLivraison(e.target.value)}
                                />
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher ID Colis"
                                    value={idColis}
                                    onChange={(e) => setIdColis(e.target.value)}
                                />
                            </div>
                            <div className="col">
   <button 
  className="btn btn-success w-100" 
  onClick={handleSearch}
  disabled={loading}
>
  {loading ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Recherche...
    </>
  ) : (
    'Valider la Recherche'
  )}
</button>
                            </div>
                        </div>

                    </div>

                    <div className="mb-4">
                        <h5>Dernier Lieu Référencé : {lastReferencedLocation}</h5>
                    </div>

                    {/* Google Maps Display */}
                    <div className="map-container" style={{ height: '400px' }}>
                        <LoadScript googleMapsApiKey="AIzaSyBV-03ODrv5lBjQ8FwVWHsp9b5Xfoc4t9o">
                            <GoogleMap
                                mapContainerStyle={{ height: '100%', width: '100%' }}
                                center={location}
                                zoom={10}
                            >
                                {/* Marker for the last referenced location */}
                                <Marker position={location} />
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Tracking
