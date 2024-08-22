import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const { isPro, userId } = await req.json();

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { isPro }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating metadata:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}