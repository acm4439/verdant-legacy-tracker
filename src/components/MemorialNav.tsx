import { MapPin, BarChart3, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import logo from "../../public/lovable-uploads/logoFLMP.png";

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
    { icon: MapPin, label: "Contact", path: "/contact", active: location.pathname === "/contact" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Forest Lawn" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Forest Lawn</h1>
              <p className="text-xs text-gray-500">Memorial Park</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2 ml-auto mr-8">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 ${
                  item.active 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
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
                <span className="text-sm text-gray-500">Welcome,</span>
                <span className="text-sm font-medium text-gray-900">{username}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  userType === 'admin' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userType === 'admin' ? 'Admin' : 'Public'}
                </span>
              </div>
            )}
            {onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2 border-gray-300 hover:border-gray-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            )}
            <button 
              className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="User account menu"
              title="Account settings"
            >
              <span className="text-sm font-medium text-white" aria-hidden="true">
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