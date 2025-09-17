// Finance Dashboard Component

// Finance Dashboard Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  MapPin,
  Mail,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Car,
  MoreHorizontal,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = () => {
      const storedApplications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );

      // Add sample data if empty
      if (storedApplications.length === 0) {
        const sampleApplications = [
          {
            applicationNumber: "APP-1703701234567",
            applicationType: "full-payment",
            status: "completed",
            totalAmount: 31500,
            downPayment: 0,
            personalInfo: {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@email.com",
              phone: "+234 123 456 7890",
            },
            deliveryAddress: {
              country: "Nigeria",
              city: "Lagos",
            },
            submittedAt: new Date("2024-01-15"),
            approvedAt: new Date("2024-01-15"),
            completedAt: new Date("2024-01-15"),
            paymentStatus: "completed",
          },
          {
            applicationNumber: "APP-1703701234568",
            applicationType: "installment",
            status: "approved",
            totalAmount: 35600,
            downPayment: 5000,
            requestedPlan: {
              duration: 2,
              interestRate: 12,
              monthlyPayment: 1275,
              totalPayments: 24,
            },
            personalInfo: {
              firstName: "Sarah",
              lastName: "Johnson",
              email: "sarah.j@email.com",
              phone: "+233 987 654 3210",
            },
            deliveryAddress: {
              country: "Ghana",
              city: "Accra",
            },
            employmentInfo: {
              status: "employed",
              employer: "Tech Corp Ltd",
              monthlyIncome: 4500,
            },
            submittedAt: new Date("2024-01-14"),
            approvedAt: new Date("2024-01-15"),
            paymentStatus: "pending",
          },
          {
            applicationNumber: "APP-1703701234569",
            applicationType: "installment",
            status: "under-review",
            totalAmount: 42000,
            downPayment: 8000,
            requestedPlan: {
              duration: 3,
              interestRate: 15,
              monthlyPayment: 1050,
              totalPayments: 36,
            },
            personalInfo: {
              firstName: "Michael",
              lastName: "Okafor",
              email: "m.okafor@email.com",
              phone: "+254 111 222 3333",
            },
            deliveryAddress: {
              country: "Kenya",
              city: "Nairobi",
            },
            employmentInfo: {
              status: "self-employed",
              monthlyIncome: 3200,
            },
            submittedAt: new Date("2024-01-13"),
            paymentStatus: "pending",
          },
        ];

        setApplications(sampleApplications);
        localStorage.setItem(
          "applications",
          JSON.stringify(sampleApplications)
        );
      } else {
        setApplications(storedApplications);
      }

      setLoading(false);
    };

    loadApplications();
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${app.personalInfo.firstName} ${app.personalInfo.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          app.personalInfo.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((app) => app.applicationType === typeFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, typeFilter]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: "bg-gray-100 text-gray-800", icon: Clock },
      "under-review": { color: "bg-blue-100 text-blue-800", icon: FileText },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      "payment-pending": {
        color: "bg-yellow-100 text-yellow-800",
        icon: DollarSign,
      },
      completed: {
        color: "bg-emerald-100 text-emerald-800",
        icon: CheckCircle,
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800" },
      processing: { color: "bg-blue-100 text-blue-800" },
      completed: { color: "bg-green-100 text-green-800" },
      failed: { color: "bg-red-100 text-red-800" },
    };

    const config = configs[status] || configs.pending;

    return (
      <Badge className={`${config.color} border-0`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleViewApplication = (applicationNumber) => {
    navigate(`/finance/application-details/${applicationNumber}`);
  };

  const handleProcessPayment = (application) => {
    navigate(`/payment/checkout`, {
      state: {
        application,
        paymentType: "full-payment",
        amount: application.totalAmount,
        applicationNumber: application.applicationNumber,
      },
    });
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(
      (app) => app.status === "pending" || app.status === "under-review"
    ).length,
    approved: applications.filter(
      (app) =>
        app.status === "approved" ||
        app.status === "completed" ||
        app.status === "payment-pending"
    ).length,
    totalValue: applications.reduce((sum, app) => sum + app.totalAmount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Finance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your vehicle finance applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Review
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Approved
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.approved}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Value
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatPrice(stats.totalValue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by application number, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="payment-pending">
                      Payment Pending
                    </SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-payment">Full Payment</SelectItem>
                    <SelectItem value="installment">Installment</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredApplications.length} of {applications.length}{" "}
                applications
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Application</TableHead>
                    <TableHead className="min-w-[200px]">Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow
                      key={application.applicationNumber}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm font-mono">
                            {application.applicationNumber}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {application.deliveryAddress.city},{" "}
                            {application.deliveryAddress.country}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm flex items-center">
                            <User className="w-3 h-3 mr-1 text-gray-400" />
                            {application.personalInfo.firstName}{" "}
                            {application.personalInfo.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.personalInfo.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            application.applicationType === "full-payment"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {application.applicationType === "full-payment"
                            ? "Full Payment"
                            : "Installment"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {formatPrice(application.totalAmount)}
                          </p>
                          {application.applicationType === "installment" &&
                            application.requestedPlan && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatPrice(
                                  application.requestedPlan.monthlyPayment
                                )}
                                /mo × {application.requestedPlan.totalPayments}
                              </p>
                            )}
                          {application.downPayment > 0 && (
                            <p className="text-xs text-green-600">
                              Down: {formatPrice(application.downPayment)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(application.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {new Date(
                              application.submittedAt
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(
                              application.submittedAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewApplication(
                                  application.applicationNumber
                                )
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {(application.status === "approved" ||
                              application.status === "payment-pending") &&
                              application.applicationType ===
                                "full-payment" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleProcessPayment(application)
                                  }
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Process Payment
                                </DropdownMenuItem>
                              )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No applications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "You haven't submitted any applications yet"}
                </p>
                {!searchTerm &&
                  statusFilter === "all" &&
                  typeFilter === "all" && (
                    <Button onClick={() => navigate("/cars")}>
                      <Car className="w-4 h-4 mr-2" />
                      Browse Cars
                    </Button>
                  )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate("/cars")} className="px-6">
            <Car className="w-4 h-4 mr-2" />
            Browse More Cars
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export both components
export default FinanceDashboard;
