import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, DollarSign, User, FileText, Phone } from "lucide-react";

interface LotInfo {
  id: string;
  phase: string;
  block: string;
  area: string;
  lotNo: string;
  name?: string;
  status: 'sold' | 'available' | 'development' | 'reserved';
  purchaseDate?: string;
  contractPrice?: number;
  remainingBalance?: number;
  paidAmount?: number;
  collector?: string;
}

interface LotInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lotInfo: LotInfo | null;
}

const statusConfig = {
  sold: {
    color: "bg-status-sold",
    label: "SOLD",
    textColor: "text-white"
  },
  available: {
    color: "bg-status-available", 
    label: "AVAILABLE",
    textColor: "text-white"
  },
  development: {
    color: "bg-status-development",
    label: "UNDER DEVELOPMENT", 
    textColor: "text-white"
  },
  reserved: {
    color: "bg-status-reserved",
    label: "RESERVED",
    textColor: "text-white"
  }
};

const LotInfoModal = ({ open, onOpenChange, lotInfo }: LotInfoModalProps) => {
  if (!lotInfo) return null;

  const config = statusConfig[lotInfo.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="lot-info-description">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl text-forest-green">
                Lot {lotInfo.lotNo}
              </DialogTitle>
              <DialogDescription id="lot-info-description" className="text-muted-foreground mt-1">
                Phase {lotInfo.phase} • Block {lotInfo.block} • Area {lotInfo.area}
              </DialogDescription>
            </div>
            <Badge className={`${config.color} ${config.textColor} text-xs font-medium px-3 py-1`}>
              {config.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <MapPin className="w-5 h-5 text-forest-green" />
                <span>Location Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Lot ID</p>
                <p className="font-medium">{lotInfo.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lot Number</p>
                <p className="font-medium">{lotInfo.lotNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phase</p>
                <p className="font-medium">{lotInfo.phase}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Block</p>
                <p className="font-medium">{lotInfo.block}</p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information - Only show if sold */}
          {lotInfo.status === 'sold' && lotInfo.name && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <User className="w-5 h-5 text-forest-green" />
                  <span>Owner Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Owner Name</p>
                    <p className="font-medium">{lotInfo.name}</p>
                  </div>
                  {lotInfo.purchaseDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Date</p>
                      <p className="font-medium flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{lotInfo.purchaseDate}</span>
                      </p>
                    </div>
                  )}
                  {lotInfo.collector && (
                    <div>
                      <p className="text-sm text-muted-foreground">Collector</p>
                      <p className="font-medium">{lotInfo.collector}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Information - Only show if sold */}
          {lotInfo.status === 'sold' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <DollarSign className="w-5 h-5 text-forest-green" />
                  <span>Financial Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {lotInfo.contractPrice && (
                    <div className="text-center p-4 bg-serenity-cream rounded-lg">
                      <p className="text-sm text-muted-foreground">Contract Price</p>
                      <p className="text-xl font-bold text-forest-green">
                        ₱{lotInfo.contractPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {lotInfo.paidAmount && (
                    <div className="text-center p-4 bg-memorial-gold/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Paid Amount</p>
                      <p className="text-xl font-bold text-memorial-gold">
                        ₱{lotInfo.paidAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {lotInfo.remainingBalance && (
                    <div className="text-center p-4 bg-status-sold/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Remaining Balance</p>
                      <p className="text-xl font-bold text-status-sold">
                        ₱{lotInfo.remainingBalance.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {lotInfo.status === 'sold' && (
              <>
                <Button variant="memorial">
                  <FileText className="w-4 h-4 mr-2" />
                  View Contract
                </Button>
                <Button variant="memorial">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
              </>
            )}
            {lotInfo.status === 'available' && (
              <Button variant="memorial">
                Mark as Reserved
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LotInfoModal;