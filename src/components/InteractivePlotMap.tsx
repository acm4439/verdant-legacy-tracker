import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LotInfoModal from "./LotInfoModal";

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
    collector: "Maria Santos"
  },
  {
    id: "L002", 
    phase: "1",
    block: "A",
    area: "Garden Section", 
    lotNo: "A-002",
    status: 'available' as const
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
    collector: "Carlos Mendez"
  },
  {
    id: "L004",
    phase: "1",
    block: "B", 
    area: "Premium Section",
    lotNo: "B-001",
    status: 'development' as const
  },
  {
    id: "L005",
    phase: "2",
    block: "C",
    area: "Family Estate",
    lotNo: "C-001", 
    status: 'reserved' as const
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

          {/* Interactive Map with SVG */}
          <div className="h-96 rounded-lg overflow-hidden border border-border bg-gradient-subtle relative">
            <svg 
              viewBox="0 0 800 400" 
              className="w-full h-full"
              role="img"
              aria-label="Interactive memorial park lot map"
            >
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Render lot polygons */}
              {sampleLots.map((lot, index) => {
                // Create simple rectangles for lots positioned across the map
                const positions = [
                  { x: 50, y: 50, width: 80, height: 60 },   // A-001
                  { x: 150, y: 50, width: 80, height: 60 },  // A-002  
                  { x: 50, y: 130, width: 80, height: 60 },  // A-003
                  { x: 300, y: 90, width: 100, height: 80 }, // B-001
                  { x: 500, y: 60, width: 120, height: 100 } // C-001
                ];
                const pos = positions[index] || positions[0];
                
                return (
                  <g key={lot.id}>
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={pos.width}
                      height={pos.height}
                      fill={getPolygonColor(lot.status)}
                      fillOpacity="0.7"
                      stroke={getPolygonColor(lot.status)}
                      strokeWidth="2"
                      className="cursor-pointer hover:fill-opacity-90 transition-all duration-200"
                      onClick={() => handleLotClick(lot)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLotClick(lot);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Lot ${lot.lotNo} in ${lot.area} - Status: ${lot.status}${lot.name ? `, Owner: ${lot.name}` : ''}`}
                    />
                    <text
                      x={pos.x + pos.width/2}
                      y={pos.y + pos.height/2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm font-bold fill-white pointer-events-none"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {lot.lotNo}
                    </text>
                  </g>
                );
              })}
              
              {/* Labels for sections */}
              <text x="90" y="30" textAnchor="middle" className="text-xs font-semibold fill-gray-600">Garden Section</text>
              <text x="350" y="70" textAnchor="middle" className="text-xs font-semibold fill-gray-600">Premium Section</text>
              <text x="560" y="40" textAnchor="middle" className="text-xs font-semibold fill-gray-600">Family Estate</text>
            </svg>
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