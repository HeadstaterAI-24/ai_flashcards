// File: PROJECT-4/ai_flashcards/app/flashcards/page.js


'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from "../components/Navbar";  // Include Navbar on flashcards page

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded || !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleDelete = async (name) => {
        if (!user) return;
        
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            
            const updatedCollections = collections.filter((flashcard) => flashcard.name !== name);

            
            const collectionRef = collection(userDocRef, name);
            const flashcardSnapshots = await getDocs(collectionRef);
            const batch = writeBatch(db);
    
            flashcardSnapshots.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
    
            await setDoc(userDocRef, { flashcards: updatedCollections }, { merge: true });

            setFlashcards(updatedCollections);
        }
    };

    return (
        <Container maxWidth="100vw">
            <Navbar />  {/* Include Navbar at the top */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid
                        item sx={12}
                        sm={6}
                        md={4}
                        key={index}
                    >
                        <Card>
                            <CardActionArea
                                onClick={() => {
                                    handleCardClick(flashcard.name);
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                    <IconButton
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the card click event
                                            handleDelete(flashcard.name);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
