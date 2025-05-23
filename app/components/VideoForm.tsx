'use client';

import { useState, useEffect } from 'react';
import { VideoData, pollGenerationStatus } from '../utils/luma';

// Define type for supported aspect ratios
type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '21:9' | '9:21';

// Define type for supported models
type ModelType = 'ray-2' | 'ray-flash-2' | 'ray-1-6';

// Define interface for request body
interface RequestBody {
  prompt: string;
  aspectRatio: AspectRatio;
  loop: boolean;
  model: ModelType;
  duration?: string;
}

interface VideoFormProps {
  addVideo: (video: VideoData) => void;
  updateVideo: (
    id: string,
    updates: { state?: string; videoUrl?: string | null }
  ) => void;
}

export default function VideoForm({ addVideo, updateVideo }: VideoFormProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [loop, setLoop] = useState(false);
  const [model, setModel] = useState<ModelType>('ray-2');
  const [duration, setDuration] = useState('5s');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if duration should be shown based on model selection
  const showDuration = model === 'ray-2' || model === 'ray-flash-2';
  
  // Reset duration if switching to a model that doesn't support it
  useEffect(() => {
    if (!showDuration) {
      setDuration('');
    } else if (duration === '') {
      setDuration('5s');
    }
  }, [model, showDuration, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare request body based on model selection
      const requestBody: RequestBody = {
        prompt,
        aspectRatio,
        loop,
        model,
      };
      
      // Only include duration for models that support it
      if (showDuration) {
        requestBody.duration = duration;
      }
      
      // Submit the generation request
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate video');
      }

      const { generationId } = await response.json();
      
      // Add the video to the gallery
      const newVideo: VideoData = {
        id: generationId,
        prompt,
        state: 'pending',
        videoUrl: null,
        model,
        duration: showDuration ? duration : undefined,
      };
      
      addVideo(newVideo);

      // Start polling for status
      pollGenerationStatus(generationId, (data) => {
        updateVideo(generationId, data);
      });
      
      // Reset form
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="prompt" 
          className="block text-sm font-medium mb-2"
        >
          Describe Your Video
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the professional video you want to create..."
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label 
            htmlFor="aspectRatio" 
            className="block text-sm font-medium mb-2"
          >
            Aspect Ratio
          </label>
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="16:9" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Landscape (16:9)</option>
            <option value="9:16" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Portrait (9:16)</option>
            <option value="1:1" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Square (1:1)</option>
            <option value="4:3" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Standard (4:3)</option>
          </select>
        </div>

        <div>
          <label 
            htmlFor="model" 
            className="block text-sm font-medium mb-2"
          >
            Model
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value as ModelType)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="ray-2" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Ray 2 (Default)</option>
            <option value="ray-flash-2" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Ray Flash 2</option>
            <option value="ray-1-6" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">Ray 1.6</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showDuration && (
          <div>
            <label 
              htmlFor="duration" 
              className="block text-sm font-medium mb-2"
            >
              Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            >
              <option value="5s" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">5 seconds</option>
              <option value="9s" className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">9 seconds</option>
            </select>
          </div>
        )}

        <div className={`flex items-center ${showDuration ? 'sm:items-end sm:pb-3 h-full' : ''}`}>
          <input
            type="checkbox"
            id="loop"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="loop" className="ml-2 block text-sm">
            Loop Video
          </label>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </button>
    </form>
  );
} 