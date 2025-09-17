import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import carReducer from "./car";
import interestRateReducer from "./interestRate";
import orderReducer from "./order";
import paymentReducer from "./payment";
import paymentPlanReducer from "./paymentPlan";
import shippingReducer from "./shipping";
import notificationReducer from "./notification";
import applicationReducer from "./application";

const store = configureStore({
  reducer: {
    user: userReducer,
    car: carReducer,
    interestRate: interestRateReducer,
    order: orderReducer,
    payment: paymentReducer,
    paymentPlan: paymentPlanReducer,
    shipping: shippingReducer,
    notification: notificationReducer,
    application: applicationReducer,
  },
});

export default store;
