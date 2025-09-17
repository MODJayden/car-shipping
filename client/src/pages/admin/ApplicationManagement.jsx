import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Download,
  Eye,
  Edit,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Car,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getAllApplications, updateStatus } from "../../store/application";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { toast } from "sonner";

const ApplicationManagement = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.application);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    dispatch(getAllApplications());
  }, [dispatch]);

  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.order.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.order.car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusUpdate = (applicationId, newStatus) => {
    dispatch(updateStatus({ applicationId, status: newStatus })).then((res) => {
      if (res.payload.success) {
        toast.success("Application status updated successfully");
        dispatch(getAllApplications());
      } else {
        toast.error(res.payload.message);
      }
    });
  };

  const downloadApplication = (application) => {
    // Create a printable PDF or text document
    const applicationText = `
      CAR LOAN APPLICATION
      ====================
      
      Personal Information:
      --------------------
      Name: ${application.user.firstName} ${application.user.lastName}
      Email: ${application.user.email}
      Phone: ${application.user.phone}
      Address: ${application.user.address}, ${application.user.city}, ${
      application.user.country
    }
      
      Vehicle Details:
      ----------------
      Car: ${application.order.car.make} ${application.order.car.model} ${
      application.order.car.year
    }
      Color: ${application.order.car.color}
      Condition: ${application.order.car.condition}
      Price: $${application.order.car.price}
      
      Order Information:
      -----------------
      Total Amount: $${application.order.totalAmount}
      Down Payment: $${application.order.downPayment}
      Payment Method: ${application.order.paymentMethod}
      Status: ${application.order.status}
      
      Payment Plan:
      -------------
      Monthly Payment: $${application.paymentPlan.monthlyPayment}
      Interest Rate: ${application.paymentPlan.interestRate}%
      Plan Duration: ${application.paymentPlan.planDuration} years
      Total Payments: ${application.paymentPlan.totalPayments}
      
      Employment Information:
      ----------------------
      Employer: ${application.employmentInfo.employer}
      Monthly Income: $${application.employmentInfo.monthlyIncome}
      Employment Status: ${application.employmentInfo.status}
      Years Employed: ${application.employmentInfo.yearsEmployed}
      
      Delivery Address:
      -----------------
      ${application.order.deliveryAddress.address}
      ${application.order.deliveryAddress.city}, ${
      application.order.deliveryAddress.country
    }
      Postal Code: ${application.order.deliveryAddress.postalCode}
      
      Application Date: ${new Date(application.createdAt).toLocaleDateString()}
    `;

    // Create and download text file
    const blob = new Blob([applicationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `application-${application.user.firstName}-${application.user.lastName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <p className="dark:text-white  text-black">
            Manage and review car loan applications
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card
          className={
            "mb-6 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          }
        >
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {filteredApplications.length} application(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortConfig.key === "createdAt" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Employment</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {application.user.firstName}{" "}
                          {application.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {application.user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {application.user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {application.order.car.make}{" "}
                          {application.order.car.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.order.car.year} •{" "}
                          {application.order.car.color}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {application.order.car.originCountry}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          {application.order.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.paymentPlan.monthlyPayment.toLocaleString()}
                          /mo
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1 text-gray-400" />
                          {application.employmentInfo.employer}
                        </div>
                        <div className="text-sm text-gray-500">
                          $
                          {application.employmentInfo.monthlyIncome.toLocaleString()}
                          /mo
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.employmentInfo.yearsEmployed} years
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadApplication(application)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(application._id, "pending")
                              }
                            >
                              <Clock className="w-4 h-4 mr-2" /> Set as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(
                                  application._id,
                                  "processing"
                                )
                              }
                            >
                              <AlertCircle className="w-4 h-4 mr-2" /> Set as
                              Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(application._id, "approved")
                              }
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(application._id, "rejected")
                              }
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            {selectedApplication && (
              <>
                <DialogHeader className="border-b pb-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Application Details
                      </DialogTitle>
                      <DialogDescription className="text-base text-gray-600 mt-2">
                        Complete application overview for{" "}
                        <span className="font-medium text-gray-800">
                          {selectedApplication.user.firstName}{" "}
                          {selectedApplication.user.lastName}
                        </span>
                      </DialogDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Application #{selectedApplication.id || "N/A"}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className=" gap-6">
                  {/* Personal Information */}
                  <Card className=" mb-3 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center text-gray-800">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Full Name
                          </p>
                          <p className="text-gray-900 font-medium">
                            {selectedApplication.user.firstName}{" "}
                            {selectedApplication.user.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Email
                          </p>
                          <p className="text-gray-900 break-words">
                            {selectedApplication.user.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Phone
                          </p>
                          <p className="text-gray-900">
                            {selectedApplication.user.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Location
                          </p>
                          <p className="text-gray-900">
                            {selectedApplication.user.city},{" "}
                            {selectedApplication.user.country}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Full Address
                        </p>
                        <p className="text-gray-900">
                          {selectedApplication.user.address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vehicle Information */}
                  <Card className="mb-3 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center text-gray-800">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <Car className="w-5 h-5 text-green-600" />
                        </div>
                        Vehicle Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Vehicle
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedApplication.order.car.make}{" "}
                          {selectedApplication.order.car.model}
                        </p>
                        <p className="text-gray-600">
                          Year: {selectedApplication.order.car.year}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Color
                          </p>
                          <p className="text-gray-900">
                            {selectedApplication.order.car.color}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Condition
                          </p>
                          <p className="text-gray-900">
                            {selectedApplication.order.car.condition}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Price
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            $
                            {selectedApplication.order.car.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Origin
                          </p>
                          <p className="text-gray-900">
                            {selectedApplication.order.car.originCountry}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card className="mb-3 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center text-gray-800">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        Payment Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Total Amount
                            </p>
                            <p className="text-xl font-bold text-purple-600">
                              $
                              {selectedApplication.order.totalAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Down Payment
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              $
                              {selectedApplication.order.downPayment.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="border-t pt-3 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Monthly
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              $
                              {selectedApplication.paymentPlan.monthlyPayment.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Interest Rate
                            </p>
                            <p className="text-lg font-semibold text-orange-600">
                              {selectedApplication.paymentPlan.interestRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Duration
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {selectedApplication.paymentPlan.planDuration}{" "}
                              years
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Employment Information */}
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center text-gray-800">
                        <div className="p-2 bg-amber-100 rounded-lg mr-3">
                          <Building className="w-5 h-5 text-amber-600" />
                        </div>
                        Employment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Company
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedApplication.employmentInfo.employer}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Monthly Income
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              $
                              {selectedApplication.employmentInfo.monthlyIncome.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Years Employed
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {selectedApplication.employmentInfo.yearsEmployed}{" "}
                              years
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Employment Status
                          </p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {selectedApplication.employmentInfo.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-8 pt-6 border-t">
                  <div className="text-sm text-gray-500">
                    Application submitted on {new Date().toLocaleDateString()}
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailOpen(false)}
                      className="min-w-[100px]"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => downloadApplication(selectedApplication)}
                      className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ApplicationManagement;
