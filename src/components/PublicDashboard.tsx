import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Eye } from "lucide-react";
import InteractivePlotMap from "@/components/InteractivePlotMap";

interface PublicDashboardProps {
  username: string;
  onLogout: () => void;
}

// Available lot areas by GeoJSON names, restricted to UNSOLD or PARTIALLY SOLD
const availableLotsData = [
  { id: "AV001", plotName: "Camella", areaType: "Regular", phase: "Phase 1", block: "A", status: "Partially Sold", price: 110000, size: "Lawn Lot", area: "Central Walk" },
  { id: "AV002", plotName: "Gumamela B", areaType: "Prime", phase: "Phase 2", block: "C", status: "Partially Sold", price: 120000, size: "Garden Lot", area: "East Lane" },
  { id: "AV003", plotName: "Azucena A", areaType: "Level A", phase: "Phase 2", block: "G", status: "Partially Sold", price: 110000, size: "Lawn Lot", area: "Azucena Lane" },
  { id: "AV004", plotName: "Azucena B", areaType: "Level B", phase: "Phase 2", block: "G", status: "Partially Sold", price: 110000, size: "Lawn Lot", area: "Azucena Lane" },
  { id: "AV005", plotName: "Camia A", areaType: "Regular", phase: "Phase 1", block: "B", status: "Partially Sold", price: 90000, size: "Lawn Lot", area: "Central Walk" },
  { id: "AV006", plotName: "Camia B", areaType: "Regular", phase: "Phase 1", block: "B", status: "Partially Sold", price: 90000, size: "Lawn Lot", area: "Central Walk" },
  { id: "AV007", plotName: "Garden of Love", areaType: "Premium", phase: "Phase 2", block: "D", status: "Partially Sold", price: 135000, size: "Garden Lot", area: "Love Lane" },
  { id: "AV008", plotName: "Garden of Peace A", areaType: "Prime", phase: "Phase 3", block: "E", status: "Unsold", price: 150000, size: "Garden Lot", area: "Peace Garden" },
  { id: "AV009", plotName: "Garden of Peace B", areaType: "Prime", phase: "Phase 3", block: "E", status: "Unsold", price: 150000, size: "Garden Lot", area: "Peace Garden" },
  { id: "AV010", plotName: "Garden of Beauty A", areaType: "Premium", phase: "Phase 3", block: "F", status: "Unsold", price: 180000, size: "Garden Lot", area: "Beauty Walk" },
  { id: "AV011", plotName: "Garden of Beauty B", areaType: "Premium", phase: "Phase 3", block: "F", status: "Unsold", price: 180000, size: "Garden Lot", area: "Beauty Walk" },
  { id: "AV012", plotName: "Garden of Paradise B", areaType: "Premium", phase: "Phase 2", block: "D", status: "Partially Sold", price: 160000, size: "Garden Lot", area: "Paradise Row" }
];

