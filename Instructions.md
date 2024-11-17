### User Story

1. The user uploads a picture of their clothing item(s) (either image file or from taking a snap from camera directly 📸).
2. The app identifies the clothing items in the image.
3. For each item, an estimated carbon footprint is calculated.
4. The total carbon score is displayed, along with eco-reward points based on the eco-savings.
5. Offers available for redemption appear based on the user's eco-reward points.

You have full creative freedom to shape as you like, have fun!
### 1. **Frontend Requirements**

- A clean, user-friendly UI for:
    - Uploading or capturing a picture of clothing items.
    - Viewing identified items, their estimated carbon footprint, and total eco-reward points.
    - Viewing available offers that users can redeem based on their eco-reward points.

### 2. **Backend Requirements**

- API Endpoints:
    - **Image Analysis Endpoint**: Accepts an image, recognizes clothing items, and returns identified items with their estimated carbon scores.
    - **Eco-Score Calculation**: Based on the items, calculate the carbon footprint and assign eco-reward points.
    - **Offers Retrieval**: Based on the user’s points, retrieve offers they can redeem.
- **Carbon Score Assumptions**:
    - Define basic assumptions for each clothing item's carbon footprint (e.g., T-shirt = 5 kg CO₂, Jeans = 10 kg CO₂).
    - Use an in-memory store (e.g., dictionary) to store carbon scores for various items.

### 3. **Technical Requirements**

- No database required; use in-memory storage.
- Basic unit tests covering core functionalities.
- Error handling for common scenarios (e.g., invalid image upload).


I want my Expresss with TS bakcend to build then test all 3 endpoints locally then integrate it with frontend.
First tell how image will be passed to backend?
Endpoint1: /recognise-image
model should be able to correctly recognise the cloth in the image and return cloth name.
Accepts an image, recognizes clothing items, and returns identified items with their estimated carbon scores.

Make error handling for common scenrios like (invalid image upload)
Enpoint 2: /calculate-carbon-score
To calculate the environmental impact of each clothing item, we have assigned approximate carbon scores based on item type. These scores are stored in an in-memory dictionary for quick access.

| 👕 Item       | 🌍 Estimated Carbon Score (kg CO₂) |
|--------------|------------------------------------|
| T-shirt      | 5                                  |
| Jeans        | 10                                 |
| Jacket       | 15                                 |
| Shoes        | 8                                  |

Is there a  way to make carbon scoring more accurate by considering factors like materials, brand data, or garment condition.
Can we pass required feilds from frontend to make accurate calulations
Based on the items, calculate the carbon footprint and assign eco-reward points.

Endpoint3: 
Based on the user’s points, retrieve offers they can redeem.
