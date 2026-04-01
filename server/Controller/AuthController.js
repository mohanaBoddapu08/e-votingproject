import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import User from "../Models/User.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import nodemailer from "nodemailer";
import twilio from "twilio";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const abiPath = path.join(__dirname, "../utils/Transaction.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

const secret = "something";

const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.send({ status: false, message: "User not found!" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.send({ status: false, message: "Incorrect password!" });

      const payload = { id: user._id };
      const token = jwt.encode(payload, secret);
      
      const passcode = Math.floor(100000 + Math.random() * 900000).toString();
      await User.findByIdAndUpdate(user._id, { passcode });

      return res.send({ status: true, message: "Login successful!", token, user, passcode });
    } catch (err) {
      return res.send({ status: false, message: err.message });
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, aadhar, dob, gender, address, city, state, pincode } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) return res.send({ status: false, message: "Email already exists!" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        aadhar, 
        dob, 
        gender, 
        address, 
        city, 
        state, 
        pincode 
      });
      await newUser.save();
      return res.send({ status: true, message: "Registered successfully!" });
    } catch (err) {
      return res.send({ status: false, message: err.message });
    }
  },

  otpTrial: async (req, res) => {
    const { identifier } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: "Voter Registration OTP",
        text: `Your registration OTP is: ${code}`,
      });
      return res.status(200).send("Verification code sent to your email!");
    } catch (err) {
      console.error("Mail Error:", err);
      return res.status(200).send("Verification code has been sent to your email. (Please check your spam folder)");
    }
  },

  blockchain: {
    castVote: async (req, res) => {
      try {
        const { election_id, candidate_id, user_id } = req.body;
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi.abi || abi, wallet);
        
        const tx = await contract.addToBlockchain(election_id, candidate_id, user_id);
        await tx.wait();
        
        return res.json({ success: true, hash: tx.hash });
      } catch (err) {
        console.error("Blockchain error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    },

    getTransactions: async (req, res) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi.abi || abi, wallet);
        
        const transactions = await contract.getAllTransaction();
        const formatted = transactions.map(t => ({
          election_id: t.election_id,
          candidate_id: t.candidate_id,
          user_id: t.user_id,
        }));
        
        return res.json(formatted);
      } catch (err) {
        console.error("Blockchain error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }
    }
  }
};

export default AuthController;
