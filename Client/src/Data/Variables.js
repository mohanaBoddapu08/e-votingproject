// Server Endpoint (Change if using different Render URL)
export const serverLink = "https://e-voting-backend.onrender.com/api/v1/";

// Registration Fields Configuration
export const signupOptions = [
  { label: "Full Name", name: "fname", type: "text", required: true },
  { label: "Voter ID", name: "voterId", type: "text", required: true },
  { label: "Email Address", name: "email", type: "email", required: true },
  { label: "Mobile Number", name: "mobile", type: "tel", required: true },
  { label: "Password", name: "password", type: "password", required: true },
];

// Admin Authorized Wallet (Sepolia Testnet)
export const adminAddress = "0x76B519871799d0db01039f3Ccf190cb1C6848889";
