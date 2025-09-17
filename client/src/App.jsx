import { Route, Routes } from "react-router-dom";
import Header from "./components/component/Header";
import Cars from "./pages/customer/Cars";
import Shipping from "./pages/customer/Shipping";
import Finance from "./pages/customer/Finance";
import Track from "./pages/customer/Track";
import Account from "./pages/customer/Account";
import Layout from "./pages/customer/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/user";
import { useEffect } from "react";
import Dashboard from "./pages/admin/Dashboard";
import CarManagement from "./pages/admin/CarManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import AuthWrapper from "./components/component/AuthWrapper";
import FinanceOptionsPage from "./pages/customer/FinanceOptionPage";
import PaymentCalculator from "./pages/customer/PaymentCalculator";
import FinanceFlow from "./pages/customer/FinancialFlow";
import FinanceApplication from "./pages/customer/FinancialApplication";
import InterestRate from "./pages/admin/InterestRate";
import FinancialProcessing from "./pages/customer/FinancialProcessing";
import FinanceDashboard from "./pages/customer/FinancialProcessing";
import PaymentProcessing from "./pages/customer/PaymentGateways";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import PaymentCallback from "./pages/customer/PaymentCallback";
import AdminShippingManagement from "./pages/admin/PaymentManagement";
import { getNotificationsByRecipient } from "./store/notification";
import ApplicationManagement from "./pages/admin/ApplicationManagement";
import Terms from "./pages/customer/Terms";
import AboutUs from "./pages/customer/About";

const App = () => {
  const { isAuth, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      dispatch(checkAuth(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getNotificationsByRecipient(user?.id));
    }
  }, [dispatch, user]); //

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthWrapper isAuth={isAuth} user={user}>
            <Layout />
          </AuthWrapper>
        }
      >
        <Route path="" element={<Cars />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="finance" element={<Finance />} />
        <Route path="about" element={<AboutUs />} />
        <Route
          path="financeApplication/:carId"
          element={<FinanceApplication />}
        />

        <Route path="financeOption/:carId" element={<FinanceOptionsPage />} />
        <Route path="track" element={<Track />} />
        <Route path="financialFlow/:carId/:type" element={<FinanceFlow />} />
        <Route path="account" element={<Account />} />
        <Route path="terms" element={<Terms />} />
        <Route path="payment" element={<PaymentProcessing />} />
        <Route path="callback" element={<PaymentCallback />} />
        <Route path="paymentSuccess" element={<PaymentSuccess />} />
        <Route
          path="financialProcessing/:carId"
          element={<FinancialProcessing />}
        />

        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AuthWrapper isAuth={isAuth} user={user}>
            <AdminLayout />
          </AuthWrapper>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cars" element={<CarManagement />} />
        <Route path="customers" element={<ApplicationManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="shipping" element={<AdminShippingManagement />} />
        <Route path="interest-rates" element={<InterestRate />} />
      </Route>
    </Routes>
  );
};
export default App;
