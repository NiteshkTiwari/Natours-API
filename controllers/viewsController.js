const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverView = catchAsync(async (req, res, next) => {
    
    //1.Get tour data from the collection
    const tours = await Tour.find();
    
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
    
});

exports.getTour = catchAsync(async (req, res, next) => {
    //1. get  the data
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
  
   
  if (!tour)
  {
    return next(new AppError('There is no Tour with that name.', 404));
      }

        res
          .status(200)
          .set(
            'Content-Security-Policy',
            'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
          )
          .render('tour', {
            title: `${tour.name} Tour`,
            tour,
          });
});

exports.getLogin = (req, res) => {
  
  res.status(200).render('login', {
    title: 'Log into your account',
  });

  
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};