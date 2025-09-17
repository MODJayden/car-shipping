import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { createShipping, getAllShippings } from "../../store/shipping";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getAllOrders } from "../../store/order";
const ProcessShippingComponent = ({
  isShippingProcessOpen,
  setIsShippingProcessOpen,
  selectedOrder,
}) => {
  const [formData, setFormData] = useState({
    fromCountry: "",
    orderId: "",
    toCountry: "",
    estimatedDays: "",
    cost: "",
    trackingNumber: "",
    status: "shipped",
    userId: "",
  });
  const dispatch = useDispatch();
  const { shippings } = useSelector((state) => state.shipping);
  const { user } = useSelector((state) => state.user);

  const existingShippings = shippings.find(
    (shipping) => shipping.orderId === selectedOrder?._id
  );

  useEffect(() => {
    dispatch(getAllShippings());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (selectedOrder) {
      setFormData((prev) => ({
        ...prev,
        orderId: selectedOrder._id,
        toCountry: selectedOrder.deliveryAddress.country,
        userId: selectedOrder.userId,
      }));
    }
  }, [selectedOrder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const shippingData = {
      ...formData,
      orderId: selectedOrder._id,
      toCountry: selectedOrder.deliveryAddress.country,
      userId: selectedOrder.userId,
    };
    if (existingShippings) {
      return toast.error("Shipping record already exists for this order.");
    }
    console.log(existingShippings);
    dispatch(createShipping(shippingData)).then((res) => {
      if (res?.payload?.success) {
        toast.success("Shipping record created successfully.");
        setIsShippingProcessOpen(false);
        dispatch(getAllShippings());
        dispatch(getAllOrders());
      }
    });

    setIsShippingProcessOpen(false);
  };

  const resetForm = () => {
    setFormData({
      fromCountry: "",
      orderId: "",
      estimatedDays: "",
      cost: "",
      trackingNumber: "",
      status: "pending",
    });
  };

  return (
    <Dialog
      open={isShippingProcessOpen}
      onOpenChange={setIsShippingProcessOpen}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Shipping</DialogTitle>
          <DialogDescription>
            Enter shipping details for the order. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fromCountry">From Country</Label>
            <Input
              id="fromCountry"
              placeholder="Enter country of origin"
              value={formData.fromCountry}
              onChange={(e) => handleInputChange("fromCountry", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedDays">Estimated Days</Label>
              <Input
                id="estimatedDays"
                type="number"
                min="1"
                placeholder="Days"
                value={formData.estimatedDays}
                onChange={(e) =>
                  handleInputChange("estimatedDays", e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Shipping Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              placeholder="Enter tracking number"
              value={formData.trackingNumber}
              onChange={(e) =>
                handleInputChange("trackingNumber", e.target.value)
              }
            />
          </div>
          {/* 
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsShippingProcessOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessShippingComponent;
