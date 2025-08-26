import { useEffect, useRef, useState } from "react";
import mapData from '../../map.geojson';

interface DetailedLot {
  id: string;
  phase: string;
  block: string;
  area: string;
  lotNo: string;
  pid: string;
  poNumber: string;
  name: string;
  tSale: string;
  purchaseDate: string;
  interest: number;
  term: number;
  principalLot: number;
  vatLot: number;
  pcfLot: number;
  contractPrice: number;
  interestLot: number;
  interestVat: number;
  tcpWithInt: number;
  ma: number;
  addons: number;
  interment: number;
  dpPercentage: number;
  dpCount: number;
  dpLastPayment: string;
  cbi: number;
  dpAmount: number;
  amortizationStartDate: string;
  amortizationEndDate: string;
  amortizationLastPayment: string;
  lpMa: number;
  rlpma: number;
  paidAmount: number;
  remainingBalance: number;
  status: string;
  collector: string;
}

interface SimpleLeafletMapProps {
  lots: any[]; // Allow simple lot data structure  
  onLotClick: (lot: any) => void;
//   lots: DetailedLot[];
//   onLotClick: (lot: DetailedLot) => void;
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

// Map styling for different lot statuses
const getPolygonColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'sold': return '#ef4444'; // red
    case 'available': return '#22c55e'; // green
    case 'development': return '#f59e0b'; // yellow
    case 'reserved': return '#3b82f6'; // blue
    case 'dp sales': return '#8b5cf6'; // purple
    case '20% dp': return '#ec4899'; // pink
    case '15k interment rider': return '#06b6d4'; // cyan
    case 'missing payment': return '#dc2626'; // dark red
    case 'fully paid': return '#059669'; // dark green
    case 'partial payment': return '#d97706'; // orange
    default: return '#6b7280'; // gray
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'sold':
    case 'fully paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'dp sales':
    case '20% dp':
    case 'partial payment':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'reserved':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'missing payment':
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'development':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'available':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const LeafletMap = ({ lots, onLotClick, publicMode = false, ownedLot }: SimpleLeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedPlotArea, setSelectedPlotArea] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const ownedMarkerRef = useRef<any>(null);
  
  // Public-facing availability data (demo)
  const publicAvailabilityData: Record<string, {
    summary: string;
    slotsAvailable: number;
    pricePerSlot: number;
    currency: string;
    paymentOptions: Array<{ label: string; details: string }>
  }> = {
    'Gumamela B': {
      summary: 'Middle section available; outer rows sold.',
      slotsAvailable: 12,
      pricePerSlot: 85000,
      currency: '₱',
      paymentOptions: [
        { label: 'Cash', details: '₱80,000 promotional cash price' },
        { label: '20% downpayment', details: '₱17,000 DP + 24 mos at ₱3,400/mo' },
        { label: '10% downpayment', details: '₱8,500 DP + 36 mos at ₱2,500/mo' }
      ]
    },
    'Garden of Peace B': {
      summary: 'Multiple lawn lots available across the block.',
      slotsAvailable: 8,
      pricePerSlot: 150000,
      currency: '₱',
      paymentOptions: [
        { label: 'Cash', details: '₱145,000 discounted cash price' },
        { label: '20% downpayment', details: '₱30,000 DP + 36 mos at ₱3,333/mo' },
        { label: '30% downpayment', details: '₱45,000 DP + 24 mos at ₱4,375/mo' }
      ]
    }
  };

