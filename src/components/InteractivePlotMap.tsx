import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LotInfoModal from "./LotInfoModal";
import LeafletMap from "./LeafletMap";

interface InteractivePlotMapProps {
  hideStats?: boolean;
  publicMode?: boolean;
  ownedLot?: {
    areaName: string;
    lotNo: string;
    ownerName: string;
    status: string;
    contractPrice?: number;
    paymentPlan?: string;
    monthly?: string;
    remainingBalance?: number;
    lastPaymentDate?: string;
  };
}

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
    case 'sold': return '#f59e0b'; // yellow
    case 'available': return '#6b7280'; // white
    case 'development': return '#ef4444'; // red
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

const InteractivePlotMap = ({ hideStats = false, publicMode = false, ownedLot }: InteractivePlotMapProps) => {
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
      {/* Statistics Overview (optional) */}
      {!hideStats && (
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
      )}

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-forest-green">Site Development Plan</CardTitle>
          <CardDescription>
            {publicMode
              ? 'Click a plot area, then choose View Available Lots to see public availability.'
              : 'Click on any lot to view detailed information. Colors indicate current status.'}
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
          <div id="public-map" className="h-96 rounded-lg overflow-hidden border border-border relative z-0">
            <LeafletMap lots={sampleLots} onLotClick={handleLotClick} publicMode={publicMode} ownedLot={ownedLot} />
          </div>

          {!publicMode && (
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Interactive lot selection - Click any numbered lot to view detailed information
            </p>
            <p className="text-xs text-muted-foreground">
              Use Tab key to navigate between lots, Enter or Space to select
            </p>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Lot Information Modal (hidden in public mode) */}
      {!publicMode && (
        <LotInfoModal 
          open={modalOpen}
          onOpenChange={setModalOpen}
          lotInfo={selectedLot}
        />
      )}
    </div>
  );
};

export default InteractivePlotMap;