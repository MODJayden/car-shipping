import { CheckCircle, Car, FileText } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transaction, application, applicationNumber } = location.state || {};

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };
  useEffect(() => {
    // Send confirmation email (API call)
    // Update order status
    // Trigger shipping process
  }, []);

/*   if (!transaction) {
    navigate("/");
    return null;
  } */

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/20 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-teal-900/5 flex items-center justify-center pt-4">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your vehicle purchase has been completed successfully
          </p>
        </div>

        {/* Transaction Details */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Transaction ID:
                    </span>
                    <span className="font-mono">
                      {transaction.gatewayPaymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount Paid:
                    </span>
                    <span className="font-semibold text-green-600">
                      {transaction.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Payment Gateway:
                    </span>
                    <span>{transaction.gateway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Date:
                    </span>
                    <span>{transaction.createdAt.split("T")[0]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Application Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Application:
                    </span>
                    <span className="font-mono">{applicationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Customer:
                    </span>
                    <span>
                      {application.user.firstName} {application.user.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Confirmation Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You'll receive a confirmation email with your receipt and
                    transaction details within the next few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Vehicle Preparation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our team will prepare your vehicle and complete all
                    necessary documentation within 3-5 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Shipping Arrangement</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll arrange secure shipping to{" "}
                    {application.order.deliveryAddress.city},{" "}
                    {application.order.deliveryAddress.country} and
                    provide tracking information.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Delivery</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your vehicle will be delivered to your specified address
                    within 30-45 days, fully documented and ready to drive.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/track")} className="px-8">
            <FileText className="w-4 h-4 mr-2" />
            View All Applications
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="px-8"
          >
            <Car className="w-4 h-4 mr-2" />
            Browse More Cars
          </Button>
        </div>

        {/* Contact Support */}
        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Need help or have questions? Contact our support team at{" "}
            <a
              href="tel:+13474037275"
              className="font-semibold hover:underline"
            >
              +1 (347) 403-7275
            </a>{" "}
            or{" "}
            <a
              href="mailto:shuqranllc@gmail.com"
              className="font-semibold hover:underline"
            >
              shuqranllc@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
