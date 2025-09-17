const express = require("express");
const router = express.Router();
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarsByMake,
  getCarsByCondition,
} = require("../controller/car");
const { upload, handleUploadImages } = require("../helpers/cloudinary");


//Image upload
router.post("/upload", upload.array("product", 5), handleUploadImages);
// Public routes
router.get("/getAllCars", getAllCars);
router.get("/get/:id", getCarById);
router.get("/make/:make", getCarsByMake);
router.get("/condition/:condition", getCarsByCondition);

// Protected routes (admin only)
router.post("/create", createCar);
router.put("/update/:id", updateCar);
router.delete("/delete/:id", deleteCar);

module.exports = router;
