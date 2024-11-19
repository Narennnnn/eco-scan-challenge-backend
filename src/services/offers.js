const store = require('../utils/memoryStore');

const AVAILABLE_OFFERS = [
    {
        id: '1',
        title: '10% Off Next Purchase',
        description: 'Get 10% off on your next eco-friendly purchase',
        pointsRequired: 20,
        type: 'discount',
        tier: 'basic'
    },
    {
        id: '2',
        title: 'Free Recycling Kit',
        description: 'Get a free clothing recycling kit',
        pointsRequired: 50,
        type: 'freebie',
        tier: 'basic'
    },
    {
        id: '3',
        title: 'Carbon Offset Certificate',
        description: 'Receive a certificate for your carbon savings',
        pointsRequired: 75,
        type: 'certificate',
        tier: 'eco'
    },
    {
        id: '4',
        title: '20% Off Sustainable Brands',
        description: 'Get 20% off on selected sustainable fashion brands',
        pointsRequired: 100,
        type: 'discount',
        tier: 'eco'
    },
    {
        id: '5',
        title: 'Sustainable Fashion Consultation',
        description: 'One-on-one session with a sustainable fashion expert',
        pointsRequired: 150,
        type: 'service',
        tier: 'premium'
    },
    {
        id: '6',
        title: 'Eco-Wardrobe Makeover',
        description: 'Complete wardrobe sustainability assessment and recommendations',
        pointsRequired: 200,
        type: 'service',
        tier: 'premium'
    }
];

function getAvailableOffers() {
    const userPoints = store.getPoints();
    
    const available = AVAILABLE_OFFERS.filter(offer => 
        offer.pointsRequired <= userPoints
    );

    const upcoming = AVAILABLE_OFFERS.filter(offer => 
        offer.pointsRequired > userPoints
    ).map(offer => ({
        ...offer,
        pointsNeeded: offer.pointsRequired - userPoints
    }));

    return {
        userPoints,
        availableOffers: available,
        upcomingOffers: upcoming
    };
}

module.exports = {
    getAvailableOffers
}; 