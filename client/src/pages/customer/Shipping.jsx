import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
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
  Edit,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  MoreVertical,
  Navigation,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { getShippingUser } from "../../store/shipping";
import ShippingDetailsDialog from "../../components/component/ShippingDetails";

const AdminShippingManagement = () => {
  const [filteredShippings, setFilteredShippings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isShippingDetailsOpen, setIsShippingDetailsOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { customerShippings: shippings } = useSelector(
    (state) => state.shipping
  );
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    dispatch(getShippingUser(user?.id));
  }, [dispatch]);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    trackingNumber: "",
    notes: "",
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = shippings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (shipping) =>
          shipping.trackingNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipping.orderId.customer.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipping.orderId.customer.lastName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipping.orderId.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipping.fromCountry
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipping.toCountry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (shipping) => shipping.status === filterStatus
      );
    }

    // Country filter
    if (filterCountry !== "all") {
      filtered = filtered.filter(
        (shipping) =>
          shipping.fromCountry === filterCountry ||
          shipping.toCountry === filterCountry
      );
    }

    setFilteredShippings(filtered);
  }, [searchTerm, filterStatus, filterCountry, shippings]);

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

  const getTransportIcon = (fromCountry) => {
    switch (fromCountry) {
      case "USA":
      case "Canada":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Japan":
      case "Europe":
        return <Ship className="w-5 h-5 text-indigo-500" />;
      default:
        return <Plane className="w-5 h-5 text-purple-500" />;
    }
  };

  const handleUpdateShipping = () => {
    setIsLoading(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterCountry("all");
  };

  const handleShippingDetails = (shipping) => {
    setSelectedShipping(shipping);
    setIsShippingDetailsOpen(true);
  };

  // Calculate statistics
  const stats = {
    total: shippings.length,
    pending: shippings.filter((s) => s.status === "pending").length,
    inTransit: shippings.filter((s) =>
      ["shipped", "in-transit"].includes(s.status)
    ).length,
    delivered: shippings.filter((s) => s.status === "delivered").length,
    avgCost: Math.round(
      shippings.reduce((acc, s) => acc + s.cost, 0) / shippings.length || 0
    ),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex mb-3 flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor all vehicle shipments and deliveries
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
    {/*   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Shipments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  In Transit
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.inTransit}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.delivered}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Search and Filter */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by tracking number, customer name, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {filteredShippings.length} Shipment
            {filteredShippings.length !== 1 ? "s" : ""} Found
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Average shipping cost: ${stats.avgCost.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Shipments Table */}
      {filteredShippings.length > 0 ? (
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="font-semibold">Route</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Tracking</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Cost</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShippings.map((shipping) => (
                  <TableRow
                    key={shipping._id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getTransportIcon(shipping.fromCountry)}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {shipping.fromCountry} → {shipping.toCountry}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {shipping.orderId.deliveryAddress?.city}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {shipping.orderId.customer.firstName}{" "}
                          {shipping.orderId.customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {shipping.orderId.customer.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {shipping.orderId.customer.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {shipping.trackingNumber ? (
                        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {shipping.trackingNumber}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not assigned
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
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
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-green-600">
                        ${shipping.cost.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {shipping.estimatedDays} days
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(shipping.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Dialog
                          open={
                            isUpdateDialogOpen &&
                            selectedShipping?._id === shipping._id
                          }
                          onOpenChange={setIsUpdateDialogOpen}
                        ></Dialog>

                        <Button
                          className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleShippingDetails(shipping)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ship className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Shippingment Coming soon
            </h3>
           {/*  <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters to find shipments.
            </p> */}
          </CardContent>
        </Card>
      )}

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Ship className="w-5 h-5 mr-2 text-blue-600" />
              Update Shipping Status
            </DialogTitle>
            <DialogDescription>
              Update the shipping status and tracking information for this
              shipment.
            </DialogDescription>
          </DialogHeader>

          {selectedShipping && (
            <div className="space-y-4 py-4">
              {/* Shipment Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Route:
                  </span>
                  <span className="font-medium">
                    {selectedShipping.fromCountry} →{" "}
                    {selectedShipping.toCountry}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Customer:
                  </span>
                  <span className="font-medium">
                    {selectedShipping.orderId.customer.firstName}{" "}
                    {selectedShipping.orderId.customer.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Current Status:
                  </span>
                  <Badge
                    className={`${getStatusColor(
                      selectedShipping.status
                    )} border-0 capitalize`}
                  >
                    {selectedShipping.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              {/* Update Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">New Status</Label>
                  <Select
                    value={updateForm.status}
                    onValueChange={(value) =>
                      setUpdateForm((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="in-transit">In Transit</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    value={updateForm.trackingNumber}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        trackingNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter tracking number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Update Notes</Label>
                  <Textarea
                    id="notes"
                    value={updateForm.notes}
                    onChange={(e) =>
                      setUpdateForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Add any notes about this status update..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setSelectedShipping(null);
                setUpdateForm({ status: "", trackingNumber: "", notes: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateShipping}
              disabled={isLoading || !updateForm.status}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ShippingDetailsDialog
        isOpen={isShippingDetailsOpen}
        onOpenChange={setIsShippingDetailsOpen}
        shipping={selectedShipping}
      />
    </div>
  );
};

export default AdminShippingManagement;
