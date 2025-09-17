import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Upload,
  X,
  Save,
  Car,
  MapPin,
  DollarSign,
  Calendar,
  Fuel,
  Settings,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Grid3X3,
  List,
  Star,
  AlertCircle,
  CheckCircle,
  CardSim,
} from "lucide-react";
import CardDetailsModal from "../../components/component/CarDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CarFormSheet from "../../components/component/CarFormSheet";
import { useDispatch, useSelector } from "react-redux";
import { createCar, deleteCar, getAllCars, updateCar } from "../../store/car";
import { toast } from "sonner";
const AdminCarManagement = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const { cars } = useSelector((state) => state.car);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isEditCarOpen, setIsEditCarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carToDelete, setCarToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  const [filters, setFilters] = useState({
    make: "all",
    condition: "all",
    status: "all",
    originCountry: "all",
    fuelType: "all",
  });
  const [isLoading, setIsLoading] = useState(false);

  const carsPerPage = 40;

  const [carFormData, setCarFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    condition: "",
    fuelType: "",
    transmission: "",
    originCountry: "",
    price: "",
    currency: "USD",
    images: [],
    status: "available",
  });
  const handleSaveCar = async (carData, isEdit) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        // Update existing car
        dispatch(updateCar({ id: selectedCar._id, formData: carData })).then(
          (res) => {
            if (res?.payload?.success) {
              toast.success("Car updated successfully!");
              dispatch(getAllCars());
            } else {
              toast.error(res?.payload);
            }
          }
        );
      } else {
        // Add new car
        dispatch(createCar(carData)).then((res) => {
          if (res?.payload?.success) {
            toast.success("Car added successfully!");
            dispatch(getAllCars());
          } else {
            toast.error(res?.payload);
          }
        });
      }
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const popularCarMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "Nissan",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Hyundai",
    "Kia",
    "Subaru",
    "Mazda",
    "Lexus",
    "Acura",
    "Infiniti",
    "Cadillac",
    "Lincoln",
    "Buick",
    "GMC",
    "Ram",
    "Jeep",
    "Dodge",
    "Chrysler",
    "Mitsubishi",
    "Volvo",
    "Land Rover",
    "Jaguar",
    "Porsche",
    "Tesla",
    "Genesis",
    "Mini",
    "Fiat",
    "Alfa Romeo",
  ];

  // Filter and search logic
  useEffect(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(
        (car) =>
          `${car.make} ${car.model}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          car.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.year.toString().includes(searchTerm)
      );
    }

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "all") {
        filtered = filtered.filter((car) => car[key] === filters[key]);
      }
    });

    setFilteredCars(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filters, cars]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCars?.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars?.slice(startIndex, endIndex);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      make: "all",
      condition: "all",
      status: "all",
      originCountry: "all",
      fuelType: "all",
    });
    setSearchTerm("");
  };

  const handleDeleteCar = () => {
    setIsDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  const openEditSheet = (car) => {
    setSelectedCar(car);
    setIsEditCarOpen(true);
    setCarFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
      condition: car.condition,
      fuelType: car.fuelType,
      transmission: car.transmission,
      originCountry: car.originCountry,
      price: car.price.toString(),
      currency: car.currency,
      images: car.images,
      status: car.status,
    });
  };

  const openDeleteDialog = (car) => {
    dispatch(deleteCar(car._id)).then((res) => {
      if (res?.payload?.success) {
        toast.success("Car deleted successfully!");
        dispatch(getAllCars());
      } else {
        toast.error(res?.payload);
      }
    });
    setIsDeleteDialogOpen(false);
  };
  const openDetailsSheet = (car) => {
    setSelectedCar(car);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      available:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      sold: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      reserved:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      shipped:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return colors[status] || colors.available;
  };

  const getConditionIcon = (condition) => {
    switch (condition) {
      case "new":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const CarCard = ({ car }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={car.images[0] || "/api/placeholder/300/200"}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge
              className={`${getStatusColor(car.status)} border-0 capitalize`}
            >
              {car.status}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 py-1">
              {getConditionIcon(car.condition)}
              <span className="text-xs font-medium capitalize">
                {car.condition}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {car.year} • {car.color}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Fuel className="w-3 h-3" />
              <span className="capitalize">{car.fuelType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings className="w-3 h-3" />
              <span className="capitalize">{car.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{car.originCountry}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(car.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${car.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{car.currency}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditSheet(car)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openDetailsSheet(car)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openDeleteDialog(car)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CarRow = ({ car }) => (
    <Card className="mb-3 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-16 overflow-hidden rounded-lg flex-shrink-0">
            <img
              src={car.images[0] || "/api/placeholder/80/64"}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-gray-500">
                {car.year} • {car.color}
              </p>
            </div>

            <div className="text-sm">
              <div className="flex items-center space-x-1 mb-1">
                {getConditionIcon(car.condition)}
                <span className="capitalize">{car.condition}</span>
              </div>
              <p className="text-gray-500 capitalize">{car.fuelType}</p>
            </div>

            <div className="text-sm">
              <p className="font-medium">{car.originCountry}</p>
              <p className="text-gray-500 capitalize">{car.transmission}</p>
            </div>

            <div>
              <p className="font-bold text-green-600">
                ${car.price.toLocaleString()}
              </p>
              <Badge
                className={`${getStatusColor(
                  car.status
                )} border-0 capitalize text-xs`}
              >
                {car.status}
              </Badge>
            </div>

            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditSheet(car)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openDetailsSheet(car)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteDialog(car)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setIsAddCarOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Car
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by make, model, color, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Select
                value={filters.make}
                onValueChange={(value) => handleFilterChange("make", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  {popularCarMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.condition}
                onValueChange={(value) =>
                  handleFilterChange("condition", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.originCountry}
                onValueChange={(value) =>
                  handleFilterChange("originCountry", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Origins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Origins</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {filteredCars?.length} Cars Found
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cars Display */}
      {currentCars?.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {currentCars.map((car) =>
            viewMode === "grid" ? (
              <CarCard key={car._id} car={car} />
            ) : (
              <CarRow key={car._id} car={car} />
            )
          )}
        </div>
      ) : (
        <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No cars found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters, or add a new car to
              get started.
            </p>
            <Button onClick={() => setIsAddCarOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Car
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredCars.length)} of {filteredCars.length}{" "}
            cars
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Car Sheet */}
      <CarFormSheet
        isOpen={isAddCarOpen}
        onOpenChange={setIsAddCarOpen}
        isEdit={false}
        onSave={handleSaveCar}
      />

      {/* Edit Car Sheet */}
      <CarFormSheet
        isOpen={isEditCarOpen}
        onOpenChange={setIsEditCarOpen}
        isEdit={true}
        carData={selectedCar}
        onSave={handleSaveCar}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Delete Car
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{carToDelete?.make}{" "}
              {carToDelete?.model}"? This action cannot be undone and will
              permanently remove the car from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCar}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Car
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Modal */}
      <CardDetailsModal
        car={selectedCar}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default AdminCarManagement;
