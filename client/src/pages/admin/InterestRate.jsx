import React, { useState, useEffect, use } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Percent,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RateFormSheet from "../../components/component/RateFormSheet";
import { useDispatch, useSelector } from "react-redux";
import {
  createInterestRate,
  getAllInterestRates,
  updateInterestRate,
  deleteInterestRate,
} from "../../store/interestRate";
import { toast } from "sonner";

const InterestRate = () => {
  const { interestRates } = useSelector((state) => state.interestRate);
  const [filteredRates, setFilteredRates] = useState([]);
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [isEditRateOpen, setIsEditRateOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [rateToDelete, setRateToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [rateFormData, setRateFormData] = useState({
    duration: "",
    rate: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(getAllInterestRates());
    setFilteredRates(interestRates);
  }, [dispatch]);

  const [formErrors, setFormErrors] = useState({});

  // Filter logic
  useEffect(() => {
    let filtered = interestRates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (rate) =>
          rate.duration.toString().includes(searchTerm) ||
          rate.rate.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      const isActive = filterStatus === "active";
      filtered = filtered.filter((rate) => rate.isActive === isActive);
    }

    setFilteredRates(filtered);
  }, [searchTerm, filterStatus, interestRates]);

  const validateRateForm = (data) => {
    const errors = {};

    if (!data.duration) {
      errors.duration = "Duration is required";
    } else if (![1, 2, 3].includes(parseInt(data.duration))) {
      errors.duration = "Duration must be 1, 2, or 3 years";
    }

    if (!data.rate) {
      errors.rate = "Interest rate is required";
    } else {
      const rate = parseFloat(data.rate);
      if (isNaN(rate) || rate <= 0 || rate >= 100) {
        errors.rate = "Interest rate must be between 0 and 100";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRate = (data) => {
    if (!validateRateForm(data)) return;

    setIsLoading(true);
    dispatch(createInterestRate(data)).then((res) => {
      if (res.payload.success) {
        setIsLoading(false);
        toast.success("Interest rate added successfully");
        dispatch(getAllInterestRates());
        setIsAddRateOpen(false);
        setRateFormData({
          duration: "",
          rate: "",
          isActive: true,
        });
      } else {
        setFormErrors(res.payload.errors);
        setIsLoading(false);
      }
    });
  };

  const handleEditRate = (id, data) => {
    if (!validateRateForm(data)) return;

    setIsLoading(true);
    dispatch(updateInterestRate({ id, formData: data })).then((res) => {
      if (res.payload.success) {
        setIsLoading(false);
        toast.success("Interest rate updated successfully");
        dispatch(getAllInterestRates());
        setIsEditRateOpen(false);
        setRateFormData({
          duration: "",
          rate: "",
          isActive: true,
        });
      } else {
        setFormErrors(res.payload);
        setIsLoading(false);
      }
    });
  };

  const handleDeleteRate = (id) => {
    setIsLoading(true);
    dispatch(deleteInterestRate(id)).then((res) => {
      if (res.payload.success) {
        toast.success("Interest rate deleted successfully");
        dispatch(getAllInterestRates());
        setIsDeleteDialogOpen(false);
        setRateToDelete(null);
      } else {
        setFormErrors(res.payload);
        setIsLoading(false);
      }
    });
  };

  const handleToggleStatus = (rate) => {
    // Check if trying to activate a rate when another rate for same duration is already active
    if (!rate.isActive) {
      const existingActiveRate = interestRates.find(
        (r) => r.duration === rate.duration && r.isActive && r._id !== rate._id
      );

      if (existingActiveRate) {
        alert(
          "Another rate for this duration is already active. Please deactivate it first."
        );
        return;
      }
    }

    setInterestRates((prev) =>
      prev.map((r) =>
        r._id === rate._id
          ? { ...r, isActive: !r.isActive, updatedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const openEditSheet = (rate) => {
    setSelectedRate(rate);
    setRateFormData({
      duration: rate.duration.toString(),
      rate: rate.rate.toString(),
      isActive: rate.isActive,
    });
    setIsEditRateOpen(true);
  };

  const openDeleteDialog = (rate) => {
    setRateToDelete(rate);
    setIsDeleteDialogOpen(true);
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

  const getRateChangeIndicator = (rate) => {
    // Simple logic to show if rate is above/below average
    const avgRate =
      interestRates.reduce((acc, r) => acc + r.rate, 0) / interestRates.length;
    return rate.rate > avgRate ? (
      <TrendingUp className="w-4 h-4 text-red-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-green-500" />
    );
  };

  // Calculate statistics
  const activeRates = interestRates.filter((rate) => rate.isActive);
  const avgRate =
    interestRates.length > 0
      ? (
          interestRates.reduce((acc, rate) => acc + rate.rate, 0) /
          interestRates.length
        ).toFixed(2)
      : 0;
  const highestRate =
    interestRates.length > 0
      ? Math.max(...interestRates.map((rate) => rate.rate)).toFixed(2)
      : 0;
  const lowestRate =
    interestRates.length > 0
      ? Math.min(...interestRates.map((rate) => rate.rate)).toFixed(2)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
         
          <p className="text-gray-600 dark:text-gray-400">
            Manage interest rates for payment plans and financing options
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Rate History
          </Button>
          <Sheet open={isAddRateOpen} onOpenChange={setIsAddRateOpen}>
            <SheetTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Rate
              </Button>
            </SheetTrigger>
            <RateFormSheet
              isOpen={isAddRateOpen}
              onOpenChange={setIsAddRateOpen}
              rateFormData={rateFormData}
              setRateFormData={setRateFormData}
              formErrors={formErrors}
              isEdit={false}
              handleAddRate={handleAddRate}
              isLoading={isLoading}
              handleEditRate={handleEditRate}
              selectedRate={selectedRate}
            />
          </Sheet>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {filteredRates.length} Interest Rate
            {filteredRates.length !== 1 ? "s" : ""} Found
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activeRates.length} active •{" "}
            {interestRates.length - activeRates.length} inactive
          </p>
        </div>
      </div>

      {/* Interest Rates Table */}
      {filteredRates.length > 0 ? (
        <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Interest Rate</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRates.map((rate) => (
                  <TableRow
                    key={rate._id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {rate.duration} Year{rate.duration !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Percent className="w-4 h-4 text-green-500" />
                        <span className="font-bold text-lg">{rate.rate}%</span>
                        {getRateChangeIndicator(rate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${getStatusColor(
                            rate.isActive
                          )} border-0`}
                        >
                          {rate.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={rate.isActive}
                          onCheckedChange={() => handleToggleStatus(rate)}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(rate.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(rate.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditSheet(rate)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Rate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Usage
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(rate)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Rate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
              <Percent className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No interest rates found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by adding your first interest rate for payment plans.
            </p>
            <Button onClick={() => setIsAddRateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Rate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Rate Sheet */}
      <RateFormSheet
        isOpen={isEditRateOpen}
        onOpenChange={setIsEditRateOpen}
        rateFormData={rateFormData}
        setRateFormData={setRateFormData}
        formErrors={formErrors}
        isEdit={true}
        handleAddRate={handleAddRate}
        isLoading={isLoading}
        handleEditRate={handleEditRate}
        selectedRate={selectedRate}
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
              Delete Interest Rate
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {rateToDelete?.duration}-year
              plan rate of {rateToDelete?.rate}%? This action cannot be undone
              and may affect existing payment plans.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteRate(rateToDelete._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Rate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InterestRate;
