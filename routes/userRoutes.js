
const express = require("express");
const userController = require('./../controllers/userController');
const authcontroller = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);

router.post('/forgotPassword', authcontroller.forgotPassword);
router.patch('/resetPassword/:token', authcontroller.resetPassword);

router.patch('/updateMyPassword', authcontroller.protect, authcontroller.updatePassword);

router.patch('/updateMe', authcontroller.protect, userController.updateMe);

router.delete('/deleteMe', authcontroller.protect, userController.deleteMe);

router.route("/").get(userController.getAllUser).post(userController.createUser);

router.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(authcontroller.protect,authcontroller.restrictTo('admin','lead-guide'),userController.deleteUser);

module.exports = router;
