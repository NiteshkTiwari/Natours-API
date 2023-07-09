
const express = require("express");
const userController = require('./../controllers/userController');
const authcontroller = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authcontroller.signup);

router.route("/").get(userController.getAllUser).post(userController.createUser);

router.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
