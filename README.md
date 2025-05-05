# AI Video Portfolio Creator

A Next.js application for generating professional portfolio videos using Luma Labs AI.

## Features

- Generate videos from text descriptions
- Multiple aspect ratio options
- Video duration selection
- AI model selection (Luma Ray versions)
- Loop video option
- Real-time status updates
- Video gallery with playback

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- An API key from Luma Labs

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Luma API key:

```
LUMAAI_API_KEY=luma-xxxxxxxxxxxxxxxxxxxxxxxx
```

You can get your API key from: [https://lumalabs.ai/dream-machine/api/keys](https://lumalabs.ai/dream-machine/api/keys)

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a detailed description of the video you want to create
2. Select the desired aspect ratio (16:9, 9:16, 1:1, or 4:3)
3. Choose an AI model version (Ray 1.6, Ray 2, or Ray Flash 2)
4. Select a video duration (5s or 9s)
5. Toggle the loop option if you want the video to loop
6. Click "Generate Video"
7. Wait for the video to be generated (this usually takes 1-2 minutes)
8. View and play your video in the gallery
9. Download the video by right-clicking and selecting "Save video as..."

## Technologies Used

- Next.js
- React
- Luma Labs AI API
- Tailwind CSS

## License

This project is licensed under the MIT License.
