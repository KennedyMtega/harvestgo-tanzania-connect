
import React, { useState, useEffect, useRef } from 'react';

// This is just a mock map component - in a real app we'd use
// a library like Mapbox or Google Maps

interface MapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  markers?: Marker[];
  onMarkerClick?: (markerId: string) => void;
  showUserLocation?: boolean;
  className?: string;
  showRoutes?: {
    from: [number, number];
    to: [number, number];
    type: 'vendor-to-driver' | 'driver-to-buyer';
  }[];
  highlightMarker?: string;
}

export interface Marker {
  id: string;
  position: [number, number]; // [lng, lat]
  type: 'vendor' | 'driver' | 'buyer';
  data?: any;
}

const Map: React.FC<MapProps> = ({ 
  center = [39.2083, -6.7924], // Dar es Salaam, Tanzania
  zoom = 13,
  markers = [],
  onMarkerClick,
  showUserLocation = true,
  className = '',
  showRoutes = [],
  highlightMarker
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // In a real implementation, we would initialize the map library here
  // and set up event handlers, markers, etc.

  // Simple function to draw a line between two points
  const renderRoute = (from: [number, number], to: [number, number], type: string) => {
    // Calculate midpoint for a curved line effect
    const midX = (from[0] + to[0]) / 2;
    const midY = (from[1] + to[1]) / 2 - 0.005; // Offset to create curve
    
    // Convert coordinates to percentage positions on the map
    const fromX = ((from[0] - center[0]) / 0.02 + 50);
    const fromY = ((from[1] - center[1]) / -0.02 + 50);
    const midPointX = ((midX - center[0]) / 0.02 + 50);
    const midPointY = ((midY - center[1]) / -0.02 + 50);
    const toX = ((to[0] - center[0]) / 0.02 + 50);
    const toY = ((to[1] - center[1]) / -0.02 + 50);
    
    const path = `M${fromX}% ${fromY}% Q${midPointX}% ${midPointY}%, ${toX}% ${toY}%`;
    
    return (
      <svg 
        className="absolute inset-0 z-10 pointer-events-none" 
        width="100%" 
        height="100%"
      >
        <path 
          d={path} 
          stroke={type === 'vendor-to-driver' ? '#4F46E5' : '#10B981'} 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray={type === 'vendor-to-driver' ? "5,5" : "none"} 
        />
      </svg>
    );
  };

  return (
    <div 
      ref={mapRef} 
      className={`relative h-full w-full overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
    >
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-primary-500">Loading map...</div>
        </div>
      ) : (
        <>
          {/* Mock map UI */}
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
            {/* Mock map grid */}
            <div className="h-full w-full grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-gray-300 dark:border-gray-600" 
                />
              ))}
            </div>
            
            {/* Render routes */}
            {showRoutes.map((route, index) => (
              renderRoute(route.from, route.to, route.type)
            ))}
            
            {/* Mock markers */}
            {markers.map((marker) => (
              <button
                key={marker.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                  highlightMarker === marker.id ? 'scale-125 z-20' : 'hover:scale-110'
                } ${
                  marker.type === 'vendor' ? 'text-secondary-500' : 
                  marker.type === 'driver' ? 'text-blue-500' : 'text-primary-500'
                }`}
                style={{ 
                  left: `${((marker.position[0] - center[0]) / 0.02 + 50)}%`, 
                  top: `${((marker.position[1] - center[1]) / -0.02 + 50)}%` 
                }}
                onClick={() => onMarkerClick && onMarkerClick(marker.id)}
              >
                {marker.type === 'vendor' && (
                  <div className="flex flex-col items-center">
                    <div className={`relative ${highlightMarker === marker.id ? 'animate-pulse' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                      </svg>
                      {highlightMarker === marker.id && (
                        <div className="absolute -inset-1 rounded-full border-2 border-secondary-500 animate-ping opacity-75"></div>
                      )}
                    </div>
                    {marker.data?.name && (
                      <div className={`bg-white text-black text-xs py-1 px-2 rounded-md shadow-md ${
                        marker.data.price ? 'font-medium' : ''
                      }`}>
                        {marker.data.name}
                        {marker.data.price && (
                          <div className="text-primary-600">
                            {marker.data.price.toLocaleString()} TZS
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {marker.type === 'driver' && (
                  <div className={`relative ${highlightMarker === marker.id ? 'animate-pulse' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8c0-3.4-2.7-6.2-6-6.2s-6 2.8-6 6.2c0 2.5 1.3 4.7 3.3 5.8l2.7 2 2.7-2c2-1.1 3.3-3.3 3.3-5.8z"/>
                    </svg>
                    {highlightMarker === marker.id && (
                      <div className="absolute -inset-1 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                    )}
                  </div>
                )}
                {marker.type === 'buyer' && (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                )}
              </button>
            ))}
            
            {/* User location indicator */}
            {showUserLocation && (
              <div 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-500 opacity-20 rounded-full animate-pulse" />
                  <div className="absolute -inset-2 bg-blue-500 opacity-30 rounded-full" />
                  <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
                </div>
              </div>
            )}
          </div>
          
          {/* Map controls */}
          <div className="absolute right-4 bottom-24 flex flex-col space-y-2">
            <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v.01M12 8v.01M12 12v.01M12 16v.01M12 20v.01M4 12h.01M8 12h.01M16 12h.01M20 12h.01" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Map;
