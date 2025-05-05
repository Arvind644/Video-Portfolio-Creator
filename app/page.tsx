'use client';

import { useState } from 'react';
import Image from 'next/image';
import VideoForm from './components/VideoForm';
import VideoGallery from './components/VideoGallery';

export default function Home() {
  const [videos, setVideos] = useState<Array<{
    id: string;
    prompt: string;
    videoUrl: string | null;
    state: string;
  }>>([]);

  const addVideo = (video: {
    id: string;
    prompt: string;
    state: string;
    videoUrl: string | null;
  }) => {
    setVideos((prev) => [...prev, video]);
  };

  const updateVideo = (
    id: string,
    updates: { state?: string; videoUrl?: string | null }
  ) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id ? { ...video, ...updates } : video
      )
    );
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-2">AI Video Portfolio Creator</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate professional portfolio videos with AI using Luma Labs
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid gap-16 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Create New Video</h2>
          <VideoForm addVideo={addVideo} updateVideo={updateVideo} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Videos</h2>
          <VideoGallery videos={videos} updateVideo={updateVideo} />
        </div>
      </main>

      <footer className="mt-20 text-center text-sm text-gray-500">
        <p>Powered by <a href="https://lumalabs.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Luma Labs</a> and <a href="https://buildclub.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Build Club</a></p>
      </footer>
    </div>
  );
}
