import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Eye,
  Heart,
  Share2,
} from "lucide-react";
import React, { useState } from "react";

// Car Card Component
const CarCard = ({ car, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "sold":
        return "bg-red-100 text-red-800 border-red-200";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={car.images[currentImageIndex] || "/api/placeholder/400/300"}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover  transition-transform duration-300"
        />

        {/* Image Navigation Dots */}
        {car.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {car.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white shadow-lg"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            className={`px-2 py-1 text-xs font-medium border ${getStatusColor(
              car.status
            )} capitalize`}
          >
            {car.status}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Origin Country Flag */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-black/20 text-white border-0 backdrop-blur-sm">
            <MapPin className="w-3 h-3 mr-1" />
            {car.originCountry}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Year */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {car.make} {car.model}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              {car.year} • {car.color}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(car.price)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Base Price
            </p>
          </div>
        </div>

        {/* Car Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Fuel className="w-4 h-4 mr-2 text-gray-400" />
            <span className="capitalize">{car.fuelType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Settings className="w-4 h-4 mr-2 text-gray-400" />
            <span className="capitalize">{car.transmission}</span>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="mb-4">
          <Badge variant="secondary" className="capitalize">
            {car.condition} Condition
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => onViewDetails(car)}
            variant="ghost"
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Link to={`/financeOption/${car._id}`} className="flex-grow">
            <Button variant="outline" className="px-4 flex-grow w-full">
              Finance
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
