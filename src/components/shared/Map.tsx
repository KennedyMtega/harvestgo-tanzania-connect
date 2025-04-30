
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Vendor {
  id: string;
  lat: number;
  lng: number;
  name: string;
  // Add other vendor properties as needed
}

interface MapComponentProps {
  vendors: Vendor[];
}

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: -6.7924, lng: 39.2083 }; // Default: Dar es Salaam

function MyMapComponent({ vendors }: MapComponentProps) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {vendors.map((vendor) => (
          <Marker key={vendor.id} position={{ lat: vendor.lat, lng: vendor.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;
