const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide both email and password');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Please provide a valid email address');
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch(err) {
        next(err);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please fill all fields');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Please provide a valid email address');
        }

        if (password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters long');
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({ name, email, password });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch(err) {
        next(err);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch(err) {
        next(err);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            if (req.body.name !== undefined && req.body.name.trim() === '') {
                res.status(400);
                throw new Error('Name cannot be empty');
            }
            if (req.body.email !== undefined) {
                if (req.body.email.trim() === '') {
                    res.status(400);
                    throw new Error('Email cannot be empty');
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(req.body.email)) {
                    res.status(400);
                    throw new Error('Please provide a valid email address');
                }
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.address = req.body.address !== undefined ? req.body.address : user.address;

            if (req.body.password) {
                if (req.body.password.length < 6) {
                    res.status(400);
                    throw new Error('Password must be at least 6 characters long');
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch(err) {
        next(err);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch(err) {
        next(err);
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers };
