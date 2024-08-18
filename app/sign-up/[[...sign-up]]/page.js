// File: PROJECT-4/ai_flashcards/app/sign-up/page.js

import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Box, Container, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function SignUpPage(){
    return (
        <Container maxWidth="100vw">
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        AI Flashcards
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>

            <Box 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">
                    Sign Up
                </Typography>
                <SignUp/>
            </Box>
        </Container>
    )
}