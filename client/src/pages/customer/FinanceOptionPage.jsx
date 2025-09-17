import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Car,
  CreditCard,
  Calendar,
  DollarSign,
  Calculator,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Percent,
  TrendingDown,
  Star,
  Users,
  Award,
  MapPin,
  Fuel,
  Settings,
  Globe,
  ArrowLeft,
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
import { getCarById } from "../../store/car";
import { useDispatch, useSelector } from "react-redux";
import { getAllInterestRates } from "../../store/interestRate";

const FinanceOptionsPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { interestRates } = useSelector((state) => state.interestRate);
  const { currentCar } = useSelector((state) => state.car);

  console.log(interestRates.find((r) => r.duration === 3)?.rate )

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCarById(carId));
    dispatch(getAllInterestRates());
  }, [dispatch, carId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateMonthlyPayment = (price, rate, years) => {
    const principal = price;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment;
  };

  if (!currentCar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Car not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="p-4 text-center flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate(`/`)}
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cars
          </Button>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0">
            <CreditCard className="w-4 h-4 mr-2" />
            Flexible Financing
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
            Finance Your Dream Car
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Car Summary Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={currentCar?.images[0] || "/api/placeholder/400/300"}
                    alt={`${currentCar?.make} ${currentCar?.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                      <Globe className="w-3 h-3 mr-1" />
                      {currentCar?.originCountry}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {currentCar?.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {currentCar?.make} {currentCar?.model}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      {currentCar?.year} • {currentCar?.color} •{" "}
                      {currentCar?.condition}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Car Price
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(currentCar?.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Fuel className="w-4 h-4 text-green-600" />
                        <span className="capitalize">
                          {currentCar?.fuelType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Settings className="w-4 h-4 text-blue-600" />
                        <span className="capitalize">
                          {currentCar?.transmission}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Why Finance With Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Secure & Licensed
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fully regulated financing
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Quick Approval
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Decision within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Competitive Rates
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Starting from 8% APR
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pay in Full Option */}
              <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Pay in Full</CardTitle>
                  <CardDescription>
                    One-time payment, own immediately
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(currentCar?.price)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Save on interest charges
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>No interest charges</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Immediate ownership</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Fastest processing</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/financialFlow/${carId}/full`)}
                  >
                    Pay Full Amount
                  </Button>
                </CardContent>
              </Card>

              {/* Finance Option */}
              <Card className="border-2 border-blue-300 dark:border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 relative">
                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>

                <CardHeader className="text-center pb-4 pt-8">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Finance This Car</CardTitle>
                  <CardDescription>Flexible monthly payments</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Starting From
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(
                        calculateMonthlyPayment(
                          currentCar?.price,
                          interestRates.find((r) => r.duration === 3)?.rate ,3
                        )
                      )}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">per month</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>Flexible 1-3 year terms</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>Competitive interest rates</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>Auto-pay available</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={true}
                    onClick={() => navigate(`/financialFlow/${carId}/part`)}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                      Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Interest Rates Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="w-5 h-5 mr-2 text-purple-600" />
                  Current Interest Rates
                </CardTitle>
                <CardDescription>
                  Competitive rates for different payment terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {interestRates.map((rate) => (
                    <div
                      key={rate.duration}
                      className="text-center p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {rate.rate}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {rate.duration} Year Plan
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        {formatPrice(
                          calculateMonthlyPayment(
                            currentCar?.price,
                            rate.rate,
                            rate.duration
                          )
                        )}
                        /mo
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-600" />
                  Why Choose Financing?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Drive Today
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get your car immediately, even with limited upfront
                          cash
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Budget Friendly
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Spread the cost over manageable monthly payments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Build Credit
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Regular payments help establish your credit history
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Trusted by 1000+
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Join thousands of satisfied customers across Africa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOptionsPage;
