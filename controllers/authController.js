const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role:req.body.role

    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next) => {

    const { email, password } = req.body;

    //1.Check email and password are provided by the user
    if (!email || !password) {
        return next(new AppError("Please provide email and password to login 🫠", 400));
    }

    //2.check if user exist and password is correct
    const user = await User.findOne({ email }).select("+password");
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }

    //3.If everyhting is ok send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token
    });

});

exports.protect = catchAsync(async (req, res, next) => {
    //1.Getting the token and checking if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in ! Please login to get access', 401));
    }

    //2.Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    //3.Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('User belonging to the current token does not exist', 401));
    }

    //4.check if the user changed the password after the token was issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed the passowrd.Please Login Again!',
          401
        )
      );
    }

    //Grant Access to the protected Routes
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //role=[admin,lead-guide]. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action ', 403));
        }

        next();
    }
    

}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1.Getting the user from the received email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new AppError('No user found with this email', 404)
        );
    }

    //2.Create ResetToken
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    
    });