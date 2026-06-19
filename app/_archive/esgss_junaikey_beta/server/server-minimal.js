import express from 'express';
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Backend Minimal is Running'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', minimal: true }));

app.listen(port, () => {
  console.log(`Minimal server listening on port ${port}`);
});
