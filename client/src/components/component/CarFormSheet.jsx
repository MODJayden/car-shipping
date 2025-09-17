import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Car,
  Settings,
  DollarSign,
  ImageIcon,
  Upload,
  Save,
  RefreshCw,
  X,
} from "lucide-react";
import { uploadProductImages } from "../../store/car";
import { useDispatch } from "react-redux";

const CarFormSheet = ({
  isOpen,
  onOpenChange,
  isEdit = false,
  carData = null,
  onSave,
}) => {
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
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState([]);

  // Populate form when carData changes (for edit mode)
  useEffect(() => {
    if (isEdit && carData) {
      setCarFormData({
        make: carData.make || "",
        model: carData.model || "",
        year: carData.year || new Date().getFullYear(),
        color: carData.color || "",
        condition: carData.condition || "",
        fuelType: carData.fuelType || "",
        transmission: carData.transmission || "",
        originCountry: carData.originCountry || "",
        price: carData.price?.toString() || "",
        currency: carData.currency || "USD",
        status: carData.status || "available",
        images: carData.images || [],
      });

      // Set existing images as uploaded images
      if (carData.images && carData.images.length > 0) {
        setUploadedImages(
          carData.images.map((image, index) => ({
            previewUrl: image,
            name: `image-${index}`,
            size: 0,
            type: "image/jpeg",
            isExisting: true, // Flag to identify existing images
          }))
        );
      }
    } else {
      // Reset form for add mode
      setCarFormData({
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
      setUploadedImages([]);
    }
  }, [isEdit, carData, isOpen]);

  useEffect(() => {
    if (file && file.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      file.forEach((f) => data.append("product", f));
      dispatch(uploadProductImages(data)).then((res) => {
        if (res?.payload?.success) {
          setCarFormData((prev) => ({
            ...prev,
            images: res?.payload?.data.map((img) => img.url),
          }));
        }
        setIsUploading(false);
      });
    }
  }, [file]);

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

  const validateForm = () => {
    const errors = {};

    if (!carFormData.make) errors.make = "Make is required";
    if (!carFormData.model) errors.model = "Model is required";
    if (!carFormData.year) errors.year = "Year is required";
    if (!carFormData.color) errors.color = "Color is required";
    if (!carFormData.condition) errors.condition = "Condition is required";
    if (!carFormData.fuelType) errors.fuelType = "Fuel type is required";
    if (!carFormData.transmission)
      errors.transmission = "Transmission is required";
    if (!carFormData.originCountry)
      errors.originCountry = "Origin country is required";
    if (!carFormData.price) errors.price = "Price is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (updateType) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = {
        ...carFormData,
        price: Number(carFormData.price),
        year: Number(carFormData.year),
      };
      if (updateType === "update") {
        await onSave(formData, isEdit);
      } else {
        await onSave(formData);
      }
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error saving car:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCarFormData({
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
    setUploadedImages([]);
    setFormErrors({});
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    setFile(files);

    if (files.length === 0) return;

    const newImages = files.map((file) => {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);

      return {
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        isExisting: false,
      };
    });

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      if (!newImages[index].isExisting) {
        URL.revokeObjectURL(newImages[index].previewUrl);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <div className="p-4">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Car className="w-5 h-5 mr-2 text-blue-600" />
              {isEdit ? "Edit Car" : "Add New Car"}
            </SheetTitle>
            <SheetDescription>
              {isEdit
                ? "Update car information"
                : "Fill in the details to add a new car to inventory"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Car className="w-4 h-4 mr-2" />
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make *</Label>
                  <Select
                    value={carFormData.make}
                    onValueChange={(value) =>
                      setCarFormData((prev) => ({ ...prev, make: value }))
                    }
                  >
                    <SelectTrigger
                      className={formErrors.make ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {popularCarMakes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.make && (
                    <p className="text-sm text-red-500">{formErrors.make}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={carFormData.model}
                    onChange={(e) =>
                      setCarFormData((prev) => ({
                        ...prev,
                        model: e.target.value,
                      }))
                    }
                    placeholder="Enter model"
                    className={formErrors.model ? "border-red-500" : ""}
                  />
                  {formErrors.model && (
                    <p className="text-sm text-red-500">{formErrors.model}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={carFormData.year}
                    onChange={(e) =>
                      setCarFormData((prev) => ({
                        ...prev,
                        year: parseInt(e.target.value) || "",
                      }))
                    }
                    className={formErrors.year ? "border-red-500" : ""}
                  />
                  {formErrors.year && (
                    <p className="text-sm text-red-500">{formErrors.year}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={carFormData.color}
                    onChange={(e) =>
                      setCarFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    placeholder="Enter color"
                    className={formErrors.color ? "border-red-500" : ""}
                  />
                  {formErrors.color && (
                    <p className="text-sm text-red-500">{formErrors.color}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Technical Specifications
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select
                    value={carFormData.condition}
                    onValueChange={(value) =>
                      setCarFormData((prev) => ({ ...prev, condition: value }))
                    }
                  >
                    <SelectTrigger
                      className={formErrors.condition ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.condition && (
                    <p className="text-sm text-red-500">
                      {formErrors.condition}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type *</Label>
                  <Select
                    value={carFormData.fuelType}
                    onValueChange={(value) =>
                      setCarFormData((prev) => ({ ...prev, fuelType: value }))
                    }
                  >
                    <SelectTrigger
                      className={formErrors.fuelType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.fuelType && (
                    <p className="text-sm text-red-500">
                      {formErrors.fuelType}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transmission *</Label>
                <Select
                  value={carFormData.transmission}
                  onValueChange={(value) =>
                    setCarFormData((prev) => ({ ...prev, transmission: value }))
                  }
                >
                  <SelectTrigger
                    className={formErrors.transmission ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.transmission && (
                  <p className="text-sm text-red-500">
                    {formErrors.transmission}
                  </p>
                )}
              </div>
            </div>

            {/* Location & Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Location & Pricing
              </h3>

              <div className="space-y-2">
                <Label>Origin Country *</Label>
                <Select
                  value={carFormData.originCountry}
                  onValueChange={(value) =>
                    setCarFormData((prev) => ({
                      ...prev,
                      originCountry: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={formErrors.originCountry ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">🇺🇸 USA</SelectItem>
                    <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    <SelectItem value="Europe">🇪🇺 Europe</SelectItem>
                    <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.originCountry && (
                  <p className="text-sm text-red-500">
                    {formErrors.originCountry}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="100"
                    value={carFormData.price}
                    onChange={(e) =>
                      setCarFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="Enter price"
                    className={formErrors.price ? "border-red-500" : ""}
                  />
                  {formErrors.price && (
                    <p className="text-sm text-red-500">{formErrors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={carFormData.currency}
                    onValueChange={(value) =>
                      setCarFormData((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Availability
              </h3>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={carFormData.status}
                  onValueChange={(value) =>
                    setCarFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Images Upload */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </h3>

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Click to upload car images
                </p>
                <input
                  type="file"
                  id="car-images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="car-images">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </span>
                  </Button>
                </label>
              </div>

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isEdit ? "Current images" : "Uploaded images"} (
                    {uploadedImages.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.previewUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t">
              {isEdit ? (
                <Button
                  onClick={() => handleSubmit("update")}
                  disabled={isLoading || isUploading}
                  className="h-10 px-4 flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading || isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      loading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit("add")}
                  disabled={isLoading || isUploading}
                  className="h-10 px-4 flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading || isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      loading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CarFormSheet;
