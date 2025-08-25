import { MapPin, BarChart3, Users, Settings, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface MemorialNavProps {
  userType?: 'admin' | 'public';
  username?: string;
  onLogout?: () => void;
}

const MemorialNav = ({ userType = 'admin', username, onLogout }: MemorialNavProps) => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/", active: location.pathname === "/" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard", active: location.pathname === "/dashboard" },
    ...(userType === 'admin' ? [{ icon: Users, label: "Lot Owners", path: "/dashboard", active: false }] : []),
    { icon: Settings, label: "Settings", path: "/dashboard", active: false },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-elegant">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-forest rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-forest-green">Forest Lawn</h1>
              <p className="text-xs text-muted-foreground">Memorial Park</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-auto mr-8">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "memorial" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {username && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Welcome,</span>
                <span className="text-sm font-medium">{username}</span>
                <span className="text-xs bg-forest-green text-white px-2 py-1 rounded">
                  {userType === 'admin' ? 'Admin' : 'Public'}
                </span>
              </div>
            )}
            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
            <button 
              className="w-8 h-8 bg-gradient-memorial rounded-full flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-memorial-gold focus:ring-offset-2"
              aria-label="User account menu"
              title="Account settings"
            >
              <span className="text-sm font-medium text-accent-foreground" aria-hidden="true">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MemorialNav;