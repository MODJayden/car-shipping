import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Calculator,
  Car,
  CreditCard,
  DollarSign,
  Calendar,
  Percent,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  Info,
  AlertCircle,
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
import { Slider } from "@/components/ui/slider";

import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { getCarById } from "../../store/car";
import { useDispatch, useSelector } from "react-redux";
import { getAllInterestRates } from "../../store/interestRate";
import { toast } from "sonner";

// Payment Calculator Component
const PaymentCalculator = () => {
  const { carId } = useParams();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(2); // Default 2 years
  const [downPayment, setDownPayment] = useState(0);
  const dispatch = useDispatch();
  const { currentCar: car } = useSelector((state) => state.car);
  const { interestRates } = useSelector((state) => state.interestRate);
  const { isAuth } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCarById(carId));
    dispatch(getAllInterestRates());
  }, [dispatch, carId]);
  // Sample data

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateLoan = () => {
    if (!car) return null;

    const totalPrice = car.price;
    const principal = totalPrice - downPayment;
    const rate =
      interestRates.find((r) => r.duration === selectedPlan)?.rate || 12;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = selectedPlan * 12;

    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / numberOfPayments,
        totalPayments: numberOfPayments,
        totalAmount: principal,
        totalInterest: 0,
        interestRate: rate,
      };
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalAmount = monthlyPayment * numberOfPayments;
    const totalInterest = totalAmount - principal;

    return {
      monthlyPayment,
      totalPayments: numberOfPayments,
      totalAmount: totalAmount + downPayment,
      totalInterest,
      interestRate: rate,
      principal,
      downPayment,
      carPrice: car.price,
    };
  };

  const loanDetails = calculateLoan();

  const handleApplyForPlan = () => {
    if (isAuth) {
      navigate(`/financeApplication/${carId}`, {
        state: {
          loanDetails,
          selectedPlan,
          downPayment,
        },
      });
    } else {
      toast.error("Please login to apply for a Installment Plan");
      navigate(`/login`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 ">
      {/* Back Button */}
      <div className="p-4 text-center flex justify-start">
        <Button
          variant="outline"
          onClick={() => navigate(`/financeOption/${carId}`)}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Finance Options
        </Button>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Finance Options
              </span>
            </div>
            <div className="flex-1 h-px bg-blue-600 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                Payment Calculator
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Application</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
            Payment Calculator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Customize your payment plan to fit your budget perfectly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Calculator Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={car?.images[0] || "/api/placeholder/120/80"}
                    alt={`${car?.make} ${car?.model}`}
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {car?.make} {car?.model}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {car?.year} • {car?.color} • From {car?.originCountry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(car?.price)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Car Price
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Choose Your Payment Plan
                </CardTitle>
                <CardDescription>
                  Select the financing term that works best for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPlan.toString()}
                  onValueChange={(value) => setSelectedPlan(parseInt(value))}
                  className="space-y-3"
                >
                  {interestRates.map((rate) => {
                    const tempLoan = {
                      principal: car?.price - downPayment,
                      rate: rate.rate,
                      years: rate.duration,
                    };
                    const monthlyRate = rate.rate / 100 / 12;
                    const numberOfPayments = rate.duration * 12;
                    const monthlyPayment =
                      monthlyRate === 0
                        ? tempLoan.principal / numberOfPayments
                        : (tempLoan.principal *
                            monthlyRate *
                            Math.pow(1 + monthlyRate, numberOfPayments)) /
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

                    return (
                      <div
                        key={rate.duration}
                        className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                      >
                        <RadioGroupItem
                          value={rate.duration.toString()}
                          id={`plan-${rate.duration}`}
                        />
                        <label
                          htmlFor={`plan-${rate.duration}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {rate.duration} Year Plan
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {rate.rate}% APR • {numberOfPayments} payments
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                {formatPrice(monthlyPayment)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                per month
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Down Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Down Payment (Optional)
                </CardTitle>
                <CardDescription>
                  Reduce your monthly payments with a down payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Amount: {formatPrice(downPayment)}</span>
                    <span>Max: {formatPrice(car?.price * 0.5)}</span>
                  </div>
                  <Slider
                    value={[downPayment]}
                    onValueChange={(value) => setDownPayment(value[0])}
                    max={car?.price * 0.5}
                    step={500}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[0, 0.1, 0.2, 0.3].map((percentage) => {
                    const amount = Math.round(car?.price * percentage);
                    return (
                      <Button
                        key={percentage}
                        variant={downPayment === amount ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDownPayment(amount)}
                        className="text-xs"
                      >
                        {percentage === 0 ? "0%" : `${percentage * 100}%`}
                      </Button>
                    );
                  })}
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Higher down payment = Lower monthly payments
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Payment Summary */}
          <div className="space-y-6">
            {/* Payment Summary Card */}
            <Card className="sticky top-6 border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-800 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Monthly Payment */}
                <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
                  <p className="text-sm opacity-90 mb-1">Monthly Payment</p>
                  <p className="text-3xl font-bold">
                    {loanDetails
                      ? formatPrice(loanDetails.monthlyPayment)
                      : "$0"}
                  </p>
                  <p className="text-sm opacity-90">
                    for {selectedPlan} year{selectedPlan > 1 ? "s" : ""} (
                    {selectedPlan * 12} payments)
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Car Price:
                    </span>
                    <span className="font-medium">
                      {formatPrice(car?.price)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Down Payment:
                    </span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(downPayment)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Loan Amount:
                    </span>
                    <span className="font-medium">
                      {loanDetails ? formatPrice(loanDetails.principal) : "$0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Interest Rate:
                    </span>
                    <span className="font-medium">
                      {loanDetails ? `${loanDetails.interestRate}%` : "0%"} APR
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Interest:
                    </span>
                    <span className="font-medium text-orange-600">
                      {loanDetails
                        ? formatPrice(loanDetails.totalInterest)
                        : "$0"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>
                      {loanDetails
                        ? formatPrice(loanDetails.totalAmount)
                        : "$0"}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleApplyForPlan}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Apply for This Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Benefits */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>24-hour approval process</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Auto-pay available</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>No prepayment penalties</span>
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

export default PaymentCalculator;
