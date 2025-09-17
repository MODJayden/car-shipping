import React from "react";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  ArrowRight,
  Shield,
  Truck,
  CreditCard,
  Users,
  Award,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const { isAuth, user } = useSelector((state) => state.user);
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white pt-16 pb-8">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur opacity-75" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-700 p-2 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Shuqran LLC</h3>
                <p className="text-gray-300 text-sm">Global to Global</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Instagram className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Browse Vehicles
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Shipping Services
                </Link>
              </li>
              <li>
                <Link
                  to="/finance"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Financing Options
                </Link>
              </li>
              <li>
                <Link
                  to= {isAuth ? "/track" : "/login"}
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Truck className="w-4 h-4 mr-2 text-blue-400" />
                Vehicle Shipping
              </li>
              <li className="flex items-center text-gray-300">
                <CreditCard className="w-4 h-4 mr-2 text-green-400" />
                Financing Solutions
              </li>
              <li className="flex items-center text-gray-300">
                <Shield className="w-4 h-4 mr-2 text-purple-400" />
                Insurance Services
              </li>
              <li className="flex items-center text-gray-300">
                <Globe className="w-4 h-4 mr-2 text-orange-400" />
                Global Sourcing
              </li>
              <li className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-2 text-pink-400" />
                Customer Support
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-blue-400" />
                <div>
                  <p>+1 (347) 403-7275</p>
                  <p className="text-sm text-gray-400">Mon-Fri, 9AM-5PM</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-green-400" />
                <div>
                  <p>shuqranllc@gmail.com</p>
                  <p className="text-sm text-gray-400">Quick response</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-red-400" />
                <div>
                  <p>963 Woodycrest ave #22b</p>
                  <p className="text-sm text-gray-400">Bronx, NY 10452</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h5 className="font-semibold">5-Star Rated</h5>
            <p className="text-sm text-gray-300">1000+ Reviews</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <Truck className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h5 className="font-semibold">500+ Vehicles</h5>
            <p className="text-sm text-gray-300">Shipped Monthly</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h5 className="font-semibold">10,000+</h5>
            <p className="text-sm text-gray-300">Happy Customers</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h5 className="font-semibold">20+ Countries</h5>
            <p className="text-sm text-gray-300">Worldwide Service</p>
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <span>© 2024 Shuqran LLC. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span className="text-sm text-gray-300">
                for the automotive community
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <Button
          className="rounded-full h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl"
          size="icon"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
