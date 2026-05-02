const router = require("express").Router();
const { register, login, logout, getMe } = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/get-me", authUser, getMe);

module.exports = router;
