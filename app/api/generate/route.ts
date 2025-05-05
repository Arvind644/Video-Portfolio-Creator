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

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      aspectRatio = '16:9', 
      loop = false,
      model = 'ray-2',
      duration = '4s'
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const client = getLumaClient();
    const generation = await client.generations.create({
      prompt,
      aspect_ratio: aspectRatio,
      loop,
      model,
      duration,
    });

    return NextResponse.json({ generationId: generation.id });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 