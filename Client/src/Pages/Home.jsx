import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography, Container } from "@mui/material";
import { TransactionContext } from "../context/TransactionContext";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function Home() {
  const { isLoggedIn } = React.useContext(TransactionContext);
  
  // Get user details ONLY if we are logged in
  let user = null;
  if (isLoggedIn) {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) user = JSON.parse(savedUser);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 128px)",
              textAlign: "center",
              py: 5
            }}
          >
            {isLoggedIn && user ? (
              <>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
                  Welcome to Your Secure Voting Portal
                </Typography>
                <Typography variant="h5" color="textSecondary" mb={4}>
                  Hello, {user.fname || user.username}! Cast your choice for a better future.
                </Typography>
                <div style={{ padding: '40px', background: '#e3f2fd', borderRadius: '20px', border: '2px dashed #1976d2' }}>
                  <Typography variant="h6" color="primary">Blockchain-Protected Voting Environment</Typography>
                  <Typography variant="body1">Your identity is verified and your vote is anonymous.</Typography>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" sx={{ color: '#1a237e', mb: 4 }}>
                  Digital Voting Portal
                </Typography>
                <Typography variant="h5" color="textSecondary" mb={5}>
                    A secure, transparent, and decentralized way to vote.
                </Typography>
                <div style={{ padding: '40px', background: '#f5f5f5', borderRadius: '20px', border: '1px solid #ddd' }}>
                  <Typography variant="h6" color="textSecondary">Sign in to start participating in active elections.</Typography>
                </div>
              </>
            )}
          </Box>
        </Container>
      </main>
    </ThemeProvider>
  );
}
