
const express = require("express");

const userController = require('./../controllers/userController');
const authcontroller = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);
router.get('/logout', authcontroller.logout);
router.post('/forgotPassword', authcontroller.forgotPassword);
router.patch('/resetPassword/:token', authcontroller.resetPassword);

//Protect all routes after this middleware
router.use(authcontroller.protect);

router.patch('/updateMyPassword',authcontroller.updatePassword);
router.patch('/updateMe',userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.get('/me',userController.getMe,userController.getUser);
router.delete('/deleteMe', userController.deleteMe);


router.use(authcontroller.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
