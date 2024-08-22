'use client'
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material"
import { useAuth } from "@clerk/nextjs"; // Import Clerk's useAuth

const ResultPage = ()=> {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const { userId } = useAuth(); // Get the authenticated user

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return 

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()

                if (res.ok) {
                    setSession(sessionData)

                    // If payment is successful, update the user's metadata
                    if (sessionData.payment_status === "paid") {
                        await fetch('/api/updateMetadata', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ isPro: true, userId: userId }),
                        });
                    }
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError('An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <Container
                maxWidth="100vw"
                sx={{
                    textAlign: 'center',
                    mt: 4,
                }}
            >
                <CircularProgress/>
                <Typography variant="h6">loading...</Typography>
            </Container>
        )
    }

    if (error) {
        return (
            <Container
                maxWidth="100vw"
                sx={{
                    textAlign: 'center',
                    mt: 4,
                }}
            >
                <CircularProgress/>
                <Typography variant="h6">{error}</Typography>
            </Container>
        )
    }

    return (
        <Container
            maxWidth="100vw"
            sx={{
                textAlign: 'center',
                mt: 4,
            }}
        >
            {
                session.payment_status === "paid" ? (
                    <>
                    <Typography variant="h4">Thank you for your purchase</Typography>
                    <Box sx={{mt: 22}}>
                        <Typography variant="h6">
                            We have received your payment.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{mt: 2}} 
                            onClick={() => {
                                  router.push('/')
                              }}
                        >
                            Home
                        </Button>
                    </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h4">Payment Failed</Typography>
                        <Box sx={{mt: 22}}>
                            <Typography variant="body1">
                                Your payment was not successful. Please try again.
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{mt: 2}} 
                                onClick={() => {
                                    router.push('/')
                                }}
                            >
                                Home
                            </Button>
                        </Box>
                    </>
                )
            }
            
        </Container>
    )
}

export default ResultPage