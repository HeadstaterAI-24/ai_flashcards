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
import getStripe from "@/utils/get-stripe";

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

  const handleSubmit = async ()=> {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'https://localhost:3000',
      }
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }
  }

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
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}  
            >
              <Typography variant="h5" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>
                Free
              </Typography>
              <Typography>
                {' '}
                Limited storage up to 5 flashcards.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
          <Box 
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}  
            >
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                $10 / Month
              </Typography>
              <Typography>
                {' '}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{mt: 2}} 
                onClick={() => {
                  if (isSignedIn) {
                    handleSubmit()
                  } else {
                    router.push('/sign-in')
                  }
                }}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