  // Sample detailed lot data for each plot area - multiple people per area
  const plotAreaData: { [key: string]: DetailedLot[] } = {
    // Each array below intentionally matches the plot area name
    'Hyacinth': [
      {
        id: 'H-001',
        phase: 'Hyacinth',
        block: 'Block A',
        area: 'Hyacinth Garden',
        lotNo: 'Hyacinth-001',
        pid: 'HYAC001',
        poNumber: 'PO-HYAC-001',
        name: 'RACAZA, SESENA V.',
        tSale: 'Active Payment',
        purchaseDate: '27/11/2024',
        interest: 0,
        term: 84,
        principalLot: 26785.71,
        vatLot: 3214.29,
        pcfLot: 3000,
        contractPrice: 33000.24,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 33000.24,
        ma: 392.86,
        addons: 0,
        interment: 0,
        dpPercentage: 0,
        dpCount: 1,
        dpLastPayment: '',
        cbi: 0,
        dpAmount: 0,
        amortizationStartDate: '27/11/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 84,
        paidAmount: 0,
        remainingBalance: 33000.24,
        status: 'Missing Payment',
        collector: 'DENNIS PINILI'
      },
      {
        id: 'H-002',
        phase: 'Hyacinth',
        block: 'Block A',
        area: 'Hyacinth Garden',
        lotNo: 'Hyacinth-002',
        pid: 'HYAC002',
        poNumber: 'PO-HYAC-002',
        name: 'SANTOS, MARIA L.',
        tSale: 'DP SALES',
        purchaseDate: '15/12/2024',
        interest: 0,
        term: 60,
        principalLot: 28500.00,
        vatLot: 3420.00,
        pcfLot: 3000,
        contractPrice: 34920.00,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 34920.00,
        ma: 582.00,
        addons: 0,
        interment: 0,
        dpPercentage: 20,
        dpCount: 1,
        dpLastPayment: '15/12/2024',
        cbi: 0,
        dpAmount: 6984.00,
        amortizationStartDate: '15/12/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 60,
        paidAmount: 6984.00,
        remainingBalance: 27936.00,
        status: 'DP Sales',
        collector: 'RHEA/JOEY'
      }
    ],
    'Belladona': [
      {
        id: 'B-001',
        phase: 'Belladona',
        block: 'Block B',
        area: 'Belladona Garden',
        lotNo: 'Belladona-001',
        pid: 'BEL001',
        poNumber: 'PO-BEL-001',
        name: 'DANCEL, EVELYN T.',
        tSale: 'Active Payment',
        purchaseDate: '04/09/2024',
        interest: 0,
        term: 84,
        principalLot: 26785.71,
        vatLot: 3214.29,
        pcfLot: 3000,
        contractPrice: 33000.24,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 33000.24,
        ma: 392.86,
        addons: 0,
        interment: 0,
        dpPercentage: 0,
        dpCount: 1,
        dpLastPayment: '',
        cbi: 0,
        dpAmount: 0,
        amortizationStartDate: '04/09/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 84,
        paidAmount: 0,
        remainingBalance: 33000.24,
        status: 'Missing Payment',
        collector: 'RHEA/JOEY'
      },
      {
        id: 'B-002',
        phase: 'Belladona',
        block: 'Block B',
        area: 'Belladona Garden',
        lotNo: 'Belladona-002',
        pid: 'BEL002',
        poNumber: 'PO-BEL-002',
        name: 'GARCIA, JUAN P.',
        tSale: 'FULLY PAID',
        purchaseDate: '20/10/2023',
        interest: 0,
        term: 12,
        principalLot: 25000.00,
        vatLot: 3000.00,
        pcfLot: 3000,
        contractPrice: 31000.00,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 31000.00,
        ma: 2583.33,
        addons: 0,
        interment: 0,
        dpPercentage: 100,
        dpCount: 1,
        dpLastPayment: '20/10/2023',
        cbi: 0,
        dpAmount: 31000.00,
        amortizationStartDate: '20/10/2023',
        amortizationEndDate: '20/10/2024',
        amortizationLastPayment: '20/10/2024',
        lpMa: 0,
        rlpma: 0,
        paidAmount: 31000.00,
        remainingBalance: 0,
        status: 'Fully Paid',
        collector: 'DENNIS PINILI'
      }
    ],
    'Willow': [
      {
        id: 'W-001',
        phase: 'Willow',
        block: 'Block W',
        area: 'Willow Estate',
        lotNo: 'Willow-001',
        pid: 'WIL001',
        poNumber: 'PO-WIL-001',
        name: 'CALISAY, CECILIA M.',
        tSale: 'Active Payment',
        purchaseDate: '02/12/2024',
        interest: 0,
        term: 12,
        principalLot: 12175.32,
        vatLot: 1607.14,
        pcfLot: 1217.53,
        contractPrice: 15000,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 15000,
        ma: 1002.44,
        addons: 0,
        interment: 0,
        dpPercentage: 20,
        dpCount: 1,
        dpLastPayment: '',
        cbi: 0,
        dpAmount: 2435.06,
        amortizationStartDate: '02/12/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 12,
        paidAmount: 0,
        remainingBalance: 15000,
        status: 'Partial Payment',
        collector: 'DENNIS PINILI'
      },
      {
        id: 'W-002',
        phase: 'Willow',
        block: 'Block W',
        area: 'Willow Estate',
        lotNo: 'Willow-002',
        pid: 'WIL002',
        poNumber: 'PO-WIL-002',
        name: 'REYES, ANTONIO S.',
        tSale: 'RESERVED',
        purchaseDate: '10/12/2024',
        interest: 0,
        term: 12,
        principalLot: 12175.32,
        vatLot: 1607.14,
        pcfLot: 1217.53,
        contractPrice: 15000,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 15000,
        ma: 1002.44,
        addons: 0,
        interment: 0,
        dpPercentage: 10,
        dpCount: 1,
        dpLastPayment: '10/12/2024',
        cbi: 0,
        dpAmount: 1500.00,
        amortizationStartDate: '10/12/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 12,
        paidAmount: 1500.00,
        remainingBalance: 13500.00,
        status: 'Reserved',
        collector: 'CASIMIRO "JUN" GIMEDA'
      }
    ],
    'Lilac': [
      {
        id: 'L-001',
        phase: 'Lilac',
        block: 'Block L',
        area: 'Lilac Garden',
        lotNo: 'Lilac-001',
        pid: 'LIL001',
        poNumber: 'PO-LIL-001',
        name: 'PAGKATIPUNAN, VIOLETA S.',
        tSale: 'DP SALES',
        purchaseDate: '05/11/2024',
        interest: 0,
        term: 24,
        principalLot: 85759.74,
        vatLot: 11320.29,
        pcfLot: 8575.97,
        contractPrice: 105656,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 105656,
        ma: 3522.16,
        addons: 0,
        interment: 0,
        dpPercentage: 20.19,
        dpCount: 1,
        dpLastPayment: '',
        cbi: 0,
        dpAmount: 17314.89,
        amortizationStartDate: '05/11/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 24,
        paidAmount: 0,
        remainingBalance: 105656,
        status: 'DP Sales',
        collector: 'JESS'
      },
      {
        id: 'L-002',
        phase: 'Lilac',
        block: 'Block L',
        area: 'Lilac Garden',
        lotNo: 'Lilac-002',
        pid: 'LIL002',
        poNumber: 'PO-LIL-002',
        name: 'MARTINEZ, CARLOS R.',
        tSale: 'FULLY PAID',
        purchaseDate: '15/08/2023',
        interest: 0,
        term: 24,
        principalLot: 85759.74,
        vatLot: 11320.29,
        pcfLot: 8575.97,
        contractPrice: 105656,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 105656,
        ma: 3522.16,
        addons: 0,
        interment: 0,
        dpPercentage: 100,
        dpCount: 1,
        dpLastPayment: '15/08/2023',
        cbi: 0,
        dpAmount: 105656,
        amortizationStartDate: '15/08/2023',
        amortizationEndDate: '15/08/2025',
        amortizationLastPayment: '15/08/2025',
        lpMa: 0,
        rlpma: 0,
        paidAmount: 105656,
        remainingBalance: 0,
        status: 'Fully Paid',
        collector: 'JESS'
      },
      {
        id: 'L-003',
        phase: 'Lilac',
        block: 'Block L',
        area: 'Lilac Garden',
        lotNo: 'Lilac-003',
        pid: 'LIL003',
        poNumber: 'PO-LIL-003',
        name: 'LOPEZ, ANA M.',
        tSale: '20% DP',
        purchaseDate: '20/12/2024',
        interest: 0,
        term: 24,
        principalLot: 85759.74,
        vatLot: 11320.29,
        pcfLot: 8575.97,
        contractPrice: 105656,
        interestLot: 0,
        interestVat: 0,
        tcpWithInt: 105656,
        ma: 3522.16,
        addons: 0,
        interment: 0,
        dpPercentage: 20,
        dpCount: 1,
        dpLastPayment: '20/12/2024',
        cbi: 0,
        dpAmount: 21131.20,
        amortizationStartDate: '20/12/2024',
        amortizationEndDate: '0000-00-00',
        amortizationLastPayment: '',
        lpMa: 0,
        rlpma: 24,
        paidAmount: 21131.20,
        remainingBalance: 84524.80,
        status: '20% DP',
        collector: 'JESS'
      }
    ]
  };

