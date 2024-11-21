const chai = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const express = require('express');
const path = require('path');
const sinonChai = require('sinon-chai');
const router = require('../../src/routes/api');

const { expect } = chai;
chai.use(sinonChai);

const app = express();
app.use('/api', router);

describe('API Endpoints', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('POST /api/recognize-image', () => {
        it('should recognize clothing from valid image', async function() {
            this.timeout(10000);
            
            const testImagePath = path.join(__dirname, '../fixtures/test-tshirt.jpg');
            const response = await request(app)
                .post('/api/recognize-image')
                .attach('image', testImagePath);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.have.property('items').that.is.an('array');
            expect(response.body.data.items).to.have.lengthOf(1);
            expect(response.body.data).to.have.property('confidence').that.is.a('number');
        });

        it('should reject non-image files', async () => {
            const response = await request(app)
                .post('/api/recognize-image')
                .attach('image', Buffer.from('not an image'), 'test.txt');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
        });

        it('should handle missing image file', async () => {
            const response = await request(app)
                .post('/api/recognize-image');

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body.error).to.equal('No image file provided');
        });
    });

    describe('POST /api/calculate-carbon-score', () => {
        it('should calculate carbon score for valid input', async () => {
            const testItem = {
                name: 'T-shirt',
                material: 'cotton',
                condition: 'new',
                age: '0-6m'
            };

            const response = await request(app)
                .post('/api/calculate-carbon-score')
                .send(testItem);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body.data).to.have.property('baseScore');
            expect(response.body.data).to.have.property('adjustments');
            expect(response.body.data).to.have.property('finalScore');
            expect(response.body.data).to.have.property('ecoPoints');
        });

        it('should reject invalid material type', async () => {
            const testItem = {
                name: 'T-shirt',
                material: 'invalid-material',
                condition: 'new',
                age: '0-6m'
            };

            const response = await request(app)
                .post('/api/calculate-carbon-score')
                .send(testItem);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('validMaterials');
        });

        it('should handle missing required fields', async () => {
            const response = await request(app)
                .post('/api/calculate-carbon-score')
                .send({});

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body.error).to.equal('Item name is required');
        });
    });

    describe('GET /api/offers', () => {
        it('should return available offers', async () => {
            const response = await request(app)
                .get('/api/offers');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('success', true);
            expect(response.body.data).to.have.property('userPoints');
            expect(response.body.data).to.have.property('availableOffers');
            expect(response.body.data).to.have.property('upcomingOffers');
        });

        it('should handle memory store errors', async () => {
            const memoryStore = require('../../src/utils/memoryStore');
            const storeStub = sandbox.stub(memoryStore, 'getPoints').throws(new Error('Store error'));

            const response = await request(app)
                .get('/api/offers');

            expect(response.status).to.equal(500);
            expect(response.body).to.have.property('success', false);
            expect(response.body.error).to.equal('Failed to retrieve offers');
        });
    });
});
