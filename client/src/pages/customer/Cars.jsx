import React, { useState, useEffect } from "react";
import {
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  TrendingUp,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

import CarDetailsModal from "../../components/component/CarDetailsModal";
import CarCard from "../../components/component/CarCard";
import { useDispatch, useSelector } from "react-redux";

import { getAllCars } from "../../store/car";
import { getNotificationsByRecipient } from "../../store/notification";
import HeroBanner from "../../components/component/Banner";


// Main Cars Page Component
const Cars = () => {
  const cars = useSelector((state) => state.car.cars);
  const [filteredCars, setFilteredCars] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [filters, setFilters] = useState({
    make: "all",
    year: "all",
    priceRange: "all",
    fuelType: "all",
    transmission: "all",
    condition: "all",
    originCountry: "all",
    status: "available",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { recipientNotifications } = useSelector((state) => state.notification);



  useEffect(() => {
    fetchCars();
  }, [currentPage, searchTerm, filters, sortBy]);

  const fetchCars = () => {
    setIsLoading(true);

    // Convert filters to query parameters
    const queryParams = {
      page: currentPage,
      limit: 12, // You can make this configurable
      search: searchTerm,
    };

    // Add filters to query params if they're not "all"
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "all") {
        queryParams[key] = filters[key];
      }
    });

    // Handle price range separately
    if (filters.priceRange !== "all") {
      const [minPrice, maxPrice] = filters.priceRange.split("-").map(Number);
      queryParams.minPrice = minPrice;
      queryParams.maxPrice = maxPrice;
    }

    // Handle year separately
    if (filters.year !== "all") {
      queryParams.minYear = filters.year;
      queryParams.maxYear = filters.year;
    }

    // Handle sort
    switch (sortBy) {
      case "price-asc":
        queryParams.sortBy = "price";
        queryParams.sortOrder = "asc";
        break;
      case "price-desc":
        queryParams.sortBy = "price";
        queryParams.sortOrder = "desc";
        break;
      case "year-desc":
        queryParams.sortBy = "year";
        queryParams.sortOrder = "desc";
        break;
      case "year-asc":
        queryParams.sortBy = "year";
        queryParams.sortOrder = "asc";
        break;
      case "featured":
        queryParams.sortBy = "featured";
        queryParams.sortOrder = "desc";
        break;
      default:
        queryParams.sortBy = "createdAt";
        queryParams.sortOrder = "desc";
    }

    dispatch(getAllCars(queryParams))
      .then((response) => {
        if (response.payload && response.payload.success) {
          setTotalPages(response.payload.totalPages);
          setTotalCars(response.payload.total);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      make: "all",
      year: "all",
      priceRange: "all",
      fuelType: "all",
      transmission: "all",
      condition: "all",
      originCountry: "all",
      status: "available",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setIsDetailsOpen(true);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (filter) => filter !== "all" && filter !== "available"
    ).length;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
          className="w-10 h-10 p-0"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-10 px-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 p-0"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-10 px-4"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  };

  const featuredCars = cars.filter(
    (car) => car.featured && car.status === "available"
  );
  const stats = {
    total: totalCars,
    available: totalCars, // This would need to be calculated based on status
    avgPrice: Math.round(
      cars.reduce((acc, car) => acc + car.price, 0) / cars.length
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Stats Overview */}
        <HeroBanner />
        {/* Featured Cars Section */}
        {featuredCars.length > 0 && (
          <div className="mb-12 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                  Featured Vehicles
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Hand-picked premium selections
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1">
                {featuredCars.length} Featured
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredCars.slice(0, 3).map((car) => (
                <div key={car._id} className="relative">
                  <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                  <CarCard car={car} onViewDetails={handleViewDetails} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4 mt-4">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2 text-black dark:text-white" />
            {showMobileFilters ? (
              <h4 className=" text-black dark:text-white">Hide Filters</h4>
            ) : (
              <h4 className="text-black dark:text-white">Show Filters</h4>
            )}
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-2 bg-blue-500">
                {getActiveFiltersCount()}
              </Badge>
            )}
            {showMobileFilters ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </Button>
        </div>

        {/* Advanced Search and Filter Section */}
        <Card
          className={`mb-8 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
            showMobileFilters ? "block" : "hidden lg:block"
          }`}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Find Your Perfect Car
                </CardTitle>
                <CardDescription>
                  Use our advanced filters to find exactly what you're looking
                  for
                </CardDescription>
              </div>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="px-3 py-1 hidden lg:flex">
                  {getActiveFiltersCount()} Active Filter
                  {getActiveFiltersCount() !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Enhanced Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by make, model, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Quick Filters - Horizontal on desktop, vertical on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select
                  value={filters.make}
                  onValueChange={(value) => handleFilterChange("make", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                    <SelectValue placeholder="Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Makes</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="mercedes">Mercedes</SelectItem>
                    <SelectItem value="tesla">Tesla</SelectItem>
                    <SelectItem value="lexus">Lexus</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.originCountry}
                  onValueChange={(value) =>
                    handleFilterChange("originCountry", value)
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                    <SelectValue placeholder="Origin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Origins</SelectItem>
                    <SelectItem value="USA">🇺🇸 USA</SelectItem>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="Europe">🇪🇺 Europe</SelectItem>
                    <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", value)
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-30000">Under $30k</SelectItem>
                    <SelectItem value="30000-50000">$30k - $50k</SelectItem>
                    <SelectItem value="50000-100000">$50k - $100k</SelectItem>
                    <SelectItem value="100000-999999">$100k+</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange("year", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters - Collapsible on mobile */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    More Filters
                  </h3>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Select
                  value={filters.fuelType}
                  onValueChange={(value) =>
                    handleFilterChange("fuelType", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.transmission}
                  onValueChange={(value) =>
                    handleFilterChange("transmission", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.condition}
                  onValueChange={(value) =>
                    handleFilterChange("condition", value)
                  }
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="h-10 rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="all">All Status</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-10 rounded-lg"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {Object.values(filters).some(
              (filter) => filter !== "all" && filter !== "available"
            ) && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  Active filters:
                </span>
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value &&
                    value !== "all" &&
                    value !== "available" && (
                      <Badge
                        key={key}
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      >
                        {key}: {value}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleFilterChange(key, "all")}
                        />
                      </Badge>
                    )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalCars} {totalCars === 1 ? "Car" : "Cars"} Found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing page {currentPage} of {totalPages}
              </p>
            </div>
            {isLoading && (
              <Badge variant="outline" className="px-3 py-1">
                Loading...
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Sort Options */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="year-desc">Year: Newest First</SelectItem>
                  <SelectItem value="year-asc">Year: Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm self-start">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none h-10 px-4"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none h-10 px-4"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {cars.map((car) => (
                <CarCard
                  key={car._id}
                  car={car}
                  onViewDetails={handleViewDetails}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Empty State */}
            {cars.length === 0 && (
              <Card className="text-center py-12 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    No cars match your criteria
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find more
                    vehicles.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="px-6"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                    <Button onClick={() => setSearchTerm("")} className="px-6">
                      <Search className="w-4 h-4 mr-2" />
                      Clear Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && renderPagination()}
      </div>

      {/* Car Details Modal */}
      <CarDetailsModal
        car={selectedCar}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Cars;
