import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  Heart
} from "lucide-react";
import KeinLogo from "@/components/common/KeinLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" }
  ];

  const shopCategories = [
    { label: "Fashion", href: "/shop?category=fashion" },
    { label: "Electronics", href: "/shop?category=electronics" },
    { label: "Beauty", href: "/shop?category=beauty" },
    { label: "Home & Garden", href: "/shop?category=home" },
    { label: "Sports", href: "/shop?category=sports" },
    { label: "Books", href: "/shop?category=books" }
  ];

  const customerService = [
    { label: "Help Center", href: "/help" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Your Order", href: "/track" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Gift Cards", href: "/gift-cards" }
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Sitemap", href: "/sitemap" }
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "SSL encrypted checkout"
    },
    {
      icon: Heart,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ];

  return (
    <footer className="bg-gray-50 border-t">
      {/* Features Section */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-kein-blue/10 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-kein-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-kein-blue to-kein-coral">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Get the latest updates on new products, exclusive deals, and live shopping events
            </p>
            
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              />
              <Button 
                className="bg-white text-kein-blue hover:bg-gray-100 font-semibold px-8"
              >
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm opacity-75 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/home" className="inline-block mb-6">
              <KeinLogo className="h-12" />
            </Link>
            
            <p className="text-gray-600 mb-6 max-w-md">
              Kein is revolutionizing online shopping with live interactive experiences. 
              Discover, engage, and shop with real-time product demonstrations and exclusive deals.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">123 Innovation Drive, Tech Valley, CA 94025</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">hello@kein.com</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-kein-blue hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-kein-blue hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-kein-blue hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-kein-blue hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-gray-600 hover:text-kein-blue transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-3">
              {shopCategories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.href}
                    className="text-gray-600 hover:text-kein-blue transition-colors text-sm"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {customerService.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.href}
                    className="text-gray-600 hover:text-kein-blue transition-colors text-sm"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Opportunities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Join as Business</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/signup/wholesaler"
                  className="text-gray-600 hover:text-kein-blue transition-colors text-sm font-medium"
                >
                  Become a Wholesaler
                </Link>
                <p className="text-xs text-gray-500 mt-1">Sell & Supply Products</p>
              </li>
              <li>
                <Link 
                  to="/signup/influencer"
                  className="text-gray-600 hover:text-kein-blue transition-colors text-sm font-medium"
                >
                  Become an Influencer
                </Link>
                <p className="text-xs text-gray-500 mt-1">Stream & Earn Commissions</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              © {currentYear} Kein. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              {legal.map((link, index) => (
                <Link 
                  key={index}
                  to={link.href}
                  className="text-gray-600 hover:text-kein-blue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <CreditCard className="h-3 w-3 text-gray-600" />
                </div>
                <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">PP</span>
                </div>
                <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">GP</span>
                </div>
                <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">AP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