  const handlePlotAreaClick = (plotName: string) => {
    setSelectedPlotArea(plotName);
    setShowModal(true);
  };

  // Normalize a name for matching status map
  const normalizeName = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

  // Provided plot status map (uppercased keys from user's list)
  const plotStatusMap: Record<string, string> = {
    HYACINTH: 'SOLD',
    BELLADONNA: 'SOLD', // alias handled below
    BELLADONA: 'SOLD',
    WILLOW: 'SOLD',
    AZALEA: 'SOLD',
    MARIGOLD: 'SOLD',
    PRIMROSE: 'SOLD',
    RUELLA: 'SOLD',
    JASMINE: 'SOLD',
    DAPHNE: 'SOLD',
    CAMELLA: 'PARTIALLY SOLD',
    IRIS: 'SOLD',
    LILAC: 'SOLD',
    ROSE: 'SOLD',
    ADELFA: 'SOLD',
    CATTLEYA: 'SOLD',
    'ANTHURIUM A': 'SOLD',
    'ANTHURIUM B': 'SOLD',
    'BROMELIAD A': 'SOLD',
    'BROMELIAD B': 'SOLD',
    DENDROBIUM: 'SOLD',
    HENNA: 'SOLD',
    SANTAN: 'SOLD',
    'SANTAN 2': 'SOLD',
    'ROSELLE A': 'SOLD',
    'ROSELLE B': 'SOLD',
    'GUMAMELA A': 'SOLD',
    'GUMAMELA B': 'OUTER SOLD, MIDDLE UNSOLD',
    'AZUCENA A': 'OUTER UNSOLD, INNER SOLD, MIDDLE SOLD',
    'AZUCENA B': 'OUTER SOLD, INNER SOLD, MIDDLE UNSOLD',
    'CAMIA A': 'OUTER SOLD, MIDDLE UNSOLD',
    'CAMIA B': 'OUTER SOLD, MIDDLE UNSOLD',
    'CHAPLET (ACACIA)': 'FOR DEVELOPMENT',
    'CHAPLET (BANABA)': 'FOR DEVELOPMENT',
    'GARDEN OF LOVE': 'PARTIALLY SOLD',
    'GARDEN OF PEACE A': 'UNSOLD',
    'GARDEN OF PEACE B': 'UNSOLD',
    'GARDEN OF BEAUTY A': 'UNSOLD',
    'GARDEN OF BEAUTY B': 'UNSOLD',
    'GARDEN OF PARADISE A': 'SOLD',
    'GARDEN OF PARADISE B': 'PARTIALLY SOLD',
  };

