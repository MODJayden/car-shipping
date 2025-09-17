require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const connectDB = require("./db/db");
const userRouter = require("./router/user");
const carRouter = require("./router/car");
const shippingRouter = require("./router/shipping");
const interestRateRouter = require("./router/interestRate");
const notificationRouter = require("./router/notification");
const orderRouter = require("./router/order");
const paymentRouter = require("./router/payment");
const paymentPlanRouter = require("./router/paymentPlan");
const applicationRouter = require("./router/application");

const CronJob = require("./cronJob");

//connecting to database
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
  })
);
CronJob.start();

//routes
app.use("/api/user", userRouter);
app.use("/api/car", carRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/interestRate", interestRateRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/paymentPlan", paymentPlanRouter);
app.use("/api/application", applicationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
