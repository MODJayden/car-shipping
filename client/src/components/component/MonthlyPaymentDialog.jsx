import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate } from "react-router";

const MonthlyPaymentDialog = ({
  isOpen,
  onOpenChange,
  currentPayment = "",
  onSave,
}) => {
  const currentToFix = parseFloat(currentPayment).toFixed(2);
  const navigate=useNavigate()
  const [monthlyPayment, setMonthlyPayment] = useState(currentToFix);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (
      !monthlyPayment ||
      isNaN(monthlyPayment) ||
      parseFloat(monthlyPayment) <= 0
    ) {
      setError("Please enter a valid monthly payment amount");
      return;
    }

    setError("");
    if(monthlyPayment !== currentToFix) {
        setError("Please enter a valid monthly payment amount");
        return;
    }
    if(monthlyPayment === currentToFix) {
      navigate("/finance",{
        
      })
    }
    onOpenChange(false);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setMonthlyPayment(currentToFix);
      setError("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Monthly Payment</DialogTitle>
          <DialogDescription>
            Enter the monthly payment amount for this application. <br />
            <span className="text-sm text-gray-500 font-bold">
              Monthly Payment: ${currentToFix}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyPayment">Monthly Payment Amount ($)</Label>
            <Input
              id="monthlyPayment"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={monthlyPayment}
              onChange={(e) => {
                setMonthlyPayment(e.target.value);
                setError("");
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyPaymentDialog;