  // Map GeoJSON names to status keys
  const nameAliases: Record<string, string> = {
    'belladona': 'belladonna',
    'chaplet acacia': 'chaplet (acacia)',
    'chaplet banaba': 'chaplet (banaba)',
    'santan1': 'santan',
    'santan2': 'santan 2',
    'anthurium a': 'anthurium a',
    'anthurium b': 'anthurium b',
    'bromeliad a': 'bromeliad a',
    'bromeliad b': 'bromeliad b',
    'garden of peace a': 'garden of peace a',
    'garden of peace b': 'garden of peace b',
    'garden of beauty a': 'garden of beauty a',
    'garden of beauty b': 'garden of beauty b',
    'garden of love': 'garden of love',
    'garden of paradise a': 'garden of paradise a',
    'garden of paradise b': 'garden of paradise b',
  };

  const getStatusForFeature = (rawName: string): string => {
    const n = normalizeName(rawName);
    const aliasKey = nameAliases[rawName.toLowerCase()] || rawName;
    const direct = plotStatusMap[aliasKey.toUpperCase()];
    if (direct) return direct;
    // try normalized fallback
    for (const key in plotStatusMap) {
      if (normalizeName(key) === n) return plotStatusMap[key];
    }
    return 'UNSOLD';
  };

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
      if (!(window as any).L || mapInstanceRef.current) return;

