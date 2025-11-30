import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const startIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const endIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684915.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

// Component to recenter map when markers change
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function TripMap({
  departStation,
  arriveStation,
  busLocation,
  eta
}) {
  const [center, setCenter] = useState([33.5731, -7.5898]); // Casablanca par défaut
  const [zoom] = useState(12);

  useEffect(() => {
    // Center map on bus location if available, otherwise on depart station
    if (busLocation && busLocation.latitude && busLocation.longitude) {
      setCenter([busLocation.latitude, busLocation.longitude]);
    } else if (departStation && departStation.latitude && departStation.longitude) {
      setCenter([departStation.latitude, departStation.longitude]);
    }
  }, [busLocation, departStation]);

  return (
    <div className="trip-map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        {/* Marker for departure station */}
        {departStation && departStation.latitude && departStation.longitude && (
          <Marker
            position={[departStation.latitude, departStation.longitude]}
            icon={startIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>🚏 Départ</strong>
                <p className="mb-0 mt-1">{departStation.nom}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker for arrival station */}
        {arriveStation && arriveStation.latitude && arriveStation.longitude && (
          <Marker
            position={[arriveStation.latitude, arriveStation.longitude]}
            icon={endIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>🏁 Arrivée</strong>
                <p className="mb-0 mt-1">{arriveStation.nom}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marker for bus current location */}
        {busLocation && busLocation.latitude && busLocation.longitude && (
          <Marker
            position={[busLocation.latitude, busLocation.longitude]}
            icon={busIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>🚌 Bus en cours</strong>
                {eta && (
                  <>
                    <p className="mb-0 mt-1">Distance: {eta.distance} km</p>
                    <p className="mb-0">ETA: ~{eta.eta} min</p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
