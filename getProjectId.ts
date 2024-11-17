import { TrainingAPIClient } from '@azure/cognitiveservices-customvision-training';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import * as dotenv from 'dotenv';

dotenv.config();

const trainingKey = process.env.AZURE_CUSTOM_VISION_TRAINING_KEY;
const endpoint = process.env.AZURE_CUSTOM_VISION_ENDPOINT;

console.log('Using Training Key:', trainingKey?.substring(0, 10) + '...');
console.log('Using Endpoint:', endpoint);

// Ensure trainingKey is defined before creating credentials
if (!trainingKey) {
    throw new Error('Training key is not defined. Please check your environment variables.');
}
const credentials = new ApiKeyCredentials({ inHeader: { 'Training-key': trainingKey } });
const trainer = new TrainingAPIClient(credentials, endpoint || '');

async function listAllProjects() {
    try {
        const projects = await trainer.getProjects();
        console.log('\nExisting Projects:');
        projects.forEach(project => {
            console.log(`\nProject ID: ${project.id}`);
            console.log(`Name: ${project.name}`);
            console.log(`Description: ${project.description}`);
            console.log(`Created: ${project.created}`);
            console.log(`Last Modified: ${project.lastModified}`);
            console.log('---------------------------');
        });
    } catch (error) {
        console.error('Error getting projects:', error);
    }
}

// Run the function
listAllProjects().catch(console.error); 