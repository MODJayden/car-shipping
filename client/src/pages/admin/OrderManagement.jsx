import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Car,
  Phone,
  Mail,
  Download,
  RefreshCw,
  MoreHorizontal,
  User,
  CreditCard,
  Edit,
  Save,
  X,
  FileText,
  TrendingUp,
} from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAllOrders, updateOrderStatus } from "../../store/order";
import OrderDetailDialog from "../../components/component/OrderDetailDialog";
import ProcessShippingComponent from "../../components/component/ProcessShippingComponent";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isShippingProcessOpen, setIsShippingProcessOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  // Filter orders
  useEffect(() => {
    if (!orders) return;

    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${order.car.make} ${order.car.model}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${order.customer.firstName} ${order.customer.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.deliveryAddress.city
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: CheckCircle,
        label: "Confirmed",
      },
      processing: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Package,
        label: "Processing",
      },
      shipped: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: Truck,
        label: "Shipped",
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Cancelled",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleStatusUpdate = (order) => {
    setUpdatingOrderId(order._id);
    setNewStatus(order.status);
    setStatusNotes("");
    setIsStatusUpdateOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!updatingOrderId || !newStatus) return;

    setUpdating(true);
    try {
      dispatch(
        updateOrderStatus({
          id: updatingOrderId,
          status: newStatus,
        })
      ).then((res) => {
        if (res?.payload?.success) {
          toast.success("Order status has been updated successfully.");
          setIsStatusUpdateOpen(false);
          dispatch(getAllOrders()); // Refresh orders
        }
      });
    } catch (error) {
      toast.success("Failed to update order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const stats = {
    total: filteredOrders?.length || 0,
    pending:
      filteredOrders?.filter((order) => order.status === "pending").length || 0,
    processing:
      filteredOrders?.filter((order) =>
        ["confirmed", "processing"].includes(order.status)
      ).length || 0,
    shipped:
      filteredOrders?.filter((order) => order.status === "shipped").length || 0,
    delivered:
      filteredOrders?.filter((order) => order.status === "delivered").length ||
      0,
    totalRevenue:
      filteredOrders?.reduce(
        (sum, order) => sum + (order.totalPricePaid || 0),
        0
      ) || 0,
  };

  const handleShippingProcess = (order) => {
    setSelectedOrder(order);
    setIsShippingProcessOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => dispatch(getAllOrders())}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Revenue
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, customer name, email, or city..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredOrders.length} of {orders?.length || 0} orders
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Order ID</TableHead>
                  <TableHead className="min-w-[200px]">Customer</TableHead>
                  <TableHead className="min-w-[200px]">Vehicle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell>
                      <div className="font-mono text-sm">
                        {order._id.slice(-8).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm flex items-center">
                          <User className="w-3 h-3 mr-1 text-gray-400" />
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {order.customer.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {order.customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          {order.car.images && order.car.images[0] ? (
                            <img
                              src={order.car.images[0]}
                              alt={`${order.car.make} ${order.car.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {order.car.make} {order.car.model}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {order.car.year} • {order.car.color}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            From: {order.car.originCountry}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">
                          {formatPrice(order.totalPricePaid)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.paymentMethod === "full-payment"
                            ? "Full Payment"
                            : "Installment"}
                        </p>
                        {order.downPayment > 0 && (
                          <p className="text-xs text-green-600">
                            Down: {formatPrice(order.downPayment)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(order.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleStatusUpdate(order)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {order.deliveryAddress.city}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.deliveryAddress.country}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString([], {
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
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(order)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShippingProcess(order)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Process Shipping
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No orders found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {orders?.length === 0
                  ? "No orders have been placed yet."
                  : "Try adjusting your search criteria or filters"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order{" "}
              {updatingOrderId?.slice(-8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {allowedStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(status)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a note about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={confirmStatusUpdate}
                disabled={updating || !newStatus}
                className="flex-1"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsStatusUpdateOpen(false)}
                disabled={updating}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OrderDetailDialog
        isDialogOpen={isOrderDetailOpen}
        setIsDialogOpen={setIsOrderDetailOpen}
        selectedOrder={selectedOrder}
      />

      <ProcessShippingComponent
        isShippingProcessOpen={isShippingProcessOpen}
        setIsShippingProcessOpen={setIsShippingProcessOpen}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;
