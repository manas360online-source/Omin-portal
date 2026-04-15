import { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Building2, School, Hotel, Landmark, Loader2, ExternalLink, Map as MapIcon, List, Stethoscope } from 'lucide-react';
import { getNearbyPlaces } from '../services/geminiService';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { cn } from '../utils/cn';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, markers }: { center: [number, number], markers: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
      bounds.extend(center);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 14);
    }
  }, [center, markers, map]);

  return null;
}

// Haversine formula to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Explore() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('hospitals');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');

  const categories = [
    { id: 'hospitals', label: 'Hospitals', icon: Stethoscope },
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLoc);
          fetchPlaces(newLoc.lat, newLoc.lng, searchQuery);
        },
        (err) => {
          setError("Location access denied. Please enable it or click on the map to explore.");
          // Fallback location (e.g., San Francisco)
          const fallbackLoc = { lat: 37.7749, lng: -122.4194 };
          setLocation(fallbackLoc);
          fetchPlaces(fallbackLoc.lat, fallbackLoc.lng, searchQuery);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      const fallbackLoc = { lat: 37.7749, lng: -122.4194 };
      setLocation(fallbackLoc);
      fetchPlaces(fallbackLoc.lat, fallbackLoc.lng, searchQuery);
    }
  }, []);

  const fetchPlaces = async (lat: number, lng: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching places for:", query, "at", lat, lng);
      const results = await getNearbyPlaces(lat, lng, query);
      console.log("Results received:", results);
      setPlaces(results);
    } catch (err: any) {
      console.error("Explore fetch error:", err);
      setError(`Failed to fetch nearby places: ${err.message || "Unknown error"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    fetchPlaces(lat, lng, searchQuery);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Hospitals</h2>
          <p className="text-slate-500 mt-1">Find hospitals and medical centers near you.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
              )}
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'map' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
              )}
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Locating...'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Active Search Coordinates</span>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSearchQuery(cat.label);
              if (location) fetchPlaces(location.lat, location.lng, cat.label);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
              searchQuery.toLowerCase().includes(cat.id) || (cat.id === 'all' && searchQuery.includes(','))
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            )}
          >
            <cat.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[70vh] relative">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-slate-400 space-y-4 rounded-3xl">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            <p className="text-lg font-medium">Scanning your surroundings...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-red-700 mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => location && fetchPlaces(location.lat, location.lng, searchQuery)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {viewMode === 'map' && location ? (
          <div className="h-[70vh] min-h-[600px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[40] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-600">
              Click anywhere on the map to search that location
            </div>
            <MapContainer 
              center={[location.lat, location.lng]} 
              zoom={14} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeView center={[location.lat, location.lng]} markers={places.filter(p => p.latitude && p.longitude)} />
              <MapEvents onMapClick={handleMapClick} />
              
              {/* User Location Marker */}
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  <div className="font-bold">Search Center</div>
                  <div className="text-[10px] text-slate-500">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</div>
                </Popup>
              </Marker>

              {/* Places Markers */}
              {places.map((place, i) => (
                place.latitude && place.longitude && (
                  <Marker key={i} position={[place.latitude, place.longitude]}>
                    <Popup>
                      <div className="p-1">
                        <h4 className="font-bold text-slate-900">{place.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{place.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{place.category}</div>
                          {location && place.latitude && place.longitude && (
                            <div className="text-[10px] font-bold text-slate-400">
                              {calculateDistance(location.lat, location.lng, place.latitude, place.longitude).toFixed(1)} km away
                            </div>
                          )}
                        </div>
                        {place.uri && (
                          <a 
                            href={place.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-3 block text-center bg-emerald-500 text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                          >
                            Open in Google Maps
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-full pr-2">
            {places.map((place, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group h-fit"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
                    <Stethoscope className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{place.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-3 mb-4">{place.description}</p>
                
                {location && place.latitude && place.longitude && (
                  <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                    <Navigation className="w-3 h-3" />
                    {calculateDistance(location.lat, location.lng, place.latitude, place.longitude).toFixed(2)} km away
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-3">
                    {place.uri && (
                      <a 
                        href={place.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Maps
                      </a>
                    )}
                    {place.latitude && (
                      <button 
                        onClick={() => setViewMode('map')}
                        className="text-xs font-semibold text-slate-400 hover:text-emerald-500 flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" /> View
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {places.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center text-slate-400">
                No places found for this category. Try another one!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
