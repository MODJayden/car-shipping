const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserInfo,
  changePassword,
  deleteUser,
} = require("../controller/user");
const authMiddleware = require("../middleware/auth");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/getAll", getAllUsers);
router.get("/getUser/:id", getUserById);
router.put("/update/:id", updateUserInfo);
router.patch("/change-password/:id", changePassword);
router.delete("/delete/:id", deleteUser);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req?.userInfo;
  try {
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    res.json({
      success: true,
      message: "User authenticated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
