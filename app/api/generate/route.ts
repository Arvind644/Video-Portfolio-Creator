import { NextRequest, NextResponse } from 'next/server';
import { LumaAI } from 'lumaai';

// Define type for supported aspect ratios
type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '21:9' | '9:21';

// Define type for supported models
type ModelType = 'ray-2' | 'ray-flash-2' | 'ray-1-6';

// Define interface for generation parameters
interface GenerationParams {
  prompt: string;
  aspect_ratio: AspectRatio;
  loop: boolean;
  model: ModelType;
  duration?: string;
}

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
      duration
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Prepare generation parameters
    const generationParams: GenerationParams = {
      prompt,
      aspect_ratio: aspectRatio as AspectRatio,
      loop,
      model: model as ModelType,
    };

    // Only include duration for models that support it (Ray 2 and Ray Flash 2)
    if (duration && (model === 'ray-2' || model === 'ray-flash-2')) {
      generationParams.duration = duration;
    }

    const client = getLumaClient();
    const generation = await client.generations.create(generationParams);

    return NextResponse.json({ generationId: generation.id });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
} 