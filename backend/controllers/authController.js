import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/authModel.js';

const hashPassword = async (pass) => {
    return await bcrypt.hash(pass, 10);
};

const signToken = (id, expiryTime) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: expiryTime || process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res, expiryTime) => {
    const token = signToken(user._id, expiryTime);
    
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    const userWithoutPassword = {
        _id: user._id,
        username: user.username,
        email: user.email
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
        data: userWithoutPassword,
    });
};

export const register = catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide name, email and password"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            status: "fail",
            message: "Password must be at least 8 characters long"
        });
    }

    let existingUser = await User.findOne({ name });
    if (existingUser) {
        return res.status(409).json({
            status: "fail",
            message: "User already exists with provided name!"
        });
    }

    existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            status: "fail",
            message: "User already exists with provided email!"
        });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    createSendToken(newUser, 201, res);
});


const login = catchAsync(async (req, res) => {
    const { email, password, captchaToken } = req.body;

    if (!email || !password || !captchaToken) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide email, password, and captcha token."
        });
    }

    //Verify CAPTCHA
    const verifyCaptcha = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            },
        }
    );

    if (!verifyCaptcha.data.success) {
        return res.status(400).json({
            status: "fail",
            message: "CAPTCHA verification failed."
        });
    }

    const user = await User.findOne({ email }).select('+password'); 
    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "User not found!"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            status: "fail",
            message: "Incorrect password!"
        });
    }

    createSendToken(user, 200, res, "24h");
});


export const logout = catchAsync(async (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ status: "success", message: "Logged out successfully!" });
});

export const fetchUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    
    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "User not found"
        });
    }
    
    res.status(200).json({ 
        status: "success",
        data: {
            id: user._id,
            name: user.name,
            email: user.email 
        }
    });
});

export const fetchAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({}).select("-password -__v");
    if (!users) {
        return res.status(404).json({
            status: "fail",
            message: "No users found"
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            users
        }
    });
});

export const updatePass = catchAsync(async (req, res) => {
    const { password } = req.body;
    
    if (!password || password.length < 8) {
        return res.status(400).json({
            status: "fail",
            message: "Password must be at least 8 characters long"
        });
    }
    
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "User not found"
        });
    }

    user.password = await hashPassword(password);
    await user.save();

    createSendToken(user, 200, res, "24h");
});

export const protect = catchAsync(async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({
            status: "fail",
            message: "You are not logged in! Please log in to get access"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const freshUser = await User.findById(decoded.id);

        if (!freshUser) {
            return res.status(401).json({
                status: "fail",
                message: "The user belonging to this token does not exist"
            });
        }
        
        req.user = freshUser;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token. Please log in again"
            });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "fail",
                message: "Your token has expired! Please log in again"
            });
        }
        return res.status(401).json({
            status: "error",
            message: "Authentication error"
        });
    }
});