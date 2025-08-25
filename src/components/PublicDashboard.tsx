import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InteractivePlotMap from "@/components/InteractivePlotMap";
import MemorialNav from "@/components/MemorialNav";

interface PublicDashboardProps {
  username: string;
  onLogout: () => void;
}

const PublicDashboard = ({ username, onLogout }: PublicDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-cream to-memorial-gold/10">
      <MemorialNav userType="public" username={username} onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest-green mb-2">Forest Lawn Memorial Park</h1>
          <p className="text-muted-foreground">Explore available memorial lots and find your peaceful resting place</p>
        </div>

        {/* Public Stats - Only basic availability info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-forest-green">5</div>
              <p className="text-xs text-muted-foreground">Total Lots</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-status-sold">2</div>
              <p className="text-xs text-muted-foreground">Sold</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-status-available">1</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-status-development">1</div>
              <p className="text-xs text-muted-foreground">Development</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <InteractivePlotMap />

        {/* Available Lots Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-forest-green">Available Memorial Lots</CardTitle>
            <CardDescription>
              Discover peaceful resting places in our beautifully maintained memorial park
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Garden Section</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Lot A-002</span>
                    <Badge className="bg-status-available text-white">Available</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Premium Section</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Lot B-001</span>
                    <Badge className="bg-status-development text-white">Development</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-serenity-cream rounded-lg">
              <h4 className="font-semibold text-forest-green mb-2">Contact Information</h4>
              <p className="text-sm text-muted-foreground">
                For inquiries about available lots or to schedule a visit, please contact our office at:
              </p>
              <div className="mt-2 text-sm">
                <p><strong>Phone:</strong> (02) 123-4567</p>
                <p><strong>Email:</strong> info@forestlawnmemorial.com</p>
                <p><strong>Office Hours:</strong> Monday - Saturday, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PublicDashboard;