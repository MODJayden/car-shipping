import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader,
  Eye,
  EyeOff,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  DollarSign,
  FileText,
  Smartphone,
  Building,
  Globe,
  Clock,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { initializePayment } from "../../store/payment";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { application, amount,monthlyPayment,installmentPlan ,applicationNumber } = location.state || {};
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [selectedGateway, setSelectedGateway] = useState("stripe");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    // Card details
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",

    // Billing address
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },

    // PayPal
    paypalEmail: "",

    // Mobile Money
    mobileNumber: "",
    mobileProvider: "",
    email: "",

    // Bank Transfer
    accountNumber: "",
    routingNumber: "",
    accountHolder: "",
    bankName: "",

    // Apple/Google Pay
    biometricAuth: false,

    // Terms
    agreeToTerms: false,
    savePaymentMethod: false,
  });

  // Payment gateways configuration
  const paymentGateways = [
    {
      id: "stripe",
      name: "Stripe",
      logo: "/stripe.webp",
      description: "Secure card processing",
      methods: ["card", "apple-pay", "google-pay"],
      countries: ["Global"],
      fees: "2.9% ",
      processingTime: "Instant",
      popular: true,
    },
    {
      id: "paystack",
      name: "Paystack",
      logo: "/pay.png",
      description: "Africa's leading payment gateway",
      methods: ["card", "mobile-money", "bank-transfer"],
      countries: ["Nigeria, Ghana, Kenya"],
      fees: "1.5% ",
      processingTime: "Instant",
      popular: true,
      african: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "/paypal.jpeg",
      description: "Pay with PayPal balance or card",
      methods: ["paypal", "card"],
      countries: ["200+ countries"],
      fees: "2.9% ",
      processingTime: "Instant",
      popular: true,
    },

    {
      id: "flutterwave",
      name: "Flutterwave",
      logo: "/fluter.webp",
      description: "Africa's leading payment gateway",
      methods: ["card", "mobile-money", "bank-transfer"],
      countries: ["Nigeria, Ghana, Kenya, Uganda, Tanzania"],
      fees: "1.4% ",
      processingTime: "Instant",
      popular: true,
      african: true,
    },
  ];

  const calculateTotalAmount = (amount) => {
    const feePercent = parseFloat(currentGateway.fees) / 100;
    const feeAmount = amount * feePercent;
    const total = amount + feeAmount;
    const totalAmount = formatPrice(total);
    return totalAmount;
  };
  // Get current gateway
  const currentGateway = paymentGateways.find((g) => g.id === selectedGateway);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setPaymentData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setPaymentData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    // Gateway-specific validation
    if (selectedGateway === "stripe" || selectedGateway === "square") {
      if (!paymentData.cardNumber)
        newErrors.cardNumber = "Card number required";
      if (!paymentData.expiryMonth)
        newErrors.expiryMonth = "Expiry month required";
      if (!paymentData.expiryYear)
        newErrors.expiryYear = "Expiry year required";
      if (!paymentData.cvv) newErrors.cvv = "CVV required";
      if (!paymentData.cardholderName)
        newErrors.cardholderName = "Cardholder name required";
    }

    if (selectedGateway === "paypal" && !paymentData.paypalEmail) {
      newErrors.paypalEmail = "PayPal email required";
    }

    if (
      (selectedGateway === "flutterwave" || selectedGateway === "mpesa") &&
      !paymentData.mobileNumber
    ) {
      newErrors.mobileNumber = "Mobile number required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Process payment
  const handleProcessPayment = async () => {
    if (!validateForm()) return;

    const calculateTotalAmount = (amount) => {
      const feePercent = parseFloat(currentGateway.fees) / 100;
      const feeAmount = amount * feePercent;
      const total = amount + feeAmount;
      return total;
    };
    const paidAmount = calculateTotalAmount(application.order.totalAmount);

    setProcessing(true);
    console.log(paidAmount);
    const updatedApplication = {
      ...application, 
      userId: user.id, 
    };

    localStorage.setItem("order", JSON.stringify(updatedApplication));
    localStorage.setItem(
      "applicationNumber",
      JSON.stringify(applicationNumber)
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newData = {
        email: application.user.email,
        amount: paidAmount,
        id: user.id,
        currency: "GHS",
      };
      if (selectedGateway === "paystack") {
        dispatch(initializePayment(newData)).then((res) => {
          if (res?.payload?.data?.data?.authorization_url) {
            window.location.href = res.payload.data.data.authorization_url;
            setProcessing(false);
          } else {
            setProcessing(false);
          }
        });
      }
    } catch (error) {
      setErrors({ submit: "Payment processing failed. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  // Gateway-specific payment methods
  const renderPaymentMethod = () => {
    switch (selectedGateway) {
      case "stripe":
      case "razorpay":
      case "square":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="cardNumber" className="mb-2 block">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiryMonth" className="mb-2 block">
                  Month
                </Label>
                <Select
                  value={paymentData.expiryMonth}
                  onValueChange={(value) =>
                    handleInputChange("expiryMonth", value)
                  }
                >
                  <SelectTrigger
                    className={errors.expiryMonth ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <SelectItem
                          key={month}
                          value={month.toString().padStart(2, "0")}
                        >
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {errors.expiryMonth && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.expiryMonth}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="expiryYear" className="mb-2 block">
                  Year
                </Label>
                <Select
                  value={paymentData.expiryYear}
                  onValueChange={(value) =>
                    handleInputChange("expiryYear", value)
                  }
                >
                  <SelectTrigger
                    className={errors.expiryYear ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() + i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expiryYear && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.expiryYear}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cvv" className="mb-2 block">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength="4"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  className={errors.cvv ? "border-red-500" : ""}
                />
                {errors.cvv && (
                  <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="cardholderName" className="mb-2 block">
                Cardholder Name
              </Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) =>
                  handleInputChange("cardholderName", e.target.value)
                }
                className={errors.cardholderName ? "border-red-500" : ""}
              />
              {errors.cardholderName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.cardholderName}
                </p>
              )}
            </div>
          </div>
        );

      // PayPal → only needs email
      case "paypal":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="paypalEmail" className="mb-2 block">
                PayPal Email
              </Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="your@paypal.com"
                value={paymentData.paypalEmail}
                onChange={(e) =>
                  handleInputChange("paypalEmail", e.target.value)
                }
                className={errors.paypalEmail ? "border-red-500" : ""}
              />
              {errors.paypalEmail && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.paypalEmail}
                </p>
              )}
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                You'll be redirected to PayPal to complete your payment
                securely.
              </p>
            </div>
          </div>
        );

      case "flutterwave":
        return (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Payment Method</Label>
              <RadioGroup
                value={paymentData.method}
                onValueChange={(value) => handleInputChange("method", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Card Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank Transfer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile">Mobile Money</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentData.method === "mobile" && (
              <div>
                <Label htmlFor="mobileNumber" className="mb-2 block">
                  Mobile Number
                </Label>
                <Input
                  id="mobileNumber"
                  placeholder="+254 700 000 000"
                  value={paymentData.mobileNumber}
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  className={errors.mobileNumber ? "border-red-500" : ""}
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.mobileNumber}
                  </p>
                )}

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mt-3">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    You'll receive a prompt on your phone to authorize the
                    payment.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Payment method configuration for {currentGateway?.name}
            </p>
          </div>
        );
    }
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Information Missing
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No application data found. Please start from the application
              process.
            </p>
            <Button onClick={() => navigate("/cars")}>Browse Cars</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border-0">
              <Shield className="w-4 h-4 mr-2" />
              Secure Payment
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent mb-4">
              Complete Your Payment
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose your preferred payment method and complete your vehicle
              purchase securely
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Gateway Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gateway Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Choose Payment Gateway
                </CardTitle>
                <CardDescription>
                  Select your preferred payment provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentGateways.map((gateway) => (
                    <div
                      key={gateway.id}
                      onClick={() => setSelectedGateway(gateway.id)}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedGateway === gateway.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {gateway.popular && (
                        <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                          Popular
                        </Badge>
                      )}
                      {gateway.african && (
                        <Badge className="absolute -top-2 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
                          Africa
                        </Badge>
                      )}

                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={gateway.logo}
                          alt={gateway.name}
                          className="w-12 h-6 object-contain"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {gateway.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {gateway.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                        <div className="flex justify-between">
                          <span>Fees:</span>
                          <span className="font-medium">{gateway.fees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing:</span>
                          <span className="font-medium">
                            {gateway.processingTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span className="font-medium text-right">
                            {gateway.countries.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Payment Details - {currentGateway?.name}
                </CardTitle>
                <CardDescription>
                  Enter your payment information securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderPaymentMethod()}

                <Separator />

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={paymentData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked)
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Terms of Service
                      </a>
                      ,{" "}
                      <a
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                      , and{" "}
                      <a
                        href="/payment-terms"
                        className="text-blue-600 hover:underline"
                      >
                        Payment Terms
                      </a>
                      . I authorize this payment and understand it is
                      non-refundable except as outlined in our refund policy.
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">
                      {errors.agreeToTerms}
                    </p>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="savePaymentMethod"
                      checked={paymentData.savePaymentMethod}
                      onCheckedChange={(checked) =>
                        handleInputChange("savePaymentMethod", checked)
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="savePaymentMethod"
                      className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                    >
                      Save this payment method for future purchases (optional)
                    </label>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 dark:text-red-400">
                        {errors.submit}
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <Button
                  onClick={handleProcessPayment}
                  disabled={processing || !paymentData.agreeToTerms}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay {calculateTotalAmount(
                        application.order.totalAmount
                      )}{" "}
                      Securely
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Application:
                    </span>
                    <span className="font-mono text-xs">
                      {applicationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Customer:
                    </span>
                    <span>
                      {application.user.firstName} {application.user.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Payment Type:
                    </span>
                    <span className="capitalize">
                      {application.order.paymentMethod}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Vehicle Price:
                    </span>
                    <span>{formatPrice(application.order.totalAmount)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping Cost:
                    </span>
                    <span>{formatPrice(3000)}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Gateway Fee:
                    </span>
                    <span>{currentGateway?.fees}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-green-600">
                    {calculateTotalAmount(application.order.totalAmount)}
                  </span>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Processed securely by {currentGateway?.name}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Methods Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Gateway Information</CardTitle>
            <CardDescription>Learn about our payment providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                        Secure Payment Processing
                      </h4>
                      <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                        <li>• 256-bit SSL encryption</li>
                        <li>• PCI DSS compliant</li>
                        <li>• Fraud protection enabled</li>
                        <li>• Payment card data not stored</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>+1 (347) 403-7275</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>shuqranllc@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>24/7 Payment Support</span>
                  </div>
                  <Separator />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Having payment issues? Our support team can help resolve any
                    problems with your transaction.
                  </div>
                </CardContent>
              </Card>

              {/* Accepted Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">We Accept</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded">
                      <img src="/visa.png" alt="Visa" className="h-6" />
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded">
                      <img src="/MASTER.png" alt="Mastercard" className="h-6" />
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded">
                      <img
                        src="america.png"
                        alt="American Express"
                        className="h-6"
                      />
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded">
                      <Building className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded text-xs font-semibold">
                      +More
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Export both components
export default PaymentProcessing;