      // Initialize map with restricted bounds
      const map = new (window as any).L.Map(mapRef.current!, {
        center: [14.7450, 121.1247],
        zoom: 19,
        scrollWheelZoom: true,
        maxBounds: [[14.743000, 121.120000], [14.746500, 121.129000]], // Lock to memorial park area
        maxBoundsViscosity: 0.2, // Prevent dragging outside bounds
        minZoom: 17, // Prevent zooming out too much
        maxZoom: 20, // Allow detailed zoom
      });

      // Add tile layer
      new (window as any).L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Set bounds
      map.fitBounds([
        [14.744429, 121.121024],
        [14.745598, 121.128346]
      ]);
      

      // Index of layers by plot name for external focus/search
      const nameToLayer: Record<string, any> = {};

      // Utility: build inner polygon within a layer by moving vertices towards centroid
      const buildInnerPolygon = (latlngs: any[], factor: number) => {
        const flat: any[] = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
        const cx = flat.reduce((s, p) => s + p.lat, 0) / flat.length;
        const cy = flat.reduce((s, p) => s + p.lng, 0) / flat.length;
        const inner = flat.map((p) => ({
          lat: cx + (p.lat - cx) * (1 - factor),
          lng: cy + (p.lng - cy) * (1 - factor)
        }));
        return (window as any).L.polygon(inner as any, {
          color: 'transparent',
          weight: 0,
          fillOpacity: 0.6,
          interactive: false,
        });
      };

