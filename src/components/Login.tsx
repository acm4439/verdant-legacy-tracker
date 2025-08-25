import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface LoginProps {
  onLogin: (userType: 'admin' | 'public', username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<'admin' | 'public'>('public');

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(selectedUserType, username);
    }
  };

  const handleDemoLogin = (userType: 'admin' | 'public') => {
    const demoUsername = userType === 'admin' ? 'Admin User' : 'Public User';
    onLogin(userType, demoUsername);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenity-cream to-memorial-gold/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-forest-green">Forest Lawn Memorial Park</CardTitle>
          <CardDescription>
            Prototype Login - Choose your access level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select User Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedUserType('public')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedUserType === 'public' 
                    ? 'border-forest-green bg-forest-green/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Badge variant="outline" className="w-full text-center">Public User</Badge>
                <p className="text-xs text-muted-foreground mt-1">View available lots only</p>
              </button>
              <button
                onClick={() => setSelectedUserType('admin')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedUserType === 'admin' 
                    ? 'border-memorial-gold bg-memorial-gold/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Badge variant="outline" className="w-full text-center">Admin User</Badge>
                <p className="text-xs text-muted-foreground mt-1">Full dashboard access</p>
              </button>
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username">Username (Optional)</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {/* Login Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleLogin}
              className="w-full"
              disabled={!username.trim()}
            >
              Login as {selectedUserType === 'admin' ? 'Administrator' : 'Public User'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">Or try demo accounts:</div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('public')}
                className="text-xs"
              >
                Demo Public
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                className="text-xs"
              >
                Demo Admin
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p><strong>Public:</strong> Basic lot information only</p>
            <p><strong>Admin:</strong> Full analytics and management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;