const PublicDashboard = ({ username, onLogout }: PublicDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter and search for available lots (UNSOLD or PARTIALLY SOLD) by GeoJSON plot name
  const filteredLots = useMemo(() => {
    const result = availableLotsData.filter(lot => {
      const haystack = `${lot.plotName} ${lot.area} ${lot.areaType}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const s = lot.status.toLowerCase();
      const matchesStatus = statusFilter === "all" || (statusFilter === 'available' && (s === 'unsold' || s.includes('partially')));
      const matchesArea = areaFilter === "all" || lot.areaType === areaFilter;
      let matchesPrice = true;
      if (priceFilter !== "all") {
        const price = lot.price;
        switch (priceFilter) {
          case "under-1m": matchesPrice = price < 1000000; break;
          case "1m-1.5m": matchesPrice = price >= 1000000 && price < 1500000; break;
          case "over-1.5m": matchesPrice = price >= 1500000; break;
        }
      }
      return matchesSearch && matchesStatus && matchesArea && matchesPrice;
    });
    return result;
  }, [searchTerm, statusFilter, areaFilter, priceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLots.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedLots = filteredLots.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'unsold': return 'bg-green-100 text-green-800 border-green-200';
      case 'partially sold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const availableAreas = Array.from(new Set(availableLotsData.map(lot => lot.areaType)));

  // Demo: public user owns a lot in Belladona
  const ownedLot = {
    areaName: 'Belladona',
    lotNo: 'Belladona-002',
    ownerName: 'Jane Doe',
    status: 'Fully Paid',
    contractPrice: 310000,
    paymentPlan: 'Cash (Paid in Full)',
    monthly: 'N/A',
    remainingBalance: 0,
    lastPaymentDate: '2024-10-20'
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-cream to-memorial-gold/10">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green mb-2">Memorial Park Map View</h1>
          <p className="text-muted-foreground">Explore available memorial lots and find your peaceful resting place</p>
        </div>

        {/* Interactive Map in public mode with owned lot marker */}
        <InteractivePlotMap hideStats publicMode ownedLot={ownedLot} />

        {/* Available Lots Table (only available) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-forest-green">Available Memorial Lots</CardTitle>
            <CardDescription>
              Search and filter through available lots to find your perfect resting place
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search lots..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
              <Select value={areaFilter} onValueChange={(v) => { setAreaFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Area Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Area Types</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Prime">Prime</SelectItem>
                  <SelectItem value="Level A">Level A</SelectItem>
                  <SelectItem value="Level B">Level B</SelectItem>
                  <SelectItem value="Level C">Level C</SelectItem>
                  <SelectItem value="Level D">Level D</SelectItem>
                  <SelectItem value="Level E">Level E</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={(v) => { setPriceFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Price Range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1m">Under ₱1M</SelectItem>
                  <SelectItem value="1m-1.5m">₱1M - ₱1.5M</SelectItem>
                  <SelectItem value="over-1.5m">Over ₱1.5M</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("all"); setAreaFilter("all"); setPriceFilter("all"); setPage(1); }} className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Results + Pagination */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing {pagedLots.length} of {filteredLots.length} available lots (page {currentPage} of {totalPages})</p>
              <div className="space-x-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase & Block</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagedLots
                    .filter((lot) => {
                      const s = lot.status.toLowerCase();
                      return s === 'unsold' || s.includes('partially');
                    })
                    .map((lot) => (
                    <tr key={lot.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{lot.plotName}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{lot.areaType}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{lot.phase} - Block {lot.block}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(lot.status)}`}>{lot.status}</span></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">₱{lot.price.toLocaleString()}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{lot.size}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{lot.area}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><Button variant="outline" size="sm" className="flex items-center" onClick={() => { if ((window as any).focusPlotArea) { (window as any).focusPlotArea(String(lot.plotName).toLowerCase()); } }}><Eye className="w-4 h-4 mr-1" />View on Map</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Owned Lots Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-forest-green">Owned Lots</CardTitle>
            <CardDescription>Lots registered under your name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="p-4 border-b">
                  <div className="text-base font-semibold text-gray-900">{ownedLot.areaName}</div>
                  <div className="text-sm text-gray-600">Lot: {ownedLot.lotNo}</div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Owner</div>
                    <div className="font-medium text-gray-900">{ownedLot.ownerName}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Status</div>
                    <div className="font-medium text-gray-900">{ownedLot.status}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Contract Price</div>
                    <div className="font-medium text-gray-900">₱{ownedLot.contractPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Plan</div>
                    <div className="font-medium text-gray-900">{ownedLot.paymentPlan}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Monthly</div>
                    <div className="font-medium text-gray-900">{ownedLot.monthly}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Remaining</div>
                    <div className="font-medium text-gray-900">₱{ownedLot.remainingBalance.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Last Payment</div>
                    <div className="font-medium text-gray-900">{ownedLot.lastPaymentDate}</div>
                  </div>
                </div>
                <div className="p-4 border-t flex justify-end">
                  <Button variant="outline" onClick={() => {
                    const el = document.getElementById('public-map');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => { (window as any).focusOwnedLot && (window as any).focusOwnedLot(); }, 400);
                  }}>
                    View Lot on Map
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PublicDashboard;