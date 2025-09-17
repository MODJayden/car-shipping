import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  AlertCircle,
  Car,
  Globe,
  Home,
  Briefcase,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  Truck,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  createApplication,
  getApplicationsByUser,
} from "../../store/application";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { getCarById } from "../../store/car";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const FinanceApplication = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from previous steps
  const { loanDetails, selectedPlan, downPayment } = location.state || {};
  const isInstallment = loanDetails && selectedPlan;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { currentCar: car } = useSelector((state) => state.car);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const randomId = Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        dispatch(getCarById(carId));
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [dispatch, carId]);

  // Form data state matching your User schema
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",

    // Address Information (delivery address for Order schema)
    country: "",
    city: "",
    address: "",
    postalCode: "",

    // Employment Information
    employmentStatus: "",
    employer: "",
    monthlyIncome: "",
    yearsEmployed: "",

    // Payment Information (for PaymentPlan schema)
    paymentMethod: "credit-card",
    paymentDay: 15,
    autoDeduction: false,

    // Terms
    agreeToTerms: false,
    agreeToCredit: false,
    subscribeNewsletter: true,
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
    } else if (step === 2) {
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.address) newErrors.address = "Address is required";
    } else if (step === 3 && isInstallment) {
      if (!formData.employmentStatus)
        newErrors.employmentStatus = "Employment status is required";
      if (!formData.monthlyIncome)
        newErrors.monthlyIncome = "Monthly income is required";
      if (formData.employmentStatus === "employed" && !formData.employer) {
        newErrors.employer = "Employer is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.id) {
      toast.error("Please login to continue");
      return;
    }

    if (!validateStep(currentStep)) return;
    if (!formData.agreeToTerms) {
      setErrors((prev) => ({
        ...prev,
        agreeToTerms: "You must agree to the terms",
      }));
      return;
    }

    setSubmitting(true);

    try {
      // Prepare data for your schemas
      const applicationData = {
        // User data
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          address: formData.address,
        },

        // Order data
        order: {
          car: carId,
          carPrice: car.price,
          totalAmount: isInstallment ? loanDetails.totalAmount : car.price,
          downPayment: isInstallment ? downPayment || 0 : 0,
          paymentMethod: isInstallment ? "installment" : "full-payment",
          paymentStatus: "pending",
          status: "pending",
          deliveryAddress: {
            country: formData.country,
            city: formData.city,
            address: formData.address,
            postalCode: formData.postalCode,
          },
          notifications: {
            email: true,
            sms: true,
          },
        },

        // PaymentPlan data (if installment)
        ...(isInstallment && {
          paymentPlan: {
            planDuration: selectedPlan,
            interestRate: loanDetails.interestRate,
            monthlyPayment: loanDetails.monthlyPayment,
            totalPayments: loanDetails.totalPayments,
            totalAmount: loanDetails.totalAmount,
            autoDeduction: formData.autoDeduction,
            paymentMethod: formData.paymentMethod,
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            paymentDay: formData.paymentDay,
            status: "active",
          },
        }),

        // Employment info (for installment)
        ...(isInstallment && {
          employmentInfo: {
            status: formData.employmentStatus,
            employer: formData.employer,
            monthlyIncome: parseFloat(formData.monthlyIncome),
            yearsEmployed: formData.yearsEmployed,
          },
        }),
      };

      const updatedApplication = {
        ...applicationData,
        userId: user.id,
      };
      // Simulate API call
      if (isInstallment) {
        dispatch(createApplication(updatedApplication)).then((res) => {
          if (res.payload.success) {
            navigate(`/finance`);
            dispatch(getApplicationsByUser(user.id));
            toast.success("Application created successfully");
          }
        });
      } else {
        navigate(`/payment`, {
          state: {
            application: applicationData,
            paymentPlan: "full-payment",
            applicationNumber: randomId,
          },
        });
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setErrors({ submit: "Application submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = isInstallment ? 4 : 3;
  const progressValue = (currentStep / totalSteps) * 100;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} className="h-4 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(progressValue)}% Complete
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-sm">
            <FileText className="w-4 h-4 mr-2" />
            {isInstallment ? "Installment Application" : "Purchase Application"}
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
            Complete Your Application
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isInstallment
              ? "Provide your information to set up your financing plan"
              : "Complete your purchase with secure processing"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <Card className="shadow-md border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Create your account and provide basic details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="flex items-center"
                        >
                          First Name{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          placeholder="John"
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center">
                          Last Name <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Doe"
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        Email Address{" "}
                        <span className="text-red-500 ml-1">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>We'll send confirmation to this email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="john@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          Phone Number{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+233 123 456 7890"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="dateOfBirth"
                          className="flex items-center"
                        >
                          Date of Birth{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          className={errors.dateOfBirth ? "border-red-500" : ""}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center">
                          Create Password{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            placeholder="Secure password"
                            className={
                              errors.password ? "border-red-500 pr-10" : "pr-10"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.password}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Must be at least 8 characters
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="flex items-center"
                        >
                          Confirm Password{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          placeholder="Confirm password"
                          className={
                            errors.confirmPassword ? "border-red-500" : ""
                          }
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Address Information */}
              {currentStep === 2 && (
                <Card className="shadow-md border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                        <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      Delivery Address
                    </CardTitle>
                    <CardDescription>
                      Where should we deliver your vehicle?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="flex items-center">
                          Country <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          placeholder="United States, Nigeria, Ghana..."
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.country && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.country}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center">
                          City <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          placeholder="Lagos, Accra, Nairobi..."
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center">
                        Street Address{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter your complete address"
                        rows={3}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        Postal/ZIP Code (Optional)
                      </Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) =>
                          handleInputChange("postalCode", e.target.value)
                        }
                        placeholder="Enter your postal code"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Employment Information (Installment only) */}
              {currentStep === 3 && isInstallment && (
                <Card className="shadow-md border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                        <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Employment Information
                    </CardTitle>
                    <CardDescription>
                      Help us understand your financial situation for
                      installment approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="employmentStatus"
                        className="flex items-center"
                      >
                        Employment Status{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Select
                        value={formData.employmentStatus}
                        onValueChange={(value) =>
                          handleInputChange("employmentStatus", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.employmentStatus ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">
                            Employed Full-time
                          </SelectItem>
                          <SelectItem value="self-employed">
                            Self-employed
                          </SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.employmentStatus && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errors.employmentStatus}
                        </p>
                      )}
                    </div>

                    {(formData.employmentStatus === "employed" ||
                      formData.employmentStatus === "part-time") && (
                      <div className="space-y-2">
                        <Label htmlFor="employer">Employer Name</Label>
                        <Input
                          id="employer"
                          value={formData.employer}
                          onChange={(e) =>
                            handleInputChange("employer", e.target.value)
                          }
                          placeholder="Company name"
                          className={errors.employer ? "border-red-500" : ""}
                        />
                        {errors.employer && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.employer}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="monthlyIncome"
                          className="flex items-center"
                        >
                          Monthly Income (USD){" "}
                          <span className="text-red-500 ml-1">*</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Your gross monthly income before taxes</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          value={formData.monthlyIncome}
                          onChange={(e) =>
                            handleInputChange("monthlyIncome", e.target.value)
                          }
                          placeholder="3000"
                          className={
                            errors.monthlyIncome ? "border-red-500" : ""
                          }
                        />
                        {errors.monthlyIncome && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />{" "}
                            {errors.monthlyIncome}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearsEmployed">
                          Years at Current Job
                        </Label>
                        <Select
                          value={formData.yearsEmployed}
                          onValueChange={(value) =>
                            handleInputChange("yearsEmployed", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less-than-1">
                              Less than 1 year
                            </SelectItem>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="2-5">2-5 years</SelectItem>
                            <SelectItem value="5-plus">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Preferences
                      </h4>

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <RadioGroup
                          value={formData.paymentMethod}
                          onValueChange={(value) =>
                            handleInputChange("paymentMethod", value)
                          }
                          className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-md hover:border-blue-300">
                            <RadioGroupItem
                              value="credit-card"
                              id="pm-card"
                              className="mt-0"
                            />
                            <label
                              htmlFor="pm-card"
                              className="text-sm flex-1 cursor-pointer"
                            >
                              Credit/Debit Card
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-md hover:border-blue-300">
                            <RadioGroupItem
                              value="bank-transfer"
                              id="pm-bank"
                              className="mt-0"
                            />
                            <label
                              htmlFor="pm-bank"
                              className="text-sm flex-1 cursor-pointer"
                            >
                              Bank Transfer
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-md hover:border-blue-300">
                            <RadioGroupItem
                              value="mobile-money"
                              id="pm-mobile"
                              className="mt-0"
                            />
                            <label
                              htmlFor="pm-mobile"
                              className="text-sm flex-1 cursor-pointer"
                            >
                              Mobile Money
                            </label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentDay">
                          Preferred Payment Day of Month
                        </Label>
                        <Select
                          value={formData.paymentDay.toString()}
                          onValueChange={(value) =>
                            handleInputChange("paymentDay", parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day}
                                  {day === 1
                                    ? "st"
                                    : day === 2
                                    ? "nd"
                                    : day === 3
                                    ? "rd"
                                    : "th"}{" "}
                                  of every month
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox
                          id="autoDeduction"
                          checked={formData.autoDeduction}
                          onCheckedChange={(checked) =>
                            handleInputChange("autoDeduction", checked)
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="autoDeduction"
                          className="text-sm text-blue-800 dark:text-blue-300"
                        >
                          Enable automatic monthly payments (0.25% discount on
                          interest rate)
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Final Step: Review & Terms */}
              {currentStep === totalSteps && (
                <Card className="shadow-md border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-xl">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      Review & Submit
                    </CardTitle>
                    <CardDescription>
                      Review your information and agree to terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Application Summary */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">
                        Application Summary
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 block text-xs">
                              Name:
                            </span>
                            <span className="font-medium">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 block text-xs">
                              Email:
                            </span>
                            <span className="font-medium">
                              {formData.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 block text-xs">
                              Phone:
                            </span>
                            <span className="font-medium">
                              {formData.phone}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 block text-xs">
                              Country:
                            </span>
                            <span className="font-medium capitalize">
                              {formData.country}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 block text-xs">
                              City:
                            </span>
                            <span className="font-medium">{formData.city}</span>
                          </div>
                          {isInstallment && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 block text-xs">
                                Employment:
                              </span>
                              <span className="font-medium capitalize">
                                {formData.employmentStatus}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) =>
                            handleInputChange("agreeToTerms", checked)
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="agreeToTerms"
                          className="text-sm text-gray-600 dark:text-gray-300"
                        >
                          I have read and agree to the{" "}
                          <a
                            href="/terms"
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Terms of Service
                          </a>
                          ,{" "}
                          <a
                            href="/privacy"
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy
                          </a>
                          , and{" "}
                          <a
                            href="/financing-terms"
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {isInstallment
                              ? "Financing Agreement"
                              : "Purchase Agreement"}
                          </a>
                          .
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />{" "}
                          {errors.agreeToTerms}
                        </p>
                      )}

                      {isInstallment && (
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="agreeToCredit"
                            checked={formData.agreeToCredit}
                            onCheckedChange={(checked) =>
                              handleInputChange("agreeToCredit", checked)
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="agreeToCredit"
                            className="text-sm text-gray-600 dark:text-gray-300"
                          >
                            I authorize a credit check and understand that this
                            application may affect my credit score. I consent to
                            receive automated payment reminders via email and
                            SMS.
                          </label>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="subscribeNewsletter"
                          checked={formData.subscribeNewsletter}
                          onCheckedChange={(checked) =>
                            handleInputChange("subscribeNewsletter", checked)
                          }
                          className="mt-1"
                        />
                        <label
                          htmlFor="subscribeNewsletter"
                          className="text-sm text-gray-600 dark:text-gray-300"
                        >
                          I would like to receive updates about new vehicles,
                          promotions, and company news (optional).
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
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    currentStep === 1 ? () => navigate(-1) : handlePrevStep
                  }
                  className="px-6"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {currentStep === 1 ? "Back" : "Previous"}
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitting || !formData.agreeToTerms}
                    className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
            <div className="space-y-6 mt-4 grid lg:grid-cols-2 gap-8">
              {/* apllication Benefits */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BadgeCheck className="w-5 h-5 mr-2 text-green-600" />
                    {isInstallment ? "Financing Benefits" : "Purchase Benefits"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">24-hour approval process</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">Secure data encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <Truck className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Professional shipping</span>
                  </div>
                  {isInstallment && (
                    <>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <DollarSign className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-sm">
                          Flexible payment options
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-sm">
                          Auto-pay discounts available
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="shadow-md border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">+1 (347) 403-7275</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sales & Support
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        shuqranllc@gmail.com
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Email Support
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mon-Fri 9AM-6PM EST</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Business Hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right - Summary & Information */}
          <div className="space-y-6">
            {/* Car Summary */}
            <Card className="sticky top-6 shadow-md border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Car className="w-5 h-5 mr-2 text-blue-600" />
                  Vehicle Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={car?.images[0] || "/api/placeholder/80/60"}
                      alt={`${car?.make} ${car?.model}`}
                      className="w-20 h-14 object-cover rounded-lg border"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white capitalize">
                        {car?.make} {car?.model}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {car?.year} • {car?.originCountry}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Summary */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Car Price:
                      </span>
                      <span className="font-medium">
                        {formatPrice(car?.price)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Shipping:
                      </span>
                      <span className="font-medium">{formatPrice(3000)}</span>
                    </div> */}
                    {isInstallment && loanDetails && (
                      <>
                        {loanDetails.downPayment > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Down Payment:</span>
                            <span className="font-medium">
                              -{formatPrice(loanDetails.downPayment)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-orange-600">
                          <span>Interest ({loanDetails.interestRate}%):</span>
                          <span className="font-medium">
                            +{formatPrice(loanDetails.totalInterest)}
                          </span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg pt-1">
                      <span>Total Amount:</span>
                      <span>
                        {isInstallment && loanDetails
                          ? formatPrice(loanDetails.totalAmount)
                          : formatPrice(car.price)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Plan Details */}
                  {isInstallment && loanDetails && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                          Payment Plan
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg text-center border">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatPrice(loanDetails.monthlyPayment)}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-400">
                            per month for {selectedPlan} years
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          {loanDetails.totalPayments} total payments
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Benefits */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceApplication;
