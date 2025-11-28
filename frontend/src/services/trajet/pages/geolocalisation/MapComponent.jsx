import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const MapComponent = ({ buses, selectedBus, onBusSelect }) => {  
  return (  
    <MapContainer center={[33.5731, -7.5898]} zoom={12} style={{ height: '500px' }}>  
      <TileLayer  
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'  
      />  
      {buses.map(bus => (  
        <Marker  
          key={bus.id}  
          position={[bus.location.latitude, bus.location.longitude]}  
          eventHandlers={{ click: () => onBusSelect(bus) }}  
        >  
          <Popup>  
            <div>  
              <strong>Bus: {bus.numeroImmatriculation}</strong><br/>  
              Lat: {bus.location.latitude.toFixed(4)}<br/>  
              Long: {bus.location.longitude.toFixed(4)}<br/>  
              Heure: {new Date(bus.location.createdAt).toLocaleTimeString()}  
            </div>  
          </Popup>  
        </Marker>  
      ))}  
    </MapContainer>  
  )  
}
export default MapComponent