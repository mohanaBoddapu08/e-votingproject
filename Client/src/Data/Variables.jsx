export const serverLink = process.env.REACT_APP_SERVER_URL || "https://e-votingproject-0gj2.onrender.com/api/auth/";
export const clientLink = process.env.REACT_APP_CLIENT_URL || "http://localhost:3000/";
export const facesLink = (process.env.REACT_APP_SERVER_URL || "https://e-votingproject-0gj2.onrender.com/api/auth/").replace("/api/auth/", "") + "/Faces/";
export const phases = ["init", "voting", "result"];
export const isFaceRecognitionEnable = true;
export const isRegistrationOpen = true; // Enforces Registration Window
