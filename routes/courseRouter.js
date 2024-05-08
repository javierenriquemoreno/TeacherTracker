const router = require("express").Router();
const auth = require('../middlewares/auth');
const courseCtrl = require("../controllers/courseCtrl");

router.route("/courses", )
	.get(auth, courseCtrl.getCourses)
	.post(auth, courseCtrl.createCourse);

router.patch("/courses/join", auth, courseCtrl.joinCourse);

router.route("/courses:id/manage", )
	.delete(auth, courseCtrl.deleteCourse)
	.patch(auth, courseCtrl.addStatus);


router.patch("/courses:id/student/exit", auth, courseCtrl.exitCourse)
router.patch("/courses:id/student/delete", auth, courseCtrl.deleteStudent)

module.exports = router;