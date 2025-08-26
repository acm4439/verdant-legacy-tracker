import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Lock, User, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (userType: 'admin' | 'public', username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Demo accounts
  const demoAccounts = {
    admin: { username: 'admin', password: 'admin123', type: 'admin' as const },
    public: { username: 'public', password: 'public123', type: 'public' as const }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check demo credentials
    const adminAccount = demoAccounts.admin;
    const publicAccount = demoAccounts.public;

    if (username === adminAccount.username && password === adminAccount.password) {
      onLogin(adminAccount.type, 'Administrator');
    } else if (username === publicAccount.username && password === publicAccount.password) {
      onLogin(publicAccount.type, 'Public User');
    } else {
      // For demo purposes, allow any login with these credentials
      if (username.toLowerCase().includes('admin')) {
        onLogin('admin', username);
      } else {
        onLogin('public', username);
      }
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (accountType: 'admin' | 'public') => {
    const account = demoAccounts[accountType];
    setUsername(account.username);
    setPassword(account.password);
    handleLogin();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img
              src="/lovable-uploads/logoFLMP.png"
              alt="Forest Lawn Memorial Park Logo"
              className="w-20 h-20 object-contain rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forest Lawn</h1>
          <p className="text-lg text-gray-600">Memorial Park Management</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access the memorial park management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              disabled={!username.trim() || !password.trim() || isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Demo Accounts Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="h-12 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 font-medium"
              >
                <div className="text-center">
                  <div className="font-semibold">Administrator</div>
                  <div className="text-xs text-gray-500">admin / admin123</div>
                </div>
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('public')}
                className="h-12 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-700 font-medium"
              >
                <div className="text-center">
                  <div className="font-semibold">Public User</div>
                  <div className="text-xs text-gray-500">public / public123</div>
                </div>
              </Button>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">System Access Levels:</p>
                  <ul className="space-y-1 text-xs">
                    <li><strong>Administrator:</strong> Full dashboard access with analytics and management tools</li>
                    <li><strong>Public User:</strong> Basic lot information and viewing capabilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Forest Lawn Memorial Park. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;