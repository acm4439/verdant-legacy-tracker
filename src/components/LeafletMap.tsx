import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

interface Lot {
  id: string;
  phase: string;
  block: string;
  area: string;
  lotNo: string;
  name?: string;
  status: 'sold' | 'available' | 'development' | 'reserved';
  purchaseDate?: string;
  contractPrice?: number;
  paidAmount?: number;
  remainingBalance?: number;
  collector?: string;
  coordinates: LatLngExpression[];
}

interface LeafletMapProps {
  lots: Lot[];
  onLotClick: (lot: Lot) => void;
}

// Map styling for different lot statuses
const getPolygonColor = (status: string) => {
  switch (status) {
    case 'sold': return '#ef4444'; // red
    case 'available': return '#22c55e'; // green
    case 'development': return '#f59e0b'; // yellow
    case 'reserved': return '#3b82f6'; // blue
    default: return '#6b7280'; // gray
  }
};

const LeafletMap = ({ lots, onLotClick }: LeafletMapProps) => {
  useEffect(() => {
    // Fix for default markers in leaflet
    delete (L as any).Icon.Default.prototype._getIconUrl;
    (L as any).Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[14.7450, 121.1247]}
      zoom={18}
      style={{ height: '100%', width: '100%' }}
      bounds={[[14.744429, 121.121024], [14.745598, 121.128346]]}
      scrollWheelZoom={true}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {lots.map((lot) => (
        <Polygon
          key={lot.id}
          positions={lot.coordinates}
          pathOptions={{
            fillColor: getPolygonColor(lot.status),
            fillOpacity: 0.7,
            color: getPolygonColor(lot.status),
            weight: 2,
            opacity: 1
          }}
          eventHandlers={{
            click: () => onLotClick(lot),
            mouseover: (e) => {
              e.target.setStyle({
                fillOpacity: 0.9,
                weight: 3
              });
            },
            mouseout: (e) => {
              e.target.setStyle({
                fillOpacity: 0.7,
                weight: 2
              });
            }
          }}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-semibold text-forest-green">{lot.lotNo}</h3>
              <p className="text-muted-foreground">{lot.area}</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${
                  lot.status === 'sold' ? 'border-red-500 text-red-500' :
                  lot.status === 'available' ? 'border-green-500 text-green-500' :
                  lot.status === 'development' ? 'border-yellow-500 text-yellow-500' :
                  'border-blue-500 text-blue-500'
                }`}
              >
                {lot.status.toUpperCase()}
              </Badge>
              {lot.name && (
                <p className="mt-1 text-xs"><strong>Owner:</strong> {lot.name}</p>
              )}
              <button 
                onClick={() => onLotClick(lot)}
                className="mt-2 text-xs bg-forest-green text-white px-2 py-1 rounded hover:bg-forest-green/80"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;