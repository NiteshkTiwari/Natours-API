const express = require('express');
const tourController = require('./../controllers/tourController');


const router = express.Router();

// router.param('id', tourController.checkId);
router.route("/top-5-cheap").get(tourController.aliasTopTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);


router.route("/").get(tourController.getAllTour).post(tourController.createTour);

router.route("/:id").get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);


module.exports = router;