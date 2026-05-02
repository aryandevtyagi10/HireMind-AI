const router = require("express").Router();
const ctrl   = require("../controllers/interview.controller");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");

router.post("/",              authUser, upload.single("resume"), ctrl.generateReport);
router.get("/",               authUser, ctrl.getAllReports);
router.get("/report/:id",     authUser, ctrl.getReportById);
router.post("/resume/pdf/:id",authUser, ctrl.downloadResumePdf);

module.exports = router;
