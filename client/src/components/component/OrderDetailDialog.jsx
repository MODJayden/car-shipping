
import {
  Package,
  Truck,
  Receipt,
  MessageCircle,
  Check,
  Clock,
  MapPin,
  Mail,
  Phone,
  Download,
  Car,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

const OrderDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedOrder,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPaymentStatusBadge = (status) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800" },
      completed: { color: "bg-green-100 text-green-800" },
      failed: { color: "bg-red-100 text-red-800" },
      refunded: { color: "bg-gray-100 text-gray-800" },
    };

    const config = configs[status] || configs.pending;

    return (
      <Badge className={`${config.color} border-0`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {selectedOrder && (
          <>
            <DialogHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-6">
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Package className="w-6 h-6 mr-2 text-blue-600" />
                Order Details
              </DialogTitle>
              <DialogDescription className="flex items-center">
                <span className="mr-2">Order ID:</span>
                <Badge variant="outline" className="font-mono">
                  {selectedOrder._id}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 ">
              <div className="">
                {/* Left Column - Vehicle & Status */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Vehicle Information Card */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Car className="w-5 h-5 mr-2 text-blue-600" />
                        Vehicle Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-32 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {selectedOrder.car.images &&
                          selectedOrder.car.images[0] ? (
                            <img
                              src={selectedOrder.car.images[0]}
                              alt={`${selectedOrder.car.make} ${selectedOrder.car.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {selectedOrder.car.make} {selectedOrder.car.model}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {selectedOrder.car.year} • {selectedOrder.car.color}{" "}
                            • {selectedOrder.car.condition}
                          </p>

                          <div className=" gap-2 text-sm">
                            <div className="flex ">
                              <span className="text-gray-500 dark:text-gray-400 min-w-[80px]">
                                Fuel:
                              </span>
                              <span className="font-medium capitalize truncate">
                                {selectedOrder.car.fuelType}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="text-gray-500 dark:text-gray-400 min-w-[80px]">
                                Origin:
                              </span>
                              <span className="font-medium truncate">
                                {selectedOrder.car.originCountry}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 dark:text-gray-400 min-w-[80px]">
                                Price:
                              </span>
                              <span className="font-medium truncate">
                                {formatPrice(selectedOrder.carPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Status Timeline */}
                  <Card className="border-0 shadow-sm -z-10">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        Order Status Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 relative z-0">
                        {/* Vertical timeline line */}
                        <div className="absolute left-3 top-2 z-0 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                        {[
                          {
                            status: "placed",
                            label: "Order Placed",
                            date: selectedOrder.createdAt,
                          },
                          { status: "confirmed", label: "Order Confirmed" },
                          { status: "processing", label: "Processing" },
                          { status: "shipped", label: "Shipped" },
                          { status: "delivered", label: "Delivered" },
                        ].map((step, index) => {
                          const isCompleted =
                            [
                              "placed",
                              "confirmed",
                              "processing",
                              "shipped",
                              "delivered",
                            ].indexOf(selectedOrder.status) >= index;
                          const isCurrent =
                            selectedOrder.status === step.status;

                          return (
                            <div
                              key={step.status}
                              className="flex items-start space-x-4 relative"
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                                  isCompleted ? "bg-green-500" : "bg-gray-300"
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-4 h-4 text-white" />
                                ) : (
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      isCurrent ? "bg-white" : "bg-gray-400"
                                    }`}
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium ${
                                    isCompleted
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {step.label}
                                </p>
                                {step.date && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(step.date).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(step.date).toLocaleTimeString()}
                                  </p>
                                )}
                                {isCurrent && (
                                  <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    Current Status
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Order Summary & Actions */}
                <div className="space-y-6 w-full">
                  {/* Order Summary */}
                  <Card className="border-0 shadow-sm w-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Receipt className="w-5 h-5 mr-2 text-purple-600" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Car Price:
                          </span>
                          <span className="font-medium">
                            {formatPrice(selectedOrder.carPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Additional Fees:
                          </span>
                          <span className="font-medium">
                            {formatPrice(
                              selectedOrder.totalPricePaid -
                                selectedOrder.carPrice
                            )}
                          </span>
                        </div>
                        {selectedOrder.downPayment > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Down Payment:</span>
                            <span className="font-medium">
                              {formatPrice(selectedOrder.downPayment)}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          Total Paid:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(selectedOrder.totalPricePaid)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Payment Method:
                          </p>
                          <Badge variant="outline" className="capitalize">
                            {selectedOrder.paymentMethod.replace("-", " ")}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Payment Status:
                          </p>
                          {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Information */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <MapPin className="w-5 h-5 mr-2 text-red-600" />
                        Delivery Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {selectedOrder.customer.firstName}{" "}
                          {selectedOrder.customer.lastName}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p className="break-words">
                            {selectedOrder.deliveryAddress.address}
                          </p>
                          <p>
                            {selectedOrder.deliveryAddress.city},{" "}
                            {selectedOrder.deliveryAddress.country}
                          </p>
                          {selectedOrder.deliveryAddress.postalCode && (
                            <p>
                              Postal Code:{" "}
                              {selectedOrder.deliveryAddress.postalCode}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {selectedOrder.customer.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {selectedOrder.customer.email}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                    {selectedOrder.status === "shipped" && (
                      <Button variant="outline" className="w-full">
                        <Truck className="w-4 h-4 mr-2" />
                        Track Shipment
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default OrderDetailDialog;
