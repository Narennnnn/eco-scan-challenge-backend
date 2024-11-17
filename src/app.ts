import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes/api';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Error handling middleware must be the last middleware
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 