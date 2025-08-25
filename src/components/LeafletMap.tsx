import { useEffect, useRef } from "react";

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      if (!window.L || mapInstanceRef.current) return;

      // Initialize map
      const map = new window.L.Map(mapRef.current!, {
        center: [14.7450, 121.1247],
        zoom: 18,
        scrollWheelZoom: true,
      });

      // Add tile layer
      new window.L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Set bounds
      map.fitBounds([
        [14.744429, 121.121024],
        [14.745598, 121.128346]
      ]);

      // Sample coordinates for each lot (positioned within the memorial park bounds)
      const lotCoordinates = {
        'L001': [
          [14.745200, 121.121500],
          [14.745200, 121.121800],
          [14.745000, 121.121800],
          [14.745000, 121.121500]
        ],
        'L002': [
          [14.745200, 121.121800],
          [14.745200, 121.122100],
          [14.745000, 121.122100],
          [14.745000, 121.121800]
        ],
        'L003': [
          [14.745000, 121.121500],
          [14.745000, 121.121800],
          [14.744800, 121.121800],
          [14.744800, 121.121500]
        ],
        'L004': [
          [14.745100, 121.124500],
          [14.745100, 121.125000],
          [14.744900, 121.125000],
          [14.744900, 121.124500]
        ],
        'L005': [
          [14.745300, 121.127000],
          [14.745300, 121.127500],
          [14.745100, 121.127500],
          [14.745100, 121.127000]
        ]
      };

      // Add polygons for each lot
      lots.forEach((lot) => {
        const coords = lotCoordinates[lot.id as keyof typeof lotCoordinates];
        if (!coords) return;

        const polygon = new window.L.Polygon(coords as [number, number][], {
          fillColor: getPolygonColor(lot.status),
          fillOpacity: 0.7,
          color: getPolygonColor(lot.status),
          weight: 2,
          opacity: 1
        }).addTo(map);

        // Add popup content
        const popupContent = `
          <div style="font-family: system-ui; min-width: 150px;">
            <h3 style="margin: 0 0 8px 0; color: #065f46; font-weight: 600;">${lot.lotNo}</h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${lot.area}</p>
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
              color: white;
              background-color: ${getPolygonColor(lot.status)};
            ">${lot.status.toUpperCase()}</span>
            ${lot.name ? `<p style="margin: 8px 0 0 0; font-size: 12px;"><strong>Owner:</strong> ${lot.name}</p>` : ''}
            <button onclick="window.handleLotClick('${lot.id}')" style="
              margin-top: 8px;
              padding: 4px 8px;
              background-color: #065f46;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
            ">View Details</button>
          </div>
        `;

        polygon.bindPopup(popupContent);

        // Add click handler
        polygon.on('click', () => {
          onLotClick(lot);
        });

        // Add hover effects
        polygon.on('mouseover', () => {
          polygon.setStyle({
            fillOpacity: 0.9,
            weight: 3
          });
        });

        polygon.on('mouseout', () => {
          polygon.setStyle({
            fillOpacity: 0.7,
            weight: 2
          });
        });
      });

      mapInstanceRef.current = map;

      // Global handler for popup button clicks
      (window as any).handleLotClick = (lotId: string) => {
        const lot = lots.find(l => l.id === lotId);
        if (lot) onLotClick(lot);
      };
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Clean up global handler
      delete (window as any).handleLotClick;
    };
  }, [lots, onLotClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '384px' }}
    />
  );
};

export default LeafletMap;