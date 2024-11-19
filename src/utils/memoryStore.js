// Simple in-memory storage
class MemoryStore {
    constructor() {
        this.points = new Map();
        this.DEFAULT_USER = 'default-user';
    }

    // Points management
    addPoints(userId, points) {
        const currentPoints = this.getPoints(userId);
        this.points.set(userId, currentPoints + points);
        return this.getPoints(userId);
    }

    getPoints(userId = this.DEFAULT_USER) {
        return this.points.get(userId) || 0;
    }
}

// Create singleton instance
const store = new MemoryStore();

module.exports = store; 