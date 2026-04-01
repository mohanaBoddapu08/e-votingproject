import express from "express";
import AuthController from "../Controller/AuthController.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/otp", AuthController.otpTrial);

// Blockchain Routes
router.post("/cast-vote", AuthController.blockchain.castVote);
router.get("/get-transactions", AuthController.blockchain.getTransactions);

export default router;
