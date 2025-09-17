import React from "react";
import {
  Ship,
  Package,
  Truck,
  Plane,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Navigation,
  Building,
  Hash,
  Globe,
  Home,
  RefreshCw,
  Star,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ShippingDetailsDialog = ({ isOpen, onOpenChange, shipping }) => {
  if (!shipping) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "in-transit":
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      arrived:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      delivered:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      case "shipped":
        return <Ship className="w-4 h-4" />;
      case "in-transit":
        return <Truck className="w-4 h-4" />;
      case "arrived":
        return <Plane className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      partial:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      pending: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[status] || colors.pending;
  };

  const getTransportIcon = (fromCountry) => {
    switch (fromCountry) {
      case "USA":
      case "Canada":
        return <Truck className="w-6 h-6 text-blue-500" />;
      case "Japan":
      case "Europe":
        return <Ship className="w-6 h-6 text-indigo-500" />;
      default:
        return <Plane className="w-6 h-6 text-purple-500" />;
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      USA: "🇺🇸",
      Canada: "🇨🇦",
      Europe: "🇪🇺",
      Japan: "🇯🇵",
      Ghana: "🇬🇭",
      Nigeria: "🇳🇬",
      Kenya: "🇰🇪",
      "South Africa": "🇿🇦",
    };
    return flags[country] || "🌍";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateDaysInTransit = () => {
    const created = new Date(shipping.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = () => {
    const statusOrder = [
      "pending",
      "processing",
      "shipped",
      "in-transit",
      "arrived",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(shipping.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center text-xl">
            <Package className="w-6 h-6 mr-3 text-blue-600" />
            Shipping Details
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-4 mt-2">
            <span>Shipment ID: {shipping._id.slice(-8).toUpperCase()}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              Order ID: {shipping.orderId._id.slice(-8).toUpperCase()}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Route */}
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                  Shipping Route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                        <span className="text-2xl">
                          {getCountryFlag(shipping.fromCountry)}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {shipping.fromCountry}
                      </p>
                      <p className="text-sm text-gray-500">Origin</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4">
                      <div className="flex items-center space-x-2">
                        {getTransportIcon(shipping.fromCountry)}
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800"></div>
                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                          {shipping.estimatedDays} days
                        </span>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-200 to-blue-200 dark:from-indigo-800 dark:to-blue-800"></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                        <span className="text-2xl">
                          {getCountryFlag(shipping.toCountry)}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {shipping.toCountry}
                      </p>
                      <p className="text-sm text-gray-500">Destination</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Progress */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Shipping Progress
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      shipping.status
                    )} border-0 flex items-center space-x-1`}
                  >
                    {getStatusIcon(shipping.status)}
                    <span className="capitalize ml-1">
                      {shipping.status.replace("-", " ")}
                    </span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Processing
                      </div>
                      <div className="text-gray-500">Order confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        In Transit
                      </div>
                      <div className="text-gray-500">On the way</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Delivered
                      </div>
                      <div className="text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Full Name
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {shipping.orderId.customer.firstName}{" "}
                          {shipping.orderId.customer.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email Address
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {shipping.orderId.customer.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Phone Number
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {shipping.orderId.customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mt-1">
                        <Home className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Delivery Address
                        </p>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {shipping.orderId.deliveryAddress.address}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {shipping.orderId.deliveryAddress.city},{" "}
                            {shipping.orderId.deliveryAddress.country}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {shipping.orderId.deliveryAddress.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Information */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Navigation className="w-5 h-5 mr-2 text-indigo-600" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {shipping.trackingNumber ? (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                          Tracking Number
                        </p>
                        <p className="font-mono text-lg font-bold text-indigo-800 dark:text-indigo-200">
                          {shipping.trackingNumber}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tracking number will be assigned once shipment is
                          processed
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Days in Transit
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {calculateDaysInTransit()} days
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Estimated Total
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {shipping.estimatedDays} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6  gap-6">
            {/* Shipping Summary */}
            <Card className="border-0   bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Shipping Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping Cost
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(shipping.cost)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Car Price
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(shipping.orderId.carPrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    Total Paid
                  </span>
                  <span className="font-bold text-xl text-gray-900 dark:text-white">
                    {formatCurrency(shipping.orderId.totalPricePaid)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Payment Method
                  </span>
                  <Badge className="capitalize">
                    {shipping.orderId.paymentMethod.replace("-", " ")}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Payment Status
                  </span>
                  <Badge
                    className={`${getPaymentStatusColor(
                      shipping.orderId.paymentStatus
                    )} border-0 capitalize`}
                  >
                    {shipping.orderId.paymentStatus}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Down Payment
                  </span>
                  <span className="font-semibold">
                    {shipping.orderId.downPayment
                      ? formatCurrency(shipping.orderId.downPayment)
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-gray-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Order Created</p>
                    <p className="text-xs text-gray-500">
                      {new Date(shipping.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(shipping.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingDetailsDialog;
