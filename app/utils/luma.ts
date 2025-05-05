// Common types used across the application
export interface GenerationResponse {
  id: string;
  state: 'pending' | 'completed' | 'failed';
  failure_reason: string | null;
  assets: {
    video: string | null;
  } | null;
  model?: string;
  duration?: string;
}

export interface VideoData {
  id: string;
  prompt: string;
  videoUrl: string | null;
  state: string;
  model?: string;
  duration?: string;
}

// Poll for generation status until completion or failure
export async function pollGenerationStatus(
  generationId: string,
  onUpdate: (data: { state: string; videoUrl: string | null }) => void,
  maxDuration = 5 * 60 * 1000 // 5 minutes
): Promise<void> {
  const startTime = Date.now();
  const checkStatus = async () => {
    try {
      if (Date.now() - startTime > maxDuration) {
        return; // Stop polling after max duration
      }

      const response = await fetch(`/api/status?id=${generationId}`);
      
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      onUpdate({
        state: data.state,
        videoUrl: data.videoUrl,
      });

      // Continue polling if not completed or failed
      if (data.state !== 'completed' && data.state !== 'failed') {
        setTimeout(checkStatus, 5000); // Check again in 5 seconds
      }
    } catch (error) {
      console.error('Error polling for video status:', error);
      setTimeout(checkStatus, 5000); // Retry on error
    }
  };

  // Start polling
  checkStatus();
} 