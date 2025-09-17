import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Eye,
  Package,
  Truck,
  Receipt,
  MessageCircle,
  Check,
  Clock,
  CheckCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Download,
  MoreHorizontal,
  XCircle,
  AlertCircle,
  DollarSign,
  Car,
  CreditCard,
  RefreshCw,
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
import { getOrderForUser } from "../../store/order";
import OrderDetailDialog from "../../components/component/OrderDetailDialog";

const Track = () => {
  const { customerOrders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      dispatch(getOrderForUser(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (customerOrders) {
      setFilteredOrders(customerOrders);
      setLoading(false);
    }
  }, [customerOrders]);

  // Filter orders
  useEffect(() => {
    if (!customerOrders) return;

    let filtered = customerOrders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${order.car.make} ${order.car.model}`
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
  }, [customerOrders, searchTerm, statusFilter]);

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
    setIsDialogOpen(true);
  };

  const stats = {
    total: filteredOrders?.length || 0,
    pending:
      filteredOrders?.filter((order) => order.status === "pending").length || 0,
    processing:
      filteredOrders?.filter(
        (order) => order.status === "processing" || order.status === "confirmed"
      ).length || 0,
    completed:
      filteredOrders?.filter((order) => order.status === "delivered").length ||
      0,
    totalSpent:
      filteredOrders?.reduce(
        (sum, order) => sum + (order.totalPricePaid || 0),
        0
      ) || 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your vehicle orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Processing
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.processing}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Delivered
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.completed}
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
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatPrice(stats.totalSpent)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by order ID, car make/model, or city..."
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

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => dispatch(getOrderForUser(user.id))}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredOrders.length} of {customerOrders?.length || 0}{" "}
                orders
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Order ID</TableHead>
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
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
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
                          <p>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
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
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            {order.status === "shipped" && (
                              <DropdownMenuItem>
                                <Truck className="w-4 h-4 mr-2" />
                                Track Shipment
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Report Issue
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
                  {customerOrders?.length === 0
                    ? "No orders yet"
                    : "No orders found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {customerOrders?.length === 0
                    ? "You haven't placed any orders yet. Start by browsing our vehicles."
                    : "Try adjusting your search criteria or filters"}
                </p>
                {customerOrders?.length === 0 && (
                  <Button onClick={() => (window.location.href = "/cars")}>
                    <Car className="w-4 h-4 mr-2" />
                    Browse Cars
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <OrderDetailDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          selectedOrder={selectedOrder}
        />
      </div>
    </div>
  );
};

export default Track;
