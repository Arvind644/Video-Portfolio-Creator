'use client';

import { useEffect } from 'react';
import { VideoData, pollGenerationStatus } from '../utils/luma';

interface VideoGalleryProps {
  videos: VideoData[];
  updateVideo: (
    id: string,
    updates: { state?: string; videoUrl?: string | null }
  ) => void;
}

export default function VideoGallery({ videos, updateVideo }: VideoGalleryProps) {
  // On component mount, poll for any pending videos
  useEffect(() => {
    videos.forEach((video) => {
      if (video.state === 'pending' && !video.videoUrl) {
        pollGenerationStatus(video.id, (data) => {
          updateVideo(video.id, data);
        });
      }
    });
  }, [videos, updateVideo]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Your generated videos will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      {videos.map((video) => (
        <div 
          key={video.id} 
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg truncate" title={video.prompt}>
              {video.prompt.length > 50 
                ? `${video.prompt.substring(0, 50)}...` 
                : video.prompt}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <StatusBadge state={video.state} />
              <div className="text-xs text-gray-500">
                {video.model && <span className="mr-2">{video.model}</span>}
                {video.duration && <span>{video.duration}</span>}
              </div>
            </div>
          </div>

          <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
            {video.videoUrl ? (
              <video 
                src={video.videoUrl}
                controls
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {video.state === 'pending' ? (
                  <div className="animate-pulse text-gray-400">
                    Generating video...
                  </div>
                ) : video.state === 'failed' ? (
                  <div className="text-red-500">
                    Failed to generate video
                  </div>
                ) : (
                  <div className="text-gray-400">
                    Waiting for generation to start...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ state }: { state: string }) {
  switch (state) {
    case 'completed':
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
          Completed
        </span>
      );
    case 'pending':
      return (
        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          Generating
        </span>
      );
    case 'failed':
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
          Failed
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
          {state}
        </span>
      );
  }
} 