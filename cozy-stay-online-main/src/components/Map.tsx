
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(
    'YOUR_MAPBOX_TOKEN' // Default placeholder
  );
  const [tokenEntered, setTokenEntered] = useState<boolean>(false);
  
  // Nairobi coordinates
  const nairobiCoordinates: [number, number] = [36.8219, -1.2921];

  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    // Initialize map with the provided token
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: nairobiCoordinates,
        zoom: 12
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker for hotel location
      new mapboxgl.Marker()
        .setLngLat(nairobiCoordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('ZamZam Hostel'))
        .addTo(map.current);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (tokenEntered && mapboxToken !== 'YOUR_MAPBOX_TOKEN') {
      // Clean up previous map instance if it exists
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      
      initializeMap();
      
      // Cleanup
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    }
  }, [tokenEntered, mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenEntered(true);
  };

  return (
    <div className="w-full h-full">
      {!tokenEntered ? (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Enter your Mapbox Token</h3>
            <p className="text-sm text-gray-600 mb-4">
              To display the map, please enter your Mapbox public token. 
              You can get one by signing up at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>.
            </p>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="Enter your Mapbox token"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-hotel-gold"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-hotel-gold hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors"
              >
                Show Map
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full" />
      )}
    </div>
  );
};

export default Map;
