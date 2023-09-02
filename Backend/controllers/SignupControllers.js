const User = require("../models/SignupModel");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); // Import jwt library


//POST
module.exports.signup = async (req, res) => {
  const { username, email, password, fullName, dob, addedby } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("Email already exists");
    return res.status(400).json({ Error: "Email already exists" });
  }

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
  if (!fullName) {
    errors.fullName = "Full name is required";
  } else if (!/^[a-zA-Z]+$/.test(fullName)) {
    errors.fullName = "Invalid fullName format";
  }
  if (!dob) {
    errors.dob = "Date of birth is required";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    errors.dob = "Invalid dob format";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    const newUser = {
      username,
      email,
      password: hashedPassword,
      fullName,
      dob,
      addedby
    };
    const result = await User.create(newUser);
    const token = jwt.sign({ userId: result._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Set the token in response cookies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    console.log(token)
    console.log("User Registered Successfully");
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Internal server error" });
  }
};
//GET
module.exports.getsignup = async (req, res) => {
  await User
    .find({})
    .then((result) => {
      console.log("Login Success");
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};



//BYID
module.exports.findsignup = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ Error: "Detail not found" });
  }
  try {
    const enrolled = await User.findById(id);
    console.log("Data returned for view");
    return res.json(enrolled);
  } catch (err) {
    return console.log(err);
  }
};

module.exports.deletesignup = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ Error: "Detail not found" });
  }

  try {
    const result = await User.findByIdAndDelete(id);
    if (result) {
      console.log("Form deleted");
      res.status(200).json({ Message: "Form deleted successfully" });
    } else {
      console.log("Form not found");
      res.status(404).json({ Error: "Form not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ Error: "Internal server error" });
  }
};
