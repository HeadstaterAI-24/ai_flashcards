/**
 * 
  File: PROJECT-4/ai_flashcards/app/page.js
  * The Home page for the AI Flashcards application.
 */

'use client'

import { Container, Box, Typography, Grid, Button } from "@mui/material";
import Head from "next/head";
import Navbar from "./components/Navbar";  // Ensure correct relative path
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Get Started");
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      setButtonText("Generate Flashcards");
    } else {
      setButtonText("Get Started");
    }
  }, [isSignedIn]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>FlashGenius</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <Navbar />  {/* Include Navbar */}

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to FlashGenius
        </Typography>
        <Typography variant="h5" gutterBottom>
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={handleGetStarted}>
          {buttonText}
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', my: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Easy Input Text
            </Typography>
            <Typography>
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Smart Flashcards
            </Typography>
            <Typography>
              Our AI intelligently breaks down our text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Accessible Anywhere
            </Typography>
            <Typography>
              Access your flashcards from any device, at any time. Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
