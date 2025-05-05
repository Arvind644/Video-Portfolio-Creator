import { NextRequest, NextResponse } from 'next/server';
import { LumaAI } from 'lumaai';

// Initialize the LumaAI client
const getLumaClient = () => {
  const apiKey = process.env.LUMAAI_API_KEY;
  if (!apiKey) {
    throw new Error('LUMAAI_API_KEY is not defined');
  }
  return new LumaAI({ authToken: apiKey });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('id');

    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    const client = getLumaClient();
    const generation = await client.generations.get(generationId);

    return NextResponse.json({ 
      state: generation.state,
      videoUrl: generation.assets?.video || null,
      failureReason: generation.failure_reason || null
    });
  } catch (error) {
    console.error('Error checking video status:', error);
    return NextResponse.json(
      { error: 'Failed to check video status' },
      { status: 500 }
    );
  }
} 