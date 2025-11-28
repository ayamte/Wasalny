import { useState, useEffect } from 'react'
import MapComponent from './MapComponent'
import { locationService } from '../../configurationService'
import { busService } from '../../configurationService'
import './geolocalisation.css'  
  
export default function GeolocalisationPage() {  
  const [busLocations, setBusLocations] = useState([])  
  const [selectedBus, setSelectedBus] = useState(null)  
  const [loading, setLoading] = useState(false)  
  
  useEffect(() => {  
    loadBusLocations()  
    // Rafraîchir toutes les 30 secondes pour le temps réel  
    const interval = setInterval(loadBusLocations, 30000)  
    return () => clearInterval(interval)  
  }, [])  
  
  const loadBusLocations = async () => {  
    try {  
      setLoading(true)  
      // Récupérer tous les bus avec leur dernière position  
      const buses = await busService.getAllBuses()  
      const locations = await Promise.all(  
        buses.map(async bus => {  
          const location = await locationService.getLatestLocation(bus.id)  
          return { ...bus, location }  
        })  
      )  
      setBusLocations(locations.filter(bus => bus.location))  
    } catch (error) {  
      console.error('Error loading locations:', error)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return (  
    <div className="admin-page">  
      <div className="admin-header">  
        <h1>Géolocalisation des Bus</h1>  
      </div>  
        
      {loading && <div>Chargement...</div>}  
        
      <div className="geolocalisation-content">  
        <MapComponent   
          buses={busLocations}  
          selectedBus={selectedBus}  
          onBusSelect={setSelectedBus}  
        />  
          
        {selectedBus && (  
          <div className="bus-details">  
            <h3>Détails du bus sélectionné</h3>  
            <p>Immatriculation: {selectedBus.numeroImmatriculation}</p>  
            <p>Latitude: {selectedBus.location.latitude}</p>  
            <p>Longitude: {selectedBus.location.longitude}</p>  
            <p>Dernière mise à jour: {new Date(selectedBus.location.createdAt).toLocaleString()}</p>  
          </div>  
        )}  
      </div>  
    </div>  
  )  
}