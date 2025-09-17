import React, { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Percent,
  AlertCircle,
  CheckCircle,
  Calculator,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Switch } from "@/components/ui/switch";

const RateFormSheet = ({
  isOpen,
  onOpenChange,
  isEdit = false,
  formErrors,
  handleAddRate,
  handleEditRate,
  resetRateForm,
  selectedRate,
  isLoading,
}) => {
  const [rateFormData, setRateFormData] = useState({
    duration: "",
    rate: "",
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      handleEditRate(selectedRate._id,rateFormData);
    } else {
      handleAddRate(rateFormData);
    }
  };

  useEffect(() => {
    if (isEdit && selectedRate) {
      // Populate fields for edit
      setRateFormData({
        duration: selectedRate?.duration?.toString(),
        rate: selectedRate?.rate?.toString(),
        isActive: selectedRate?.isActive,
      });
    } else if (!isEdit && isOpen) {
      // Reset form when opening add mode
      setRateFormData({
        duration: "",
        rate: "",
        isActive: true,
      });
    }
  }, [isEdit, selectedRate, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-auto sm:max-w-md">
        <div className="p-4">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Percent className="w-5 h-5 mr-2 text-blue-600" />
              {isEdit ? "Edit Interest Rate" : "Add Interest Rate"}
            </SheetTitle>
            <SheetDescription>
              {isEdit
                ? "Update interest rate information"
                : "Set up a new interest rate for payment plans"}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Duration Selection */}
            <div className="space-y-2">
              <Label>Plan Duration *</Label>
              <Select
                value={rateFormData?.duration}
                onValueChange={(value) =>
                  setRateFormData((prev) => ({ ...prev, duration: value }))
                }
              >
                <SelectTrigger
                  className={formErrors?.duration ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Year Plan</SelectItem>
                  <SelectItem value="2">2 Year Plan</SelectItem>
                  <SelectItem value="3">3 Year Plan</SelectItem>
                </SelectContent>
              </Select>
              {formErrors?.duration && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors?.duration}
                </p>
              )}
            </div>

            {/* Interest Rate Input */}
            <div className="space-y-2">
              <Label htmlFor="rate">Interest Rate (%) *</Label>
              <div className="relative">
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  max="99.99"
                  step="0.01"
                  value={rateFormData?.rate}
                  onChange={(e) =>
                    setRateFormData((prev) => ({
                      ...prev,
                      rate: e.target.value,
                    }))
                  }
                  placeholder="Enter rate (e.g., 7.5)"
                  className={`pr-10 ${
                    formErrors?.rate ? "border-red-500" : ""
                  }`}
                />
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {formErrors?.rate && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {formErrors?.rate}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Enter the annual interest rate as a percentage (0-99.99%)
              </p>
            </div>

            {/* Active Status */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Active Rate</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make this rate available for new payment plans
                  </p>
                </div>
                <Switch
                  checked={rateFormData?.isActive}
                  onCheckedChange={(checked) =>
                    setRateFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>

            {/* Rate Preview */}
            {rateFormData?.duration && rateFormData?.rate && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Calculator className="w-4 h-4 mr-2" />
                  Rate Preview
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Duration:
                    </span>
                    <span className="font-medium">
                      {rateFormData?.duration} Year
                      {rateFormData?.duration !== "1" ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Annual Rate:
                    </span>
                    <span className="font-bold text-blue-600">
                      {rateFormData?.rate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <Badge
                      className={
                        rateFormData?.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {rateFormData?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? "Update Rate" : "Add Rate"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  resetRateForm();
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

export default RateFormSheet;
