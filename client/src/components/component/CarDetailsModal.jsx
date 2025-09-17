import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Heart,
  Share2,
  Calendar,
  Palette,
  Fuel,
  Settings,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Shield,
  MapPin,
  Star,
  Eye,
  Download,
  Phone,
  MessageCircle,
  Truck,
  Gauge,
  Zap,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Calculator,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Car Details Modal Component
const CarDetailsModal = ({ car, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  // Reset selected image when car changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [car]);

  if (!car) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "available":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          text: "Available Now",
        };
      case "sold":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: X,
          text: "Sold Out",
        };
      case "reserved":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Clock,
          text: "Reserved",
        };
      case "shipped":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Truck,
          text: "In Transit",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Info,
          text: status,
        };
    }
  };

  const statusConfig = getStatusConfig(car.status);
  const StatusIcon = statusConfig.icon;

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  // Sample additional data (you can replace with real data)
  const additionalSpecs = {
    mileage: car.mileage || "15,000 miles",
    mpg: car.mpg || "28/35 mpg",
    engine: car.engine || "2.5L 4-Cylinder",
    drivetrain: car.drivetrain || "Front-Wheel Drive",
    exteriorColor: car.color,
    interiorColor: car.interiorColor || "Black Leather",
    doors: car.doors || 4,
    seats: car.seats || 5,
  };

  const features = car.features || [
    "Backup Camera",
    "Bluetooth Connectivity",
    "Keyless Entry",
    "Power Windows",
    "Air Conditioning",
    "Cruise Control",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl lg:max-w-6xl max-h-[95vh] overflow-y-auto p-0 sm:p-0">
        {/* Header with Close Button */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b p-4 sm:p-6">
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <DialogHeader className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {car.make} {car.model}
                </DialogTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    {car.year}
                  </Badge>
                  <Badge className={`px-3 py-1 border ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.text}
                  </Badge>
                  <Badge className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                    <Globe className="w-3 h-3 mr-1" />
                    {car.originCountry}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  className="h-10 w-10"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Premium {car.condition} condition vehicle • Complete
              specifications and details
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image Gallery */}
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-0">
                  <div className="relative h-64 sm:h-80 md:h-96 group">
                    <img
                      src={
                        car.images[selectedImageIndex] ||
                        "/api/placeholder/800/600"
                      }
                      alt={`${car.make} ${car.model} - Image ${
                        selectedImageIndex + 1
                      }`}
                      className="w-full h-full object-cover"
                    />

                    {/* Image Navigation Buttons */}
                    {car.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={prevImage}
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={nextImage}
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-sm">
                      {selectedImageIndex + 1} / {car.images.length}
                    </div>

                    {/* View Full Screen Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>

                  {/* Thumbnail Gallery */}
                  {car.images.length > 1 && (
                    <div className="p-3 sm:p-4">
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {car.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`relative h-12 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              selectedImageIndex === index
                                ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                            }`}
                          >
                            <img
                              src={image || "/api/placeholder/150/100"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Specifications Tabs */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Detailed Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="specs" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="specs">Specifications</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="condition">Condition</TabsTrigger>
                    </TabsList>

                    <TabsContent value="specs" className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Gauge className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Mileage
                            </p>
                            <p className="font-semibold text-sm sm:text-base">
                              {additionalSpecs.mileage}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Fuel className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Fuel Economy
                            </p>
                            <p className="font-semibold text-sm sm:text-base">
                              {additionalSpecs.mpg}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Zap className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Engine
                            </p>
                            <p className="font-semibold text-sm sm:text-base">
                              {additionalSpecs.engine}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Settings className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Drivetrain
                            </p>
                            <p className="font-semibold text-sm sm:text-base">
                              {additionalSpecs.drivetrain}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="condition" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            <div>
                              <p className="font-semibold text-green-800 dark:text-green-300 capitalize">
                                {car.condition} Condition
                              </p>
                              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                                Thoroughly inspected and certified
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 self-start sm:self-auto">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Purchase Info */}
            <div className="space-y-6">
              {/* Price and Purchase Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-purple-900/20">
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {formatPrice(car.price)}
                    </div>
                    <CardDescription className="text-sm flex flex-col sm:flex-row items-center justify-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Base Price (USD)</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Financing Available</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl backdrop-blur-sm">
                      <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Year
                      </p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {car.year}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl backdrop-blur-sm">
                      <Palette className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Color
                      </p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize">
                        {car.color}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl backdrop-blur-sm">
                      <Fuel className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Fuel
                      </p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize">
                        {car.fuelType}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl backdrop-blur-sm">
                      <Settings className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Trans.
                      </p>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize">
                        {car.transmission}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      onClick={() => navigate(`/financeOption/${car._id}`)}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Finance
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-10 text-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Finance
                      </Button>
                      <Button variant="outline" className="h-10 text-sm">
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="ghost" className="h-10 text-sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="ghost" className="h-10 text-sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Vehicle Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          Origin Country
                        </span>
                      </div>
                      <span className="font-semibold text-sm">
                        {car.originCountry}
                      </span>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Shipping to Africa
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Professional shipping and handling included
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          Verified Dealer
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Licensed & Insured
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Star className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Quality Assured
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Inspected & Certified
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Download className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                          Documentation
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          Complete paperwork included
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailsModal;
