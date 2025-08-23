import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Store, Video, ArrowRight, Check } from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Shop & Discover',
      description: 'Browse products, shop during live streams, and enjoy exclusive deals.',
      icon: Users,
      features: [
        'Browse product catalog',
        'Shop during live streams',
        'Get exclusive deals',
        'Track your orders',
        'Customer support'
      ],
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'wholesaler',
      title: 'Wholesaler',
      subtitle: 'Sell & Supply',
      description: 'List your products, manage inventory, and fulfill orders from customers.',
      icon: Store,
      features: [
        'Upload product catalog',
        'Manage inventory',
        'Process orders',
        'Track sales analytics',
        'Commission earnings'
      ],
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'influencer',
      title: 'Influencer',
      subtitle: 'Stream & Earn',
      description: 'Host live streams, showcase products, and earn commissions on sales.',
      icon: Video,
      features: [
        'Host live streams',
        'Showcase products',
        'Earn commissions',
        'Build your audience',
        'Analytics dashboard'
      ],
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/signup/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/keinlogo.png" 
              alt="Kein Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Join Kein as...
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose your role to get started with the perfect experience tailored for you
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  isSelected 
                    ? 'border-kein-blue bg-kein-blue/5 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-16 h-16 rounded-full ${role.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2 flex items-center justify-center gap-2">
                    {role.title}
                    {isSelected && <Check className="h-5 w-5 text-kein-blue" />}
                  </CardTitle>
                  <Badge variant="secondary" className={role.bgColor + ' ' + role.textColor}>
                    {role.subtitle}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-6">
                    {role.description}
                  </p>
                  <div className="space-y-2">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className={`w-2 h-2 rounded-full ${role.color} mr-3 flex-shrink-0`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-8 py-3 text-lg font-medium transition-all duration-300 ${
              selectedRole 
                ? 'bg-kein-blue hover:bg-kein-blue/90 text-white shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : '...'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-kein-blue font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
