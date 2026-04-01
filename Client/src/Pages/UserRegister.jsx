import React, { useState, useEffect } from "react";
import axios from "axios";
import { signupOptions, serverLink } from "../Data/Variables";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserRegister = () => {
    const [userData, setUserData] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        if (!userData.email) return toast.error("Enter a valid email first.");
        
        setLoading(true);
        try {
            await axios.post(serverLink + "send-otp", { email: userData.email });
            setOtpSent(true);
            toast.success("OTP sent to your email!");
        } catch (err) {
            toast.error("Error sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        try {
            const res = await axios.post(serverLink + "verify-otp", { 
                email: userData.email, 
                otp: enteredOtp 
            });
            if (res.status === 200) {
                setIsVerified(true);
                toast.success("Email Verified!");
            }
        } catch (err) {
            toast.error("Invalid OTP.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isVerified) return toast.error("Verify email first.");

        setLoading(true);
        try {
            const res = await axios.post(serverLink + "register", userData);
            if (res.status === 201) {
                toast.success("Registration Successful!");
                window.location.href = "/login";
            }
        } catch (err) {
            toast.error("Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4 border-0 rounded-4">
                        <h2 className="text-center text-primary mb-4">Voter Registration</h2>
                        <form onSubmit={handleRegister}>
                            {signupOptions.map((opt) => (
                                <div className="mb-3" key={opt.name}>
                                    <label className="form-label">{opt.label}</label>
                                    <input 
                                        type={opt.type} 
                                        name={opt.name} 
                                        className="form-control rounded-pill" 
                                        onChange={handleChange} 
                                        required={opt.required} 
                                    />
                                </div>
                            ))}

                            {!otpSent ? (
                                <button onClick={sendOTP} className="btn btn-warning w-100 rounded-pill mb-3">
                                    Send Email OTP
                                </button>
                            ) : (
                                <div className="input-group mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control rounded-start-pill" 
                                        placeholder="Enter OTP" 
                                        onChange={(e) => setEnteredOtp(e.target.value)} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={verifyOTP} 
                                        className="btn btn-success rounded-end-pill"
                                        disabled={isVerified}
                                    >
                                        {isVerified ? "Verified" : "Verify"}
                                    </button>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100 rounded-pill mt-3" 
                                disabled={!isVerified || loading}
                            >
                                {loading ? "Registering..." : "COMPLETE REGISTRATION"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;