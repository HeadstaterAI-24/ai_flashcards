// File: PROJECT-4/ai_flashcards/app/generate/page.js

'use client'

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../components/Navbar";  // Ensure correct path

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [text, setText] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    }).then((res) => res.json()).then((data) => setFlashcards(data));
  };

  return (
    <div style={{ width: '100%' }}>  {/* Ensure full width for the navbar */}
      <Navbar />  {/* Full-width Navbar */}
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: '100%', maxWidth: '600px' }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Flashcards Preview</Typography>
          {/* Flashcards preview rendering logic */}
        </Box>
      )}
    </div>
  );
}
