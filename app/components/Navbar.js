// File: PROJECT-4/ai_flashcards/app/components/Navbar.js

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1565c0',
        padding: '0.5rem 1rem',
        width: '100%',  // Ensure full width
        '&:hover': {
          backgroundColor: '#1e88e5',
          transition: 'background-color 0.3s ease-in-out',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
            AI Flashcards
          </Link>
        </Typography>
        <Box>
          <Button sx={{ color: 'white', mx: 1 }}>
            <Link href="/flashcards" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
              Flashcards
            </Link>
          </Button>
          <SignedOut>
            <Button sx={{ color: 'white', mx: 1 }}>
              <Link href="/sign-in" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                Login
              </Link>
            </Button>
            <Button sx={{ color: 'white', mx: 1 }}>
              <Link href="/sign-up" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

