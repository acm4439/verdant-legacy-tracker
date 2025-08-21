import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LotInfoModal from "./LotInfoModal";

// Sample lot data based on the Excel structure
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

          {/* Site Plan Image with Overlaid Interactive Elements */}
          <div className="relative bg-gradient-subtle rounded-lg overflow-hidden">
            <img 
              src="/lovable-uploads/9108a20f-d140-47a2-9217-3efa3d62f717.png"
              alt="Forest Lawn Memorial Park Site Plan"
              className="w-full h-auto opacity-90"
            />
            
            {/* Interactive Lot Overlays - Positioned over the map */}
            <div className="absolute inset-0">
              {/* Phase 1 - Garden Section (Left side area) */}
              <div className="absolute top-[35%] left-[15%] grid grid-cols-2 gap-1">
                {sampleLots.filter(lot => lot.phase === "1" && lot.block === "A").map((lot, index) => (
                  <button
                    key={lot.id}
                    onClick={() => handleLotClick(lot)}
                    className={`w-12 h-8 ${statusColors[lot.status]} rounded border-2 border-white shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center`}
                    title={`Lot ${lot.lotNo} - ${lot.status.toUpperCase()}`}
                  >
                    <span className="text-xs font-bold text-white">{lot.lotNo.split('-')[1]}</span>
                  </button>
                ))}
              </div>

              {/* Phase 1 - Premium Section (Center area) */}
              <div className="absolute top-[45%] left-[45%]">
                {sampleLots.filter(lot => lot.phase === "1" && lot.block === "B").map((lot) => (
                  <button
                    key={lot.id}
                    onClick={() => handleLotClick(lot)}
                    className={`w-16 h-10 ${statusColors[lot.status]} rounded border-2 border-white shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center`}
                    title={`Lot ${lot.lotNo} - ${lot.status.toUpperCase()}`}
                  >
                    <span className="text-xs font-bold text-white">{lot.lotNo.split('-')[1]}</span>
                  </button>
                ))}
              </div>

              {/* Phase 2 - Family Estate (Right side) */}
              <div className="absolute top-[30%] right-[20%]">
                {sampleLots.filter(lot => lot.phase === "2").map((lot) => (
                  <button
                    key={lot.id}
                    onClick={() => handleLotClick(lot)}
                    className={`w-20 h-12 ${statusColors[lot.status]} rounded border-2 border-white shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center`}
                    title={`Lot ${lot.lotNo} - ${lot.status.toUpperCase()}`}
                  >
                    <span className="text-xs font-bold text-white">{lot.lotNo.split('-')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Interactive lot selection - Click any colored area to view lot details
          </p>
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