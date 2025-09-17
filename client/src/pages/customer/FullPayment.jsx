// Full Payment Component - Professional Restructure
import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Award,
  Shield,
  Mail,
  Clock,
  Globe,
  Fuel,
  Settings,
  MapPin,
  Truck,
  Phone,
  User,
  Home,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getCarById } from "../../store/car";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FullPayment = () => {
  const { carId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [shippingCost] = useState(3000);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();
  const { currentCar: car } = useSelector((state) => state.car);
  const { isAuth } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCarById(carId));
  }, [dispatch, carId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProceedToPayment = () => {
    if (isAuth) {
      navigate(`/financeApplication/${carId}`, {
        state: {
          paymentType: "full-payment",
          amount: car.price + shippingCost,
          paymentMethod,
          car,
        },
      });
    } else {
      toast.error("Please login to proceed to payment");
      navigate(`/login`);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 pb-12">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/financeOption/${carId}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Options
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border-0">
            <CheckCircle className="w-4 h-4 mr-2" />
            Full Payment
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Pay in full and own your car immediately with no interest charges
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="w-16 h-1 bg-blue-600 mx-2"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="w-16 h-1 bg-gray-300 mx-2"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold">
                3
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details & Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vehicle Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={car?.images[0] || "/api/placeholder/400/300"}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {car.year} • {car.color}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Fuel className="w-4 h-4 text-green-600" />
                      <span className="capitalize">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="capitalize">{car.transmission}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span>{car.originCountry}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Award className="w-4 h-4 text-orange-600" />
                      <span className="capitalize">{car.condition}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Car Price:
                    </span>
                    <span className="font-semibold">
                      {formatPrice(car.price)}
                    </span>
                  </div>
                  {/*   <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping to Africa:
                    </span>
                    <span className="font-semibold">
                      {formatPrice(shippingCost)}
                    </span>
                  </div> */}
                  <div className="flex justify-between text-green-600">
                    <span>Interest Charges:</span>
                    <span className="font-semibold">$0.00 (Saved!)</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      {formatPrice(car.price)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800 dark:text-green-300">
                      Full Payment Benefits
                    </span>
                  </div>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• No interest charges - save money!</li>
                    <li>• Immediate ownership transfer</li>
                    <li>• Fastest processing time</li>
                    <li>• Priority shipping arrangement</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Process */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method */}
            {/* <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose how you'd like to pay for your vehicle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <label
                      htmlFor="credit-card"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-semibold">Credit/Debit Card</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Visa, Mastercard, American Express
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-0">
                          Instant
                        </Badge>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <label
                      htmlFor="bank-transfer"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Home className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="font-semibold">Bank Transfer</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Direct bank transfer (ACH)
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-0">
                          1-2 Days
                        </Badge>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <RadioGroupItem value="mobile-money" id="mobile-money" />
                    <label
                      htmlFor="mobile-money"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-6 h-6 text-orange-600" />
                          <div>
                            <p className="font-semibold">Mobile Money</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              M-Pesa, MTN Money, Airtel Money
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 border-0">
                          Popular in Africa
                        </Badge>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card> */}

            {/* Shipping Information */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-orange-600" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Your vehicle will be shipped to your location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                          Origin: {car.originCountry}
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Professional handling included
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                          Delivery: 30-45 days
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Fully tracked and insured
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Fully insured</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Tracking included</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Dedicated support</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>Documentation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Agreement */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Terms & Agreement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Important Information</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                  </div>

                  {showDetails && (
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Vehicle title transferred upon full payment
                          confirmation
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Shipping commences within 3-5 business days after
                          payment
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          All import duties and local fees are buyer's
                          responsibility
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Vehicle comes with a 30-day limited warranty
                        </span>
                      </li>
                    </ul>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreement"
                    checked={agreementAccepted}
                    onCheckedChange={setAgreementAccepted}
                    className="mt-1"
                  />
                  <div className="space-y-1 leading-none">
                    <Label
                      htmlFor="agreement"
                      className="text-sm font-medium leading-relaxed cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Shipping Policy
                      </Link>
                    </Label>
                    <p className="text-xs text-gray-500">
                      I understand that this purchase is final and subject to
                      the terms outlined above.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Section */}
            <div className="space-y-4">
              <Button
                onClick={handleProceedToPayment}
                disabled={!agreementAccepted}
                className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Security Notice */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    <span className="font-semibold">
                      Secure Payment Processing:
                    </span>{" "}
                    Your payment information is protected with bank-level
                    encryption. We never store your payment details on our
                    servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPayment;
