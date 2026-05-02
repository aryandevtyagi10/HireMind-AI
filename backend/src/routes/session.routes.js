const router = require("express").Router();
const ctrl   = require("../controllers/session.controller");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

router.post("/",             authUser, upload.single("resume"), ctrl.startSession);
router.get("/",              authUser, ctrl.getAllSessions);
router.get("/:id",           authUser, ctrl.getSession);
router.post("/:id/answer",   authUser, ctrl.submitAnswer);
router.post("/:id/complete", authUser, ctrl.completeSession);
router.get("/:id/pdf",       authUser, ctrl.downloadReport);

module.exports = router;
