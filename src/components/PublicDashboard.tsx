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

// Sample lot data for the public view
const sampleLots = [
  { id: "L001", lotNo: "A-001", area: "Garden Section", phase: "Phase 1", block: "A", status: "Sold", price: 850000, size: "4 sqm", location: "Near Main Entrance" },
  { id: "L002", lotNo: "A-002", area: "Garden Section", phase: "Phase 1", block: "A", status: "Available", price: 720000, size: "4 sqm", location: "Near Prayer Area" },
  { id: "L003", lotNo: "A-003", area: "Garden Section", phase: "Phase 1", block: "A", status: "Sold", price: 780000, size: "4 sqm", location: "Center Area" },
  { id: "L004", lotNo: "B-001", area: "Premium Section", phase: "Phase 1", block: "B", status: "Available", price: 1200000, size: "6 sqm", location: "Premium Area" },
  { id: "L005", lotNo: "B-002", area: "Premium Section", phase: "Phase 1", block: "B", status: "Reserved", price: 1150000, size: "6 sqm", location: "Premium Area" },
  { id: "L006", lotNo: "C-001", area: "Family Estate", phase: "Phase 2", block: "C", status: "Available", price: 1500000, size: "8 sqm", location: "Family Section" },
  { id: "L007", lotNo: "C-002", area: "Family Estate", phase: "Phase 2", block: "C", status: "Available", price: 1450000, size: "8 sqm", location: "Family Section" },
  { id: "L008", lotNo: "D-001", area: "Chaplet Area", phase: "Phase 2", block: "D", status: "Development", price: 950000, size: "5 sqm", location: "Chaplet Section" },
  { id: "L009", lotNo: "D-002", area: "Chaplet Area", phase: "Phase 2", block: "D", status: "Available", price: 920000, size: "5 sqm", location: "Chaplet Section" },
  { id: "L010", lotNo: "E-001", area: "Garden of Peace", phase: "Phase 3", block: "E", status: "Available", price: 1800000, size: "10 sqm", location: "Peace Garden" }
];

const PublicDashboard = ({ username, onLogout }: PublicDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter and search logic (same as before)
  const filteredLots = useMemo(() => {
    const result = sampleLots.filter(lot => {
      const matchesSearch = lot.lotNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lot.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lot.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lot.status.toLowerCase() === statusFilter;
      const matchesArea = areaFilter === "all" || lot.area === areaFilter;
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
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const availableAreas = Array.from(new Set(sampleLots.map(lot => lot.area)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-cream to-memorial-gold/10">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green mb-2">Memorial Park Map View</h1>
          <p className="text-muted-foreground">Explore available memorial lots and find your peaceful resting place</p>
        </div>

        {/* Interactive Map with legend/heading controlled internally */}
        <InteractivePlotMap hideStats />

        {/* Available Lots Table */}
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
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
              <Select value={areaFilter} onValueChange={(v) => { setAreaFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {availableAreas.map(area => (<SelectItem key={area} value={area}>{area}</SelectItem>))}
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
              <p className="text-sm text-muted-foreground">Showing {pagedLots.length} of {filteredLots.length} filtered lots (page {currentPage} of {totalPages})</p>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase & Block</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagedLots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{lot.lotNo}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{lot.area}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{lot.phase} - Block {lot.block}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(lot.status)}`}>{lot.status}</span></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">₱{lot.price.toLocaleString()}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{lot.size}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{lot.location}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap"><Button variant="outline" size="sm" className="flex items-center" onClick={() => { if ((window as any).focusPlotArea) { (window as any).focusPlotArea(lot.area.toLowerCase()); } }}><Eye className="w-4 h-4 mr-1" />View on Map</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PublicDashboard;