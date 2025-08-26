import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
 } from "lucide-react";
import InteractivePlotMap from "@/components/InteractivePlotMap";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard = ({ username, onLogout }: DashboardProps) => {
  // Sample data
  const dashboardStats = {
    totalLots: 487,
    soldLots: 324,
    availableLots: 98,
    developmentLots: 45,
    reservedLots: 20,
    totalRevenue: 245600000,
    monthlyRevenue: 12800000,
    occupancyRate: 66.5
  };

  const recentTransactions = [
    {
      id: "T001",
      lotNo: "A-045",
      owner: "Maria Santos",
      amount: 850000,
      date: "2024-08-20",
      status: "completed"
    },
    {
      id: "T002", 
      lotNo: "B-023",
      owner: "Carlos Mendez",
      amount: 720000,
      date: "2024-08-18",
      status: "pending"
    },
    {
      id: "T003",
      lotNo: "C-012",
      owner: "Ana Rodriguez",
      amount: 950000,
      date: "2024-08-15", 
      status: "completed"
    }
  ];

  const upcomingPayments = [
    {
      lotNo: "A-078",
      owner: "Juan Dela Cruz",
      amount: 45000,
      dueDate: "2024-08-25"
    },
    {
      lotNo: "B-034",
      owner: "Isabel Garcia",
      amount: 38000,
      dueDate: "2024-08-28"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-cream to-memorial-gold/10">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-forest-green">Memorial Park Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            "Ang binago at Higit na Pinagandang Memorial Park!"
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="memorial">
            <MapPin className="w-4 h-4 mr-2" />
            View Full Map
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-forest-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-forest-green">{dashboardStats.totalLots}</div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              Across all phases
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-memorial-gold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-memorial-gold">{dashboardStats.occupancyRate}%</div>
            <Progress value={dashboardStats.occupancyRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-available">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-available">
              ₱{(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center mt-2 text-sm text-status-available">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-trust-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-trust-blue">
              ₱{(dashboardStats.totalRevenue / 1000000).toFixed(0)}M
            </div>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              Lifetime revenue
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map Section */}
      <InteractivePlotMap />

      {/* Recent Activity & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-forest-green" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>Latest lot purchases and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-serenity-cream rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.status === 'completed' ? 'bg-status-available' : 'bg-status-development'
                    }`} />
                    <div>
                      <p className="font-medium">Lot {transaction.lotNo}</p>
                      <p className="text-sm text-muted-foreground">{transaction.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest-green">₱{transaction.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-memorial-gold" />
              <span>Upcoming Payments</span>
            </CardTitle>
            <CardDescription>Payment reminders and due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-memorial-gold/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-memorial-gold" />
                    <div>
                      <p className="font-medium">Lot {payment.lotNo}</p>
                      <p className="text-sm text-muted-foreground">{payment.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-memorial-gold">₱{payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Due {payment.dueDate}</p>
                  </div>
                </div>
              ))}
              <Button variant="memorial" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                View All Payment Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;