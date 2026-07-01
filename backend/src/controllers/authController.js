const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try{
        const {name, email, password, role} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: "user already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({
            message: "User created successfully",
            user,
        });
        }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
    }

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );
        res.status(200).json({
            token, 
            user,
        });
    }
    catch(error){
        res.status(500).json({
            error: error.message
        })
    }
}

const profile = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = { register, login, profile};