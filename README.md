# Scan App Backend

A sustainable fashion analysis service built with Node.js/Express.js that uses computer vision to analyze clothing items and calculate their environmental impact through comprehensive carbon scoring.

## Features

- Real-time clothing analysis using Azure Vision API
- Environmental impact calculation and carbon scoring
- Efficient image processing and analysis pipeline
- RESTful API endpoints for seamless integration
- Comprehensive error handling and validation

##  Prerequisites

- Node.js (v22.11.0)
- npm (v10.2.4 or higher)
- Azure Vision API credentials
- Redis (optional, for caching)
- MongoDB (optional, for data persistence)

##  Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Narennnnn/eco-scan-challenge-backend
cd scan-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file and add the following
AZURE_VISION_API_KEY=<your-azure-vision-api-key>
AZURE_VISION_API_ENDPOINT=<your-azure-vision-api-endpoint>
PORT=3000
```

### Environment Setup

Create a `.env` file in the root directory with the following configurations:

```env
# Azure Vision API Configuration
AZURE_VISION_API_KEY=your_vision_api_key_here
AZURE_VISION_API_ENDPOINT=your_vision_endpoint_here

# Server Configuration
PORT=3000                       # Optional, defaults to 3000
NODE_ENV=development           # Optional, defaults to development

# Example Azure Vision Endpoint format
# AZURE_VISION_API_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/
```

To get Azure Vision API credentials:
1. Go to Azure Portal
2. Create or select a Computer Vision resource
3. Go to "Keys and Endpoint" section
4. Copy Key 1 (or Key 2) and Endpoint
5. Paste them in your .env file

### Running the Application

```bash
npm run dev

# Run tests
npm test
```

## Architecture

### Core Components

- **Image Processing Service**: Handles image uploads and preprocessing
- **Vision Analysis**: Integrates with Azure Vision API for garment analysis
- **Carbon Score Calculator**: Computes environmental impact scores
- **API Layer**: RESTful endpoints for client communication
- **In memory storage**: Uses an in memory store(Node.js memory store) for fast response



## Improvements

- Deploy to Azure App Service for reliable hosting
- Add MongoDB Atlas for storing scan history and user points
- Add Bull.js queue for handling multiple image uploads
- Implement basic rate limiting for API protection
- Add basic authentication system


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

##  Links
- [Frontend Repository](https://github.com/Narennnnn/eco-scan-challenge)
- [Backend Repository](https://github.com/Narennnnn/eco-scan-challenge-backend)

---

### Go Green, Save the Planet!💚🌏
