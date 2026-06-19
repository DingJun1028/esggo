import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3344; // Use a random port to avoid conflicts

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Minimal server works!' });
});

app.listen(PORT, () => {
  console.log(`Minimal Test Server running on port ${PORT}`);
});
