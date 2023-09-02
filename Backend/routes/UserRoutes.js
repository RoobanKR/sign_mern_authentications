const { getadminUserList, AdminSignup } = require("../controllers/UserControllers");
const { userVerification } = require("../middleware/authentication");
// const requireAuth = require("../middleware/secureMiddleware");
const router = require("express").Router();

// Apply authentication middleware globally if needed
// router.use(requireAuth);

// Example route for user signup (POST)
router.post("/Adminsignup", AdminSignup);

// Example route for user verification (POST)
router.post('/', userVerification);

// Example route for getting admin user list (GET)
router.get("/users", getadminUserList);

module.exports = router;
