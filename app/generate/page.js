// File: PROJECT-4/ai_flashcards/app/generate/page.js

'use client'

import { db } from "@/firebase";  // Import Firebase DB
import { useAuth, useUser } from "@clerk/nextjs";  // Clerk for user authentication
import { 
    Alert,
    Box, 
    Button, 
    Card, 
    CardActionArea, 
    CardContent, 
    Container, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Grid,
    Paper, 
    Snackbar, 
    TextField, 
    Typography 
} from "@mui/material";  // Import all necessary Material UI components
import { useRouter } from "next/navigation";  // Navigation hook from Next.js
import { useState } from "react";  // React state management
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore";  // Firestore operations
import Navbar from "../components/Navbar";  // Navbar component

export default function Generate(){
    const { isSignedIn } = useAuth();    
    const { user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [openDialog, setDialogOpen] = useState(false);
    const [openAlert, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    if (!isSignedIn) {
        router.push('/');
      }

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then((res) => res.json()).then((data) => {
            setFlashcards(data);
            setFlipped(Array(data.length).fill(false));  // Initialize flip state to false for all flashcards
        });
    };

    const handleCardClick = (index) => {
        setFlipped((prev) => {
            const newFlipped = [...prev];
            newFlipped[index] = !newFlipped[index];
            return newFlipped;
        });
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleAlertOpen = () => {
        setAlertOpen(true);
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            const totalFlashcards = collections.length

            if (user.publicMetadata.isPro === undefined && totalFlashcards >= 5) {
                setAlertMessage('Only Pro subscribers can have more than 5 flashcard collections. Upgrade to Pro to unlock unlimited flashcards.');
                handleAlertOpen()
                return;
            }

            if (collections.find((f) => f.name === name)) {
                setAlertMessage("Flashcard collection with the same name already exists.");
                handleAlertOpen()
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleDialogClose();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth="100vw">
            <Navbar />
            <Grid container justifyContent="center" sx={{ mt: 4, mb: 6 }}>
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h4">Generate Flashcards</Typography>   
                        <Paper sx={{ p: 4, width: '100%' }}>
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
                </Grid>
            </Grid>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4">Flashcards Preview</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea
                                        onClick={() => handleCardClick(index)}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                        transform: flipped[index]
                                                            ? 'rotateY(180deg)'
                                                            : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                        overflowY: 'auto',  // Allow scrolling if text overflows
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    }
                                                }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                        sx={{
                            mt: 4,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDialogOpen}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name of your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openAlert} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="info">
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
