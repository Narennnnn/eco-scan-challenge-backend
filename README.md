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
- Azure AI Service credentials
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

# Example Azure Vision Endpoint format
# AZURE_VISION_API_ENDPOINT=https://your-resource-name.openai.azure.com/
```

To get Azure Vision API credentials:
1. Go to Azure Portal
2. Create or select a Azure AI service
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

## Carbon Score Assumptions

To calculate the environmental impact of each clothing item, we have assigned approximate carbon scores based on item type. These scores are stored in an in-memory dictionary for quick access.

### Base Scores (kg CO₂)
| Item Type    | Base Score | Environmental Impact |
|-------------|------------|---------------------|
| T-shirt     | 5         | Low                 |
| Shirt       | 7         | Medium-Low          |
| Jeans       | 10        | Medium              |
| Jacket      | 15        | High                |
| Dress       | 12        | Medium-High         |
| Accessories | 2-4       | Low                 |
| Shoes       | 8         | Medium              |
| Sportswear  | 6         | Medium-Low          |
| Underwear   | 3         | Low                 |

### Adjustment Multipliers

#### Material Impact
| Material Type      | Factor | Environmental Impact |
|-------------------|--------|---------------------|
| Organic Cotton    | 0.7    | Better             |
| Standard Cotton   | 1.0    | Neutral            |
| Polyester        | 1.2    | Worse              |
| Recycled Polyester| 0.8    | Better             |
| Wool             | 1.3    | Worse              |
| Recycled Wool    | 0.9    | Better             |
| Leather          | 1.5    | Worst              |
| Vegan Leather    | 1.2    | Worse              |
| Recycled Materials| 0.6    | Best               |
| Bamboo           | 0.7    | Better             |
| Linen            | 0.8    | Better             |

#### Condition Factors
| Condition | Multiplier | Reasoning |
|-----------|------------|-----------|
| New       | 1.0        | Full impact |
| Like-new  | 0.95       | Minimal wear |
| Good      | 0.9        | Some wear |
| Fair      | 0.8        | Significant wear |
| Poor      | 0.7        | Heavy wear |
| Very Poor | 0.6        | Maximum wear |

#### Age Impact
| Age Range | Multiplier | Reasoning |
|-----------|------------|-----------|
| 0-6m      | 1.0        | Recent production |
| 6-12m     | 0.9        | Moderate age |
| 12-24m    | 0.8        | Older item |

Final Score Calculation:
```
Final Score = Base Score × Material Factor × Condition Factor × Age Factor
Eco Points = Floor(Final Score × 10)
```

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


