const nodemailer = require("nodemailer");
const User = require("../models/SignupModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const secretKey = "your_secret_key"; // Replace with your secret key
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: "roobankr6@gmail.com",
         pass: "pfdwevxunzujxcmy",
      },
    });
    
    const mailOptions = {
      from: "roobankr6@gmail.com", // Update with your email
      to: email,
      subject: "Password Reset",
      html: `Click <a href="${resetLink}">here</a> to reset your password.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent")
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};


exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.accountLocked) {
      const now = new Date();
      if (user.lockUntil > now) {
        const remainingTime = Math.ceil((user.lockUntil - now) / 1000); // Convert to seconds
        console.log(`Account locked. Please try again after ${remainingTime} seconds.`);
        return res.status(401).json({ message: `Account locked. Please try again after ${remainingTime} seconds.` });
      } else {
        // Reset failed login attempts and unlock account
        user.failedLoginAttempts = 0;
        user.accountLocked = false;
        await user.save();
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Reset failed login attempts on successful login
      user.failedLoginAttempts = 0;
      await user.save();

      const tokenPayload = {
        userId: user.id,
        username: user.username, // Assuming you have an 'username' field in your User model
      };

      const token = jwt.sign(tokenPayload, secretKey, {
        expiresIn: "1h",
      });

      const responseData = {
        token,
        username: user.username, // Send the admin's name in the response
      };

      res.json(responseData);
      console.log(token);
    } else {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.accountLocked = true;
        user.lockUntil = new Date(Date.now() + 10 * 1000); // Lock for 10 seconds
      }
      await user.save();

      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};