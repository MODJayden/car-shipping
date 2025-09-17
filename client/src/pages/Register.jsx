import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  UserPlus,
  ArrowRight,
  Globe,
  Users,
  Award,
  Zap,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/user";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    role: "customer",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToNewsletter, setAgreedToNewsletter] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim()) errors.phone = "Phone number is required";
    }

    if (step === 2) {
      if (!formData.country) errors.country = "Country is required";
      if (!formData.city.trim()) errors.city = "City is required";
    }

    if (step === 3) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (!agreedToTerms) {
        errors.terms = "You must agree to the terms and conditions";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);

    // Simulate API call to register user
    dispatch(registerUser(formData)).then((res) => {
      if (res?.payload?.success) {
        toast.success("Registration successful! ");
        navigate("/login");
        setIsLoading(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          country: "",
          city: "",
          role: "customer",
        });
      } else {
        toast.error(res?.payload);
        console.log(res);
        setIsLoading(false);
      }
    });
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      "Very Weak",
      "Weak",
      "Fair",
      "Good",
      "Strong",
      "Very Strong",
    ];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-green-600",
    ];

    return {
      level: levels[strength] || "Very Weak",
      color: colors[strength] || "bg-red-500",
      percentage: (strength / 5) * 100,
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const steps = [
    {
      number: 1,
      title: "Personal Information",
      description: "Tell us about yourself",
      icon: User,
    },
    {
      number: 2,
      title: "Location Details",
      description: "Where are you located?",
      icon: MapPin,
    },
    {
      number: 3,
      title: "Account Security",
      description: "Create your secure account",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
            <div
              className="absolute top-6 left-0 h-0.5 bg-blue-600 transition-all duration-300 hidden sm:block"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            ></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index + 1 <= currentStep;
              const isCurrent = index + 1 === currentStep;

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10 mx-8"
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive
                        ? isCurrent
                          ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                          : "bg-blue-600 border-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 hidden sm:block mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold flex items-center justify-center"></CardTitle>
              <CardDescription className="text-lg">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="flex items-center text-sm font-medium"
                        >
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className={`h-12 rounded-xl ${
                            formErrors.firstName ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.firstName && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="flex items-center text-sm font-medium"
                        >
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className={`h-12 rounded-xl ${
                            formErrors.lastName ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.lastName && (
                          <p className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center text-sm font-medium"
                      >
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`h-12 rounded-xl ${
                          formErrors.email ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center text-sm font-medium"
                      >
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`h-12 rounded-xl ${
                          formErrors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Location Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
                        <Globe className="w-4 h-4 mr-2 text-gray-500" />
                        Country *
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your country"
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        className={`h-12 rounded-xl ${
                          formErrors.city ? "border-red-500" : ""
                        }`}
                      />

                      {formErrors.country && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.country}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium">
                        <Building className="w-4 h-4 mr-2 text-gray-500" />
                        City *
                      </Label>

                      <Input
                        type="text"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`h-12 rounded-xl ${
                          formErrors.city ? "border-red-500" : ""
                        }`}
                        disabled={!formData.country}
                      />

                      {formErrors.city && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.city}
                        </p>
                      )}
                      {!formData.country && (
                        <p className="text-sm text-gray-500">
                          Please select a country first
                        </p>
                      )}
                    </div>

                    {/* Location Benefits */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-blue-600" />
                        Location Benefits
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Customized shipping routes
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Local payment methods
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Regional customer support
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Local compliance handling
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Account Security */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="flex items-center text-sm font-medium"
                      >
                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`h-12 rounded-xl pr-12 ${
                            formErrors.password ? "border-red-500" : ""
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              Password Strength:
                            </span>
                            <span
                              className={`font-medium ${
                                passwordStrength.level === "Strong" ||
                                passwordStrength.level === "Very Strong"
                                  ? "text-green-600"
                                  : passwordStrength.level === "Good"
                                  ? "text-blue-600"
                                  : passwordStrength.level === "Fair"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {passwordStrength.level}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{
                                width: `${passwordStrength.percentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {formErrors.password && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="flex items-center text-sm font-medium"
                      >
                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={`h-12 rounded-xl pr-12 ${
                            formErrors.confirmPassword ? "border-red-500" : ""
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.confirmPassword}
                        </p>
                      )}
                      {formData.password &&
                        formData.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <p className="text-sm text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Passwords match
                          </p>
                        )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={setAgreedToTerms}
                          className="mt-1"
                        />
                        <div className="space-y-1 leading-none">
                          <Label
                            htmlFor="terms"
                            className="text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            I agree to the{" "}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              Privacy Policy
                            </a>{" "}
                            *
                          </Label>
                        </div>
                      </div>
                      {formErrors.terms && (
                        <p className="text-sm text-red-500 flex items-center ml-7">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.terms}
                        </p>
                      )}

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="newsletter"
                          checked={agreedToNewsletter}
                          onCheckedChange={setAgreedToNewsletter}
                          className="mt-1"
                        />
                        <div className="space-y-1 leading-none">
                          <Label
                            htmlFor="newsletter"
                            className="text-sm font-medium leading-relaxed cursor-pointer"
                          >
                            Subscribe to our newsletter for updates and
                            exclusive offers
                          </Label>
                          <p className="text-xs text-gray-500">
                            Get notified about new vehicles, special deals, and
                            platform updates
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Security Features */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-600" />
                        Account Security Features
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Email verification required
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Credit score tracking
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Secure data encryption
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Two-factor authentication
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="px-6"
                      >
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading || !agreedToTerms}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                10,000+ Users
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                50+ Countries
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2" />
                5-Star Rated
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 mt-8 opacity-60">
              <div className="text-xs text-gray-400">🔒 SSL Secured</div>
              <div className="text-xs text-gray-400">✅ GDPR Compliant</div>
              <div className="text-xs text-gray-400">🛡️ Privacy Protected</div>
              <div className="text-xs text-gray-400">
                ⚡ Instant Verification
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