      // Add GeoJSON layer for memorial park lots
      const geo = (window as any).L.geoJSON(mapData, {
        style: (feature: any) => {
          const hasData = !!plotAreaData[feature.properties.name];
          const status = getStatusForFeature(feature.properties.name);
          const fillColor = ((): string => {
            if (status.includes('FOR DEVELOPMENT')) return '#cc5e7d';
            if (status.includes('SOLD') && !status.includes('UNSOLD') && !status.includes('PARTIALLY')) return '#facc15'; // yellow
            if (status === 'UNSOLD') return '#ffffff';
            // partially/complex defaults to mostly white
            return '#ffffff';
          })();
          return {
            fillColor,
            fillOpacity: 0.7,
            color: hasData ? '#ef4444' : '#065f46',
            weight: hasData ? 3 : 2,
            opacity: 1
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const key = String(feature.properties.name).toLowerCase();
          nameToLayer[key] = layer;
          const status = getStatusForFeature(feature.properties.name);
          // Add popup content
          const isPublic = publicMode;
          const showsAvailability = status === 'UNSOLD' || status.toUpperCase().includes('PARTIALLY') || status.toUpperCase().includes('UNSOLD');
          const buttonEnabled = isPublic ? showsAvailability : true;
          const buttonLabel = isPublic ? (buttonEnabled ? 'View Available Lots' : 'No Available Lots') : 'View All Lots';
          const buttonOnClick = buttonEnabled ? `onclick="window.handlePlotAreaClick('${feature.properties.name}')"` : '';
          const buttonStyles = `
                margin-top: 8px;
                padding: 6px 12px;
                background-color: ${buttonEnabled ? '#065f46' : '#9ca3af'};
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: ${buttonEnabled ? 'pointer' : 'not-allowed'};
                width: 100%;
              `;
          const subtitle = isPublic ? 'Public view' : 'Management view';
          const note = isPublic ? (buttonEnabled ? 'Click to see available lots and pricing' : 'Area currently has no public availability') : 'Click to view all lots in this area';
          const popupContent = `
            <div style="font-family: system-ui; min-width: 220px;">
              <h3 style="margin: 0 0 4px 0; color: #065f46; font-weight: 600;">${feature.properties.name}</h3>
              <p style="margin: 0 0 4px 0; color: #16a34a; font-size: 12px;">${subtitle}</p>
              <p style="margin: 0 8px 8px 0; color: #6b7280; font-size: 13px;">Status: ${status}</p>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">${note}</p>
              <button ${buttonOnClick} style="${buttonStyles}">${buttonLabel}</button>
            </div>
          `;

          layer.bindPopup(popupContent);

          // Label (plot name). We'll toggle visibility based on zoom
          const tooltip = layer.bindTooltip(String(feature.properties.name), {
            permanent: true,
            direction: 'center',
            className: 'plot-label'
          }).getTooltip();

          // Add hover effects
          layer.on('mouseover', () => {
            layer.setStyle({
              fillOpacity: 0.8,
              weight: 3
            });
          });

          layer.on('mouseout', () => {
            const hasData = !!plotAreaData[feature.properties.name];
            layer.setStyle({
              fillOpacity: 0.6,
              weight: hasData ? 3 : 2
            });
          });

          // Overlays for partial/inner/middle instructions (approximation using inner polygons)
          const s = status.toUpperCase();
          const latlngs: any = layer.getLatLngs();
          if (s.includes('PARTIALLY SOLD')) {
            const innerSmall = buildInnerPolygon(latlngs, 0.45).setStyle({ fillColor: '#facc15' });
            innerSmall.addTo(map);
          }
          if (s.includes('INNER SOLD')) {
            const inner = buildInnerPolygon(latlngs, 0.25).setStyle({ fillColor: '#facc15' });
            inner.addTo(map);
          }
          if (s.includes('MIDDLE SOLD')) {
            const inner1 = buildInnerPolygon(latlngs, 0.35).setStyle({ fillColor: '#facc15', fillOpacity: 0.65 });
            inner1.addTo(map);
          }
          if (s.includes('MIDDLE UNSOLD')) {
            const inner1 = buildInnerPolygon(latlngs, 0.35).setStyle({ fillColor: '#ffffff', fillOpacity: 0.8 });
            inner1.addTo(map);
          }
          if (s.includes('OUTER UNSOLD') && s.includes('INNER SOLD')) {
            layer.setStyle({ fillColor: '#ffffff', fillOpacity: 0.7 });
          }
        }
      }).addTo(map);

      mapInstanceRef.current = map;

      // Owned lot marker setup (public mode)
      const addOwnedMarkerIfAny = () => {
        if (!publicMode || !ownedLot) return;
        // Find the feature layer by name matching the area
        const areaKey = String(ownedLot.areaName).toLowerCase();
        let layer = nameToLayer[areaKey];
        if (!layer) {
          // fallback: try normalized comparison across keys
          const targetNorm = normalizeName(ownedLot.areaName);
          const matchKey = Object.keys(nameToLayer).find((k) => normalizeName(k) === targetNorm);
          if (matchKey) layer = nameToLayer[matchKey];
        }
        if (!layer) return;
        const bounds = layer.getBounds();
        const center = bounds.getCenter();
        if (ownedMarkerRef.current) {
          map.removeLayer(ownedMarkerRef.current);
          ownedMarkerRef.current = null;
        }
        const marker = new (window as any).L.marker(center, {
          title: `${ownedLot.ownerName} – ${ownedLot.lotNo}`
        }).addTo(map);
        ownedMarkerRef.current = marker;
        const content = `
          <div style="font-family: system-ui; min-width: 220px;">
            <div style="font-weight:700; color:#065f46;">Owned Lot</div>
            <div style="margin-top:4px; font-size:14px;"><strong>Owner:</strong> ${ownedLot.ownerName}</div>
            <div style="font-size:14px;"><strong>Area:</strong> ${ownedLot.areaName}</div>
            <div style="font-size:14px;"><strong>Lot No:</strong> ${ownedLot.lotNo}</div>
            <div style="font-size:14px;"><strong>Status:</strong> ${ownedLot.status}</div>
            ${ownedLot.contractPrice ? `<div style="font-size:14px;"><strong>Contract Price:</strong> ₱${(ownedLot.contractPrice||0).toLocaleString()}</div>` : ''}
            ${ownedLot.paymentPlan ? `<div style="font-size:14px;"><strong>Payment Plan:</strong> ${ownedLot.paymentPlan}</div>` : ''}
            ${ownedLot.monthly ? `<div style="font-size:14px;"><strong>Monthly:</strong> ${ownedLot.monthly}</div>` : ''}
            ${ownedLot.remainingBalance ? `<div style="font-size:14px;"><strong>Remaining:</strong> ₱${(ownedLot.remainingBalance||0).toLocaleString()}</div>` : ''}
            ${ownedLot.lastPaymentDate ? `<div style="font-size:14px;"><strong>Last Payment:</strong> ${ownedLot.lastPaymentDate}</div>` : ''}
          </div>`;
        marker.bindPopup(content);
        return { marker, center };
      };

      // Global handler for plot area clicks
      (window as any).handlePlotAreaClick = (plotName: string) => {
        handlePlotAreaClick(plotName);
      };

      // Expose a focus function for searching by plot name (robust matching + better centering)
      (window as any).focusPlotArea = (plotName: string) => {
        if (!plotName) return;
        const inputName = String(plotName);
        const lc = inputName.toLowerCase();
        const aliasKey = nameAliases[lc] || lc;
        let layer = nameToLayer[aliasKey];
        if (!layer) {
          const targetNorm = normalizeName(inputName);
          const matchKey = Object.keys(nameToLayer).find((k) => normalizeName(k) === targetNorm);
          if (matchKey) layer = nameToLayer[matchKey];
        }
        if (layer) {
          setTimeout(() => { try { map.invalidateSize(); } catch {} }, 0);
          const bounds = layer.getBounds();
          map.flyToBounds(bounds, {
            maxZoom: 19,
            paddingTopLeft: [80, 120],
            paddingBottomRight: [80, 120],
            animate: true
          });
          const originalColor = (layer as any).options.color;
          layer.setStyle({ color: '#f97316', weight: 4 });
          layer.openPopup();
          setTimeout(() => {
            layer.setStyle({ color: originalColor, weight: plotAreaData[inputName] ? 3 : 2 });
          }, 1500);
        }
      };

      // Add marker after layers are ready
      const owned = addOwnedMarkerIfAny();

      // Expose function to focus owned lot
      (window as any).focusOwnedLot = () => {
        if (!owned && (!ownedMarkerRef.current)) return;
        const center = owned?.center || ownedMarkerRef.current.getLatLng?.();
        if (!center) return;
        map.setView(center, Math.max(map.getZoom(), 19), { animate: true });
        if (ownedMarkerRef.current) {
          ownedMarkerRef.current.openPopup();
        }
      };

      // Toggle labels based on zoom level
      const toggleLabels = () => {
        const show = map.getZoom() >= 18;
        const labels = document.querySelectorAll('.leaflet-tooltip.plot-label');
        labels.forEach((el: any) => { el.style.display = show ? 'block' : 'none'; });
      };
      map.on('zoomend', toggleLabels);
      // Initial state
      toggleLabels();
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Clean up global handler
      delete (window as any).handlePlotAreaClick;
      delete (window as any).focusPlotArea;
      delete (window as any).focusOwnedLot;
      if (ownedMarkerRef.current) {
        try { mapInstanceRef.current?.removeLayer?.(ownedMarkerRef.current); } catch {}
        ownedMarkerRef.current = null;
      }
    };
  }, [lots, onLotClick, publicMode, ownedLot]);

  const selectedLots = plotAreaData[selectedPlotArea] || [];

  return (
    <>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg relative z-0"
        style={{ minHeight: '384px' }}
      />
      
      {/* Plot Area Details Modal */}
      {showModal && selectedPlotArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPlotArea} Plot Area</h2>
                  <p className="text-green-100 mt-1">{publicMode ? 'Public availability view' : 'Memorial Park Management System'}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-green-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {publicMode ? (
                (() => {
                  const areaKey = Object.keys(publicAvailabilityData).find(k => k.toLowerCase() === String(selectedPlotArea).toLowerCase());
                  const data = areaKey ? publicAvailabilityData[areaKey] : undefined;
                  const status = getStatusForFeature(selectedPlotArea);
                  const showAvail = status === 'UNSOLD' || status.toUpperCase().includes('PARTIALLY') || status.toUpperCase().includes('UNSOLD');
                  if (!showAvail) {
                    return (
                      <div className="text-sm text-gray-700">
                        There are currently no publicly available lots in this area.
                      </div>
                    );
                  }
                  if (!data) {
                    return (
                      <div className="text-sm text-gray-700">
                        Availability information will be posted here when lots are released.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="text-green-700 font-semibold">Slots Available</div>
                          <div className="text-2xl font-bold text-green-800">{data.slotsAvailable}</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                          <div className="text-emerald-700 font-semibold">Price per Slot</div>
                          <div className="text-2xl font-bold text-emerald-800">{data.currency}{data.pricePerSlot.toLocaleString()}</div>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                          <div className="text-teal-700 font-semibold">Summary</div>
                          <div className="text-sm text-teal-900">{data.summary}</div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="p-4 border-b text-sm font-semibold text-gray-700">Payment Options</div>
                        <div className="divide-y">
                          {data.paymentOptions.map((opt, i) => (
                            <div key={i} className="p-4 flex items-start justify-between gap-4">
                              <div>
                                <div className="font-medium text-gray-900">{opt.label}</div>
                                <div className="text-sm text-gray-600">{opt.details}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 text-xs text-gray-500">Prices and terms are illustrative and subject to change without prior notice.</div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-blue-600 font-semibold">Total Lots</div>
                      <div className="text-2xl font-bold text-blue-800">{selectedLots.length}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-green-600 font-semibold">Fully Paid</div>
                      <div className="text-2xl font-bold text-green-800">
                        {selectedLots.filter(lot => lot.status.toLowerCase().includes('fully paid')).length}
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="text-yellow-600 font-semibold">Active Payments</div>
                      <div className="text-2xl font-bold text-yellow-800">
                        {selectedLots.filter(lot => lot.status.toLowerCase().includes('dp sales') || lot.status.toLowerCase().includes('20% dp')).length}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-red-600 font-semibold">Missing Payments</div>
                      <div className="text-2xl font-bold text-red-800">
                        {selectedLots.filter(lot => lot.status.toLowerCase().includes('missing payment')).length}
                      </div>
                    </div>
                  </div>

                  {/* Lots Table */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Info</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collector</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedLots.map((lot) => (
                            <tr key={lot.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{lot.lotNo}</div>
                                  <div className="text-sm text-gray-500">{lot.phase} - {lot.block}</div>
                                  <div className="text-xs text-gray-400">PID: {lot.pid}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{lot.name}</div>
                                  <div className="text-sm text-gray-500">{lot.purchaseDate}</div>
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(lot.status)}`}>
                                  {lot.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₱{lot.contractPrice.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₱{lot.paidAmount.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₱{lot.remainingBalance.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lot.collector}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        console.log('Export data for', selectedPlotArea);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Export Data
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeafletMap;