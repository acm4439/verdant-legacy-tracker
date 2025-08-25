import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LotInfoModal from "./LotInfoModal";
import "leaflet/dist/leaflet.css";

// Sample lot data with GeoJSON polygons for map plotting
const sampleLots = [
  {
    id: "L001",
    phase: "1",
    block: "A",
    area: "Garden Section",
    lotNo: "A-001",
    name: "Juan Dela Cruz",
    status: 'sold' as const,
    purchaseDate: "2023-06-15",
    contractPrice: 850000,
    paidAmount: 425000,
    remainingBalance: 425000,
    collector: "Maria Santos",
    coordinates: [
      [14.745200, 121.121500],
      [14.745200, 121.121800],
      [14.745000, 121.121800],
      [14.745000, 121.121500]
    ] as LatLngExpression[]
  },
  {
    id: "L002", 
    phase: "1",
    block: "A",
    area: "Garden Section", 
    lotNo: "A-002",
    status: 'available' as const,
    coordinates: [
      [14.745200, 121.121800],
      [14.745200, 121.122100],
      [14.745000, 121.122100],
      [14.745000, 121.121800]
    ] as LatLngExpression[]
  },
  {
    id: "L003",
    phase: "1", 
    block: "A",
    area: "Garden Section",
    lotNo: "A-003",
    name: "Ana Rodriguez",
    status: 'sold' as const,
    purchaseDate: "2023-08-22",
    contractPrice: 720000,
    paidAmount: 720000,
    remainingBalance: 0,
    collector: "Carlos Mendez",
    coordinates: [
      [14.745000, 121.121500],
      [14.745000, 121.121800],
      [14.744800, 121.121800],
      [14.744800, 121.121500]
    ] as LatLngExpression[]
  },
  {
    id: "L004",
    phase: "1",
    block: "B", 
    area: "Premium Section",
    lotNo: "B-001",
    status: 'development' as const,
    coordinates: [
      [14.745100, 121.124500],
      [14.745100, 121.125000],
      [14.744900, 121.125000],
      [14.744900, 121.124500]
    ] as LatLngExpression[]
  },
  {
    id: "L005",
    phase: "2",
    block: "C",
    area: "Family Estate",
    lotNo: "C-001", 
    status: 'reserved' as const,
    coordinates: [
      [14.745300, 121.127000],
      [14.745300, 121.127500],
      [14.745100, 121.127500],
      [14.745100, 121.127000]
    ] as LatLngExpression[]
  }
];

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

const statusColors = {
  sold: "bg-status-sold hover:bg-status-sold/80",
  available: "bg-status-available hover:bg-status-available/80", 
  development: "bg-status-development hover:bg-status-development/80",
  reserved: "bg-status-reserved hover:bg-status-reserved/80"
};

const InteractivePlotMap = () => {
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLotClick = (lot: any) => {
    setSelectedLot(lot);
    setModalOpen(true);
  };

  const statistics = {
    total: sampleLots.length,
    sold: sampleLots.filter(lot => lot.status === 'sold').length,
    available: sampleLots.filter(lot => lot.status === 'available').length,
    development: sampleLots.filter(lot => lot.status === 'development').length,
    reserved: sampleLots.filter(lot => lot.status === 'reserved').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-forest-green">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">Total Lots</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-status-sold">{statistics.sold}</div>
            <p className="text-xs text-muted-foreground">Sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-status-available">{statistics.available}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-status-development">{statistics.development}</div>
            <p className="text-xs text-muted-foreground">Development</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-status-reserved">{statistics.reserved}</div>
            <p className="text-xs text-muted-foreground">Reserved</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-forest-green">Site Development Plan</CardTitle>
          <CardDescription>
            Click on any lot to view detailed information. Colors indicate current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-serenity-cream rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-status-sold rounded"></div>
              <span className="text-sm">Sold</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-status-available rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-status-development rounded"></div>
              <span className="text-sm">Under Development</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-status-reserved rounded"></div>
              <span className="text-sm">Reserved</span>
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div className="h-96 rounded-lg overflow-hidden border border-border">
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
              
              {/* Render polygons for each lot */}
              {sampleLots.map((lot) => (
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
                    click: () => handleLotClick(lot),
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
                        onClick={() => handleLotClick(lot)}
                        className="mt-2 text-xs bg-forest-green text-white px-2 py-1 rounded hover:bg-forest-green/80"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Polygon>
              ))}
            </MapContainer>
          </div>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Interactive lot selection - Click any numbered lot to view detailed information
            </p>
            <p className="text-xs text-muted-foreground">
              Use Tab key to navigate between lots, Enter or Space to select
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lot Information Modal */}
      <LotInfoModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        lotInfo={selectedLot}
      />
    </div>
  );
};

export default InteractivePlotMap;