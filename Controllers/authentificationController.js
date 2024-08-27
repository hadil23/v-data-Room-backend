const jwt = require("jsonwebtoken");
const { generateOPT, sendSms } = require("../utils/functions.js");
const User = require("../Models/User.js");

let otpAndPhoneNumberMap = new Map();

const sendOTP = async (req, res) => {
    let exist = false;
    const { phoneNumber } = req.body;
  
    const existingUser = await User.getUserByPhoneNumber(phoneNumber); // Create a method for this in User class
    if (existingUser) {
      exist = true;
    }
  
    const existingOTP = generateOPT();
    if (existingOTP) {
      otpAndPhoneNumberMap.set(phoneNumber, existingOTP);
    }
  
    console.log("OTP :", existingOTP);
    sendSms(phoneNumber, existingOTP);
  
    user = existingUser ? existingUser : new User(null, null, null, null, null, phoneNumber);
  
    res.json({ code: existingOTP, existingUser: exist });
};

const verifyOTP = async (req, res) => {
    const { otp, phoneNumber } = req.body;
  
    if (!otp || !phoneNumber) {
      return res.status(400).json({ msg: "OTP and phoneNumber are required" });
    }
  
    if (otpAndPhoneNumberMap.has(phoneNumber)) {
      const storedOTP = otpAndPhoneNumberMap.get(phoneNumber);
  
      if (storedOTP === otp) {
        otpAndPhoneNumberMap.delete(phoneNumber); // Remove OTP after verification
  
        try {
          let user = await User.getUserByPhoneNumber(phoneNumber);
  
          if (!user) {
            // Ensure you provide default or valid values for all required fields
            user = new User(null, 'Default Name', 'default@example.com', 'defaultPassword', 'user', phoneNumber);
            await user.createUser(); // Use the createUser method
          }
  
          const accessToken = jwt.sign(
            {
              user: {
                phoneNumber: user.phoneNumber,
                id: user.id, // Adjust based on your actual user object structure
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "365d" }
          );
  
          return res.status(200).json({ msg: "OTP verified successfully", accessToken });
        } catch (error) {
          console.error("Error saving user:", error);
          return res.status(500).json({ msg: "Error saving user", error });
        }
      } else {
        return res.status(400).json({ msg: "Incorrect OTP" });
      }
    } else {
      return res.status(400).json({ msg: "Phone Number not found!" });
    }
};

const signin = async (req, res) => {
  const { phoneNumber } = req.body;

  const user = await User.getUserByPhoneNumber(phoneNumber);
  if (!user) {
    return res
      .status(404)
      .json({ msg: `User with the number ${phoneNumber} does not exist!` });
  }

  const accessToken = jwt.sign(
    {
      user: {
        phoneNumber: user.phoneNumber,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "365d" }
  );

  return res.status(200).json({ accessToken });
};

const authenticateToken = (req, res) => {
  res.json(req.user);
};

module.exports = {
  sendOTP,
  signin,
  verifyOTP,
  authenticateToken,
};
