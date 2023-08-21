const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
};


exports.updateMe = catchAsync(async (req, res, next) => {
  //1.Create error if the user tries to put the password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for the password updates.Please use /updateMyPassword',
        400
      )
    );
  }

  //2.Filtered Out unwanted field names that were allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  //3.Update the user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};


exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    messsage: 'Route not defined.Please ! use signup instead.',
  });
};


exports.getAllUser = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
