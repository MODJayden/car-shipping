import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyPayment } from "../../store/payment";
import { createOrder } from "../../store/order";

const PaymentCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your payment, please wait..."
  );

  
  const hasRun = useRef(false); // ✅ prevent duplicate execution

  useEffect(() => {
    if (hasRun.current) return; // ✅ stop if already executed
    hasRun.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const reference = searchParams.get("reference");

    const order = JSON.parse(localStorage.getItem("order") || "{}");
    const applicationNumber = JSON.parse(
      localStorage.getItem("applicationNumber") || "null"
    );

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      setTimeout(() => navigate("/payment/failed"), 3000);
      return;
    }

    dispatch(verifyPayment(reference))
      .then(async (res) => {
        const payment = res?.payload?.payment;

        if (payment?.status === "success") {
          setStatus("success");
          setMessage("Payment verified successfully! Redirecting...");

          const orderData = {
            ...order.order,
            customer: order.user,
            userId: order.userId,
            paymentId: payment._id,
            totalPricePaid: payment.amount,
          };

          // ✅ create order only once
          await dispatch(createOrder(orderData));

          // ✅ clear local storage after success
          localStorage.removeItem("order");
          localStorage.removeItem("applicationNumber");

          navigate("/paymentSuccess", {
            state: {
              transaction: payment,
              application: order,
              applicationNumber,
            },
          });
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please try again.");
        }
      })
      .catch(() => {
        setStatus("failed");
        setMessage("An error occurred during verification.");
      });
  }, [dispatch, navigate]);

  const LoadingSpinner = () => (
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse"></div>
    </div>
  );

  const SuccessIcon = () => (
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
  );

  const FailedIcon = () => (
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </div>
  );

  const getStatusIcon = () => {
    switch (status) {
      case "verifying":
        return <LoadingSpinner />;
      case "success":
        return <SuccessIcon />;
      case "failed":
        return <FailedIcon />;
      default:
        return <LoadingSpinner />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getBackgroundGradient = () => {
    switch (status) {
      case "verifying":
        return "from-blue-50 to-indigo-50";
      case "success":
        return "from-green-50 to-emerald-50";
      case "failed":
        return "from-red-50 to-rose-50";
      default:
        return "from-blue-50 to-indigo-50";
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center p-4 sm:p-6 lg:p-8`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 sm:p-10">
          <div className="flex justify-center mb-6">{getStatusIcon()}</div>

          <div className="text-center space-y-4">
            <h1 className={`text-xl sm:text-2xl font-bold ${getStatusColor()}`}>
              {status === "verifying" && "Processing Payment"}
              {status === "success" && "Payment Successful"}
              {status === "failed" && "Payment Failed"}
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {message}
            </p>
          </div>

          {status === "verifying" && (
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This may take a few moments...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 text-center">
                You will be redirected to complete your order confirmation.
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 text-center">
                If you continue to experience issues, please contact support.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs">Secure Payment Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
