const router = require("express").Router();
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/create-order",   authUser, createOrder);
router.post("/verify-payment", authUser, verifyPayment);

module.exports = router;
