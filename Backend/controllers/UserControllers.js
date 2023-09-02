const User = require("../models/SignupModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key"; // Replace with your actual secret key

exports.AdminSignup = async (req, res) => {
  const { username, email, password,addedby } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      addedby,
    });
    const errors = {};
    if (!username) {
      errors.username = "Username is required";
    } else if (!/^[a-zA-Z\s]+$/.test(username)) {
      errors.username = "Username can only contain letters and spaces";
    }
  
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[a-zA-Z]).{8,}$/.test(
        password
      )
    ) {
      errors.password = "Invalid Password format";
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    await newUser.save();

    // Create a JWT token and send it as part of the response
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });

    res.status(201).json({ message: 'Admin registered successfully', token });
    console.log("Admin Registered Successfully");

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.getadminUserList = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
